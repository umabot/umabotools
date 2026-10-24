---
skip_conversion: true
---

# CDN Dependency Inventory

**Last Reviewed:** 24 October 2026
**Scope:** Third-party CSS/JavaScript dependencies loaded by root-level HTML files, including API loader scripts; nested HTML snippets and generated documentation are excluded. Runtime API data requests, images, and ordinary links are not counted.
**Compliance Status:** **Not fully compliant.** Four files use the Tailwind Play CDN without pinned versions, SRI, or `crossorigin`. The Google Maps JavaScript API loader in [around.html](around.html) also does not specify a version or release channel; SRI is not practical for this provider-controlled API script.

This inventory records the CDN references present in the repository. The review reconciled URLs and HTML attributes; it was not a vulnerability scan or an independent validation of SRI hashes.

## Summary

- **Root-level HTML files analyzed:** 15
- **Files with CDN dependencies:** 9
- **Files without CDN dependencies:** 6
- **Distinct libraries/services:** 7
- **CDN references:** 20
- **Static-library references pinned and protected with SRI:** 8 of 12 (the other 4 are Tailwind Play CDN references)
- **Dynamic Google service references:** 8 (5 Google Fonts, 2 Google Translate, and 1 Google Maps JavaScript API)
- **Tailwind Play CDN references requiring remediation:** 4

## Library Inventory

### 1. Tailwind CSS

**Versions:** `2.2.19` for the static stylesheet; dynamic Play CDN for the noncompliant references
**Purpose:** Utility-first CSS framework
**Usage:** 7 files

**Pinned static stylesheet configuration:**

```html
<link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
    integrity="sha384-HtMZLkYo+pR5/u7zCzXxMJP6QoNnQJt1qkHM0EaOPvGDIzaVZbmYr/TlvUZ/sKAg"
    crossorigin="anonymous">
```

**Files using the pinned static stylesheet:**
- [around.html](around.html)
- [clubciclista.html](clubciclista.html)
- [lang2cron.html](lang2cron.html)

**Files using the Tailwind Play CDN (noncompliant):**
- [gcal_converter.html](gcal_converter.html)
- [photo_tagger.html](photo_tagger.html)
- [qr_generator.html](qr_generator.html)
- [secure_secrets_gs.html](secure_secrets_gs.html)

The Play CDN is dynamic and these references do not pin a version or provide SRI and `crossorigin`. Replace them with a suitable pinned stylesheet and test affected pages before marking the inventory compliant. The app files have not been changed as part of this inventory update.

**Documentation:** https://tailwindcss.com/docs

### 2. Lucide Icons

**Version:** `0.563.0`
**Purpose:** Icon library with customizable SVG icons
**CDN provider:** unpkg
**Usage:** 3 files

```html
<script
    src="https://unpkg.com/lucide@0.563.0/dist/umd/lucide.min.js"
    integrity="sha384-aRB6X3zBuyu5EQF6GZFp0RCYdOwxYAOdFk4nViPfqSXYxc+MrZlqbM+nUYRwDQn1"
    crossorigin="anonymous">
</script>
```

**Files:**
- [clubciclista.html](clubciclista.html)
- [image_comparison.html](image_comparison.html)
- [qr_generator.html](qr_generator.html)

**Documentation:** https://lucide.dev/

### 3. Chart.js

**Version:** `4.4.1`
**Purpose:** JavaScript charting library
**CDN provider:** jsDelivr
**Usage:** 1 file

```html
<script
    src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js"
    integrity="sha384-dug+JxfBvklEQdJ4AYuBBAIScUz0bVN73xpy273gcAwHjb3qI0fXmuYNaNfdyYJG"
    crossorigin="anonymous">
</script>
```

**File:** [secure_secrets_gs.html](secure_secrets_gs.html)
**Documentation:** https://www.chartjs.org/docs/

### 4. QRCode.js

**Version:** `1.0.0`
**Purpose:** QR code generation library
**CDN provider:** cdnjs
**Usage:** 1 file

```html
<script
    src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"
    integrity="sha384-3zSEDfvllQohrq0PHL1fOXJuC/jSOO34H46t6UQfobFOmxE5BpjjaIJY5F2/bMnU"
    crossorigin="anonymous">
</script>
```

**File:** [qr_generator.html](qr_generator.html)
**Documentation:** https://github.com/davidshimjs/qrcodejs

### 5. Google Fonts — documented exception

