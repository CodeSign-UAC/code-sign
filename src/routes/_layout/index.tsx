import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Braces, KeyRound, Mail } from 'lucide-react';
import * as z from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";

import { useState, type JSX } from 'react'
import { supabase } from '@/lib/supabaseClient';
import { useSession } from '@/core/hooks/useSession';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_layout/')({
  component: LoginPage,
})

const scheme = z.object({
  email: z.email('Ingrese un correo electrónico válido'),
  password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres')
})

function LoginPage(): JSX.Element {
  const { session, loading } = useSession()
  const navigate = useNavigate({ from: Route.id })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(scheme),
    defaultValues: { email: '', password: '' },
    mode: "onChange"
  })

  const onSubmit = async ({ email, password }: z.infer<typeof scheme>): Promise<void> => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setIsLoading(false)

    if (error)
      console.error('Error al iniciar sesión:', error.message)
    else
      navigate({ to: '/app/home' })
  }

  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <div className='w-full max-w-md'>

        {/* Header */}
        <div className='flex flex-col items-center justify-center mb-6'>
          <div className='bg-blue-500 rounded-full p-4 mb-2'>
            <Braces size={34} color='white' />
          </div>
          <h1 className='text-2xl font-bold'>CodeSign</h1>
          <p>Aprende a programar</p>
        </div>

        <Card className='shadow-md'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-2xl font-semibold text-center'>Bienvenido de nuevo</CardTitle>
            <CardDescription className='text-center'>Inicie sesión para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className="space-y-2">
                <Label htmlFor='email'>Correo institucional</Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='email'
                    type="email"
                    placeholder="Ingrese su correo institucional"
                    className={`${watch('email').length > 0 && 'validator'} pl-10`}
                    {...register('email')}
                  />
                </div>
              </div>
              {errors.email && (
                <Alert variant='destructive'>
                  <Mail />
                  {/* <AlertTitle>Error</Al ertTitle> */}
                  <AlertDescription>
                    {errors.email.message}
                  </AlertDescription>
                </Alert>
              )}

              <div className='space-y-2'>
                <Label htmlFor='password'>Contraseña</Label>
                <div className='relative'>
                  <KeyRound className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='password'
                    type="password"
                    placeholder="Ingrese su contraseña"
                    className={`${watch('password').length > 0 && 'validator'} pl-10`}
                    {...register('password')}
                  />
                </div>
              </div>
              {errors.password && (
                <Alert variant='destructive'>
                  <KeyRound />
                  {/* <AlertTitle>Error</AlertTitle> */}
                  <AlertDescription>
                    {errors.password.message}
                  </AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 cursor-pointer">
                {isLoading ? 'Cargando...' : 'Iniciar sesión'}
              </Button>
            </form>
            <div className='w-full flex flex-col items-center justify-center space-y-4 mt-4'>
              <span className='text-sm text-gray-500'>
                ¿Olvidó su contraseña? <a href="https://auth.supabase.com/sign-up" className='text-blue-500 hover:underline cursor-pointer'>Recupérela aquí</a>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  //  <div className='w-full flex flex-col gap-2'>
  //                 <label className='label text-base-content'>Contraseña</label>
  //                 <label className={`input ${watch('password').length > 0 && 'validator'} w-full`}>
  //                   <KeyRound stroke='gray' />
  //                   <input type="password" placeholder="Ingrese su contraseña" {...register('password')} />
  //                 </label>
  //                 {errors.password && <span className='text-red-500 text-sm'>{errors.password.message}</span>}
  //               </div>

  // if (loading) {
  //   return <div></div>
  // } else if (!session) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <div className="w-xl px-4">
  //         <Auth
  //           supabaseClient={supabase}
  //           appearance={{ theme: ThemeSupa }}
  //           providers={['google']}
  //         />
  //       </div>
  //     </div>
  //   )
  // } else {
  //   return <div>Logged in!</div>
  // }
}
