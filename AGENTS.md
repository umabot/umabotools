---
skip_conversion: true
---

# Umabotools AGENTS.md

## Project Overview

Umabotools is a collection of simple, standalone web applications and utility tools. The focus is on simplicity, security, and zero-backend architecture.

## Architecture Principles

### 1-Page Web Apps
- **Location**: Root directory (`.`)
- **Technology Stack**: Pure HTML, CSS, and vanilla JavaScript only
- **No Frameworks**: Never use React, Vue, Angular, Node.js, or similar frameworks
- **Testing**: Apps must run by opening the HTML file directly in a browser (file:// protocol)
- **Hosting**: Deployed via GitHub Pages using `.github/workflows/deploy-pages.yml`

### Python Tools & Scripts
- **Location**: `./tools/`
- **Package Manager**: Use `uv` for Python dependency management
- **Scope**: Simple utilities, conversion scripts, automation tools

### Google Apps Scripts
- **Location**: `./docs/<tool-name>/` (documentation only, scripts hosted in Google)
- **Purpose**: Google Sheets/Workspace integrations

## Code Style & Standards

### HTML/CSS/JS Guidelines

1. **No Backend Required**
   - All logic must run client-side
   - No server setup, no database connections
   - No user authentication or login systems

2. **Data Storage**
   - Use `localStorage` API for client-side persistence
   - No cookies
   - No cloud storage or external databases
   - No user data collection

3. **External Dependencies**
   - Only use validated CDN libraries with integrity checks (SRI)
   - Include security vulnerability checks for all dependencies
   - Prefer native browser APIs over external libraries when possible

4. **API Integration Pattern**
   - For apps requiring API keys, follow the pattern in `photo_tagger.html`
   - See `secure_secrets_gs.html` for secure key management via Google Apps Script proxy
   - Never hardcode API keys in client-side code

5. **Security Checklist**
   - [ ] No inline event handlers (use `addEventListener`)
   - [ ] Sanitize all user inputs
   - [ ] Use CSP (Content Security Policy) headers where applicable
   - [ ] Validate CDN resources with Subresource Integrity (SRI)
   - [ ] No `eval()` or similar dangerous functions

### Python Guidelines

1. **Dependencies**
   - Manage with `uv` tool
   - Keep dependencies minimal
   - Document all requirements

2. **File Organization**
   - Scripts in `./tools/`
   - Documentation in `./docs/`
   - Output/build artifacts in `./dist/`

## Documentation Standards

### Structure
```
.
├── index.md                # Landing page source (markdown)
├── index.html              # Landing page (auto-generated)
├── <app-name>.html         # Individual web apps
├── assets/                 # Images and reusable components
│   ├── images/             # Logos and branding
│   │   └── logo.svg        # InnovUmabot logo
│   └── snippets/           # Reusable markdown partials
│       ├── doc-header.md   # Standard header (back to home link)
│       └── doc-footer.md   # Standard footer (license, branding)
├── docs/                   # Markdown documentation
│   └── <tool-name>/
│       └── README.md       # Tool-specific documentation
├── dist/                   # Generated HTML docs (automated)
├── tools/                  # Python scripts
└── .github/workflows/      # CI/CD automation
```

### Documentation Workflow

1. **Write**: Create `./docs/<tool-name>/README.md`
2. **Convert**: Run `python3 convert_docs.py` to generate HTML
3. **Link**: Reference in `index.md` landing page table
4. **Deploy**: Push to GitHub (automatic via Actions)

**For Landing Page Updates:**
1. Edit `index.md` (not `index.html`)
2. Run `python3 convert_docs.py`
3. Commit both `index.md` and generated `index.html`

### Style Consistency

- **index.md** source is converted to **index.html** with landing page styling
- **Generated documentation** (from `./docs`) uses documentation styling
- Individual apps can have custom styles
- Landing page style guide:
  - White background (#ffffff)
  - System fonts (Apple System, Segoe UI, etc.)
  - Link color: #0066cc
  - Max-width: 900px
  - Table-based tool listing
  - Logo header
  - Footer with license and branding
- Documentation style guide:
  - Matches index.html base styling
  - Code blocks: Dark background (#1e1e1e) with light text (#d4d4d4)
  - Includes header snippet (back to home link)
  - Includes footer snippet (license, company info, disclaimer)

### Markdown Frontmatter

Use frontmatter to control conversion behavior:

```markdown
---
skip_conversion: true
title: Custom Page Title

### Reusable Snippets

Snippet files in `./assets/snippets/` are automatically injected into documentation:

**doc-header.md:**
```markdown
[← Back to Home](../../index.html)

---
```

**doc-footer.md:**
```markdown

---

## Licensemd` tools table
6. Run `python3 convert_docs.py` to generate HTML
7
This project is licensed under the MIT License.

**InnovUmabot** | [https://innovumabot.com](https://innovumabot.com)

*This tool was vibe-coded with AI with strict human supervision.*
```md`
5. Run `python3 convert_docs.py

These snippets are automatically added to all documentation pages during conversion.

### Branding Assets

Place company logo in `./assets/images/`:
- `logo.svg` (preferred) or `logo.png`
- Logo is displayed at the top of the landing page
- Keep logo files under 200KB for fast loading
draft: true
---
```

**Supported fields:**
- `skip_conversion`: Skip HTML generation (for internal docs)
- `title`: Override page title
- `draft`: Mark as work-in-progress (skips conversion)

## Development Workflow

### Adding a New Web App

1. Create `<app-name>.html` in root directory
2. Write pure HTML/CSS/JS (no frameworks)
3. Test locally by opening in browser
4. Create `./docs/<app-name>/README.md`
5. Add entry to `index.html` tools table
6. Push to GitHub (auto-deploys to Pages)

### Adding a Python Tool

1. Create script in `./tools/`
2. Use `uv` for dependencies
3. Document in `./docs/<tool-name>/README.md`
4. Add entry to `index.html`

### Adding a Google Apps Script

1. Host script in Google Apps Script
2. Document usage in `.md`
5. Run `python3 convert_docs.pys/<tool-name>/README.md`
3. Include setup instructions (API keys, permissions, etc.)
4. Add entry to `index.html`

## CI/CD Pipeline

- **GitHub A`index.md` to `index.html`
  - Convert markdown docs to HTML with header/footer snippets
  - Deploy all HTML files to GitHub Pages
  - Copy `assets/` directory (images, snippets)
  - Maintain `./dist/` folder structure
- **Validation**: Ensures `index.html` exists before deployment
  - Convert markdown docs to HTML
  - Deploy all HTML files to GitHub Pages
  - Maintain `./dist/` folder structure

## Testing Requirements

### For Web Apps
- [ ] Opens directly in browser (no server needed)
- [ ] No console errors
- [ ] Works offline (except for CDN/API calls)
- [ ] Mobile responsive
- [ ] No data sent to external services (unless documented)

### For Python Tools
- [ ] Runs with `uv run <script>`
- [ ] Clear error messages
- [ ] Help/usage documentation

- [ ] Header and footer snippets are included
- [ ] License and branding information present
### For Documentation
- [ ] Converts cleanly to HTML
- [ ] Links work in both markdown and HTML
- [ ] Tables render correctly
- [ ] Code blocks have proper syntax highlighting

## Security Best Practices

1. **Client-Side Security**
   - Validate all CDN resources with SRI hashes
   - Sanitize user inputs to prevent XSS
   - Use HTTPS for all external resources
   - No `innerHTML` with user content (use `textContent` or DOMPurify)

2. **API Key Management**
   - Never commit keys to repository
   - Use Google Apps Script proxy pattern for secrets
   - Document key rotation procedures

3. **Dependency Audits**
   - Check CDN libraries for known vulnerabilities
   - Use reputable CDN providers (cdnjs, unpkg, jsdelivr)
   - Pin specific versions (avoid `@latest`)

## Common Patterns

### CDN Library with SRI
```html
<script 
    src="https://cdn.jsdelivr.net/npm/library@1.0.0/dist/library.min.js"
    integrity="sha384-HASH_HERE"
    crossorigin="anonymous">
</script>
```

### localStorage Usage
```javascript
// Save
localStorage.setItem('key', JSON.stringify(data));

// Load
const data = JSON.parse(localStorage.getItem('key') || '[]');
```

### API Proxy Pattern
See `photo_tagger.html` and `secure_sec
- Logo file: `logo.svg` or `logo.png` (in `assets/images/`)
- Snippets: `kebab-case.md` (in `assets/snippets/`)rets_gs.html` for the complete pattern of using Google Apps Script as a secure API proxy.

## File Naming Conventions

- Web apps: `snake_case.html` or `kebab-case.html`
- Python scripts: `snake_case.py`
- Commit both `index.md` and generated `index.html`
- Don't commit API keys or secrets
- Keep `.gitignore` updated
- Commit `assets/` directory (logos and snippets)`kebab-case`

## Version Control

- Commit atomic changes
- Use descriptive commit messages
- Don't commit `./dist/` (generated by CI)
- Don't commit API keys or secrets
- Keep `.gitignore` updated

## Questions & Troubleshooting

**Q: Can I use a JavaScript framework?**

**Q: How do I update the landing page?**
A: Edit `index.md`, run `python3 convert_docs.py`, then commit both files.

**Q: Where do I add the company logo?**
A: Place `logo.svg` or `logo.png` in `./assets/images/` directory.
A: No. This project uses vanilla JavaScript only.

**Q: How do I add a new CDN library?**
A: Include with SRI hash, test for vulnerabilities, document the dependency.

**Q: Where should backend logic go?**
A: There is no backend. Use Google Apps Script proxy for API calls requiring secrets.

**Q: How do I test GitHub Pages deployment locally?**
A: Open `index.html` in a browser. All apps should work via `file://` protocol.
