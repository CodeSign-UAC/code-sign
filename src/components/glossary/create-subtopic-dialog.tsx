import type { InsertSubtopicDto } from "@/modules/glossary/glossary.model"
import { insertSubtopic } from "@/modules/glossary/glossary.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "../ui/input"
import { toast } from "sonner"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { FolderPlus } from "lucide-react"
import { Button } from "../ui/button"
import { subtopicSchema, type SubtopicSchema } from "@/modules/glossary/glossary.schema"

interface CreateSubtopicDialogProps {
  onCreated: () => void
  topicId: number
  topicName: string
  variant?: "default" | "outline"
  asPopoverItem?: boolean
}

export default function CreateSubtopicDialog({ onCreated, topicId, topicName, variant = "outline", asPopoverItem }: CreateSubtopicDialogProps): React.JSX.Element {
  const form = useForm<SubtopicSchema>({
    resolver: zodResolver(subtopicSchema),
    defaultValues: { subtopic_name: '' }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: InsertSubtopicDto): Promise<void> => insertSubtopic(data),
    onSuccess: (): void => {
      form.reset()
      toast.success("Subtema creado con éxito.")
      onCreated()
    },
    onError: (): void => {
      toast.error("Ocurrió un error al crear el subtema.")
    }
  })

  const onSubmit = (data: SubtopicSchema): void => mutate({
    id_topic: topicId,
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
            <FolderPlus className="h-4 w-4" />
            Agregar subtema
          </Button>
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant={variant} className='flex items-center gap-1'>
            <FolderPlus className="h-4 w-4" />
            Agregar subtema
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle>Crear nuevo subtema</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Para el tema: <span className="font-medium">{topicName}</span>
          </p>
        </DialogHeader>
        <Form {...form}>
          <form id="create-subtopic" className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
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
            form="create-subtopic"
            disabled={isPending}
          >
            {isPending ? "Creando..." : "Crear subtema"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}