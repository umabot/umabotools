---
title: Time Zone Converter
---

# Time Zone Converter

Convert a time from one time zone to UTC and other selected time zones. The converter accepts natural-language dates and times, explicit UTC offsets, and Unix timestamps, then displays the resulting instant in several common formats.

[Open Time Zone Converter](../../timezoneconverter.html)

## Features

- Parse inputs such as `1 pm today`, `tomorrow 09:30`, `24 Oct 2026 3pm +02:00`, ISO-style dates, and Unix timestamps.
- Set the input time zone using a browser-supported IANA name such as `Europe/London`. An explicit offset or bracketed time-zone name in the input takes precedence.
- Add or remove target time zones to see the same instant in each location.
- Choose how to handle daylight-saving transitions: use the first or second occurrence of a repeated local time, move forward through a skipped time, or reject ambiguous and skipped times.
- Use example chips to set the current time or shift the displayed instant by common intervals.
- Copy displayed values in formats including ISO 8601 / RFC 3339, RFC 9557-style zone-tagged timestamps, basic ISO, military date-time group, RFC 2822, and UTC Unix seconds or milliseconds.

## Usage

1. Open [timezoneconverter.html](../../timezoneconverter.html) in a browser.
2. Enter a date or time. Slash-separated dates are interpreted day first. Inputs without a specified time use midnight.
3. Choose the input time zone. If the input includes `Z`, `UTC`, an offset such as `+02:00`, or a bracketed zone such as `[Europe/Paris]`, that value overrides the selected input zone.
4. Set the daylight-saving policy if the input falls during a clock change.
5. Add target time zones as needed. Click a displayed value or its copy button to copy it.

Invalid dates, unknown time zones, and unrecognized input are reported in the page. For reliable results, use an IANA zone name or an explicit numeric offset rather than an ambiguous abbreviation.

## Privacy and dependencies

Conversion and formatting happen in the browser using the built-in `Intl` API and the browser's time-zone data. The tool has no backend, external CDN dependencies, or browser-storage persistence; entered times are not sent to a service.
