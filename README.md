# HomeTab Launcher 📺

A modern, TV-style New Tab page designed for HTPCs, big screens, and keyboard warriors. Built with **TypeScript**, **Vite**, and **Glassmorphism** aesthetics.

![HomeTab Preview](./public/icon.png) 
*(Note: Replace this path with a real screenshot in your repo, e.g., `screenshots/preview.png`)*

## ✨ Features

- **🎮 TV-Optimized Navigation**: Full D-Pad (Arrow Keys) support. Navigate your grid without a mouse.
- **🎨 Modern Design**: Hybrid "Neon Cyberpunk" glow effects with clean Glassmorphism tiles.
- **✏️ Edit Mode**: 
  - Add, Edit, and Remove shortcuts easily.
  - **Auto-Fetch**: Automatically grabs website titles and icons.
  - **Customization**: Manually set custom Logo URLs and rename shortcuts.
- **👋 Custom Greetings**: Click the greeting text to personalize your welcome message.
- **📱 PWA Support**: Installable as a standalone app on any device (Chrome/Edge/Safari).
- **🦊 Cross-Browser**: Works on Chrome, Edge, Brave, and Firefox.

## 🚀 Installation

### 1. As a Chrome/Edge Extension (Developer Mode)
1. Clone this repo: `git clone https://github.com/alidkhaida/hometab.git`
2. Install dependencies & build:
   ```bash
   npm install
   npm run build
   ```
3. Open your browser's Extensions page:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
4. Enable **Developer Mode** (top right toggle).
5. Click **Load unpacked** and select the `dist` folder from this project.

### 2. As a Firefox Extension
1. Build the project as shown above.
2. Go to `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on...**.
4. Navigate to the `dist` folder and select `manifest.firefox.json` (or rename it to `manifest.json` first if needed).

### 3. As a PWA (Standalone App)
1. Run the dev server: `npm run dev`
2. Open `http://localhost:5173` in your browser.
3. Click the "Install App" icon in your address bar.

## 🛠️ Usage

### Edit Mode
Click the **Settings Icon ⚙️** in the top right corner to enter Edit Mode.
- **Add**: Click the large `+` card.
- **Edit**: Click the **Pencil ✎** on any card to change its URL, Title, or Icon.
- **Delete**: Click the **X** badge to remove a shortcut.
- **Greeting**: Click the "Good Evening" text to type a custom message.

### Keyboard Controls
- **Arrow Keys**: Navigate the grid.
- **Enter**: Launch the selected app (or save changes in modal).
- **Esc**: Close modals.

## 💻 Development

This project uses **Vite** and **TypeScript**.

```bash
# Install dependencies
npm install

# Start Dev Server (Hot Reload)
npm run dev

# Build for Production (outputs to /dist)
npm run build
```

## 📄 License
MIT
