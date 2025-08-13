import CreateResourceDialog from '@/components/resources/create-resource-dialog'
import ListResources from '@/components/resources/list-resources'
import { useUserResourcesQuery } from '@/core/hooks/use-user-resources'
import { useAuth } from '@/modules/auth/auth.provider'
import type { MstResource } from '@/modules/resource/resource.model'
import { fetchAllResources } from '@/modules/resource/resource.service'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/app/_layout/resources/')({
  component: ResourcePage,
})

export default function ResourcePage(): React.JSX.Element {
  const [resources, setResources] = useState<{
    isLoading: boolean
    data: MstResource[]
  }>({
    isLoading: true,
    data: [],
  })

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const resources = await fetchAllResources()
        setResources({
          isLoading: false,
          data: resources,
        })
      } catch (error) {
        console.error('Error fetching resources:', error)
        setResources({
          isLoading: false,
          data: [],
        })
      }
    }

    fetchResources()
  }, [])

  const { user_id } = useAuth()

  const { data: myResourcesData, isLoading } = useUserResourcesQuery(
    user_id ?? 0,
  )

  return (
    <div className="space-y-4">
      <section>
        <ListResources
          title="Mis Recursos"
          description="Accede a una lista de recursos que has guardado."
          resources={myResourcesData}
          isLoading={isLoading}
        />
      </section>
      <section className="mt-8">
        <ListResources
          resources={resources.data}
          isLoading={resources.isLoading}
        >
          <CreateResourceDialog />
        </ListResources>
      </section>
    </div>
  )
}
