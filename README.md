# Spoiler Free Threads Chrome Extension

Automatically reveals spoiler content on Threads.net without having to click on each one.

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top right corner)
3. Click "Load unpacked"
4. Select the folder containing this extension (the folder with `manifest.json`)
5. The extension is now installed!

## Usage

1. Visit [Threads.net](https://www.threads.net/)
2. The extension will automatically reveal any spoiler content as you browse
3. Click the extension icon to toggle auto-reveal on or off
4. The badge on the icon shows the current state (green "ON" / gray "OFF")

## Features

- Automatically reveals blurred/hidden spoiler content
- Works with dynamically loaded content (as you scroll)
- Multiple detection methods for different types of spoiler content
- Toggle on/off via the extension popup
- Badge indicator showing current state
- Clean and CSP-safe implementation

## Optional: Adding Icons

The extension will work without icons, but you can add custom icons by creating:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

Place these files in the same folder as the manifest.json file.
