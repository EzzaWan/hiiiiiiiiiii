# Favicon Setup Guide

## Files Created (Placeholders)

Replace these placeholder files in the `app/` directory with your actual favicon images:

### Required Files:

1. **`app/favicon.ico`**
   - Format: ICO
   - Size: 16x16, 32x32, or 48x48 pixels
   - This is the classic favicon shown in browser tabs

2. **`app/icon.png`**
   - Format: PNG
   - Size: 512x512 pixels (recommended)
   - Used for modern browsers and PWA icons

3. **`app/icon.svg`**
   - Format: SVG (vector)
   - Scalable vector icon
   - Works at any size, preferred for modern browsers

4. **`app/apple-icon.png`**
   - Format: PNG
   - Size: 180x180 pixels
   - Used for Apple devices (iOS home screen)

## Design Suggestions for Cyberpunk Theme:

- **Colors**: Neon green (#00ff41), purple (#bf00ff), or black background
- **Icon Ideas**: 
  - Pixelated brain 🧠
  - "HI" text in pixel font
  - Terminal/code symbol
  - Glitch effect
  - Circuit board pattern

## Tools to Create Favicons:

1. **Online Generators:**
   - [Favicon.io](https://favicon.io) - Upload image, generates all sizes
   - [RealFaviconGenerator](https://realfavicongenerator.net) - Comprehensive generator
   - [Favicon Generator](https://www.favicon-generator.org)

2. **From Existing Image:**
   - Upload your logo/image to favicon.io
   - It will generate all required formats automatically

3. **Design Tools:**
   - Figma, Photoshop, or any image editor
   - Export as PNG, then convert to ICO using online tools

## Quick Setup:

1. Design your favicon (512x512px PNG recommended)
2. Go to [favicon.io](https://favicon.io/favicon-converter/)
3. Upload your image
4. Download the generated files
5. Replace the placeholder files in `app/` directory:
   - `favicon.ico`
   - `icon.png` (or use the 512x512 version)
   - `apple-icon.png` (use the 180x180 version)
   - `icon.svg` (optional, but recommended)

## Next.js Automatic Detection:

Next.js 13+ automatically detects these files in the `app/` directory:
- `favicon.ico` → `/favicon.ico`
- `icon.png` → `/icon.png`
- `icon.svg` → `/icon.svg`
- `apple-icon.png` → `/apple-icon.png`

The metadata in `app/layout.tsx` is already configured to reference these files.

## Testing:

After replacing the files:
1. Restart your dev server: `npm run dev`
2. Check browser tab - favicon should appear
3. Test on mobile devices for Apple icon


