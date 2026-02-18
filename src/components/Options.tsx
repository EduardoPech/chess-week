import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import {
  FolderPlus
} from "lucide-react"

interface OptionsPanelProps {
    directory: string;
    setDirectory: (dir: string) => void;
}

export default function OptionsPanel({ directory, setDirectory }: OptionsPanelProps) {
  const onDirectoryChange = async () => {
    const dir = await window.ipcRenderer.invoke('select-directory') as string
    setDirectory(dir)
  }

  return (
    <div className="flex flex-row gap-4 my-4">
      <div className="flex flex-col items-center justify-center">
        <Label>Local Files Directory</Label>
      </div>
      <div className="flex flex-col w-full">
        <Input value={directory} readOnly placeholder="No directory selected" />
      </div>
      <div className="flex flex-col">
        <Button onClick={onDirectoryChange}>
          <FolderPlus className="size-4" />
          {directory ? 'Change Directory' : 'Select Directory'}
        </Button>
      </div>
    </div>
  )
};