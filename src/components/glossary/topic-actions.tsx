import { EllipsisVertical, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import CreateSubtopicDialog from './create-subtopic-dialog'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useMutation } from '@tanstack/react-query'
import { deleteTopic } from '@/modules/glossary/glossary.service'
import { toast } from 'sonner'
import { EditTopicDialog } from './edit-topic-dialog'

interface TopicActionsProps {
  topicId: number
  topicName: string
  onChanged: () => void
}

export function TopicActions({ topicId, topicName, onChanged }: TopicActionsProps): React.JSX.Element {
  const { mutate: deleteTopicMutation, isPending: isDeleting } = useMutation({
    mutationFn: async (): Promise<void> => deleteTopic(topicId),
    onSuccess: (): void => {
      toast.success("Tema eliminado con éxito.")
      onChanged()
    },
    onError: (): void => {
      toast.error("Ocurrió un error al eliminar el tema.")
    }
  })

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="end">
        <div className="space-y-1">
          <CreateSubtopicDialog
            onCreated={onChanged}
            topicId={topicId}
            topicName={topicName}
            asPopoverItem={true}
          />

          <EditTopicDialog
            onUpdated={onChanged}
            topic={{ id_topic: topicId, topic: topicName }}
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
                Eliminar tema
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" />
                  Eliminar tema
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">Tema:</span>
                  </div>
                  <p className="font-medium text-foreground">"{topicName}"</p>
                </div>

                <p className="text-sm text-muted-foreground">
                  Esta acción eliminará permanentemente el tema y todos sus subtemas y términos asociados.
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
                    onClick={(): void => deleteTopicMutation()}
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