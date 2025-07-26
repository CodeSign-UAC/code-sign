import { createFileRoute } from '@tanstack/react-router'
import { Braces, KeyRound, Mail } from 'lucide-react';
import * as z from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../supabaseClient'
import { useSession } from '../hooks/useSession'
import type { JSX } from 'react'

export const Route = createFileRoute('/')({
  component: App,
})

const scheme = z.object({
  email: z.email('Ingrese un correo electrónico válido'),
  password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres')
})

function App(): JSX.Element {
  const { session, loading } = useSession()

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(scheme),
    defaultValues: { email: '', password: '' },
    mode: "onChange"
  })

  const onSubmit = async ({ email, password }: z.infer<typeof scheme>): Promise<void> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error)
      console.error('Error al iniciar sesión:', error.message)
    else
      console.log('Inicio de sesión exitoso')
  }

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='w-full max-w-md'>
        <div className='flex flex-col items-center justify-center mb-6'>
          <div className='bg-blue-500 rounded-full p-4 mb-2'>
            <Braces size={34} color='white' />
          </div>
          <h1 className='text-2xl font-bold'>CodeSign</h1>
          <p>Aprende a programar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='card bg-base-100 card-xs shadow-sm px-2 py-4'>
          <div className='flex flex-col items-center space-y-2 mb-4'>
            <h3 className='text-2xl'>Inicie sesión</h3>
            <p className='text-sm text-gray-500'>Ingrese sus credenciales</p>
          </div>

          <div className='flex flex-col gap-3 items-center p-6'>
            <div className='w-full flex flex-col gap-2'>
              <label className='label text-base-content'>Correo institucional</label>
              <label className={`input ${watch('email').length > 0 && 'validator'} w-full`}>
                <Mail stroke='gray' />
                <input type="email" placeholder="correo@universidad.edu.ni" {...register('email')} />
              </label>
              {errors.email && <span className='text-red-500 text-sm'>{errors.email.message}</span>}
            </div>
            <div className='w-full flex flex-col gap-2'>
              <label className='label text-base-content'>Contraseña</label>
              <label className={`input ${watch('password').length > 0 && 'validator'} w-full`}>
                <KeyRound stroke='gray' />
                <input type="password" placeholder="Ingrese su contraseña" {...register('password')} />
              </label>
              {errors.password && <span className='text-red-500 text-sm'>{errors.password.message}</span>}
            </div>

            <div className='w-full flex flex-col items-center justify-center space-y-4'>
              <button type="submit" className="btn btn-primary w-full mt-4">Iniciar sesión</button>

              <span className='text-sm text-gray-500'>
                ¿Olvidó su contraseña? <a href="https://auth.supabase.com/sign-up" className='text-blue-500 hover:underline'>Recupérela aquí</a>
              </span>
            </div>

          </div>
        </form>
      </div>
    </div>
  )

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
