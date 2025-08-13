import z from 'zod'

export const createResourceSchema = z.object({
  id_category: z.number().min(1, {
    error: 'Seleccione una categoría',
  }),
  title: z.string().min(16).max(100, {
    error: 'El título debe tener entre 16 y 100 caracteres',
  }),
  file_url: z.url(),
  short_description: z.string().min(32).max(120, {
    error: 'La descripción corta debe tener entre 32 y 120 caracteres',
  }),
  description: z.string().min(64, {
    error: 'La descripción debe tener al menos 64 caracteres',
  }),
})
