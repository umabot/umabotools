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