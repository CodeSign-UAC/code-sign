import type { UpdateTopicDto } from "@/modules/glossary/glossary.model"
import { topicSchema, type TopicSchema } from "@/modules/glossary/glossary.schema"
import { updateTopic } from "@/modules/glossary/glossary.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "../ui/input"
import { toast } from "sonner"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Edit } from "lucide-react"
import { Button } from "../ui/button"

interface EditTopicDialogProps {
  onUpdated: () => void
  topic: {
    id_topic: number
    topic: string
  }
  asPopoverItem?: boolean
}

export function EditTopicDialog({ onUpdated, topic, asPopoverItem = false }: EditTopicDialogProps): React.JSX.Element {
  const form = useForm<TopicSchema>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      topic: topic.topic
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateTopicDto): Promise<void> => updateTopic(data),
    onSuccess: (): void => {
      form.reset()
      toast.success("Tema actualizado con éxito.")
      onUpdated()
    },
    onError: (): void => {
      toast.error("Ocurrió un error al actualizar el tema.")
    }
  })

  const onSubmit = (data: TopicSchema): void => mutate({
    id_topic: topic.id_topic,
    topic: data.topic
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
            Editar tema
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
          <DialogTitle>Editar tema</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id={`edit-topic-${topic.id_topic}`} className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField name="topic" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del tema</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Introduce el nombre del tema"
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
            form={`edit-topic-${topic.id_topic}`}
            disabled={isPending}
          >
            {isPending ? "Actualizando..." : "Actualizar tema"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}