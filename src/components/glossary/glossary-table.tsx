import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, type ColumnHelper } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { MstGlossary, UpdateGlossaryDto } from '@/modules/glossary/glossary.model'
import { Button } from '../ui/button'
import type React from 'react'
import { Trash, Video } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { useMutation } from '@tanstack/react-query'
import { deleteGlossary } from '@/modules/glossary/glossary.service'
import { toast } from 'sonner'

interface Props {
  glossaries: MstGlossary[]
  onChanged: () => void
}

const columnHelper: ColumnHelper<MstGlossary> = createColumnHelper<MstGlossary>()

const useDeleteGlossary = (onChanged: () => void) => {
  return useMutation({
    mutationFn: async (id: UpdateGlossaryDto): Promise<void> => deleteGlossary(id),
    onSuccess: (): void => {
      toast.success("Glosario eliminado con éxito.")
      onChanged()
    },
    onError: (): void => {
      toast.warning("Ocurrió un error al eliminar el glosario.")
    }
  })
}

export default function GlossaryTable({ glossaries, onChanged }: Props): React.JSX.Element {
  const { mutate } = useDeleteGlossary(onChanged)

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
    columnHelper.display({
      id: 'actions',
      header: () => <span>Acciones</span>,
      cell: info => {
        const glossary: MstGlossary = info.row.original

        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={'outline'}>
                <Trash />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>¿Desea eliminar este glosario?</DialogTitle>
              </DialogHeader>
              <div className='flex justify-end gap-2'>
                <DialogClose asChild>
                  <Button variant={'outline'}>Cancelar</Button>
                </DialogClose>
                <Button variant={'destructive'} onClick={(): void => {
                  mutate({ p_id_glossary: glossary.id_glossary })
                }}>
                  Eliminar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )
      }
    })
  ]

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
