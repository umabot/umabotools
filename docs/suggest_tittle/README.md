# SUGGEST_TITLE Function Documentation

The `SUGGEST_TITLE` function is a custom Google Apps Script function designed for use in Google Sheets. It utilizes the Gemini Vision API to analyze an image from a given URL and generate a descriptive, short title.

## Function Signature

```javascript
SUGGEST_TITLE(imageUrl, language)
```

## Parameters

| Parameter | Type | Required | Description | Default |
| :--- | :--- | :--- | :--- | :--- |
| `imageUrl` | String | Yes | The direct URL of the image to analyze. | - |
| `language` | String | No | The language code for the generated title (e.g., 'en', 'es', 'fr'). | 'en' |

## Return Value

Returns a **String** containing the suggested title in Title Case.

Possible error returns:
- `"No URL provided"`
- `"Image Access Error: [Code]"`
- `"Gemini Error: [Message]"`
- `"⚠️ Blocked: [Reason]"`
- `"⚠️ Sensitive Content (Censored)"`
- `"Error: [Exception Message]"`

## Setup Instructions

1.  Open your Google Sheet.
2.  Go to **Extensions** > **Apps Script**.
3.  Copy the `SUGGEST_TITLE` function code into the script editor.
4.  **Important:** You must setup in Project Properties the value of API_KEY
    ```javascript
    // 1. Setup
  const scriptProperties = PropertiesService.getScriptProperties();
  const apiKey = scriptProperties.getProperty('API_KEY');
  // Changed to 2.5-flash
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    ```
5.  Save the script.

## Usage in Google Sheets

Once the script is saved, you can use the function directly in a cell like any other spreadsheet formula.

### Basic Example
Generate a title in English (default):
```excel
=SUGGEST_TITLE("https://example.com/my-photo.jpg")
```

### With Language Parameter
Generate a title in Spanish:
```excel
=SUGGEST_TITLE("https://example.com/my-photo.jpg", "es")
```

### Using Cell References
You can reference cells containing the URL and language:
```excel
=SUGGEST_TITLE(A2, B2)
```
*Where A2 contains the URL and B2 contains the language code.*

## Notes
- The function uses the `gemini-2.5-flash-preview-09-2025` model.
- It requests a 5-word descriptive title.
- The function includes safety settings to block harmful content.
