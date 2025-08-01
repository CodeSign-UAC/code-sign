import { BookOpen, DoorOpen, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { JSX } from 'react/jsx-runtime'
import type { Resource } from '@/core/models'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ResourceStatus } from '@/core/models'
import ResourceCard from '@/components/card/ResourceCard'

interface Props {
  resources: Array<Resource>
}

const StatusTag: Record<ResourceStatus, JSX.Element> = {
  [ResourceStatus.Available]: (
    <span className="text-green-600 text-sm font-medium bg-green-50 px-2 rounded-lg">
      Disponible
    </span>
  ),
  [ResourceStatus.DueSoon]: (
    <span className="text-yellow-600 text-sm font-medium bg-yellow-50 px-2 rounded-lg">
      Próximo a vencer
    </span>
  ),
  [ResourceStatus.Completed]: (
    <span className="text-blue-600 text-sm font-medium bg-blue-50 px-2 rounded-lg">
      Completado
    </span>
  ),
}

export default function ResourceSection({ resources }: Props): JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filteredResources, setFilteredResources] =
    useState<Array<Resource>>(resources)

  useEffect((): void => {
    if (searchTerm.trim() === '') setFilteredResources(resources)
    else {
      const lowerCaseSearchTerm: string = searchTerm.toLowerCase()
      const filtered: Array<Resource> = resources.filter(
        ({ title, description }) =>
          title.toLowerCase().includes(lowerCaseSearchTerm) ||
          description.toLowerCase().includes(lowerCaseSearchTerm),
      )
      setFilteredResources(filtered)
    }
  }, [searchTerm])
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen size={32} />
          <h2 className="text-xl font-semibold">Recursos</h2>
        </CardTitle>
        <CardDescription>
          Accede a una lista de recursos útiles para tu aprendizaje.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar recursos..."
            onChange={(e): void => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="space-y-4">
          {filteredResources.map(
            (resource: Resource): JSX.Element => (
              <ResourceCard key={resource.id} resource={resource} />
            ),
          )}
        </div>
      </CardContent>
    </Card>
  )
}
