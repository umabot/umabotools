# Date Time Parser

Date Time Parser is a browser-based utility for parsing, adjusting, and formatting date/time values. It defaults to UTC for inputs without a timezone and lets you inspect the same instant in other timezones.

## Features

- Parse ISO-style date/time strings, values with explicit offsets, RFC 9557-style strings with an IANA timezone tag, and Unix timestamps.
- Treat date/time inputs without an explicit timezone as UTC.
- Select from the browser's supported IANA timezones, with a fallback list for browsers that do not provide the timezone list API.
- Keep the wall-clock time fixed or preserve the instant when changing timezones.
- Edit the date and time directly, load the current instant, or shift it by preset or custom intervals.
- View the active UTC offset, a DST indicator, and the Unix epoch value.
- Copy the selected instant in formats including UTC ISO 8601, ISO with offset, PostgreSQL-style timestamps, RFC 9557-style timestamps, RFC 2822-style dates, and Unix epoch seconds or milliseconds.

## Usage

Open [datetimeparser.html](../../datetimeparser.html) in a browser. Paste a date/time string or Unix timestamp into the parser field and choose **Parse**. Use the date, time, and timezone controls to adjust the instant, or use the shift controls to move it forward or backward. Click a formatted value to copy it.

## Privacy and dependencies

Date parsing and formatting run in the browser. The tool does not send entered date/time values to a backend and does not save them in browser storage.

The page has no runtime JavaScript framework or external CDN dependency. Its styling is a precompiled, local Tailwind utility stylesheet at [assets/css/datetimeparser.css](../../assets/css/datetimeparser.css); the browser does not load or run Tailwind itself.
