import { EllipsisVertical, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useMutation } from '@tanstack/react-query'
import { deleteTerm } from '@/modules/glossary/glossary.service'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import type { MstGlossary } from '@/modules/glossary/glossary.model'
import { EditTermDialog } from './edit-term-dialog'

interface TermActionsProps {
  glossary: MstGlossary
  onChanged: () => void
}

export function TermActions({ glossary, onChanged }: TermActionsProps): React.JSX.Element {
  const { mutate: deleteTermMutation, isPending: isDeleting } = useMutation({
    mutationFn: async (): Promise<void> => deleteTerm(glossary.id_glossary),
    onSuccess: (): void => {
      toast.success("Término eliminado con éxito.")
      onChanged()
    },
    onError: (): void => {
      toast.error("Ocurrió un error al eliminar el término.")
    }
  })

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 opacity-70 group-hover:opacity-100 transition-opacity"
        >
          <EllipsisVertical className="h-4 w-4" />
          <span className="sr-only">Abrir acciones</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="end">
        <div className="space-y-1">
          <EditTermDialog
            onUpdated={onChanged}
            term={{
              id_glossary: glossary.id_glossary,
              term: glossary.term,
              description: glossary.description
            }}
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
                Eliminar término
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" />
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
                    onClick={(): void => deleteTermMutation()}
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