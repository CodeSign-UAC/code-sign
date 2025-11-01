import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, type ColumnHelper } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { MstGlossary, UpdateGlossaryDto } from '@/modules/glossary/glossary.model'
import { Button } from '../ui/button'
import type React from 'react'
import { Trash, Video, FileText, MoreVertical } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { useMutation } from '@tanstack/react-query'
import { deleteGlossary } from '@/modules/glossary/glossary.service'
import { toast } from 'sonner'
import { Badge } from '../ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'

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
          <span>Término</span>
        </div>
      ),
      cell: info => (
        <div className="font-medium text-foreground">
          {info.getValue()}
        </div>
      ),
      size: 200,
    }),
    columnHelper.accessor('description', {
      header: () => (
        <div className="flex items-center gap-2">
          <span>Descripción</span>
        </div>
      ),
      cell: info => (
        <div className="text-sm text-muted-foreground line-clamp-2">
          {info.getValue()}
        </div>
      ),
      size: 400,
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <span>Acciones</span>,
      cell: info => {
        const glossary: MstGlossary = info.row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {glossary.video_url && (
                <DropdownMenuItem asChild>
                  <a
                    href={glossary.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Video className="h-4 w-4" />
                    <span>Ver video</span>
                  </a>
                </DropdownMenuItem>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="flex items-center gap-2 text-destructive focus:text-destructive"
                  >
                    <Trash className="h-4 w-4" />
                    <span>Eliminar término</span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Trash className="h-5 w-5 text-destructive" />
                      Eliminar término
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      ¿Estás seguro de que deseas eliminar el término
                      <span className="font-semibold text-foreground"> "{glossary.term}"</span>?
                      Esta acción no se puede deshacer.
                    </p>
                    <div className="flex justify-end gap-3">
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
      size: 80,
    })
  ]

  const table = useReactTable({
    data: glossaries,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  if (glossaries.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No hay términos</h3>
        <p className="text-muted-foreground">
          Comienza agregando el primer término a este tema.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="font-semibold text-foreground bg-muted/50"
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
              className="border-b hover:bg-muted/30 transition-colors group"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className="py-3 align-top"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}