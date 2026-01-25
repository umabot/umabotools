# GCal Participant List Cleaner

A simple, client-side utility to convert messy Google Calendar participant lists into clean, usable CSV data.

## Overview

**GCal Participant List Cleaner** solves the annoyance of copying guest lists from Google Calendar events. When you copy participants from GCal, you often get a string like `Name Surname <email@example.com>, Another Name <another@example.com>`. This tool parses that text and converts it into a structured two-column CSV (Participant, Email) that you can paste directly into Excel or Google Sheets.

[View Source Code on GitHub](https://github.com/umabot/umabotools/blob/main/gcal_converter.html)

## Key Features

### 🧹 Clean Parsing
- Detailed extraction of Names and Emails
- Handles multiple separators (commas, newlines)
- Removes unnecessary whitespace

### 📊 Instant CSV Output
- Generates a standard CSV format: `"Name","Email"`
- Handles special characters and quotes correctly
- Ready for spreadsheet import

### 🔒 Privacy Focused
- **100% Client-Side**: All processing happens in your browser
- **No Data Collection**: Your contact lists are never sent to any server
- **Secure**: No external API calls required

## How It Works

1. **Copy List**: Go to your Google Calendar event and copy the entire list of guests/participants.
2. **Paste**: Paste the text into the input area.
3. **Convert**: Click the "Convert to CSV" button.
4. **Copy Result**: Use the "Copy CSV to Clipboard" button to get your clean data.

## Getting Started

Simply open `gcal_converter.html` in your web browser. No installation or server is required.
