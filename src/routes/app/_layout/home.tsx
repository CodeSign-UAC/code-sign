import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchUserResources } from '@/modules/resource/resource.service'
import { useAuth } from '@/modules/auth/auth.provider'
import type { MstResource } from '@/modules/resource/resource.model'
import Stats from '@/components/home/stats'
import HomeResources from '@/components/home/home-resources'

export const Route = createFileRoute('/app/_layout/home')({
  component: DashboardPage,
})

export function getUserResourcesQuery(userId: number) {
  return useQuery({
    queryKey: ['resources', userId],
    queryFn: (): Promise<MstResource[]> => fetchUserResources(userId),
    enabled: !!userId,
  })
}

function DashboardPage(): React.JSX.Element {
  const { user_id } = useAuth()
  const { data, isLoading } = getUserResourcesQuery(user_id ?? 0)

  return (
    <div className="space-y-4">
      <section>
        <Stats
          resources={data}
          isLoading={isLoading}
        />
      </section>
      <section>
        <HomeResources
          resources={data}
          isLoading={isLoading}
        />
      </section>
    </div>
  )
}
