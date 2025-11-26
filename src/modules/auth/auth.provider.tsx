import { createContext, useContext } from 'react'
import { useSession } from '../../core/hooks/useSession'
import Spinner from '@/components/auth/spinner'

interface AuthContextProps {
  role: 'Administrador' | 'Profesor' | 'Estudiante' | 'Usuario'
  name: string
  user_id: number | undefined
}

const AuthContext = createContext<AuthContextProps>({
  role: 'Usuario',
  name: '',
  user_id: undefined,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { role, name, loading, user_id } = useSession()

  if (loading)
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50"
        aria-label="Cargando"
      >
        <Spinner />
      </div>
    )

  return (
    <AuthContext.Provider value={{ role, name, user_id }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextProps => useContext(AuthContext)
