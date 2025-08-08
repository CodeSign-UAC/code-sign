import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import type { MstResource } from '@/modules/resource/models/resource.model'
import WelcomeSection from '@/modules/home/components/welcome-section'
import { fetchUserResources } from '@/modules/resource/services/resource.service'
import ResourceSection from '@/modules/home/components/resources-section'

export const Route = createFileRoute('/app/_layout/home')({
  component: DashboardPage,
})

export function useUserResources(userId: number) {
  return useQuery({
    queryKey: ['resources', userId],
    queryFn: (): Promise<Array<MstResource>> => fetchUserResources(userId),
    enabled: !!userId,
  })
}

function DashboardPage(): React.JSX.Element {
  const { data, isLoading, isError } = useUserResources(1)

  return (
    <div className="space-y-4">
      <WelcomeSection />
      {/* Ponganle un skeleton tambien de ser posible */}
      {!isLoading ? (<ResourceSection resources={data} />) : <></>}
      {/* Si hay un error ponganle... */}
    </div>
  )
}
