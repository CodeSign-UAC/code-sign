import type { JSX } from 'react'
import { useSession } from '@/core/hooks/useSession'

export default function UserRole(): JSX.Element {
  const { role } = useSession()

  const renderRole = () => {
    switch (role) {
      case 'student':
        return 'Estudiante'
      case 'teacher':
        return 'Profesor'
      case 'admin':
        return 'Administrador'
      default:
        return 'Usuario'
    }
  }

  return <div>{renderRole()}</div>
}
