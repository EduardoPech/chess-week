export function downloadSelectedTwicNumber(twicNumber: number, dir: string) {
  return window.ipcRenderer.invoke('download-selected-twic-number', twicNumber, dir);
}

export function getDownloadedTwicNumbers(dir: string) {
  return window.ipcRenderer.invoke('get-downloaded-twic-numbers', dir);
}