import type { UpdateTermDto } from "@/modules/glossary/glossary.model"
import { glossarySchema, type GlossarySchema } from "@/modules/glossary/glossary.schema"
import { updateTerm } from "@/modules/glossary/glossary.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "../ui/input"
import { toast } from "sonner"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Edit } from "lucide-react"
import { Button } from "../ui/button"
import { TextArea } from "../ui/textArea"

interface EditTermDialogProps {
  onUpdated: () => void
  term: {
    id_glossary: number
    term: string
    description: string
  }
  asPopoverItem?: boolean
}

export function EditTermDialog({ onUpdated, term, asPopoverItem = false }: EditTermDialogProps): React.JSX.Element {
  const form = useForm<GlossarySchema>({
    resolver: zodResolver(glossarySchema),
    defaultValues: {
      term: term.term,
      description: term.description
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateTermDto): Promise<void> => updateTerm(data),
    onSuccess: (): void => {
      form.reset()
      toast.success("Término actualizado con éxito.")
      onUpdated()
    },
    onError: (): void => {
      toast.error("Ocurrió un error al actualizar el término.")
    }
  })

  const onSubmit = (data: GlossarySchema): void => mutate({
    id_glossary: term.id_glossary,
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
            <Edit className="h-4 w-4" />
            Editar término
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-2">
          <DialogTitle>Editar término</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id={`edit-term-${term.id_glossary}`} className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
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
            form={`edit-term-${term.id_glossary}`}
            disabled={isPending}
          >
            {isPending ? "Actualizando..." : "Actualizar término"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}