import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { KeyRound, Mail } from 'lucide-react'

import type { JSX } from 'react'
import type { SignupForm as SignupFormType } from '@/lib/schemas/auth'
import { signupSchema } from '@/lib/schemas/auth'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface SignupFormProps {
  onSuccess: () => void
  onError?: (error: string) => void
}

export function SignupForm({
  onSuccess,
  onError,
}: SignupFormProps): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormType>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
    mode: 'onChange',
  })

  const onSubmit = async ({
    email,
    password,
  }: SignupFormType): Promise<void> => {
    setIsLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    setIsLoading(false)

    if (error) {
      const errorMessage = 'Error al crear cuenta: ' + error.message
      console.error(errorMessage)
      onError?.(errorMessage)
    } else {
      onSuccess()
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      data-testid="signup-form"
    >
      <div className="space-y-2">
        <Label htmlFor="signup-email">Correo institucional</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-email"
            type="email"
            placeholder="Ingrese su correo institucional"
            className={`${watch('email').length > 0 && 'validator'} pl-10`}
            {...register('email')}
            data-testid="signup-email-input"
          />
        </div>
      </div>
      {errors.email && (
        <Alert variant="destructive" data-testid="signup-email-error">
          <Mail />
          <AlertDescription>{errors.email.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="signup-password">Contraseña</Label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-password"
            type="password"
            placeholder="Ingrese su contraseña"
            className={`${watch('password').length > 0 && 'validator'} pl-10`}
            {...register('password')}
            data-testid="signup-password-input"
          />
        </div>
      </div>
      {errors.password && (
        <Alert variant="destructive" data-testid="signup-password-error">
          <KeyRound />
          <AlertDescription>{errors.password.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirmar contraseña</Label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirme su contraseña"
            className={`${watch('confirmPassword').length > 0 && 'validator'} pl-10`}
            {...register('confirmPassword')}
            data-testid="confirm-password-input"
          />
        </div>
      </div>
      {errors.confirmPassword && (
        <Alert variant="destructive" data-testid="confirm-password-error">
          <KeyRound />
          <AlertDescription>{errors.confirmPassword.message}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 cursor-pointer text-white"
        disabled={isLoading}
        data-testid="signup-submit"
      >
        {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
      </Button>
    </form>
  )
}
