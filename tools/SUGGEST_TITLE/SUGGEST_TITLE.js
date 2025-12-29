/**
 * Creates a custom menu when the spreadsheet opens
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🔐 API Settings')
    .addItem('Setup API Key', 'setupApiKey')
    .addItem('Clear Stored Secrets', 'resetMySecrets')
    .addToUi();
}

/**
 * Setup function to prompt for and store the API key
 */
function setupApiKey() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    'Setup Required',
    'Please enter your Google AI Studio API Key:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (response.getSelectedButton() == ui.Button.OK) {
    const input = response.getResponseText().trim();
    if (input) {
      PropertiesService.getUserProperties().setProperty('GOOGLE_AI_STUDIO_API_KEY', input);
      ui.alert('✅ API Key saved successfully!');
    } else {
      ui.alert('❌ No API key entered.');
    }
  }
}

/**
 * A central manager to get secrets. 
 * If the secret isn't found, it prompts the user to enter it.
 * NOTE: Cannot be used in @customfunction context - use direct PropertiesService access instead.
 * @param {string} keyName The name of the property (e.g., 'GOOGLE_AI_STUDIO_API_KEY')
 * @param {boolean} isUserSpecific If true, uses UserProperties (private). If false, uses ScriptProperties (shared).
 * @returns {string|null} The secret value, or null if the user cancelled.
 */
function getOrPromptSecret(keyName, isUserSpecific = true) {
  const service = isUserSpecific ? PropertiesService.getUserProperties() : PropertiesService.getScriptProperties();
  let secret = service.getProperty(keyName);

  if (secret) return secret;

  // Prompt the user if missing
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    'Setup Required',
    `Please enter your value for: ${keyName}\n(This will be saved ${isUserSpecific ? 'privately to your account' : 'for all editors'}).`,
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() == ui.Button.OK) {
    const input = response.getResponseText().trim();
    if (input) {
      service.setProperty(keyName, input);
      return input;
    }
  }
  
  return null;
}

/**
 * Clear settings utility
 */
function resetMySecrets() {
  PropertiesService.getUserProperties().deleteAllProperties();
  SpreadsheetApp.getUi().alert('✅ Your private credentials have been cleared.');
}

/**
 * Generates a title for a Flickr photo using Gemini Vision.
 * * @param {string} imageUrl The URL of the photo (thumbnail or direct link).
 * @param {string} language Optional: 'en', 'es', or 'fr'. Defaults to 'en'.
 * @return The suggested photo title.
 * @customfunction
 */
function SUGGEST_TITLE(imageUrl, language = 'en') {
  if (!imageUrl) return "No URL provided";
  
  // 1. Setup - Get API key securely (no UI prompts in custom functions)
  const service = PropertiesService.getUserProperties();
  const apiKey = service.getProperty('GOOGLE_AI_STUDIO_API_KEY');
  
  if (!apiKey) {
    return "⚠️ Setup Required: Go to '🔐 API Settings' menu → 'Setup API Key'";
  }
  
  // Changed to 2.5-flash
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  try {
    const response = UrlFetchApp.fetch(imageUrl, {
      "headers": { "User-Agent": "Mozilla/5.0" },
      "muteHttpExceptions": true
    });

    if (response.getResponseCode() !== 200) {
      return "Image Access Error: " + response.getResponseCode();
    }

    const blob = response.getBlob();
    const base64Data = Utilities.base64Encode(blob.getBytes());
    const mimeType = blob.getContentType();

    const payload = {
      "contents": [{
        "parts": [
          { "text": "Provide a descriptive 5-word title for this image in " + language + ". Only return the title text." },
          { "inline_data": { "mime_type": mimeType, "data": base64Data } }
        ]
      }],
      "safetySettings": [
        { "category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE" },
        { "category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE" },
        { "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_ONLY_HIGH" },
        { "category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE" }
      ]
    };

    const options = {
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify(payload),
      "muteHttpExceptions": true
    };

    const apiResponse = UrlFetchApp.fetch(API_URL, options);
    const result = JSON.parse(apiResponse.getContentText());

    // 1. Check for API Errors (Keys/Endpoints)
    if (result.error) {
      return "Gemini Error: " + result.error.message;
    }

    // 2. SAFETY FILTER CHECK
    // If the model blocks the prompt before generating
    if (result.promptFeedback && result.promptFeedback.blockReason) {
      return "⚠️ Blocked: " + result.promptFeedback.blockReason;
    }

    // If the response is empty because the generation was censored
    if (!result.candidates || result.candidates.length === 0 || !result.candidates[0].content) {
      return "⚠️ Sensitive Content (Censored)";
    }

    // 3. SUCCESS: Process Text
    let rawTitle = result.candidates[0].content.parts[0].text.trim().replace(/[*'"]/g, '');
    
    // Capitalize Title Case
    return rawTitle.split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

  } catch (e) {
    return "Error: " + e.message;
  }
}