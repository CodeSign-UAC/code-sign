import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { deleteResource } from '@/modules/resource/resource.service'

interface DeleteResourceDialogProps {
  id: number
  makeRedirect: () => void
}

export default function DeleteResourceDialog({
  id,
  makeRedirect,
}: DeleteResourceDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteResource(id)
      toast.success('Recurso eliminado exitosamente')
      makeRedirect()
      setOpen(false)
    } catch (err) {
      toast.error('Error al eliminar recurso')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Eliminar Recurso</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar eliminación</DialogTitle>
        </DialogHeader>

        <p className="py-4">
          ¿Estás seguro de que deseas eliminar este recurso?
        </p>

        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            Sí, eliminar
          </Button>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            No, cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
