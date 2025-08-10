import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, type ColumnHelper } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { MstGlossary } from '@/modules/glossary/glossary.model'
import { Button } from '../ui/button'
import type React from 'react'
import { Video } from 'lucide-react'

const columnHelper: ColumnHelper<MstGlossary> = createColumnHelper<MstGlossary>()

const columns = [
  columnHelper.accessor('term', {
    header: () => <span>Término</span>,
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('description', {
    header: () => <span>Descripción</span>,
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('video_url', {
    header: () => <span>URL del video</span>,
    cell: info => {
      if (info.getValue()) {
        return (
          <Button variant={'outline'}>
            <Video />
            <a href={info.getValue() ?? undefined} target="_blank">Ver video</a>
          </Button>
        )
      }
      return <span>—</span>
    },
  }),
]

interface Props {
  glossaries: MstGlossary[]
}

export default function GlossaryTable({ glossaries }: Props): React.JSX.Element {
  const table = useReactTable({
    data: glossaries,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
