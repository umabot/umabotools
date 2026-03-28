# Single Landing Page — Club Ciclista

A complete, single-file landing page template for a cycling club, local association, or small business. Combines a multi-language interface, dynamic data from a Google Spreadsheet used as a lightweight database, and a rich interactive UI — all served as a static HTML file with no backend required.

## Overview

**Club Ciclista** is a reference implementation showing how to build a polished organizational landing page without any server, framework, or build step. It is designed so that a real club or association can fork and adapt it:

- Swap text, colours, and section copy to match any brand or organization.
- Update the members list by editing a JavaScript array.
- Manage upcoming events or routes through a Google Sheet, without touching the codebase.
- Offer multi-language support with a single line of configuration.

[View Source Code on GitHub](https://github.com/umabot/umabotools/blob/main/clubciclista.html)

## Page Structure

The app is split into two files:

- **`clubciclista.html`** — Markup, styles, CDN links, and the Google Translate initialisation block. Provides the DOM mount points consumed by the data script.
- **`assets/js/clubciclista_data.js`** — All data and rendering logic: members array, routes CSV fetch/parse/render, icon initialisation, hero carousel, language switcher, mobile navigation, and contact form handler.

### Sections

| Section | Anchor | Content |
|---------|--------|---------|
| Navigation | `.top-nav` | Sticky bar with logo, section links, language switcher, and mobile hamburger menu |
| Hero Carousel | `#inicio` | Auto-playing three-slide carousel with prev/next arrows, navigation dots, and CTA buttons |
| Why Join | `#unete` | Static feature grid with four Lucide icon cards |
| Upcoming Routes | `#rutas` | Horizontally-scrollable route cards rendered dynamically from Google Sheets CSV into `#routes-track` |
| Team | `#miembros` | Member cards rendered from the in-memory JS array into `#members-grid` |
| About & Contact | `#contacto` | Two-column layout: about text and a contact form |
| Footer | `<footer>` | Four-column footer with navigation, legal, and contact details |
| Toast | `#toast` | Fixed-position notification overlay for form submissions and UI feedback |

## Dynamic Data

### Routes — Google Sheets CSV

Upcoming route cards are rendered entirely client-side. The data pipeline in `assets/js/clubciclista_data.js` follows three stages:

```javascript
var ROUTES_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/...output=csv';

fetch(ROUTES_CSV_URL)
    .then(function (response) { return response.text(); })
    .then(function (csvText) {
        var routes = parseCSV(csvText);   // parse headers + rows
        renderRoutes(routes);             // inject cards into #routes-track
    });
```

1. **`fetch(ROUTES_CSV_URL)`** — Requests the publicly published CSV export from Google Sheets.
2. **`parseCSV(csvText)`** — Splits on newlines, reads the first row as case-insensitive headers (special characters stripped), and maps each subsequent row to a route object. Rows with no recognisable fields are ignored.
3. **`renderRoutes(routes)`** — Creates a `.route-card` element per row and appends it to `#routes-track`. Shows a brief loading placeholder while the fetch is in flight and an inline error message if the request fails.

### Spreadsheet Data Fields

Use the following column headers in your Google Sheet. Headers are matched case-insensitively, so `Title`, `TITLE`, and `title` are all valid.

| Column | Required | Example value | Notes |
|--------|----------|---------------|-------|
| `title` | ✓ | `Sierra Norte Explorer` | Route name shown as the card heading |
| `date` | ✓ | `22 Mar 2026` | Displayed in the card meta row |
| `time` | ✓ | `08:00` | Displayed in the card meta row |
| `distance` | ✓ | `72 km` | Displayed as-is in the card meta row |
| `desc` | ✓ | `Ascenso por Puerto de Canencia` | Short description in the card body |
| `bgClass` | — | `placeholder-bg-2` | Background gradient: one of `placeholder-bg-1` through `placeholder-bg-4`. Defaults to `placeholder-bg-1` if absent or unrecognised |

**Example sheet layout:**

```
title               | date         | time  | distance | desc                                        | bgClass
Sierra Norte        | 22 Mar 2026  | 08:00 | 72 km    | Ascenso por Puerto de Canencia.             | placeholder-bg-1
Vía Verde del Tajuña| 29 Mar 2026  | 09:00 | 45 km    | Ruta familiar por la antigua vía del tren.  | placeholder-bg-2
```

### Members — In-Memory JS Array

Team member cards in `#members-grid` are rendered from a static array at the top of `assets/js/clubciclista_data.js`. To update the team, edit this array directly:

```javascript
var members = [
    { name: "Carlos Martínez", role: "Presidente",    initials: "CM" },
    { name: "Laura Rodríguez", role: "Vicepresidenta", initials: "LR" },
    // add or remove entries here
];
```

| Field | Description |
|-------|-------------|
| `name` | Full display name |
| `role` | Job title or role within the organization |
| `initials` | Two-letter abbreviation shown in the avatar circle |

## Language Switching

The translation system is directly based on the pattern developed in [Google Translate Test Page](../../test_translate.html) — see its [documentation](../../dist/test_translate/README.html) for a full technical walkthrough. The implementation in Club Ciclista adapts it for a Spanish-primary audience with four available languages.

### How It Works

1. Google's `TranslateElement` is initialised with `pageLanguage: 'es'` and `includedLanguages: 'es,en,fr,pt'`. `autoDisplay: false` prevents the native widget from rendering.
2. The native widget container (`#google_translate_element`) and its banner are hidden with CSS.
3. Custom language buttons in the navigation bar call `changeLanguage(langCode)`.
4. Because the Google widget loads asynchronously, `changeLanguage` polls every 100 ms (up to 5 seconds) for the hidden `.goog-te-combo` select element, then programmatically sets its value and dispatches a `change` event to trigger the translation.
5. The selected language code is persisted in `localStorage` under the key `club_lang_pref` and restored on the next page load.

```javascript
function changeLanguage(langCode) {
    // Update button visual state immediately
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.lang === langCode);
    });

    var attempts = 0;
    var poll = setInterval(function () {
        var combo = document.querySelector('.goog-te-combo');
        attempts++;
        if (combo) {
            combo.value = langCode;
            combo.dispatchEvent(new Event('change'));
            localStorage.setItem('club_lang_pref', langCode);
            clearInterval(poll);
        } else if (attempts >= 50) {       // 5 second timeout
            checkScriptLoad();
            clearInterval(poll);
        }
    }, 100);
}
```

If the Google Translate script fails to load, `checkScriptLoad()` reveals `#error-banner` with a user-friendly message.

## Contact Form

The contact form (`#contact-form`) validates inputs client-side, saves submitted data to `localStorage` under the key `contact_messages` as a JSON array, and shows a toast confirmation. There is no server-side submission by default.

> To enable real outbound delivery, replace the form submit handler in `assets/js/clubciclista_data.js` with a `POST` to a Google Apps Script proxy, following the pattern described in [Secure Secrets](../../secure_secrets_gs.html).

## Google Sheets Setup Runbook

### Step 1 — Create the spreadsheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet.
2. Rename the first sheet tab to something descriptive, for example `routes`.
3. Add the six column headers in row 1:

```
title | date | time | distance | desc | bgClass
```

4. Fill one row per upcoming route. For `bgClass`, use one of `placeholder-bg-1`, `placeholder-bg-2`, `placeholder-bg-3`, or `placeholder-bg-4`. Leave the cell blank to use the default (`placeholder-bg-1`).

### Step 2 — Publish the sheet as CSV

1. In Google Sheets, go to **File → Share → Publish to the web**.
2. Under *Link*, select the sheet tab you created (e.g. `routes`).
3. Select **Comma-separated values (.csv)** as the format.
4. Click **Publish** and confirm when prompted.
5. Copy the URL that appears. It will look like:

```
https://docs.google.com/spreadsheets/d/e/LONG_ID/pub?gid=0&single=true&output=csv
```

### Step 3 — Update the URL in the code

Open `assets/js/clubciclista_data.js` and replace the placeholder value:

```javascript
var ROUTES_CSV_URL = 'PASTE_YOUR_CSV_URL_HERE';
```

### Step 4 — Validate rendering

- Open `clubciclista.html` in a browser with internet access (or from a local server).
- The routes section displays "Cargando rutas..." briefly, then renders one card per spreadsheet row.
- If only the header row is present, the section shows "No hay rutas programadas próximamente."
- Open the browser developer console; network or parse errors are logged there.

## Troubleshooting

| Problem | Likely cause | Fix |
|---------|-------------|-----|
| Routes section stays blank or shows loading forever | Sheet not published, or URL is incorrect | Re-publish the sheet via **File → Share → Publish to the web** and verify the URL opens in a browser tab returning plain CSV text |
| Cards render with empty or missing fields | Column headers do not match expected names | Ensure row 1 uses the exact header names (`title`, `date`, `time`, `distance`, `desc`, `bgClass`); headers are normalised to lowercase with non-alphanumeric characters stripped before matching |
| All cards use the same background gradient | `bgClass` column value is missing or misspelled | Set each cell to exactly `placeholder-bg-1` through `placeholder-bg-4` |
| Error banner appears instead of translated text | Google Translate script blocked (offline or restricted network) | Run the page from a host with internet access; the page is fully functional without translation |
| Contact form shows toast but message is not received externally | Expected — client-side only by default | Integrate a Google Apps Script proxy for server-side form delivery |

## Design Principles

| Principle | Implementation |
|-----------|----------------|
| **No backend** | Runs directly via `file://` or any static host |
| **No frameworks** | Vanilla HTML, CSS, and JavaScript only |
| **CDN resources with SRI** | Tailwind CSS and Lucide Icons pinned to exact versions with SHA-384 integrity hashes and `crossorigin="anonymous"` |
| **Privacy-conscious** | Google Translate cookie disclosure; `localStorage` only for language preference and contact messages |
| **Mobile responsive** | Hamburger nav, fluid hero height (`70vh`), horizontal-scroll route cards |
| **Accessible** | Semantic HTML, `aria-label` on all interactive controls, keyboard navigation support |

## Technical Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection required for: Google Fonts, Tailwind CSS CDN, Lucide Icons CDN, Google Translate, and Google Sheets CSV fetch
- JavaScript enabled
