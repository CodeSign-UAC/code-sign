import type { UpdateSubtopicDto } from "@/modules/glossary/glossary.model"
import { subtopicSchema, type SubtopicSchema } from "@/modules/glossary/glossary.schema"
import { updateSubtopic } from "@/modules/glossary/glossary.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "../ui/input"
import { toast } from "sonner"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Edit } from "lucide-react"
import { Button } from "../ui/button"

interface EditSubtopicDialogProps {
  onUpdated: () => void
  subtopic: {
    id_subtopic: number
    subtopic_name: string
  }
  asPopoverItem?: boolean
}

export function EditSubtopicDialog({ onUpdated, subtopic, asPopoverItem = false }: EditSubtopicDialogProps): React.JSX.Element {
  const form = useForm<SubtopicSchema>({
    resolver: zodResolver(subtopicSchema),
    defaultValues: {
      subtopic_name: subtopic.subtopic_name
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateSubtopicDto): Promise<void> => updateSubtopic(data),
    onSuccess: (): void => {
      form.reset()
      toast.success("Subtema actualizado con éxito.")
      onUpdated()
    },
    onError: (): void => {
      toast.error("Ocurrió un error al actualizar el subtema.")
    }
  })

  const onSubmit = (data: SubtopicSchema): void => mutate({
    id_subtopic: subtopic.id_subtopic,
    subtopic_name: data.subtopic_name
  })

  return (
    <Dialog>
      {asPopoverItem ? (
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            size="sm"
          >
            <Edit className="h-4 w-4" />
            Editar subtema
          </Button>
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle>Editar subtema</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id={`edit-subtopic-${subtopic.id_subtopic}`} className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField name="subtopic_name" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del subtema</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Introduce el nombre del subtema"
                    {...field}
                    value={field.value ?? ""}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form={`edit-subtopic-${subtopic.id_subtopic}`}
            disabled={isPending}
          >
            {isPending ? "Actualizando..." : "Actualizar subtema"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}