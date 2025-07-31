import { createFileRoute, useNavigate } from '@tanstack/react-router'
import type { JSX } from 'react'
import { AuthLayout } from '@/components/auth'

export const Route = createFileRoute('/_layout/')({
  component: LoginPage,
})

function LoginPage(): JSX.Element {
  const navigate = useNavigate({ from: Route.id })

  const handleAuthSuccess = () => {
    navigate({ to: '/app/home' })
  }

  return <AuthLayout onSuccess={handleAuthSuccess} />
}
