# umabotools

A collection of 1-page web-based tools.

## GitHub Pages Setup

This repository is configured to automatically deploy to GitHub Pages using GitHub Actions. The GitHub Action is setup in the `deploy_pages.yaml`. Every time a push is send to `main` branch it will update the GitHub pages at [https://umabot.tools/](https://umabot.tools/)

### How it works

The **index.html** is created during deploy from the `index.md` file. The GitHub Actions workflow runs `convert_docs.py` which transforms `*.md` files into `*.html` files with proper styling and structure.

Two conversion paths are automated:

1. **Landing Page**: `index.md` → `index.html` (uses custom landing page template with logo support)
2. **Documentation**: `./docs/**/*.md` → `./dist/**/*.html` (uses documentation template with automatic header/footer snippet injection)

The conversion logic also injects reusable snippets from `./assets/snippets/` (header and footer) into all documentation files. Files marked with `skip_conversion: true` or `draft: true` in their frontmatter are excluded from conversion.

### Markdown-to-HTML Conversion Pipeline

#### Landing Page Conversion

- **Source**: `index.md` (root directory)
- **Output**: `index.html` (root directory)
- **Template**: Landing page with logo support and white background
- **Snippets**: No automatic injection (standalone page)
- **Processing**: Converts markdown to HTML with support for tables, fenced code blocks, and header IDs

#### Documentation Conversion

- **Source**: `./docs/**/*.md` (any markdown file in docs directory and subdirectories)
- **Output**: `./dist/**/*.html` (matching directory structure)
- **Template**: Documentation template with GitHub markdown styling
- **Snippets**: Automatically injects header and footer:
  - `./assets/snippets/doc-header.md` (inserted at top, includes back-to-home link)
  - `./assets/snippets/doc-footer.md` (inserted at bottom, includes license and branding)
- **Processing**: Computes relative URLs for back-to-home links based on output file depth

#### Frontmatter Control

Markdown files can include optional YAML frontmatter to control conversion behavior:

```markdown
---
skip_conversion: true
title: Custom Page Title
draft: false
---
```

**Supported fields:**
- `skip_conversion: true` — Skip HTML generation for this file
- `draft: true` — Mark as work-in-progress (skips conversion)
- `title` — Override the page title (default: derived from filename)

#### File Handling Notes

- **README.md files in `./docs/`**: Treated as regular markdown files. They will be converted unless marked with `skip_conversion: true` or `draft: true` in frontmatter.
- **Current converted files** (~8-9 across subdirectories in `./docs/`): Each tool's README is converted and deployed to `./dist/`
- **Relative path computation**: The script dynamically computes relative URLs for back-to-home links, adjusting based on output directory depth

### Accessing the Site

Once GitHub Pages is enabled in the repository settings, the site will be available at:
```
https://umabot.tools/
```

(previous deployment was at `https://umabot.github.io/umabotools/`)

### Setup Instructions

To enable GitHub Pages for this repository:

1. Go to the repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. The workflow will automatically deploy the site when changes are pushed to the main branch

### Automated Deployment (GitHub Actions)

**Workflow File**: `.github/workflows/deploy-pages.yml`

#### Deployment Trigger

- **Automatic**: Push to `main` branch
- **Manual**: Workflow dispatch via GitHub Actions tab

#### Build Pipeline

The deployment workflow executes the following steps:

1. **Checkout code**: Pull latest repository contents
2. **Set up Python**: Install Python 3.x environment
3. **Install dependencies**: 
   - Upgrade pip
   - Install `markdown2` package for markdown conversion
4. **Convert documentation**: Run `python convert_docs.py`
   - Converts `index.md` to `index.html` at repository root
   - Converts all `./docs/**/*.md` to `./dist/**/*.html`
   - Injects header/footer snippets automatically
   - Respects `skip_conversion` and `draft` frontmatter flags
5. **Verify output**: Check that `index.html` was successfully generated (fails if missing)
6. **List contents**: Debug step showing generated dist directory structure
7. **Prepare deployment** (`_site` folder):
   - Copy all `*.html` files from root
   - Copy `./dist/` (converted documentation)
   - Copy `./assets/` (images and snippets)
   - Copy `./docs/` folder
   - Create `.nojekyll` file (prevents Jekyll processing by GitHub Pages)
8. **Upload artifact**: Store `_site/` folder as deployment artifact
9. **Deploy**: Push artifact to GitHub Pages

#### Result

- **Live site**: https://umabot.tools/
- **Update frequency**: Automatic on each push to `main`
- **Deploy time**: Typically 1-2 minutes

### Quick Start for Developers

Adding a new web-based tool to umabotools:

1. **Create the HTML app** in the root directory (e.g., `my_tool.html`)
   - Pure HTML/CSS/JavaScript only (no frameworks)
   - Must run via `file://` protocol (no backend required)
   - Include all CDN dependencies with SRI hashes (see CDN Dependency Management below)

2. **Create documentation** in `./docs/my_tool/README.md`
   - Document purpose, usage, and setup instructions
   - Use markdown with optional YAML frontmatter
   - Header/footer snippets are auto-injected during conversion

3. **Link on landing page** in `index.md`
   - Add entry to the tools table
   - Include description and link to your HTML file

4. **Push to main branch**
   - GitHub Actions automatically converts and deploys
   - Site updates at https://umabot.tools/

5. **Reference**: See [AGENTS.md](AGENTS.md) for complete coding standards and architecture principles

### Developer Guidelines (AGENTS.md)

**Purpose**: Central reference for coding standards, architecture principles, and development workflows.

**Key Topics**:
- 1-page web app standards (HTML/CSS/JS only)
- Python tools and scripts (`./tools/` directory with `uv` package manager)
- Google Apps Scripts integration
- Security best practices and CSP policies
- External dependency management with SRI hashes
- API key management (Google Apps Script proxy pattern)
- Documentation standards and conversion workflow
- File naming conventions and version control

**When to Consult**: Before adding new features, tools, or making architectural decisions. This is the authoritative guide for project standards.

**Link**: [AGENTS.md](AGENTS.md)

### CDN Dependency Management (CDN_INVENTORY.md)

**Purpose**: Tracks all external CDN dependencies, their versions, SRI hashes, and security audit status.

**Key Information**:
- **Compliance Status**: 100% adherence to SRI hash requirements (where applicable)
- **Current Libraries**: 6 libraries (4 with SRI, 2 documented exceptions like Google Fonts)
- **Last Audit**: 15 March 2026
- **Security Standards**:
  - Version pinning (never `@latest`)
  - SHA-384 Subresource Integrity hashes
  - CORS protection enabled
  - Documented vulnerabilities (none currently)

**When to Update**: When adding, removing, or updating any CDN library in HTML files.

**How to Generate SRI Hash**:
```bash
curl -s "https://cdn.example.com/library.js" | openssl dgst -sha384 -binary | openssl base64 -A
```

**Link**: [CDN_INVENTORY.md](CDN_INVENTORY.md)

### Local Development Test

Simply open any `*.html` file and try it. All apps run via `file://` protocol with no server required.

### Python Setup (uv External Environment)

Project standard: always use the external uv environment at `~/development/uv/umabotools` for this repository.

Dependencies stay managed by this repository (`pyproject.toml` and `uv.lock`), while the environment itself is stored outside the repo.

Set this once in zsh so uv always targets the external path:

```bash
echo 'export UV_PROJECT_ENVIRONMENT="$HOME/development/uv/umabotools"' >> ~/.zshrc
source ~/.zshrc
```

Then initialize and sync from the project root:

```bash
cd ~/Documents/code/umabotools
mkdir -p ~/development/uv/umabotools

# Sync runtime dependencies
uv sync

# Sync test/dev dependencies
uv sync --extra dev

# Verify installed packages in that environment
uv pip list --python ~/development/uv/umabotools/bin/python
```

Run project commands against that same environment:

```bash
cd ~/Documents/code/umabotools
uv run pytest tools/mdproperties/test_mdproperties.py -q
```

### Warning: VIRTUAL_ENV Does Not Match .venv

If you see this warning:

```text
warning: `VIRTUAL_ENV=...` does not match the project environment path `.venv` and will be ignored
```

it means another active virtual environment is set in your shell. For this project, prefer the external uv environment configured with `UV_PROJECT_ENVIRONMENT`.

Resolve it with one of these commands before running uv:

```bash
deactivate 2>/dev/null || true
unset VIRTUAL_ENV
```

### Verify External Setup

```bash
cd ~/Documents/code/umabotools
echo "$UV_PROJECT_ENVIRONMENT"
uv sync
uv sync --extra dev
uv pip list --python ~/development/uv/umabotools/bin/python
uv run pytest tools/mdproperties/test_mdproperties.py -q
```

Optional cleanup after migration to external-only usage:

```bash
rm -rf ~/Documents/code/umabotools/.venv
```

---

## Header & Footer Standardization

**Branch**: `standardization-of-header-and-footers-for-each-tool`

All 14 single-page HTML tools were updated to follow a consistent header/footer standard modeled after `lang2cron.html`.

### Standard Header Elements

Every tool's `<header>` now includes:

1. **← Home link** — navigates back to `index.html`
2. **🌙/☀️ Theme toggle** — switches between dark and light mode; preference persisted in `localStorage('theme')` (shared across all tools)
3. **⚙️ API key button** *(only where the tool requires an API key)* — shows/hides the API key input section
4. **📖 Docs link** — navigates to the tool's documentation page in `dist/<tool>/README.html`

### Standard Footer Elements

Every tool's `<footer>` now includes two rows:

- **Row 1**: `InnovUmabot | innovumabot.com • MIT License`
- **Row 2**: A tool-specific client-side disclaimer. For tools that call an external API (Gemini, Google Maps), the disclaimer explicitly notes that requests go directly from the browser to the API — no intermediate servers, no data collection.

### Favicon

All tools now include the standard 3-tag favicon block in `<head>`. Two tools were missing it and had it added:

- `datetimeparser.html` — favicon added
- `timezoneconverter.html` — favicon added

### Changes Summary

| Tool | Favicon | Home Link | Theme Toggle | Docs Link | Footer | API Key Btn |
|------|:-------:|:---------:|:------------:|:---------:|:------:|:-----------:|
| `around.html` | ✅ | ✅ | ✅ Added | ✅ Added | ✅ Floating overlay | ✅ (existing `openSettingsBtn`) |
| `artemis_launch_counter.html` | ✅ | ✅ Added | ✅ Added | ✅ Added | ✅ Expanded existing | — |
| `clubciclista.html` | ✅ | ✅ Added | ✅ Added | ✅ Added | ✅ Updated `footer-bottom` | — |
| `datetimeparser.html` | ✅ **Added** | ✅ Added | ✅ Added | ✅ Added | ✅ Replaced existing | — |
| `day_calculator.html` | ✅ | ✅ Added | ✅ Added | ✅ Added | ✅ New footer | — |
| `gcal_converter.html` | ✅ | ✅ Added | ✅ Added | ✅ Added | ✅ Replaced existing | — |
| `image_comparison.html` | ✅ | ✅ Added | ✅ Added | ✅ Added | ✅ Replaced existing | — |
| `lang2cron.html` | ✅ | ✅ | ✅ | ✅ | ✅ Disclaimer updated | ✅ (existing) |
| `photo_tagger.html` | ✅ | ✅ Added | ✅ Added | ✅ Added | ✅ New footer | ✅ Added (toggles `#apiKeyContainer`) |
| `qr_generator.html` | ✅ | ✅ Added | ✅ Added | ✅ Added | ✅ New footer | — |
| `secure_secrets_gs.html` | ✅ | ✅ Added | ✅ Added | ✅ Added | ✅ Replaced existing | — |
| `spaceinvaders.html` | ✅ | ✅ Added | ✅ Added | ✅ Added | ✅ Compact footer | — |
| `test_translate.html` | ✅ | ✅ Added | ✅ Added | ✅ Added | ✅ New footer | — |
| `timezoneconverter.html` | ✅ **Added** | ✅ Added | ✅ Added | ✅ Added | ✅ New footer | — |

### Implementation Notes

- **Theme persistence**: All tools share the `localStorage` key `theme` for cross-tool consistency. `lang2cron.html` retains its own `lang2cron_theme` key for backward compatibility but also writes to the shared `theme` key.
- **`timezoneconverter.html`**: Already used a `data-theme` attribute system; theme toggle was adapted to use `setAttribute('data-theme', ...)` instead of class toggling.
- **`around.html`**: Full-viewport map layout — header controls were added to the existing floating panel; footer is a floating glass-panel overlay that does not obstruct the map.
- **`spaceinvaders.html`**: Fullscreen canvas — a slim retro-styled header was added above the game container and a compact footer below the mobile controls.
- **`photo_tagger.html`**: The `#apiKeyContainer` is now hidden by default; the `⚙️` button in the header toggles its visibility.
- **Files not modified**: `index.md`, `index.html`, and all `docs/*/README.md` files were intentionally left unchanged.