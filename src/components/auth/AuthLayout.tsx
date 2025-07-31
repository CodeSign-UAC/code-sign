import { useState } from 'react'
import { Braces } from 'lucide-react'

import { SignupForm } from './SignupForm'
import { LoginForm } from './LoginForm'
import type { JSX } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface AuthLayoutProps {
  onSuccess: () => void
}

export function AuthLayout({ onSuccess }: AuthLayoutProps): JSX.Element {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
  }

  const clearError = () => {
    setError(null)
  }

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode)
    clearError()
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="bg-blue-500 rounded-full p-4 mb-2">
            <Braces size={34} color="white" />
          </div>
          <h1 className="text-2xl font-bold">CodeSign</h1>
          <p>Aprende a programar</p>
        </div>

        <Card className="shadow-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center">
              {isLoginMode ? 'Bienvenido de nuevo' : 'Crear cuenta'}
            </CardTitle>
            <CardDescription className="text-center">
              {isLoginMode
                ? 'Inicie sesión para continuar'
                : 'Únase a CodeSign para comenzar'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div
                className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
                data-testid="auth-error"
              >
                {error}
              </div>
            )}

            {isLoginMode ? (
              <LoginForm onSuccess={onSuccess} onError={handleError} />
            ) : (
              <SignupForm onSuccess={onSuccess} onError={handleError} />
            )}

            {/* Mode Toggle */}
            <div className="w-full flex flex-col items-center justify-center space-y-4 mt-4">
              <Button
                variant="link"
                onClick={toggleMode}
                className="text-blue-500 cursor-pointer"
                data-testid="auth-mode-toggle"
              >
                {isLoginMode
                  ? '¿No tiene cuenta? Crear una'
                  : '¿Ya tiene cuenta? Iniciar sesión'}
              </Button>

              {isLoginMode && (
                <span className="text-sm text-gray-500">
                  ¿Olvidó su contraseña?{' '}
                  <a
                    href="https://auth.supabase.com/sign-up"
                    className="text-blue-500 hover:underline cursor-pointer"
                  >
                    Recupérela aquí
                  </a>
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
