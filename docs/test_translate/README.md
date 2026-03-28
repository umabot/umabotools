# Google Translation quick setup

This app showcases how to build a custom language picker interface while leveraging Google's translation service behind the scenes.

## Features

### Custom Language Selector

- **Clean UI**: Custom language buttons that call the Google Translation service.
- **Four Languages**: Switch between English, French, Spanish, and German.
- **Active State**: Visual feedback shows the currently selected language.
- **Persistent Choice**: Remembers your language preference using localStorage.

### Privacy-First Design

- **No Backend**: Runs entirely in the browser via `file://` protocol.
- **Local Storage Only**: Saves only language preference client-side.
- **Third-Party Disclosure**: Clear notice about Google Translate's cookie usage.
- **No Tracking**: Zero user data collection or analytics.

## How It Works

### Architecture Approach

The app follows a **zero-backend, client-side only** philosophy aligned with the umabotools project standards:

1. **Pure HTML/CSS/JavaScript**: No frameworks, no build tools, no server required.
2. **Google Translate API**: Uses the free Google Translate Element API for translations.
3. **Hidden Widget Pattern**: Hides Google's default UI (`#google_translate_element`) and controls it programmatically.
4. **Event-Driven**: Uses `addEventListener` pattern (no inline event handlers) for CSP compliance.

### Technical Implementation

#### 1. Google Translate Initialization

```javascript
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,fr,es,de',
        autoDisplay: false
    }, 'google_translate_element');
}
```

- **pageLanguage**: Sets English as the source language.
- **includedLanguages**: Restricts available languages to four options.
- **autoDisplay**: Prevents the default widget from showing.

#### 2. Custom Language Switching

```javascript
function changeLanguage(langCode) {
    // Update button visual state
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === langCode);
    });

    // Poll for Google's dropdown element
    const poll = setInterval(() => {
        const combo = document.querySelector('.goog-te-combo');
        if (combo) {
            combo.value = langCode;
            combo.dispatchEvent(new Event('change'));
            localStorage.setItem('demo_lang_pref', langCode);
            clearInterval(poll);
        }
    }, 100);
}
```

**Why Polling?** Google's translate widget loads asynchronously. The polling mechanism waits for the hidden dropdown (`.goog-te-combo`) to become available, then programmatically changes its value and triggers the translation.

#### 3. Error Handling

```javascript
function checkScriptLoad() {
    if (typeof google === 'undefined' || typeof google.translate === 'undefined') {
        document.getElementById('error-banner').style.display = 'block';
    }
}
```

Displays a user-friendly error message if:

- The Google Translate script fails to load
- Browser security policies block external scripts
- Network connection issues occur

#### 4. Security & Standards Compliance

✅ **CSP Compliant**:

- No inline event handlers (`onclick` removed)
- All JavaScript uses `addEventListener` pattern

✅ **No External Frameworks**:

- Replaced Tailwind CDN with inline CSS
- No SRI hash vulnerabilities

✅ **Privacy Transparent**:

- Cookie disclosure notice included
- localStorage usage documented

## Usage

### Local Testing

1. Download `test_translate.html`
2. Open directly in a web browser (no server needed)
3. Click language buttons to see instant translation

### Limitations

- **External Dependency**: Requires Google Translate script to load (needs internet connection)
- **Google's Cookies**: Translation state is managed by Google's cookies (disclosed in UI)
- **Language Scope**: Limited to four languages (can be extended via `includedLanguages`)

## Design Philosophy

This app demonstrates key principles from the umabotools project:

| Principle | Implementation |
|-----------|----------------|
| **Single-page app** | Entire app in one HTML file |
| **No backend** | Runs via `file://` protocol |
| **Security-first** | No inline handlers, CSP compliant |
| **Privacy-conscious** | Clear disclosure, minimal data storage |
| **Vanilla JS** | Zero frameworks or dependencies (except Google API) |
| **Accessible** | Semantic HTML, keyboard navigation support |

## Use Cases

- **Translation Testing**: Verify how your content translates across languages.
- **Pattern Reference**: Example of hiding third-party widgets and building custom UIs.
- **Educational**: Learn async polling, DOM manipulation, and localStorage patterns.
- **Prototype Base**: Starting point for multi-language web applications.

## Future Enhancements

Potential improvements while maintaining the zero-backend philosophy:

- Add more languages (expandable via `includedLanguages`)
- Implement keyboard shortcuts (e.g., `Ctrl+1` for English)
- Add language auto-detection based on browser settings
- Export translated content as text file
- Dark mode toggle

## Technical Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for Google Translate API)
- JavaScript enabled
- Cookies enabled (for Google Translate functionality)
