# PWA Assets Setup Guide

## Current Status
✅ manifest.json updated with Rural Connection branding  
✅ Placeholder icons created (1x1 pixels - need replacement)  
✅ Placeholder screenshots created (1x1 pixels - need replacement)  

## What You Need to Do

### 1. Create App Icons

**Option A: Use Canva (Easy, Free)**
1. Go to https://www.canva.com
2. Create design → Custom size → 512x512 pixels
3. Design your icon:
   - Background: Brown (#926829)
   - Add "RC" text or Rural Connection logo
   - Keep it simple and recognizable
4. Download as PNG
5. Use online tool to resize:
   - Upload to https://www.iloveimg.com/resize-image
   - Create 192x192 version
   - Create 512x512 version
6. Replace files:
   - `public/icon-192x192.png`
   - `public/icon-512x512.png`

**Option B: Use Favicon Generator (Automated)**
1. Create one 512x512 icon
2. Upload to https://realfavicongenerator.net/
3. Download generated package
4. Extract and use the icons

### 2. Create Screenshots

**Mobile Screenshot (390x844)**
1. Open your deployed site on Vercel
2. Open Chrome DevTools (F12)
3. Click device toolbar icon (phone icon)
4. Select "iPhone 12 Pro" (390x844)
5. Take screenshot: DevTools menu → ⋮ → Capture screenshot
6. Save as `public/screenshot-mobile.png`

**Desktop Screenshot (1920x1080)**
1. Open your deployed site
2. Set browser window to 1920x1080
3. Take full-page screenshot (use extension like "GoFullPage")
4. Save as `public/screenshot-desktop.png`

### 3. Deploy Updated Assets

```bash
git add .
git commit -m "Add PWA icons and screenshots"
git push origin main
```

## Quick Test Icons (Temporary)

If you need to test PWA quickly, you can:

1. **Use the SVG icon** I created:
   - Open `public/icon.svg` in browser
   - Take screenshot at 512x512
   - Resize to 192x192 for smaller icon

2. **Use emoji as icon** (temporary):
   ```
   Background: #926829 brown
   Add emoji: 🤝 or 🏘️ or 🛍️
   ```

## Verification

After replacing placeholders:

1. Visit your Vercel URL
2. Open Chrome DevTools → Application tab
3. Click "Manifest" in sidebar
4. Check:
   - ✅ No errors
   - ✅ Icons show properly
   - ✅ Screenshots visible
   - ✅ Name: "Rural Connection"

5. Check installability:
   - Desktop: Look for install icon in address bar
   - Mobile: Chrome menu → "Install app"

## Current Manifest Configuration

```json
{
  "name": "Rural Connection - Empowering Rural Artisans",
  "short_name": "Rural Connect",
  "theme_color": "#926829",
  "background_color": "#faf8f5"
}
```

## Need Help?

If icons/screenshots are too complex, let me know and I can:
- Generate simple text-based icons programmatically
- Create basic screenshots from your live site
- Suggest free tools for icon creation
