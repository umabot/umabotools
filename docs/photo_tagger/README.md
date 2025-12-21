# GenAI Photo Tagger

A fully standalone, privacy-focused web application that uses Google's Gemini AI to generate multilingual titles and tags for your photographs. No server required, no data collection, just your browser and an AI API.

## Overview

**Photo Tagger** is a single-page HTML application that analyzes photographs and generates:
- **Creative titles** (up to 5 words) in English, French, and Spanish
- **Relevant tags** (5 keywords per language) for better photo organization
- **Inspiration-guided suggestions** using your custom prompts

The app combines AI vision capabilities with your creative input to produce a title and tags to use to classify your photo.

[View Source Code on GitHub](https://github.com/umabot/umabotools/blob/main/photo_tagger.html)

## Key Features

### 🌍 Multilingual Support
- Generates titles and tags in **English**, **French**, and **Spanish**
- Easy language switching with flag buttons
- View all translations for the same photo instantly

### 🎨 Inspiration-Driven
- Add a custom prompt, quote, or theme to guide the AI's suggestions
- Example: "Empty streets are a blessing" or "Vintage Americana"
- The AI uses your text to match the tone and style you're looking for

### 🔐 Privacy First
- **No cloud storage** - Everything runs in your browser
- **No data collection** - Your photos and API key never leave your device
- **No server uploads** - Photos are analyzed directly via the Gemini API
- Your API key is stored in browser localStorage (never transmitted to servers, cloud, nothing, nowhere)

### 📊 Local History
- Automatic history tracking of all analyzed photos (to review if it really works)
- Persistent storage using browser localStorage
- Clear history anytime with one click
- View past analyses with all language versions

## How It Works

1. **Enter Photo URL** - Paste a direct link to your image (must end in .jpg, .png, etc.)
2. **Add Inspiration** (Optional) - Type a theme, mood, or phrase to guide the AI
3. **Analyze** - Click the button and let Gemini AI analyze your photo
4. **Review Results** - Get instant title and tag suggestions in 3 languages
5. **Switch Languages** - Click flag buttons to view different language versions
6. **Check History** - Access all your past analyses in the History tab

## Getting Started

### 1. Get Your Gemini API Key

The app requires a free Google Gemini API key to function:

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API key"**
4. Select an existing project or create a new one
5. Copy the generated API key

**Note:** The Gemini API offers a generous free tier. Your API key should look like: `AIza...` (39 characters)

### 2. Configure the App

1. Open [photo_tagger.html](https://umabot.github.io/umabotools/photo_tagger.html) in your browser
2. Look for the **API Key Management** section at the top
3. Paste your API key in the password field
4. Click **Save**
5. You'll see a green ✅ indicating the key is saved

Your API key is now stored in your browser's localStorage and will persist across sessions.

### 3. Analyze Your First Photo

1. Find a direct image URL (e.g., `https://example.com/photo.jpg`)
   - The URL must point directly to an image file
   - Supported formats: JPG, PNG, WebP, GIF
2. Paste the URL in the **"Enter Photo URL"** field
3. (Optional) Add an inspiration prompt like "Moody urban landscapes"
4. Click **"Analyze Photo with GenAI"**
5. Wait a few seconds for the AI to process
6. View your results in all three languages!

## Privacy & Security

### Your Data Stays Local

**Photo Tagger** is designed with privacy as a core principle:

✅ **No Server-Side Storage** - We don't have a backend. There's nothing to store your data on.

✅ **Client-Side Only** - All processing happens in your browser. The only external call is directly to Google's Gemini API.

✅ **No Tracking** - No analytics, no cookies, no user tracking of any kind.

✅ **Open Source** - [View the complete source code](https://github.com/umabot/umabotools/blob/main/photo_tagger.html) to verify our claims. It's all in one HTML file!

### What Gets Stored Locally?

The app uses browser `localStorage` to store:
- Your Gemini API key (encrypted by browser security)
- Analysis history (last 50 photos analyzed) (maybe it is not working properly yet)
- User preferences

This data:
- Never leaves your device
- Can be cleared anytime using browser tools or the "Clear History" button
- Is tied to your browser profile (not synced across devices)

### Security Best Practices

🔑 **API Key Protection**
- Your API key is stored with the `password` input type (masked on screen)
- Stored in localStorage, which is isolated per domain
- Never transmitted to any server except Google's Gemini API
- Consider using API key restrictions in Google Cloud Console

⚠️ **Public Computers**
- Don't save your API key on shared/public computers
- Clear browser data after use

🔗 **Photo URLs**
- Use HTTPS URLs when possible
- Some images may fail due to CORS restrictions (the app will use a placeholder)

## Technical Details

### Browser Compatibility
- **Chrome/Edge**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support
- Requires modern browser with ES6+ support

### API Usage
- Uses Gemini 2.5 Flash model
- Structured JSON output for reliability
- Exponential backoff for rate limiting
- Handles up to ~4MB images (larger images may fail)

### CORS Limitations
Some photo URLs may be blocked by CORS (Cross-Origin Resource Sharing) policies. If this happens:
- The app will use a placeholder image for analysis
- A warning will appear in the browser console
- Solution: Use image URLs from CORS-friendly sources or host images yourself

### localStorage Limits
- History is limited to 50 most recent analyses
- localStorage typically has 5-10MB limit per domain
- Older entries are automatically removed to stay within limits

## Usage Tips

### Getting Better Results

1. **Use Descriptive Inspiration**
   - Instead of: "Nice photo"
   - Try: "Melancholic autumn afternoon" or "Urban decay aesthetic"

2. **High-Quality Images**
   - Higher resolution images provide more details for the AI
   - Keep images under 4MB to avoid API errors

3. **Direct Image URLs**
   - Ensure the URL ends with an image extension (.jpg, .png, etc.)
   - Social media preview URLs often don't work

4. **Experiment with Languages**
   - Some concepts translate better in certain languages
   - French and Spanish tags may capture nuances English misses

### Troubleshooting

**"API Key Required" Error**
- Make sure you've saved your API key in the top section
- Verify the key is correct (should start with `AIza`)
- Check that the key hasn't been revoked in Google Cloud Console

**"CORS FAIL" Placeholder Image**
- The image URL is blocking cross-origin requests
- Try a different image source
- The AI will still attempt analysis, but results may be less accurate

**Empty/No Response**
- Check browser console for errors (F12)
- Verify your internet connection
- Ensure your API key has quota remaining
- Try a smaller image if the current one is very large

**Rate Limiting**
- The app automatically retries with exponential backoff
- If you see "API Limit Exceeded", wait a few minutes
- Consider upgrading your Gemini API quota if needed

## Frequently Asked Questions

**Q: Is this really free?**  
A: Yes! The app itself is free and open source. You only need a free Gemini API key from Google, which includes a generous free tier.

**Q: Can I use this offline?**  
A: Partially. The HTML file works offline, but you need internet to call the Gemini API for photo analysis.

**Q: Will my photos be saved anywhere?**  
A: No. Your photo URLs are stored locally in your browser's history, but the actual photos are never uploaded or saved by this app.

**Q: Can I export my history?**  
A: Currently, no built-in export feature. Your history is in browser localStorage and could be extracted manually via browser dev tools.

**Q: Does this work on mobile?**  
A: Yes! The app is responsive and works on mobile browsers. However, copying image URLs on mobile can be tricky.

**Q: Can I analyze my own photos?**  
A: Yes, but you need to upload them somewhere with a direct URL (Imgur, your own website, cloud storage with public links, etc.).

**Q: What languages are supported for the inspiration text?**  
A: You can write your inspiration prompt in any language. The AI will understand and generate English, French, and Spanish outputs regardless.

## Contributing

Found a bug or have a feature suggestion? 

- [Open an issue](https://github.com/umabot/umabotools/issues)
- [Submit a pull request](https://github.com/umabot/umabotools/pulls)
- The entire app is in one file for easy modification!

## License

This project is open source. Check the [repository](https://github.com/umabot/umabotools) for license details.

## Credits

- Built with [Google Gemini AI](https://ai.google.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Inspired by photographers who need better photo organization tools

---

**Start tagging your photos with AI today!** 📸✨
