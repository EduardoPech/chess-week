<p align="center">
  <img src="public/icons/icon.png" alt="Chess Week" width="96" height="96" />
</p>

<h1 align="center">♟️ Chess Week Synchronizer</h1>

<p align="center">
  <strong>A desktop app to sync and download The Week in Chess (TWIC) game archives</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#development">Development</a>
</p>

---

## Overview

**Chess Week Synchronizer** is an Electron desktop application that lets you browse, select, and download TWIC (The Week in Chess) PGN archives from [theweekinchess.com](https://theweekinchess.com). Choose a local folder, pick which weeks to sync, and keep your chess database up to date with a single click.

---

## Features

| Feature | Description |
|--------|-------------|
| **Browse TWICs** | View all available TWIC issues with week number, date, and game count |
| **Select & Download** | Pick multiple weeks and download them as ZIP files in one batch |
| **Smart Sync** | Automatically detects which TWICs you already have and shows only what's missing |
| **Directory Picker** | Choose where to store your downloads via a native folder dialog |
| **Progress Feedback** | See download progress as each archive is synchronized |
| **Cross-Platform** | Runs on macOS, Windows, and Linux |

---

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS 4, shadcn/ui, Radix UI
- **Desktop:** Electron 30
- **Data:** TanStack Table, DOM parsing for TWIC list scraping

---

## Installation

### Prerequisites

- Node.js 18+
- npm or pnpm

### Build from source

```bash
# Clone the repository
git clone https://github.com/eduardopech/chess-week.git
cd chess-week

# Install dependencies
npm install

# Build the app (creates installers in release/)
npm run build
```

Built artifacts will be in `release/1.0.0/`:

- **macOS:** `ChessWeek-Mac-1.0.0-Installer.dmg`
- **Windows:** `ChessWeek-Windows-1.0.0-Setup.exe`
- **Linux:** `ChessWeek-Linux-1.0.0.AppImage`

---

## Usage

1. **Launch** the app
2. **Select a directory** where you want to store TWIC archives
3. **Browse** the table of available TWICs (weeks you already have are hidden)
4. **Select** the weeks you want to download
5. **Click** "Start Synchronization" to download the selected archives

Each TWIC is saved as a ZIP file (e.g. `twic1234g.zip`) in your chosen folder.

---

## Development

```bash
# Start dev server (Vite + Electron)
npm run dev

# Lint
npm run lint

# Preview production build (web only)
npm run preview
```

---

## Project Structure

```
chess-week/
├── electron/          # Electron main process
├── src/
│   ├── components/    # React components (Options, Loading, twics, ui)
│   ├── lib/           # fetchTwics, twicDownload, constants
│   ├── types.ts
│   └── App.tsx
├── public/
│   └── icons/         # App icons
└── release/           # Built installers (after npm run build)
```

---

## License

MIT © [Eduardo Pech](https://github.com/eduardopech)

---

<p align="center">
  <sub>Built with ♟️ for chess enthusiasts</sub>
</p>
