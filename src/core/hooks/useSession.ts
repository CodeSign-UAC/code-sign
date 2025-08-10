import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { supabase } from '../../lib/supabaseClient'
import type { JwtPayload, Session } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import type { UserDto } from '../../modules/user/user.model'
import { fetchUser } from '@/modules/user/user.service'

type UserRoles = 'Administrador' | 'Profesor' | 'Estudiante' | 'Usuario'

const renderRole = (role: number): UserRoles => {
  switch (role) {
    case 1: return 'Administrador'
    case 2: return 'Profesor'
    case 3: return 'Estudiante'
    default: return 'Usuario'
  }
}

export const getUserQuery = (uuid: string) => {
  return useQuery({
    queryKey: ["user", uuid],
    queryFn: (): Promise<UserDto[]> => fetchUser(uuid),
    enabled: !!uuid
  })
}

export function useSession() {
  const [currentSession, setCurrentSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [jwt, setJwt] = useState<JwtPayload>()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentSession(session)
      setLoading(false)
      if (session?.access_token) {
        setJwt(jwtDecode(session.access_token))
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentSession(session)
      setLoading(false)
      if (session?.access_token) {
        setJwt(jwtDecode(session.access_token))
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const { data, isLoading: roleLoading } = getUserQuery(jwt?.sub ?? '')
  const role: UserRoles = renderRole(data?.[0]?.id_role ?? 0)
  const name: string = data?.[0].first_name + ' ' + (data?.[0].surname || '')

  return {
    session: currentSession,
    user: currentSession?.user,
    jwt,
    role,
    name,
    user_id: data?.[0].id_user,
    loading: loading || roleLoading
  }
}
