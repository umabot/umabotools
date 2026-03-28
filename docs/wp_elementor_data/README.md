# WordPress Elementor Dynamic Data from Google Sheets

This guide explains how to add dynamic route cards to a WordPress page built with Elementor, using Google Sheets as the data source.

Objective: fetch dynamic data from a source like Google Sheets and render it on a WordPress site without a custom backend.

## Related Project

- [Club Ciclista landing page demo](https://innovumabot.com/prueba-club-ciclista/)
- [Club Ciclista app source](../../clubciclista.html)
- [Club Ciclista documentation](../dist/clubciclista/README.html)

## Code Files Used in This Integration

- JavaScript loader: [elementor_routes.js](https://github.com/umabot/umabotools/blob/main/tools/wordpress/elementor_routes_csv.js)
- Elementor widget template: [elementor_widget.html](https://github.com/umabot/umabotools/blob/main/tools/wordpress/elementor_widget_html.html)
- Setup reference: [ELEMENTOR_SETUP.md](https://github.com/umabot/umabotools/blob/main/tools/wordpress/ELEMENTOR_SETUP.md)

## 1. Prepare Google Sheets Data

Create a sheet with these headers (case-insensitive):

- `title`
- `date`
- `time`
- `distance`
- `desc`
- `bgClass`
- `strava` (or `link` / `url`)

Example CSV data:

```csv
title,date,time,distance,desc,bgClass,strava
Ruta Larga,2026-03-29,07:00,80,Ruta de fondo,placeholder-bg-1,https://strava.com/...
Ruta Corta,2026-03-30,08:00,35,Ruta de recuperacion,placeholder-bg-2,https://strava.com/...
```

## 2. Publish the Sheet as CSV

1. Open Google Sheets.
2. Go to File > Share > Publish to the web.
3. Select the target sheet.
4. Choose `Comma-separated values (.csv)`.
5. Copy the published CSV URL.

## 3. Upload Hero Images in WordPress

For image mapping by `bgClass`, upload files named exactly as:

- `placeholder-bg-1.png`
- `placeholder-bg-2.png`
- `placeholder-bg-3.png`
- `placeholder-bg-4.png`

The script combines `HERO_IMAGE_BASE_URL + bgClass + ".png"`.

## 4. Configure Script Constants

Open [elementor_routes.js](../../tools/wordpress/elementor_routes_csv.js) and verify:

```javascript
var ROUTES_CSV_URL = 'YOUR_PUBLISHED_CSV_URL';
var HERO_IMAGE_BASE_URL = 'https://innovumabot.com/wp-content/uploads/2026/03/';
var ROUTES_MOUNT_SELECTOR = '#routes-track';
```

## 5. Add the Elementor HTML Widget

1. Open your WordPress page in Elementor.
2. Edit the section where route cards should appear (for example, "Proximas rutas").
3. Add an HTML widget.
4. Paste the base structure from [elementor_widget.html](../../tools/wordpress/elementor_widget_html.html).
5. Paste the script from [elementor_routes.js](../../tools/wordpress/elementor_routes_csv.js) inside a `<script>` block, or load it through a WordPress custom code method.

Minimal required mount node:

```html
<div class="routes-container">
  <div class="routes-track" id="routes-track"></div>
</div>
```

## 6. Validate Behavior

Check the following:

- Cards are rendered from spreadsheet rows.
- Layout is horizontal with scroll on desktop and mobile.
- Card index overlays the hero area.
- Distance appears as `NN km`.
- `bgClass` maps to the uploaded image files.
- Missing image falls back to gradient styling.

## 7. Troubleshooting

Image does not show:

- Confirm exact filename and extension.
- Confirm `HERO_IMAGE_BASE_URL` path.
- Open the final image URL directly in the browser.

Cards render without expected style:

- Verify the script actually runs in your Elementor/WordPress setup.
- If inline scripts are restricted, move JS to Elementor Custom Code and keep only HTML in the widget.

No cards appear:

- Verify CSV URL is public and returns CSV text.
- Verify headers match expected field names.

## Summary

This pattern lets you maintain route/event content in Google Sheets while automatically rendering it in a WordPress Elementor page. It is a practical no-backend approach for dynamic, non-technical content updates.
