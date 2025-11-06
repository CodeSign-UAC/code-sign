import { EllipsisVertical, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import CreateTermDialog from './create-term-dialog'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useMutation } from '@tanstack/react-query'
import { deleteSubtopic } from '@/modules/glossary/glossary.service'
import { toast } from 'sonner'
import { EditSubtopicDialog } from './edit-subtopic-dialog'

interface SubtopicActionsProps {
  subtopicId: number
  subtopicName: string
  onChanged: () => void
}

export function SubtopicActions({ subtopicId, subtopicName, onChanged }: SubtopicActionsProps): React.JSX.Element {
  const { mutate: deleteSubtopicMutation, isPending: isDeleting } = useMutation({
    mutationFn: async (): Promise<void> => deleteSubtopic(subtopicId),
    onSuccess: (): void => {
      toast.success("Subtema eliminado con éxito.")
      onChanged()
    },
    onError: (): void => {
      toast.error("Ocurrió un error al eliminar el subtema.")
    }
  })

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <EllipsisVertical className="h-4 w-4" />
          <span className="sr-only">Abrir acciones</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="end">
        <div className="space-y-1">
          <CreateTermDialog
            onCreated={onChanged}
            subtopicId={subtopicId}
            subtopicName={subtopicName}
            asPopoverItem={true}
          />

          <EditSubtopicDialog
            onUpdated={onChanged}
            subtopic={{ id_subtopic: subtopicId, subtopic_name: subtopicName }}
            asPopoverItem={true}
          />

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar subtema
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" />
                  Eliminar subtema
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">Subtema:</span>
                  </div>
                  <p className="font-medium text-foreground">"{subtopicName}"</p>
                </div>

                <p className="text-sm text-muted-foreground">
                  Esta acción eliminará permanentemente el subtema y todos sus términos asociados.
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
                    onClick={(): void => deleteSubtopicMutation()}
                    disabled={isDeleting}
                    className="px-6"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isDeleting ? "Eliminando..." : "Eliminar"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </PopoverContent>
    </Popover>
  )
}