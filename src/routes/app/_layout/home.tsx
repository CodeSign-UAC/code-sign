import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchUserResources } from '@/modules/resource/resource.service'
import WelcomeSection from '@/components/home/stats-section'
import ResourceSection from '@/components/home/resources-section'
import { useAuth } from '@/modules/auth/auth.provider'
import type { MstResource } from '@/modules/resource/resource.model'

export const Route = createFileRoute('/app/_layout/home')({
  component: DashboardPage,
})

function useUserResources(userId: number) {
  return useQuery({
    queryKey: ['resources', userId],
    queryFn: (): Promise<MstResource[]> => fetchUserResources(userId),
    enabled: !!userId,
  })
}

function DashboardPage(): React.JSX.Element {
  const { user_id } = useAuth()
  const { data, isLoading } = useUserResources(user_id ?? 0)

  // useEffect(() => {
  //   console.log('Is loading:', isLoading);
  //   console.log('Data:', data);
  // }, [isLoading, data])

  return (
    <div className="space-y-4">
      <section>
        <WelcomeSection resources={data} isLoading={isLoading} />
      </section>
      <section>
        <ResourceSection resources={data} isLoading={isLoading} />
      </section>
    </div>
  )
}
