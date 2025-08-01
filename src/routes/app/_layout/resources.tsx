import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import type { JSX } from 'react/jsx-runtime'
import type { Resource } from '@/core/models'
import { supabase } from '@/lib/supabaseClient'
import ResourceCard from '@/components/card/ResourceCard'

export const Route = createFileRoute('/app/_layout/resources')({
  component: ResourcePage,
})

function ResourcePage(): JSX.Element {
  const [resources, setResources] = useState<Array<Resource>>([])

  useEffect(() => {
    async function fetchResources() {
      const { data, error } = await supabase.from('resource').select('*')
      if (error) {
        console.error('Error fetching resources:', error)
        return
      }
      console.log(data)
      setResources(data as Array<Resource>)
      console.log('Resources fetched:', data)
    }

    fetchResources()
  }, [])

  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <ResourceCard resource={resource} />
      ))}
    </div>
  )
}
