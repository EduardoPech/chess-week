import { app as s, BrowserWindow as w, ipcMain as c, dialog as m } from "electron";
import { fileURLToPath as R } from "node:url";
import e from "node:path";
import _ from "node:fs";
const D = "https://theweekinchess.com", I = (o) => `${D}/zips/twic${o}g.zip`, O = (o) => `twic${o}g.zip`, P = /twic\d+g\.zip/, p = {
  SELECT_DIRECTORY: "select-directory",
  DOWNLOAD_TWIC: "download-selected-twic-number",
  GET_DOWNLOADED_TWICS: "get-downloaded-twic-numbers"
}, E = e.dirname(R(import.meta.url));
process.env.APP_ROOT = e.join(E, "..");
const l = process.env.VITE_DEV_SERVER_URL, S = e.join(process.env.APP_ROOT, "dist-electron"), T = e.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = l ? e.join(process.env.APP_ROOT, "public") : T;
let t;
function f() {
  t = new w({
    icon: e.join(process.env.VITE_PUBLIC, "icon.png"),
    webPreferences: {
      preload: e.join(E, "preload.mjs")
    },
    width: 1200,
    height: 800
  }), t.webContents.on("did-finish-load", () => {
    t == null || t.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), l ? t.loadURL(l) : t.loadFile(e.join(T, "index.html"));
}
s.on("window-all-closed", () => {
  process.platform !== "darwin" && (s.quit(), t = null);
});
s.on("activate", () => {
  w.getAllWindows().length === 0 && f();
});
c.handle("scraper:fetch-url", async (o, n) => {
  const i = await fetch(n);
  if (!i.ok) throw new Error(`HTTP ${i.status}: ${n}`);
  return i.text();
});
c.handle(p.SELECT_DIRECTORY, async (o) => (await m.showOpenDialog({
  properties: ["openDirectory"]
})).filePaths[0]);
c.handle(p.DOWNLOAD_TWIC, async (o, n, i) => {
  const r = I(n), a = await fetch(r);
  if (!a.ok) throw new Error(`HTTP ${a.status}: ${r}`);
  const h = await a.arrayBuffer(), d = e.join(i, O(n));
  return _.writeFileSync(d, Buffer.from(h)), d;
});
c.handle(p.GET_DOWNLOADED_TWICS, async (o, n) => _.readdirSync(n).filter((r) => r.match(P)).map((r) => r.replace("twic", "").replace("g.zip", "")));
s.whenReady().then(f);
export {
  S as MAIN_DIST,
  T as RENDERER_DIST,
  l as VITE_DEV_SERVER_URL
};
