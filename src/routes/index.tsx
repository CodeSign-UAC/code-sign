import { createFileRoute } from '@tanstack/react-router'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../supabaseClient'
import { useSession } from '../hooks/useSession'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { session, loading } = useSession()

  if (loading) {
    return <div></div>
  } else if (!session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-xl px-4">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={['google']}
          />
        </div>
      </div>
    )
  } else {
    return <div>Logged in!</div>
  }
}
