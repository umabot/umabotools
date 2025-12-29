# Securing Secrets in Google Apps Script
This guide provides a tiered approach to storing sensitive credentials (API keys, passwords, database strings) in Google Apps Script, moving from basic individual usage to enterprise-grade security.

## 1. Choosing the Right Storage
Depending on your use case, you should choose the storage method that matches your security and sharing requirements.

| Method | Best For | Security | Visibility |
|--------|----------|----------|------------|
| User Properties | Personal scripts or shared tools where each user has their own API key. | High | Only the current user. |
| Script Properties | Team-wide tools where one API key is shared by all editors. | Medium | All script editors. |
| GCP Secret Manager | Enterprise apps requiring auditing, rotation, and high security. | Maximum | Managed via IAM permissions. |
| Protected Sheet | Beginners or simple mockups. | Low | Sheet owner (risky if not hidden). |

## 2. The Menu-Based Secrets Setup Pattern
The recommended approach is to use a menu-based setup function to collect and store secrets, then access them directly in your functions. This pattern works for both custom functions and regular functions.

### ⚠️ Important: Custom Functions Limitation
**Custom functions** (functions with `@customfunction` tag used in spreadsheet formulas) **cannot call `SpreadsheetApp.getUi()`**. They run in a restricted context that doesn't allow UI interactions.

**Solution**: Use a menu-based setup function to store secrets, then access them directly in all functions:

```javascript
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
    'Please enter your API Key:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (response.getSelectedButton() == ui.Button.OK) {
    const input = response.getResponseText().trim();
    if (input) {
      PropertiesService.getUserProperties().setProperty('MY_API_KEY', input);
      ui.alert('✅ API Key saved successfully!');
    }
  }
}

/**
 * Custom function that accesses the stored secret WITHOUT UI prompts
 * @customfunction
 */
function MY_CUSTOM_FUNCTION(param) {
  const apiKey = PropertiesService.getUserProperties().getProperty('MY_API_KEY');
  
  if (!apiKey) {
    return "⚠️ Setup Required: Go to '🔐 API Settings' menu → 'Setup API Key'";
  }
  
  // Use apiKey for your logic...
}

/**
 * Regular function that also accesses the stored secret directly
 */
function runMyTool() {
  const apiKey = PropertiesService.getUserProperties().getProperty('MY_API_KEY');
  
  if (!apiKey) {
    SpreadsheetApp.getUi().alert("⚠️ Setup Required: Go to '🔐 API Settings' menu → 'Setup API Key'");
    return;
  }

  // Proceed with your logic...
  console.log("Task running with authenticated key.");
}

/**
 * Clear settings utility
 */
function resetMySecrets() {
  PropertiesService.getUserProperties().deleteAllProperties();
  SpreadsheetApp.getUi().alert('Your private credentials have been cleared.');
}
```

## 3. Enterprise Solution: Google Cloud Secret Manager
For production environments, you should avoid PropertiesService entirely and use GCP Secret Manager. This allows you to rotate keys without updating your script code.

### Prerequisites:
- Link your Apps Script to a standard Google Cloud Project.
- Enable the Secret Manager API.
- Grant the project service account (or the user) the Secret Manager Secret Accessor role.

```javascript
function getGCPSecret(secretName) {
  const projectId = "YOUR_GCP_PROJECT_ID";
  const url = `https://secretmanager.googleapis.com/v1/projects/${projectId}/secrets/${secretName}/versions/latest:access`;
  
  const options = {
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() !== 200) throw new Error("Could not fetch secret from GCP.");

  const payload = JSON.parse(response.getContentText());
  return Utilities.newBlob(Utilities.base64Decode(payload.payload.data)).getDataAsString();
}
```

## 4. Summary of Best Practices

- **Never Hardcode**: If you see const KEY = "sk-...", your code is a security liability. Move it to Properties immediately.
- **Avoid Logger.log() on Secrets**: Execution logs are often stored in the Cloud Project and may be visible to other administrators or editors.
- **Use User Properties by Default**: Unless a key must be shared for the tool to function, always prefer getUserProperties(). This prevents "Account Hijacking" where one editor uses another editor's paid API credits.
- **Library Separation**: If you are building a tool for others, put your sensitive logic and default keys in a Script Library. Share the Spreadsheet with "Viewer" access to the Library so they can use the code without seeing the source values.
- **Custom Functions Cannot Show UI**: Always use menu-based setup functions for custom functions. Access stored properties directly without prompts.

## 5. FAQ / Debugging

### ❌ Error: "Cannot call SpreadsheetApp.getUi() from this context"

**Cause**: You're trying to call `SpreadsheetApp.getUi()` from a custom function (`@customfunction`). Custom functions run in a restricted execution context that doesn't allow UI interactions.

**Solution**: 
1. Create a separate menu function (via `onOpen()`) to collect and store the secret
2. In your custom function, access the stored property directly using `PropertiesService.getUserProperties().getProperty('KEY_NAME')`
3. Return a helpful error message if the key is missing, directing users to the setup menu

**Example**:
```javascript
// ✅ CORRECT: Menu function can show UI
function setupApiKey() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt('Enter API Key:');
  if (response.getSelectedButton() == ui.Button.OK) {
    PropertiesService.getUserProperties().setProperty('API_KEY', response.getResponseText());
  }
}

// ✅ CORRECT: Custom function accesses property directly
function MY_FUNCTION() {
  const key = PropertiesService.getUserProperties().getProperty('API_KEY');
  if (!key) return "⚠️ Run 'Setup API Key' from menu first";
  // Use key...
}

// ❌ WRONG: Custom function tries to show UI
function MY_FUNCTION() {
  const ui = SpreadsheetApp.getUi(); // Will fail in custom functions!
  const response = ui.prompt('Enter API Key:');
}
```

### 🔍 How do I check if a property is stored?

```javascript
function checkStoredKeys() {
  const props = PropertiesService.getUserProperties().getProperties();
  console.log(props); // Shows all stored keys
}
```

### 🗑️ How do I delete a specific key?

```javascript
function deleteSpecificKey() {
  PropertiesService.getUserProperties().deleteProperty('MY_API_KEY');
  SpreadsheetApp.getUi().alert('Key deleted.');
}
```

### 🔄 Can I switch between User and Script Properties?

Yes, but be aware of the security implications:
- **UserProperties**: Private to each user (more secure, prevents credit hijacking)
- **ScriptProperties**: Shared among all editors (use only when necessary)

```javascript
// Store in UserProperties (private)
PropertiesService.getUserProperties().setProperty('KEY', 'value');

// Store in ScriptProperties (shared with all editors)
PropertiesService.getScriptProperties().setProperty('KEY', 'value');
```

### 📝 Do I need to authorize my script?

Yes. The first time you run a function that uses `PropertiesService` or `UrlFetchApp`, Google will prompt you to authorize the script. This is normal and required.