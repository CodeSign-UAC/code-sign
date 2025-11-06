import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, type ColumnHelper } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { MstGlossary } from '@/modules/glossary/glossary.model'
import type React from 'react'
import { FileText, BookOpen } from 'lucide-react'

import { TermActions } from './terms-actions'

interface Props {
  glossaries: MstGlossary[]
  onChanged: () => void
}

const columnHelper: ColumnHelper<MstGlossary> = createColumnHelper<MstGlossary>()

export default function GlossaryTable({ glossaries, onChanged }: Props): React.JSX.Element {
  const columns = [
    columnHelper.accessor('term', {
      header: () => (
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">Término</span>
        </div>
      ),
      cell: info => (
        <div className="flex flex-col">
          <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {info.getValue()}
          </div>
        </div>
      ),
      size: 250,
    }),
    columnHelper.accessor('description', {
      header: () => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">Descripción</span>
        </div>
      ),
      cell: info => (
        <div className="text-sm text-muted-foreground leading-relaxed">
          {info.getValue()}
        </div>
      ),
      size: 500,
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <span className="font-semibold">Acciones</span>,
      cell: info => {
        const glossary: MstGlossary = info.row.original
        return (
          <TermActions
            glossary={glossary}
            onChanged={onChanged}
          />
        )
      },
      size: 100
    })
  ]

  const table = useReactTable({
    data: glossaries,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  if (glossaries.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed">
        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2 text-foreground">No hay términos</h3>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent border-b">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="font-semibold text-foreground bg-muted/30 py-3"
                  style={{
                    width: header.getSize() !== 150 ? header.getSize() : undefined
                  }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="border-b hover:bg-muted/20 transition-colors group last:border-b-0"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className="py-4 align-top"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="px-6 py-3 bg-muted/10 border-t">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>
            Mostrando {glossaries.length} término{glossaries.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  )
}