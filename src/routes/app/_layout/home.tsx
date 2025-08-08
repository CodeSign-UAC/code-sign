import { createFileRoute } from '@tanstack/react-router'
import type { JSX } from 'react/jsx-runtime'
import ResourceSection from '@/modules/home/components/resources-section'
import WelcomeSection from '@/modules/home/components/welcome-section'
import type { Resource } from '@/modules/models/resource.model'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/app/_layout/home')({
  component: DashboardPage,
})

function DashboardPage(): JSX.Element {

  const query = useQuery({
    queryKey: ['resourceData'],
    queryFn: () => {
    }
  })

  return (
    <div className="space-y-4">
      <WelcomeSection />
      <ResourceSection resources={resources} />
    </div>
  )
}
