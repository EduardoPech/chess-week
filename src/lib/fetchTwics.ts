import type { Twic } from '../types'

let cachedTwics: Twic[] | null = null

const getTwics = async (): Promise<Twic[]> => {
  if (cachedTwics) return cachedTwics

  try {
    const htmlText = await window.ipcRenderer.invoke('scraper:fetch-url', 'https://theweekinchess.com/twic')
    const doc = parseIntoDocument(htmlText)
    const rows = [...doc.getElementsByTagName('tr')]
    // Filter row that has class tabhead or tabhead2 and not empty and has seven cells
    const filteredRows = rows.filter((row: HTMLElement) => !row.classList.contains('tabhead') && !row.classList.contains('tabhead2') && row.innerText.trim() !== '' && row.getElementsByTagName('td').length === 7
    && row.getElementsByTagName('td')[3].getElementsByTagName('a')[0]?.href)

    const twics = filteredRows.map((row: HTMLElement) => {
      const cells = row.getElementsByTagName('td')

      return {
        week: parseInt(cells[0].textContent || '0'),
        date: cells[1].textContent || '',
        games: parseInt(cells[5].textContent || '0'),
        url: cells[3].getElementsByTagName('a')[0]?.href || '',
      }
    })
    cachedTwics = twics
    return twics
  } catch (err) {
    console.warn('Something went wrong.', err)
    return []
  }
}

const parseIntoDocument = (str: string) => {
  const parser = new DOMParser();
  return parser.parseFromString(str, "text/html");
}
export {
  getTwics
};
