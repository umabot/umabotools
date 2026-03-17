# CDN Dependency Inventory

**Last Updated:** 15 March 2026  
**Total Libraries:** 6 (4 regular + 2 documented exceptions)  
**Compliance Status:** ✅ **100% Compliant** with AGENTS.md standards

---

## Summary Statistics

- **HTML Files Analyzed:** 10
- **Files with CDN Dependencies:** 7
- **Files without CDN Dependencies:** 3
- **Total CDN Resources:** 6 unique libraries
- **Libraries with SRI:** 4 (100% of applicable libraries)
- **Security Exceptions:** 2 (Google Fonts, Google Translate)

---

## Library Inventory

### 1. Tailwind CSS

**Version:** 3.4.1  
**Purpose:** Utility-first CSS framework  
**CDN Provider:** jsDelivr (Recommended)  
**Usage:** 4 files

**CDN Configuration:**
```html
<link 
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.1/dist/tailwind.min.css"
    integrity="sha384-wAkE1abywdsF0VP/+RDLxHADng231vt6gsqcjBzQFUoAQNkuN63+cJ4XDiE7LVjx"
    crossorigin="anonymous">
```

**Files Using This Library:**
- [qr_generator.html](qr_generator.html)
- [secure_secrets_gs.html](secure_secrets_gs.html)
- [photo_tagger.html](photo_tagger.html)
- [gcal_converter.html](gcal_converter.html)
- [clubciclista.html](clubciclista.html)

**Security Notes:**
- ✅ Using prebuilt CSS file (NOT the Play CDN `cdn.tailwindcss.com`)
- ✅ Version pinned to 3.4.1
- ✅ SRI hash validated
- ✅ CORS protection enabled

**Documentation:** https://tailwindcss.com/docs  
**Last Security Audit:** 15 March 2026  
**Known Vulnerabilities:** None

**Generate SRI Hash:**
```bash
curl -s "https://cdn.jsdelivr.net/npm/tailwindcss@3.4.1/dist/tailwind.min.css" | openssl dgst -sha384 -binary | openssl base64 -A
```

---

### 2. Lucide Icons

**Version:** 0.563.0  
**Purpose:** Icon library with customizable SVG icons  
**CDN Provider:** unpkg  
**Usage:** 2 files

**CDN Configuration:**
```html
<script 
    src="https://unpkg.com/lucide@0.563.0/dist/umd/lucide.min.js"
    integrity="sha384-aRB6X3zBuyu5EQF6GZFp0RCYdOwxYAOdFk4nViPfqSXYxc+MrZlqbM+nUYRwDQn1"
    crossorigin="anonymous">
</script>
```

**Files Using This Library:**
- [qr_generator.html](qr_generator.html)
- [image_comparison.html](image_comparison.html)
- [clubciclista.html](clubciclista.html)

**Security Notes:**
- ✅ Version pinned to 0.563.0
- ✅ SRI hash validated
- ✅ CORS protection enabled

**Documentation:** https://lucide.dev/  
**Last Security Audit:** 14 February 2026  
**Known Vulnerabilities:** None

**Generate SRI Hash:**
```bash
curl -s "https://unpkg.com/lucide@0.563.0/dist/umd/lucide.min.js" | openssl dgst -sha384 -binary | openssl base64 -A
```

---

### 3. Chart.js

**Version:** 4.4.1  
**Purpose:** JavaScript charting library  
**CDN Provider:** jsDelivr (Recommended)  
**Usage:** 1 file

**CDN Configuration:**
```html
<script 
    src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js"
    integrity="sha384-dug+JxfBvklEQdJ4AYuBBAIScUz0bVN73xpy273gcAwHjb3qI0fXmuYNaNfdyYJG"
    crossorigin="anonymous">
</script>
```

**Files Using This Library:**
- [secure_secrets_gs.html](secure_secrets_gs.html)

**Security Notes:**
- ✅ Version pinned to 4.4.1
- ✅ SRI hash validated
- ✅ CORS protection enabled
- ✅ Using UMD build for browser compatibility

**Documentation:** https://www.chartjs.org/docs/  
**Last Security Audit:** 14 February 2026  
**Known Vulnerabilities:** None

**Generate SRI Hash:**
```bash
curl -s "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js" | openssl dgst -sha384 -binary | openssl base64 -A
```

---

### 4. QRCode.js

**Version:** 1.0.0  
**Purpose:** QR code generation library  
**CDN Provider:** cdnjs (Cloudflare)  
**Usage:** 1 file

**CDN Configuration:**
```html
<script 
    src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"
    integrity="sha384-3zSEDfvllQohrq0PHL1fOXJuC/jSOO34H46t6UQfobFOmxE5BpjjaIJY5F2/bMnU"
    crossorigin="anonymous">
</script>
```

**Files Using This Library:**
- [qr_generator.html](qr_generator.html)

**Security Notes:**
- ✅ Version pinned to 1.0.0
- ✅ SRI hash validated
- ✅ CORS protection enabled

**Documentation:** https://github.com/davidshimjs/qrcodejs  
**Last Security Audit:** 14 February 2026  
**Known Vulnerabilities:** None (stable legacy library)

**Generate SRI Hash:**
```bash
curl -s "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js" | openssl dgst -sha384 -binary | openssl base64 -A
```

---

### 5. Google Fonts ⚠️ **Documented Exception**

**Version:** Dynamic (updates automatically)  
**Purpose:** Web font hosting service  
**CDN Provider:** Google  
**Usage:** 3 files

