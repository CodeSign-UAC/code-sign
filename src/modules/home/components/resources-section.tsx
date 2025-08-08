import { BookOpen, DoorOpen, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { JSX } from 'react/jsx-runtime'
import type { MstResource } from '@/modules/resource/models/resource.model'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { categoryIcon, categoryValue } from '@/modules/resource/utils/resource.util'

interface Props { resources: Array<MstResource> | undefined }

export default function ResourceSection({ resources }: Props): JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('')

  const filteredResources: Array<MstResource> | undefined = useMemo(() => {
    const lowerCaseSearchTerm: string = searchTerm.toLowerCase()
    return resources?.filter(
      ({ title, description }) =>
        title.toLowerCase().includes(lowerCaseSearchTerm) ||
        description.toLowerCase().includes(lowerCaseSearchTerm)
    )
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
          {filteredResources.map((resource: MstResource): JSX.Element => (
            <Card key={resource.id_resource}>
              <CardHeader>
                <CardTitle className="flex max-md:flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {categoryIcon[resource.id_category]}
                    {resource.title}
                  </div>
                  <div className="flex gap-1">
                    <span className="flex items-center justify-center px-2 rounded-lg font-semibold text-xs border">{categoryValue[resource.id_category]}</span>
                  </div>
                </CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-center">
                  <Button variant={"outline"} className="cursor-pointer">
                    <DoorOpen />
                    Acceder
                  </Button>
                  {/* {resource.duration && (
                    <p className="text-sm text-muted-foreground">Duración: {resource.duration}</p>
                  )} */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
