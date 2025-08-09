import { BookOpen, DoorOpen, Search, SearchX } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { categoryIcon, categoryValue } from '@/modules/resource/resource.util'
import { Skeleton } from '@/components/ui/skeleton'
import type { MstResource } from '@/modules/resource/resource.model'
import { Badge } from '../ui/badge'

interface Props {
  resources: MstResource[] | undefined
  isLoading: boolean
}

export default function ResourceSection({ resources = [], isLoading }: Props): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('')

  const filteredResources: MstResource[] = useMemo(() => {
    const lowerCaseSearchTerm: string = searchTerm.toLowerCase()

    return resources.length ? resources.filter(
      ({ title, description }) =>
        title.toLowerCase().includes(lowerCaseSearchTerm) ||
        description.toLowerCase().includes(lowerCaseSearchTerm)
    ) : []

  }, [searchTerm, isLoading])

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
          <Input placeholder="Buscar recursos..." className="pl-10"
            onChange={(e): void => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={`space-y-4 ${isLoading && 'space-y-8'}`}>
          {isLoading ? (
            Array.from(({ length: 2 })).map((_, index: number): React.JSX.Element => (
              <div key={index} className="flex flex-col space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div>
                  <Skeleton className="h-8 w-[100px]" />
                </div>
              </div>
            ))
          ) : renderResources(filteredResources)}
        </div>
      </CardContent>
    </Card>
  )
}

const renderResources = (resources: Array<MstResource>) => {
  if (!resources?.length) return (
    <div className='flex justify-center items-center mt-8 gap-2'>
      <SearchX />
      <p className='font-medium text-xl'>No se encontraron recursos.</p>
    </div>
  )

  return resources.map((resource: MstResource): React.JSX.Element => (
    <Card key={resource.id_resource}>
      <CardHeader>
        <CardTitle className="flex max-md:flex-col gap-2">
          <div className="flex items-center gap-2">
            {categoryIcon[resource.id_category]}
            <h3 className='line-clamp-1'>{resource.title}</h3>
          </div>
        </CardTitle>
        <Badge className='mt-1' variant='outline'>
          <span className='font-medium text-xs'>{categoryValue[resource.id_category]}</span>
        </Badge>
        <div className='flex max-lg:flex-col gap-2 lg:items-center lg:justify-between '>
          <CardDescription className='text-start'>{resource.description}</CardDescription>
          <div className="flex justify-end gap-4 items-center">
            <Button variant={"outline"} className="cursor-pointer max-lg:w-full max-lg:mt-2"
              onClick={(): void => { console.log(resource.file_url) }}
            >
              <DoorOpen />
              Acceder
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  ))
}