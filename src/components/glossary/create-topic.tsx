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

interface Props { onCreated: () => void }

export default function CreateTopic({ onCreated }: Props): React.JSX.Element {
  const form = useForm<TopicSchema>({
    resolver: zodResolver(topicSchema),
    defaultValues: { topic: '' }
  })

  const { mutate } = useMutation({
    mutationFn: (data: InsertTopicDto): Promise<void> => insertTopic(data),
    onSuccess: (): void => {
      form.reset()
      toast.success("Tema creado con éxito.")
      onCreated()
    },
    onError: (): void => {
      toast.warning("Ocurrió un error al crear el tema.")
    }
  })

  const onSubmit = (data: TopicSchema): void => mutate({ p_topic: data.topic })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='flex items-center gap-1'>
          <Plus />
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
                  <Input type="text" placeholder="Introduce el tema" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="create-topic">Añadir término</Button>
          <DialogClose asChild onClick={(): void => form.reset()}>
            <Button variant="outline">
              Cancelar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}