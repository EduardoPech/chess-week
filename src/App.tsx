import { useEffect, useMemo, useState } from 'react'
import './App.css'
import OptionsPanel from './components/Options'
import { getTwics } from './lib/fetchTwics'
import { Button } from './components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './components/ui/card'
import { downloadSelectedTwicNumber, getDownloadedTwicNumbers } from './lib/twicDownload'
import { ColumnDef } from "@tanstack/react-table"
import { columns } from "./components/twics/columns"
import { DataTable } from './components/twics/data-table'
import { Badge } from './components/ui/badge'
import type { Twic } from './types'
import { FolderSync } from 'lucide-react'
import Loading from './components/Loading'
import { Progress } from './components/ui/progress'

function App() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [directory, setDirectory] = useState('')
  const [twics, setTwics] = useState<Twic[]>([])
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const selectedTwics = useMemo(
    () => twics.filter((t) => rowSelection[t.week.toString()]),
    [twics, rowSelection]
  )
  const [downloadedTwicNumbers, setDownloadedTwicNumbers] = useState<string[]>([])
  const getUrlStatuses = async () => {
    const listOfTwics = await getTwics()
    const listOfDownloadedTwicNumbers = await getDownloadedTwicNumbers(directory)
    setDownloadedTwicNumbers(listOfDownloadedTwicNumbers)
    const twicsNotDownloaded = listOfTwics.filter((twic) => !listOfDownloadedTwicNumbers.includes(twic.week.toString()))
    return twicsNotDownloaded
  }

  const downloadSelectedTwics = async () => {
    setIsDownloading(true)
    setDownloadProgress(0)
    for (const twic of selectedTwics) {
      const zipPath = await downloadSelectedTwicNumber(twic.week, directory)
      // zipPach example: /Users/eduardopech/Desktop/twics/twic1628g.zip
      if (zipPath) {
        setDownloadedTwicNumbers((prev) => [...prev, twic.week.toString()])
        setTwics((prev) => prev.filter((t) => t.week !== twic.week))
      }
      setDownloadProgress((prev) => prev + 100 / selectedTwics.length)
    }
    setIsDownloading(false)
    setRowSelection({})
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setRowSelection({})
      const urlStatuses = await getUrlStatuses()
      const downloadedTwics = await getDownloadedTwicNumbers( directory )
      setTwics(urlStatuses)
      setDownloadedTwicNumbers(downloadedTwics)
      setIsLoading(false)
    }
    if (directory) {
      fetchData()
    }
  }, [directory])

  return (
      <div className="container mx-auto py-5">
        <h1 className="text-2xl font-bold">
          Chess Week Synchronizer
        </h1>
        <p className="text-sm text-gray-500">
          Synchronize the Week in Chess (TWIC) games from the Week in Chess website.
        </p>
        <OptionsPanel directory={directory} setDirectory={setDirectory} />
      { !directory && (
        <div className="my-10">
          <h2 className="text-gray-500 text-center py-10 font-bold text-2xl">
            Select a directory to synchronize the TWICs
          </h2>
        </div>
      )} 
      { directory && !isLoading && (
        <div className="flex flex-row gap-4 h-full">
          <div className="flex-1">
              <Card>
                <CardHeader>
                  <CardTitle>TWICs</CardTitle>
                </CardHeader>
                <CardContent>
                  Available: <Badge>{twics.length}</Badge> <br />
                  Downloaded: <Badge>{downloadedTwicNumbers.length}</Badge> <br />
                  Selected: <Badge>{selectedTwics.length}</Badge>
                </CardContent>
                <CardFooter className="flex flex-col justify-center gap-4">
                  {isDownloading &&
                    <Progress value={downloadProgress} />}
                  <Button onClick={downloadSelectedTwics} disabled={isDownloading}>
                    <FolderSync className="size-4" />
                    {isDownloading ? 'Synchronizing...' : 'Start Synchronization'}
                  </Button>
                </CardFooter>
              </Card>
          </div>
          <div className="flex-2">
          <DataTable columns={columns as ColumnDef<Twic>[]} twics={twics} rowSelection={rowSelection} setRowSelection={setRowSelection} />
          </div>
        </div>
      )}
      { isLoading && <Loading /> }
    </div>
  )
}

export default App
