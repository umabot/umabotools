# QR Code Studio

A lightweight, browser-based QR code generator that creates production-ready QR codes for URLs, text messages, and contact information (vCards).

## Features

### Multiple QR Code Types

- **URL**: Generate QR codes for website links. Automatically prepends `https://` if no protocol is specified.
- **Text**: Encode plain text messages into scannable QR codes.
- **Contact (vCard)**: Create QR codes containing contact information (name, organization, phone, email) in the standard vCard 3.0 format.

### Customization Options

- **Color**: Choose any color for your QR code using the color picker.
- **Size**: Select from three preset sizes:
  - Small (128×128 pixels)
  - Medium (256×256 pixels) - default
  - Large (512×512 pixels)

### Export & Sharing

- **Download**: Save your QR code as a PNG image file.
- **Copy Link**: Quickly copy the encoded content to your clipboard.

## Technical Details

- **Standard Compliance**: Generates ISO/IEC 18004 compliant QR codes.
- **Error Correction**: Uses Level H (High) error correction, allowing up to 30% of the code to be damaged while remaining readable.
- **Compatibility**: Works with iOS Camera, Android Lens, and all standard QR code readers.

## Dependencies

This tool uses the following external libraries (loaded via CDN):

- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework for styling
- [Lucide Icons](https://lucide.dev/) - Beautiful open-source icons
- [QRCode.js](https://github.com/davidshimjs/qrcodejs) - QR code generation library

## Usage

1. Open [qr_generator.html](../../qr_generator.html) in any modern web browser.
2. Select the type of QR code you want to create (URL, Text, or Contact).
3. Fill in the required information.
4. Optionally customize the color and size.
5. Click **Generate QR Code**.
6. Download the image or copy the link as needed.

## Keyboard Shortcuts

- **Enter**: Generate QR code (works from any input field)

## Browser Support

Works in all modern browsers including:
- Chrome / Edge (Chromium-based)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome for Android)

No server required—runs entirely in the browser.
