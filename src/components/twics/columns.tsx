import { createColumnHelper } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import type { Twic } from "@/types"

const columnHelper = createColumnHelper<Twic>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const columns = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="border-gray-300"
        checked={table.getIsAllRowsSelected() || (table.getIsSomeRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="border-gray-300"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  }),
  columnHelper.accessor("week", {
    header: "Week",
  }),
  columnHelper.accessor("date", {
    header: "Date",
    cell: ({ row }) => {
      return <div className="text-center">{formatDate(row.original.date)}</div>
    }
  }),
  columnHelper.accessor("games", {
    header: "Games",
  }),
]