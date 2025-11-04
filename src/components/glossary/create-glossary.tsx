import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { InsertGlossaryDto } from "@/modules/glossary/glossary.model"
import { glossarySchema, type GlossarySchema } from "@/modules/glossary/glossary.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "../ui/input"
import { TextArea } from "../ui/textArea"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { createGlossaryTerm } from "@/modules/glossary/glossary.service"

interface Props {
  id_topic: number
}

export default function CreateGlossary({ id_topic }: Props): React.JSX.Element {
  const form = useForm({
    resolver: zodResolver(glossarySchema),
    defaultValues: {
      id_topic,
      term: '',
      description: '',
    }
  })

  const { mutate } = useMutation({
    mutationFn: (data: InsertGlossaryDto) => createGlossaryTerm(data),
    onSuccess: (): void => {
      form.reset()
      toast.success("Glosario creado con éxito.")
    },
    onError: (): void => {
      toast.warning("Ocurrió un error al crear el glosario.")
    }
  })

  const onSubmit = (data: GlossarySchema): void => {
    mutate({
      p_id_topic: data.id_topic,
      p_term: data.term,
      p_description: data.description
    })
  }

  return (
    <Form {...form}>
      <form id="create-glossary-form" className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField name="term" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Término</FormLabel>
            <FormControl >
              <Input type="text" placeholder="Introduce el término" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField name="description" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción</FormLabel>
            <FormControl >
              <TextArea className="resize-none h-9" placeholder="Describe el término" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </form>
    </Form>
  )
}