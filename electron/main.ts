import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import {
  getTwicDownloadUrl,
  getTwicZipFilename,
  IPC_CHANNELS,
  TWIC_ZIP_REGEX,
} from '../src/constants'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
    width: 1200,
    height: 800,
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Fetch URL from main process (no CORS)
ipcMain.handle('scraper:fetch-url', async (_event, url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
  return res.text()
})

// Select directory
ipcMain.handle(IPC_CHANNELS.SELECT_DIRECTORY, async (_event) => {
  const dir = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  return dir.filePaths[0]
})

// Download selected TWIC number
ipcMain.handle(IPC_CHANNELS.DOWNLOAD_TWIC, async (_event, twicNumber: number, dir: string) => {
  const url = getTwicDownloadUrl(twicNumber)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
  const zip = await res.arrayBuffer()
  const zipPath = path.join(dir, getTwicZipFilename(twicNumber))
  fs.writeFileSync(zipPath, Buffer.from(zip))
  return zipPath
})

// Return a list of twic numbers that are already downloaded
ipcMain.handle(IPC_CHANNELS.GET_DOWNLOADED_TWICS, async (_event, dir: string) => {
  const files = fs.readdirSync(dir)
  return files
    .filter((file) => file.match(TWIC_ZIP_REGEX))
    .map((file) => file.replace('twic', '').replace('g.zip', ''))
})

app.whenReady().then(createWindow)
