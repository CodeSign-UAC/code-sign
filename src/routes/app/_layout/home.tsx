import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/modules/auth/auth.provider'
import Stats from '@/components/home/stats'
import HomeResources from '@/components/home/home-resources'
import { useUserResourcesQuery } from '@/core/hooks/use-user-resources'

export const Route = createFileRoute('/app/_layout/home')({
  component: DashboardPage,
})

function DashboardPage(): React.JSX.Element {
  const { user_id } = useAuth()
  const { data, isLoading } = useUserResourcesQuery(user_id ?? 0)

  return (
    <div className="space-y-4">
      <section>
        <Stats resources={data} isLoading={isLoading} />
      </section>
      <section>
        <HomeResources resources={data} isLoading={isLoading} />
      </section>
    </div>
  )
}
