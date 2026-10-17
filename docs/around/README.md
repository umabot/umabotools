---
title: Around - Multi-Format Location Mapper
---

# Around - Multi-Format Location Mapper

A lightweight, zero-backend single-page web application to plot and visualize lists of locations on an interactive Google Map, supporting multiple input formats with inline labeling, editable navigation details, and route connections.

## Features

### Flexible Multi-Format Location Input
Enter multiple locations one per line directly into the collapsible drawer. Supported formats include:
- **Decimal Coordinates**: Standard latitude and longitude pairs (e.g., `48.8584, 2.2945` or `40.7128 -74.0060`).
- **DMS Coordinates**: Degrees, minutes, and seconds format (e.g., `48°51'29.8"N 2°17'40.2"E`).
- **Google Maps URLs**: Links copied directly from Google Maps (e.g., `https://maps.google.com/?q=48.8584,2.2945` or `https://www.google.com/maps/@48.8584,2.2945,15z`).
- **Addresses and Place Names**: Free-form street addresses or famous landmarks (e.g., `Colosseum, Rome, Italy` or `Tower Bridge, London`), automatically resolved using the Google Maps Geocoding service.

### Intelligent Inline Labeling
Prepend a custom name or label to any location on the same line:
- `Eiffel Tower: 48.8584, 2.2945`
- `Colosseum - Rome, Italy`
- `Louvre Museum | Rue de Rivoli, 75001 Paris`
- `"Hotel Milano" 45.4642, 9.1900`

If no custom label is provided, points are automatically assigned sequential letters (`A`, `B`, `C`...).

### Floating Navigation Table
A collapsible table floating directly above the map enables smooth exploration:
- **Badge Indicators**: Easily locate pins on the map using matching letter badges.
- **Inline Editable Labels**: Update point names on the fly; markers and popups reflect changes immediately.
- **Editable Notes & Descriptions**: Add personal reminders, opening hours, or travel notes for each stop.
- **Click-to-Focus**: Clicking any row smoothly centers and zooms the map to that pin and opens its InfoWindow.
- **Point Deletion**: Remove individual stops with a single click.

### Route Connection & Distance Calculation
- **Connect Points Toggle**: Draw a sequential geodesic line connecting points in order (`A` &rarr; `B` &rarr; `C`...).
- **Total Distance Badge**: Automatically computes and displays the cumulative distance in both kilometers and miles.
- **Fit Bounds**: Re-center and adjust map zoom with a single click to display all plotted points.

### Local Privacy & Persistence
- **Client-Side Only**: Runs entirely in the browser with no server, database, or analytics tracking.
- **Local Persistence**: Plotted points, labels, notes, and preferences are automatically saved in browser `localStorage`.
- **API Key Security**: Your Google Maps API key is stored only on your device and is never transmitted to any third party.

---

## Technical Details

- **Architecture**: 100% client-side HTML5, CSS3, and vanilla JavaScript.
- **Map Engine**: Google Maps JavaScript API with `geometry` and `geocoding` services.
- **Custom Pins**: Dynamic SVG markers generated as data URIs for crisp rendering across all screen densities.
- **Protocol Support**: Works offline or online via static GitHub Pages and directly via `file://`.

## Dependencies

This tool adheres strictly to the Umabotools security guidelines:

- [Tailwind CSS](https://tailwindcss.com/) (v2.2.19) - Utility-first styling loaded with SHA-384 Subresource Integrity (`integrity="sha384-HtMZLkYo+pR5/u7zCzXxMJP6QoNnQJt1qkHM0EaOPvGDIzaVZbmYr/TlvUZ/sKAg"`).
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript) - Map rendering, geocoding, and geodesic distance calculations.

## Usage Guide

1. **Configure API Key**: Click the Settings (⚙️) icon in the top bar. Enter your Google Maps API key or use a free [Maps Demo Key](https://mapsplatform.google.com/maps-demo-key) for testing.
2. **Input Locations**: In the left drawer, paste or type your locations (one per line). Use the "Sample Data" button to test pre-formatted points.
3. **Plot Points**: Click **📍 Plot Points**. The tool parses coordinates, extracts labels, and geocodes any text addresses.
4. **Inspect & Edit**: Review plotted points in the bottom table. Edit labels or notes directly inside the table inputs.
5. **Connect Path**: Toggle **Connect Points** in the top bar to visualize the route order and see the total distance traveled.
