import { createContext, useContext } from "react";
import { useSession } from "../hooks/useSession";
import Spinner from "@/components/spinner";


interface AuthContextProps {
  role: 'Administrador' | 'Profesor' | 'Estudiante' | 'Usuario'
  name: string
}

const AuthContext = createContext<AuthContextProps>({ role: 'Usuario', name: '' })

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { role, name, loading } = useSession()

  if (loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50" aria-label="Cargando">
      <Spinner />
    </div>
  )

  return (
    <AuthContext.Provider value={{ role, name }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextProps => useContext(AuthContext)