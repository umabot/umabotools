# Before & After Studio

A fully standalone, privacy-focused web application for comparing two images side-by-side using an interactive slider. Perfect for visualizing how a picture changed after modifications, such as edits made with photo editing tools like Photoshop, Lightroom, or AI-powered image generators and LLMs.

## Overview

**Before & After Studio** is a single-page HTML application that provides:

- **Interactive slider comparison** between two images
- **Drag-and-slide interface** to reveal differences at any position
- **Multiple input methods** - URL or local file upload
- **Persistent storage** using browser localStorage

The app makes it easy to visualize changes between an original and modified version of any image.

[View Source Code on GitHub](https://github.com/umabot/umabotools/blob/main/image_comparison.html)

## Key Features

### 🎚️ Interactive Slider

- Smooth drag-to-compare slider interface
- Slide left to reveal more of the "After" image
- Slide right to reveal more of the "Before" image
- Clear "Before" and "After" labels for easy reference

### 📤 Flexible Input Options

- **URL input** - Paste direct links to images
- **Local file upload** - Choose files directly from your computer
- Both methods work for either the before or after image

### 🔐 Privacy First

- **No cloud storage** - Everything runs in your browser
- **No data collection** - Your images never leave your device
- **No cookies** - Zero tracking
- Images are stored in browser localStorage for persistence

### 🎨 Clean, Modern Design

- Responsive layout that works on desktop and mobile
- 16:9 aspect ratio comparison container
- Intuitive handle with visual guidelines

## Use Cases

This tool is ideal for:

- **Photo Editing** - Compare before/after results from Photoshop, Lightroom, GIMP, etc.
- **AI Image Generation** - View changes made by AI tools, LLMs, or image enhancement services
- **Retouching** - Evaluate skin retouching, color correction, or object removal
- **Restoration** - Compare original damaged photos with restored versions
- **Web Design** - Compare UI/UX design iterations
- **Any visual comparison** - Architecture renders, product photography, etc.

## How It Works

1. **Load Before Image** - Paste a URL or upload a local file for the "Before" photo
2. **Load After Image** - Paste a URL or upload a local file for the "After" photo
3. **Compare** - Drag the slider left or right to reveal differences
4. **Reset** - Click "Reset to default demo" to restore the example images

## Getting Started

### Requirements

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No installation required

### Usage

1. Open `image_comparison.html` in your browser
2. The tool loads with a demo comparison (color vs black & white landscape)
3. Replace with your own images using the URL fields or file upload buttons
4. Drag the slider to compare the images

## Technical Details

- **Pure HTML/CSS/JavaScript** - No frameworks or build process required
- **Lucide Icons** - Clean iconography loaded from CDN
- **LocalStorage** - Images persist between browser sessions
- **Responsive Design** - Works on various screen sizes

## Privacy Notice

All images stay strictly on your computer. This tool:

- Does not upload images to any server
- Does not use cookies
- Does not collect any analytics
- Stores images only in your browser's localStorage
