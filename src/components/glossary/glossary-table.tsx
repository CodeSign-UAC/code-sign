import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, type ColumnHelper } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { MstGlossary, UpdateGlossaryDto } from '@/modules/glossary/glossary.model'
import { Button } from '../ui/button'
import type React from 'react'
import { Trash, FileText, MoreVertical, Edit, BookOpen } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { useMutation } from '@tanstack/react-query'
import { deleteGlossary } from '@/modules/glossary/glossary.service'
import { toast } from 'sonner'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Badge } from '../ui/badge'

interface Props {
  glossaries: MstGlossary[]
  onChanged: () => void
}

const columnHelper: ColumnHelper<MstGlossary> = createColumnHelper<MstGlossary>()

const useDeleteGlossary = (onChanged: () => void) => {
  return useMutation({
    mutationFn: async (id: UpdateGlossaryDto): Promise<void> => deleteGlossary(id),
    onSuccess: (): void => {
      toast.success("Término eliminado con éxito.")
      onChanged()
    },
    onError: (): void => {
      toast.error("Ocurrió un error al eliminar el término.")
    }
  })
}

export default function GlossaryTable({ glossaries, onChanged }: Props): React.JSX.Element {
  const { mutate } = useDeleteGlossary(onChanged)

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-70 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                className="flex items-center gap-2 text-foreground cursor-pointer"
                onClick={() => {
                  toast.info("Funcionalidad de editar en desarrollo")
                }}
              >
                <Edit className="h-4 w-4" />
                <span>Editar término</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                  >
                    <Trash className="h-4 w-4" />
                    <span>Eliminar término</span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                      <Trash className="h-5 w-5" />
                      Eliminar término
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="font-normal">
                          Término
                        </Badge>
                      </div>
                      <p className="font-medium text-foreground">"{glossary.term}"</p>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Esta acción eliminará permanentemente el término del glosario.
                      Esta acción no se puede deshacer.
                    </p>

                    <div className="flex justify-end gap-3 pt-2">
                      <DialogClose asChild>
                        <Button variant="outline" className="px-6">
                          Cancelar
                        </Button>
                      </DialogClose>
                      <Button
                        variant="destructive"
                        onClick={(): void => {
                          mutate({ p_id_glossary: glossary.id_glossary })
                        }}
                        className="px-6"
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      size: 100,
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