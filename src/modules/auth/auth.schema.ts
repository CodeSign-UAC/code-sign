import * as z from 'zod'

export const loginSchema = z.object({
  email: z.email({
    error: 'Ingrese un correo electrónico válido'
  }),
  password: z.string().min(4, {
    error: 'La contraseña debe tener al menos 4 caracteres'
  }),
})

export const signupSchema = z.object({
  username: z.string().min(3, {
    error: 'El nombre de usuario debe tener al menos 3 caracteres'
  }),
  email: z.email({
    error: 'Ingrese un correo electrónico válido'
  }),
  password: z.string().min(6, {
    error: 'La contraseña debe tener al menos 6 caracteres'
  }),
  confirmPassword: z.string().min(6, {
    error: 'Confirme su contraseña'
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
})

export type LoginForm = z.infer<typeof loginSchema>
export type SignupForm = z.infer<typeof signupSchema>