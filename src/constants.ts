/**
 * Application constants - URLs, IPC channels, and shared patterns.
 * Centralizes configuration to avoid repetition and enable easy updates.
 */

/** Base URL for The Week in Chess website */
export const TWIC_BASE_URL = 'https://theweekinchess.com'

/** URL for the TWIC archive list page */
export const TWIC_LIST_URL = `${TWIC_BASE_URL}/twic`

/** Pattern for TWIC zip download URL - use with twic number: getTwicDownloadUrl(1628) */
export const getTwicDownloadUrl = (week: number): string =>
  `${TWIC_BASE_URL}/zips/twic${week}g.zip`

/** Pattern for TWIC zip filename - use with twic number: getTwicZipFilename(1628) */
export const getTwicZipFilename = (week: number): string => `twic${week}g.zip`

/** Regex to match downloaded TWIC zip files */
export const TWIC_ZIP_REGEX = /twic\d+g\.zip/

/** IPC channel names - keep in sync with electron/main.ts */
export const IPC_CHANNELS = {
  FETCH_URL: 'scraper:fetch-url',
  SELECT_DIRECTORY: 'select-directory',
  DOWNLOAD_TWIC: 'download-selected-twic-number',
  GET_DOWNLOADED_TWICS: 'get-downloaded-twic-numbers',
} as const
