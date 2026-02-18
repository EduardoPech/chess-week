import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
const TWIC_BASE_URL = "https://theweekinchess.com";
const getTwicDownloadUrl = (week) => `${TWIC_BASE_URL}/zips/twic${week}g.zip`;
const getTwicZipFilename = (week) => `twic${week}g.zip`;
const TWIC_ZIP_REGEX = /twic\d+g\.zip/;
const IPC_CHANNELS = {
  SELECT_DIRECTORY: "select-directory",
  DOWNLOAD_TWIC: "download-selected-twic-number",
  GET_DOWNLOADED_TWICS: "get-downloaded-twic-numbers"
};
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    },
    width: 1200,
    height: 800
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
ipcMain.handle("scraper:fetch-url", async (_event, url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.text();
});
ipcMain.handle(IPC_CHANNELS.SELECT_DIRECTORY, async (_event) => {
  const dir = await dialog.showOpenDialog({
    properties: ["openDirectory"]
  });
  return dir.filePaths[0];
});
ipcMain.handle(IPC_CHANNELS.DOWNLOAD_TWIC, async (_event, twicNumber, dir) => {
  const url = getTwicDownloadUrl(twicNumber);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  const zip = await res.arrayBuffer();
  const zipPath = path.join(dir, getTwicZipFilename(twicNumber));
  fs.writeFileSync(zipPath, Buffer.from(zip));
  return zipPath;
});
ipcMain.handle(IPC_CHANNELS.GET_DOWNLOADED_TWICS, async (_event, dir) => {
  const files = fs.readdirSync(dir);
  return files.filter((file) => file.match(TWIC_ZIP_REGEX)).map((file) => file.replace("twic", "").replace("g.zip", ""));
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
