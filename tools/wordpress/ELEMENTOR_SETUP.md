# Setup Guide: Dynamic Routes in Elementor

This guide matches the current implementation in [tools/wordpress/elementor_routes_csv.js](tools/wordpress/elementor_routes_csv.js).

## What Is Implemented

- Routes are loaded from a published Google Sheets CSV.
- Cards render in a horizontal scroll row on all screen sizes.
- Card width is fixed: 320px desktop/tablet, 300px mobile.
- Route index is overlayed on top of the hero block.
- Route index color uses Elementor accent color `#C9EB55`.
- Distance is rendered with `km` suffix automatically.
- Hero image is mapped from `bgClass` to image filename.
- If image is missing, gradient fallback is kept.

## 1. Spreadsheet Format

Use these headers (case-insensitive):

- `title`
- `date`
- `time`
- `distance`
- `desc`
- `bgClass`
- `strava` (or `link` / `url`)

Example:

```csv
title,date,time,distance,desc,bgClass,strava
Ruta Larga,2026-03-29,07:00,80,Ruta de fondo,placeholder-bg-1,https://strava.com/...
Ruta Corta,2026-03-30,08:00,35,Ruta de recuperacion,placeholder-bg-2,https://strava.com/...
```

Notes:
- `distance` can be `80` or `80 km`. The script normalizes to show `km` once.
- `bgClass` should be one of:
  - `placeholder-bg-1`
  - `placeholder-bg-2`
  - `placeholder-bg-3`
  - `placeholder-bg-4`

## 2. Publish Sheet as CSV

1. Open Google Sheets.
2. Go to File > Share > Publish to the web.
3. Choose your target sheet.
4. Select `Comma-separated values (.csv)`.
5. Copy the published URL.

## 3. Upload Hero Images in WordPress

Image naming must match the `bgClass` value plus `.png`:

- `placeholder-bg-1.png`
- `placeholder-bg-2.png`
- `placeholder-bg-3.png`
- `placeholder-bg-4.png`

Current base URL configured in JS:

`https://innovumabot.com/wp-content/uploads/2026/03/`

Final image URL example:

`https://innovumabot.com/wp-content/uploads/2026/03/placeholder-bg-1.png`

## 4. Configure Script Constants

In [tools/wordpress/elementor_routes_csv.js](tools/wordpress/elementor_routes_csv.js), verify:

```javascript
var ROUTES_CSV_URL = 'YOUR_PUBLISHED_CSV_URL';
var HERO_IMAGE_BASE_URL = 'https://innovumabot.com/wp-content/uploads/2026/03/';
var ROUTES_MOUNT_SELECTOR = '#routes-track';
```

## 5. Elementor HTML Widget

In Elementor:

1. Open section "Proximas rutas".
2. Add or edit the HTML widget.
3. Keep a mount node with id `routes-track`.
4. Paste the script from [tools/wordpress/elementor_routes_csv.js](tools/wordpress/elementor_routes_csv.js) in a `<script>` block (or load it through your WordPress custom code method).

Minimal mount markup:

```html
<div class="routes-container">
  <div class="routes-track" id="routes-track"></div>
</div>
```

## 6. Behavior Details

- Horizontal layout: `.club-routes-list` uses `display:flex` and `overflow-x:auto`.
- Fixed card width: `.club-route-card` keeps `320px` (`300px` on small screens).
- Overlay index: index is absolutely positioned over the hero block.
- Image mapping:
  - CSV `bgClass = placeholder-bg-4`
  - Script requests `.../placeholder-bg-4.png`
  - If image fails to load, gradient class remains visible.

## 7. Quick Validation Checklist

- [ ] CSV URL opens and returns text/CSV.
- [ ] Cards render from sheet rows.
- [ ] Desktop shows horizontal scroll row (not vertical stack).
- [ ] Card index overlays hero in `#C9EB55`.
- [ ] Distance appears as `NN km`.
- [ ] `bgClass` images show when files exist.
- [ ] Missing image falls back to gradient.

## 8. Troubleshooting

Image not showing:
- Confirm exact filename, including dashes and `.png`.
- Confirm month/year path in `HERO_IMAGE_BASE_URL`.
- Open the image URL directly in browser.

Cards render but no styles:
- Ensure script actually runs in Elementor (some setups strip inline script).
- If needed, move script to Elementor Custom Code and keep only mount HTML in widget.

Distance shows duplicated unit:
- Keep spreadsheet values as numbers when possible.
- Script already avoids duplicating `km` if it is present.
