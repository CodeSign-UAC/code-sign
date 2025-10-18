import z from 'zod'

export const createResourceSchema = z.object({
  id_category: z.number().min(1, {
    error: 'Seleccione una categoría',
  }),
  title: z
    .string()
    .min(16, {
      error: 'El título debe de ser de mínimo 16 caracteres',
    })
    .max(100, {
      error: 'El título debe de ser de máximo 100 caracteres',
    }),
  file_url: z.url({
    error: 'Debe subir un archivo para poder continuar',
  }),
  short_description: z
    .string()
    .min(24, {
      error: 'La descripción corta debe tener al menos 24 caracteres',
    })
    .max(120, {
      error: 'La descripción corta debe tener máximo 120 caracteres',
    }),
  description: z.string().min(24, {
    error: 'La descripción debe tener al menos 24 caracteres',
  }),
})

export type CreateResourceForm = z.infer<typeof createResourceSchema>
