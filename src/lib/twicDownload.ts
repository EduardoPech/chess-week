import { IPC_CHANNELS } from '../constants'

export function downloadSelectedTwicNumber(twicNumber: number, dir: string) {
  return window.ipcRenderer.invoke(IPC_CHANNELS.DOWNLOAD_TWIC, twicNumber, dir)
}

export function getDownloadedTwicNumbers(dir: string) {
  return window.ipcRenderer.invoke(IPC_CHANNELS.GET_DOWNLOADED_TWICS, dir)
}