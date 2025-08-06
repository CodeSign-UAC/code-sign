import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { supabase } from '../../lib/supabaseClient'
import type { Session } from '@supabase/supabase-js'

export function useSession() {
  const [currentSession, setCurrentSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentSession(session)
      setLoading(false)
      if (session?.access_token) {
        const jwt = jwtDecode(session.access_token)
        setRole((jwt as any).user_role ?? 'student')
      }
    })

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentSession(session)
      setLoading(false)
    })

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe()
  }, [])

  return {
    session: currentSession,
    user: currentSession?.user,
    loading,
    role,
  }
}
