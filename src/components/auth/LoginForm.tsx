/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { KeyRound, Mail } from 'lucide-react'

import type { JSX } from 'react'
import type { LoginForm as LoginFormType } from '@/modules/auth/auth.schema'
import { loginSchema } from '@/modules/auth/auth.schema'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface LoginFormProps {
  onSuccess: () => void
  onError?: (error: string) => void
}

export function LoginForm({ onSuccess, onError }: LoginFormProps): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  })

  const onSubmit = async ({
    email,
    password,
  }: LoginFormType): Promise<void> => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setIsLoading(false)

    if (error) {
      const errorMessage = 'Error al iniciar sesión: ' + error.message
      console.error(errorMessage)
      onError?.(errorMessage)
    } else {
      onSuccess()
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const email = params.get('email')
    const password = params.get('password')

    if (email && password) {
      onSubmit({ email, password })
    }
  }, [])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      data-testid="login-form"
    >
      <div className="space-y-2">
        <Label htmlFor="email">Correo institucional</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="Ingrese su correo institucional"
            className={`${watch('email').length > 0 && 'validator'} pl-10`}
            {...register('email')}
            data-testid="email-input"
          />
        </div>
      </div>
      {errors.email && (
        <Alert variant="destructive" data-testid="email-error">
          <Mail />
          <AlertDescription>{errors.email.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="Ingrese su contraseña"
            className={`${watch('password').length > 0 && 'validator'} pl-10`}
            {...register('password')}
            data-testid="password-input"
          />
        </div>
      </div>
      {errors.password && (
        <Alert variant="destructive" data-testid="password-error">
          <KeyRound />
          <AlertDescription>{errors.password.message}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 cursor-pointer"
        disabled={isLoading}
        data-testid="login-submit"
      >
        {isLoading ? 'Cargando...' : 'Iniciar sesión'}
      </Button>
    </form>
  )
}
