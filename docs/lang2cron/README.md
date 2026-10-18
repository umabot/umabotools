---
title: Lang2Cron - Natural Language to UNIX Cron Generator
---

# Lang2Cron - Natural Language to UNIX Cron Generator

A lightweight, zero-backend single-page web application that converts natural language schedule requests into standard 5-field UNIX cron expressions using Google Gemini for grounding, interactive clarification, and multilingual understanding.

[Open Lang2Cron Application](../../lang2cron.html)

---

## Overview

Writing and debugging cron syntax often leads to mistakes or platform discrepancies—especially around 5-field UNIX conventions versus 6-field quartz variants, or day-of-week indexing (where `0` represents Sunday).

**Lang2Cron** provides an intuitive conversational interface where functional users, sysadmins, and developers can describe when a recurring job should execute in plain words. Lang2Cron clarifies ambiguities and validates the resulting schedule against standard UNIX cron rules directly in the browser.

---

## Key Features

### 1. Conversational Grounding & Clarification
- **Handles Ambiguous Input**: If a user enters vague statements like *"I want to run it recurrently"* or *"run it often"*, the grounding model proactively asks clarifying questions (*"When do you need to run it? Daily, every 2 days? At what time?"*) until a deterministic schedule is achieved.
- **Multilingual Support**: Users can enter schedule requests in English, Spanish, French, German, Italian, Portuguese, and more.
- **Self-Documenting Grounded Help**: Asking questions such as *"How do I use you?"* or *"¿Cómo te uso?"* triggers an in-context explanation of how to use the converter.

### 2. Standard 5-Field UNIX Cron Compliance
Enforces strict 5-field UNIX syntax:
```text
┌───────────── Minute (0 - 59)
│ ┌─────────── Hour (0 - 23)
│ │ ┌───────── Day of Month (1 - 31)
│ │ │ ┌─────── Month (1 - 12)
│ │ │ │ ┌───── Day of Week (0 - 6) (0 = Sunday)
│ │ │ │ │
* * * * *
```
- Restricts operators strictly to `*` (every), `*/n` (step), `,` (list), and `-` (range).
- Rejects non-standard quartz seconds fields, `L`, `W`, `?`, or `#` flags to prevent execution surprises across heterogeneous Linux/UNIX environments.

### 3. Client-Side Validation & Compilation
- The Gemini model produces a structured grounding spec.
- A client-side JavaScript engine verifies field limits (0–59, 0–23, 1–31, 1–12, 0–6), step bounds, and ranges before assembling the final pattern.
- Displays a prominent **Field-by-Field Breakdown** inspecting Minute, Hour, Day of Month, Month, and Day of Week tokens.

### 4. 1-Click Copy & Productivity
- Copy the generated cron expression instantly with visual feedback (`Copied! ✓`).
- Quick-starter example chips for common patterns (*"Every 15 minutes"*, *"Weekdays at 09:00 AM"*, *"First day of month"*, etc.).

### 5. Dark & Light Mode
- Clean, responsive UI featuring both dark and light modes.
- Theme preference is remembered across sessions via `localStorage`.

### 6. Zero-Backend Privacy
- No backend servers, databases, or cookies.
- Your Gemini API key is stored strictly on your device in browser `localStorage` and sent directly to Google's Generative Language API endpoint.

---

## Standard UNIX Cron Reference Table

| Frequency | Cron Expression | Explanation |
| :--- | :--- | :--- |
| **Every 5 minutes** | `*/5 * * * *` | Runs at minutes 0, 5, 10, ..., 55 of every hour |
| **Every 15 minutes** | `*/15 * * * *` | Runs at minutes 0, 15, 30, and 45 |
| **Top of every hour** | `0 * * * *` | Runs at minute 0 of every hour |
| **Daily at midnight** | `0 0 * * *` | Runs at 00:00 server time every day |
| **Daily at 08:30 AM** | `30 8 * * *` | Runs at 08:30 server time |
| **Weekdays at 09:00 AM** | `0 9 * * 1-5` | Runs Monday through Friday at 09:00 |
| **First day of every month** | `0 0 1 * *` | Runs at 00:00 on day 1 of the month |

> **System Clock Reminder**: Standard UNIX cron schedules run relative to the host system clock (often configured to UTC). Ensure your server timezone aligns with your scheduled intent.

---

## Usage Guide

1. **Open Lang2Cron**: Open `lang2cron.html` directly in any web browser or via GitHub Pages.
2. **Configure Gemini API Key**:
   - On first launch, enter your Gemini API key in the setup dialog.
   - You can update or remove the key at any time by clicking the Settings (⚙️) icon in the header.
3. **Enter Your Schedule**:
   - Type your requirement in the input box, such as *"Run a backup every Sunday night at 11 PM"* or click an example chip.
4. **Clarify if Prompted**:
   - If the request is incomplete, Lang2Cron will ask you for details (e.g. specific hour or weekdays).
5. **Copy the Pattern**:
   - Once resolved, click **Copy Cron** to copy the pattern to your clipboard.

### Obtaining a Gemini API Key

Lang2Cron uses `gemini-2.5-flash-lite`, Google's lightweight and cost-effective Flash-tier model.

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Click **Create API Key**.
4. Copy the key, paste it into Lang2Cron, and click **Save Key**.

---

## Technical Details

- **Technology**: Pure HTML5, CSS3, and vanilla JavaScript (no React, Vue, Angular, or Node.js).
- **Model**: `gemini-2.5-flash-lite` via `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent`.
- **Dependencies**:
  - [Tailwind CSS](https://tailwindcss.com/) v2.2.19 (jsDelivr CDN with SHA-384 SRI)
  - Google Fonts Inter
- **Compatibility**: Runs directly via `file://` protocol or static web hosting.