**Version:** Dynamic provider response
**Purpose:** Web fonts
**Usage:** 5 files

Google Fonts serves browser-dependent CSS and font resources, so the project documents it as an exception to version pinning and SRI. The current embed patterns do not use `crossorigin`.

**Files:**
- [around.html](around.html) — Inter
- [clubciclista.html](clubciclista.html) — Inter
- [lang2cron.html](lang2cron.html) — Inter and JetBrains Mono
- [qr_generator.html](qr_generator.html) — Inter
- [test_translate.html](test_translate.html) — Inter

**Documentation:** https://fonts.google.com/

### 6. Google Translate — documented exception

**Version:** Dynamic provider service
**Purpose:** Client-side translation element
**Usage:** 2 files

This provider-controlled script does not offer a version-pinned URL or a stable resource for SRI. The current embed pattern does not use `crossorigin`; this is a documented exception.

**Files:**
- [clubciclista.html](clubciclista.html)
- [test_translate.html](test_translate.html)

**Documentation:** https://cloud.google.com/translate/

### 7. Google Maps JavaScript API — documented exception

**Version:** Dynamic provider service
**Purpose:** Interactive maps and geometry library
**Usage:** 1 file

The app loads the Google Maps JavaScript API dynamically after the user provides a Google Maps API key. The URL in the current page does not specify a version or release channel. SRI is not practical for this provider-controlled API script; review the provider's version-selection options before claiming the loader is fully compliant. Runtime API data requests are outside this inventory's counts.

**File:** [around.html](around.html)
**Documentation:** https://developers.google.com/maps/documentation/javascript

## File-by-File Matrix

This matrix covers the 15 root-level HTML files in scope. A dash means no reference to that library/service was found.

| HTML file | Tailwind CSS | Lucide | Chart.js | QRCode.js | Google Fonts | Google Translate | Google Maps JS API |
|-----------|--------------|--------|----------|-----------|--------------|------------------|--------------------|
| `around.html` | Static | - | - | - | Yes | - | Yes |
| `artemis_launch_counter.html` | - | - | - | - | - | - | - |
| `clubciclista.html` | Static | Yes | - | - | Yes | Yes | - |
| `day_calculator.html` | - | - | - | - | - | - | - |
| `datetimeparser.html` | - | - | - | - | - | - | - |
| `gcal_converter.html` | Play CDN | - | - | - | - | - | - |
| `image_comparison.html` | - | Yes | - | - | - | - | - |
| `index.html` | - | - | - | - | - | - | - |
| `lang2cron.html` | Static | - | - | - | Yes | - | - |
| `photo_tagger.html` | Play CDN | - | - | - | - | - | - |
| `qr_generator.html` | Play CDN | Yes | - | Yes | Yes | - | - |
| `secure_secrets_gs.html` | Play CDN | - | Yes | - | - | - | - |
| `spaceinvaders.html` | - | - | - | - | - | - | - |
| `test_translate.html` | - | - | - | - | Yes | Yes | - |
| `timezoneconverter.html` | - | - | - | - | - | - | - |

**Files without CDN dependencies:** `artemis_launch_counter.html`, `day_calculator.html`, `datetimeparser.html`, `index.html`, `spaceinvaders.html`, and `timezoneconverter.html`.

## Dependency Maintenance

When adding, updating, or removing a CDN dependency:

1. Prefer native browser functionality where practical.
2. For static CDN resources, pin an exact version and include a verified SHA-384 SRI hash and `crossorigin="anonymous"`.
3. Document approved dynamic-service exceptions and their rationale.
4. Test affected pages in a browser, including their direct-file behavior where applicable.
5. Update the library inventory, usage lists, matrix, and summary counts together.
6. Check dependencies for known vulnerabilities and record the scope and date of that check; do not describe an inventory reconciliation as a vulnerability audit.

Avoid `@latest`, version ranges, unversioned static URLs, and the Tailwind Play CDN.

## Review Log

| Date | Review | Notes |
|------|--------|-------|
| 24 Oct 2026 | Repository inventory reconciliation | Reconciled root-level CSS/JavaScript dependencies and counts. No vulnerability database scan or independent SRI hash validation was performed. |

## Related Documentation

- [AGENTS.md](AGENTS.md) — CDN implementation standards
- [README.md](README.md) — Project overview
- [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) — Deployment workflow

---

**InnovUmabot** | [https://innovumabot.com](https://innovumabot.com)

*This inventory records external dependencies and their documented exceptions.*