**CDN Configuration (Example):**
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap">
```

**Files Using This Library:**
- [test_translate.html](test_translate.html) - Inter font (400, 600, 700 weights)
- [qr_generator.html](qr_generator.html) - Inter font (300, 400, 500, 600, 700 weights)
- [clubciclista.html](clubciclista.html) - Inter font (300-900 weights)

**Security Notes:**
- ⚠️ **No SRI hash** - This is correct per AGENTS.md guidelines
- ⚠️ **No crossorigin** - Not required for Google Fonts
- ℹ️ Google Fonts dynamically updates and SRI would break functionality
- ℹ️ Documented exception in AGENTS.md (Special Cases section)

**Documentation:** https://fonts.google.com/  
**Last Security Audit:** 14 February 2026  
**Exception Rationale:** Google Fonts uses dynamic CSS that varies by browser and updates frequently. SRI constraints would break the service. This is an accepted trade-off for trusted Google infrastructure.

---

### 6. Google Translate API ⚠️ **Documented Exception**

**Version:** Dynamic (updates automatically)  
**Purpose:** Client-side translation widget  
**CDN Provider:** Google  
**Usage:** 2 files

**CDN Configuration:**
```html
<script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
```

**Files Using This Library:**
- [test_translate.html](test_translate.html)
- [clubciclista.html](clubciclista.html)

**Security Notes:**
- ⚠️ **No SRI hash** - This is correct per AGENTS.md guidelines
- ⚠️ **No crossorigin** - Not required for Google APIs
- ⚠️ **No version pinning** - API endpoint doesn't support versioning
- ℹ️ Documented exception in AGENTS.md (Google Services section)

**Documentation:** https://cloud.google.com/translate/  
**Last Security Audit:** 14 February 2026  
**Exception Rationale:** Google Translate API is a dynamic service that updates frequently. It doesn't support SRI or version pinning. This is an accepted trade-off for trusted Google infrastructure.

---

## File-by-File Matrix

| HTML File | Tailwind CSS | Lucide Icons | Chart.js | QRCode.js | Google Fonts | Google Translate |
|-----------|--------------|--------------|----------|-----------|--------------|------------------|
| **artemis_launch_counter.html** | - | - | - | - | - | - |
| **gcal_converter.html** | ✅ | - | - | - | - | - |
| **image_comparison.html** | - | ✅ | - | - | - | - |
| **index.html** | - | - | - | - | - | - |
| **photo_tagger.html** | ✅ | - | - | - | - | - |
| **qr_generator.html** | ✅ | ✅ | - | ✅ | ✅ | - |
| **secure_secrets_gs.html** | ✅ | - | ✅ | - | - | - |
| **spaceinvaders.html** | - | - | - | - | - | - |
| **test_translate.html** | - | - | - | - | ✅ | ✅ |
| **clubciclista.html** | ✅ | ✅ | - | - | ✅ | ✅ |

**Files with no CDN dependencies:** 3 (artemis_launch_counter.html, index.html, spaceinvaders.html)

---

## Version Update Guidelines

### When to Update CDN Versions

1. **Security Vulnerabilities:** Update immediately if a CVE is published
2. **Regular Maintenance:** Review quarterly for minor/patch updates
3. **Breaking Changes:** Test thoroughly before updating major versions
4. **Deprecation Notices:** Plan migration when library maintainers announce EOL

### Update Checklist

- [ ] Test library in isolated environment first
- [ ] Generate new SRI hash using commands provided above
- [ ] Update version number in CDN URL
- [ ] Update integrity attribute with new SRI hash
- [ ] Test all affected HTML files in multiple browsers
- [ ] Update this CDN_INVENTORY.md file with new version and date
- [ ] Document any breaking changes in commit message
- [ ] Run security vulnerability check (if available)

### Recommended CDN Providers (in order of preference)

1. **jsDelivr** (`cdn.jsdelivr.net`) - Provides SRI hashes, fast global CDN
2. **cdnjs** (`cdnjs.cloudflare.com`) - Cloudflare-backed, reliable
3. **unpkg** (`unpkg.com`) - Good for npm packages, generate SRI manually

**Avoid:**
- Using `@latest` or unversioned URLs
- CDNs without HTTPS support
- Tailwind Play CDN (`cdn.tailwindcss.com`) - JIT compiler, no SRI support

---

## Security Audit Log

| Date | Auditor | Action | Notes |
|------|---------|--------|-------|
| 14 Feb 2026 | System | Initial inventory created | All 6 libraries documented, 100% compliant |

---

## Maintenance Instructions

**Update this file whenever:**
1. Adding a new CDN library to any HTML file
2. Updating the version of an existing library
3. Removing a CDN dependency
4. Discovering a security vulnerability
5. Conducting quarterly security audits

**Required Information for New Libraries:**
- Library name, version, and purpose
- Complete CDN configuration (URL, SRI, crossorigin)
- List of files using the library
- Link to official documentation
- Command to generate SRI hash
- Security audit notes

**Verification Steps:**
1. Search codebase: `grep -r "cdn\." *.html`
2. Check for @latest: `grep -r "@latest" *.html` (should return nothing)
3. Verify SRI: `grep -r "integrity=" *.html`
4. Cross-reference with this inventory file

---

## Related Documentation

- **[AGENTS.md](AGENTS.md)** - See "CDN Library with SRI" section for implementation standards
- **[README.md](README.md)** - Project overview and structure
- **[.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)** - Deployment configuration

---

**InnovUmabot** | [https://innovumabot.com](https://innovumabot.com)

*This inventory maintains security and compliance standards for all external dependencies.*
