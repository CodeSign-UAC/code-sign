import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, type ColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { MstGlossary } from '@/modules/glossary/glossary.model'
import { FileText, BookOpen } from 'lucide-react'
import { TermActions } from './terms-actions'
import { useMemo } from 'react'

interface Props {
  glossaries: MstGlossary[]
  onChanged: () => void
  hasAdminPermission: boolean
}

const columnHelper: ColumnHelper<MstGlossary> = createColumnHelper<MstGlossary>()

export default function GlossaryTable({ glossaries, onChanged, hasAdminPermission }: Props): React.JSX.Element {
  const columns = useMemo(() => {
    const baseColumns: ColumnDef<MstGlossary, any>[] = [
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
      }),
      columnHelper.accessor('description', {
        header: () => (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">Descripción</span>
          </div>
        ),
        cell: info => (
          <div className="text-sm text-muted-foreground leading-relaxed whitespace-normal wrap-break-word">
            {info.getValue()}
          </div>
        ),
        size: 500,
      }),
    ]

    if (hasAdminPermission) {
      baseColumns.push(
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
        })
      )
    }

    return baseColumns
  }, [onChanged, hasAdminPermission])

  const table = useReactTable({
    data: glossaries,
    columns,
    getCoreRowModel: getCoreRowModel()
  })


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
                  style={{ width: header.getSize() }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
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
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length} // <-- Esto se ajustará automáticamente
                className="h-48 text-center"
              >
                <div className="flex flex-col items-center justify-center gap-3">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">No hay términos</h3>
                    <p className="text-sm text-muted-foreground">
                      No se han agregado términos a este subtema.
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {table.getRowModel().rows.length > 0 && (
        <div className="px-6 py-3 bg-muted/10 border-t">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>
              Mostrando {glossaries.length} término{glossaries.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}