import type { InsertTopicDto } from "@/modules/glossary/glossary.model"
import { topicSchema, type TopicSchema } from "@/modules/glossary/glossary.schema"
import { insertTopic } from "@/modules/glossary/glossary.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "../ui/input"
import { toast } from "sonner"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Plus } from "lucide-react"
import { Button } from "../ui/button"

interface Props {
  onCreated: () => void
  variant?: "default" | "outline"
}

export default function CreateTopicDialog({ onCreated, variant = "default" }: Props): React.JSX.Element {
  const form = useForm<TopicSchema>({
    resolver: zodResolver(topicSchema),
    defaultValues: { topic: '' }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: InsertTopicDto): Promise<void> => insertTopic(data),
    onSuccess: (): void => {
      form.reset()
      toast.success("Tema creado con éxito.")
      onCreated()
    },
    onError: (): void => {
      toast.error("Ocurrió un error al crear el tema.")
    }
  })

  const onSubmit = (data: TopicSchema): void => mutate({ topic: data.topic })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant} className='flex items-center gap-1'>
          <Plus className="h-4 w-4" />
          Agregar tema
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle>Crear nuevo tema</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id="create-topic" className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField name="topic" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Tema</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Introduzca el nombre del tema"
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
            form="create-topic"
            disabled={isPending}
          >
            {isPending ? "Creando..." : "Crear tema"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}