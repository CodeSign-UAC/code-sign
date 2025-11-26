import type { InsertGlossaryDto } from "@/modules/glossary/glossary.model"
import { glossarySchema, type GlossarySchema } from "@/modules/glossary/glossary.schema"
import { insertGlossaryTerm } from "@/modules/glossary/glossary.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "../ui/input"
import { toast } from "sonner"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { FilePlus } from "lucide-react"
import { Button } from "../ui/button"
import { TextArea } from "../ui/textArea"

interface CreateTermDialogProps {
  onCreated: () => void
  subtopicId: number
  subtopicName: string
  variant?: "default" | "outline"
  asPopoverItem?: boolean
}

export default function CreateTermDialog({ onCreated, subtopicId, subtopicName, variant = "outline", asPopoverItem }: CreateTermDialogProps): React.JSX.Element {
  const form = useForm<GlossarySchema>({
    resolver: zodResolver(glossarySchema),
    defaultValues: {
      term: '',
      description: ''
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: InsertGlossaryDto): Promise<void> => insertGlossaryTerm(data),
    onSuccess: (): void => {
      form.reset()
      toast.success("Término creado con éxito.")
      onCreated()
    },
    onError: (): void => {
      toast.error("Ocurrió un error al crear el término.")
    }
  })

  const onSubmit = (data: GlossarySchema): void => mutate({
    id_subtopic: subtopicId,
    term: data.term,
    description: data.description
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
            <FilePlus className="h-4 w-4" />
            Agregar término
          </Button>
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant={variant} className='flex items-center gap-1'>
            <FilePlus className="h-4 w-4" />
            Agregar término
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-2">
          <DialogTitle>Crear nuevo término</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Para el subtema: <span className="font-medium">{subtopicName}</span>
          </p>
        </DialogHeader>
        <Form {...form}>
          <form id="create-term" className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField name="term" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Término</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Introduce el término"
                    {...field}
                    value={field.value ?? ""}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="description" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <TextArea
                    placeholder="Describe el término..."
                    {...field}
                    value={field.value ?? ""}
                    disabled={isPending}
                    rows={4}
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
            form="create-term"
            disabled={isPending}
          >
            {isPending ? "Creando..." : "Crear término"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}