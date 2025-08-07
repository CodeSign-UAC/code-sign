import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ResourceStatus, type Resource } from "@/core/models";
import { Binoculars, BookOpen, ClipboardList, DoorOpen, FileTextIcon, Search, VideoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { JSX } from "react/jsx-runtime";

interface Props {
  resources: Array<Resource>
}

const resourceIcon: Record<string, JSX.Element> = {
  ['video']: <VideoIcon />,
  ['document']: <FileTextIcon />,
  ['assignment']: <ClipboardList />,
  ['tutorial']: <Binoculars />
}

const StatusTag: Record<ResourceStatus, JSX.Element> = {
  [ResourceStatus.Available]: (
    <span className="flex items-center justify-center text-green-600 text-xs bg-green-50 px-2 rounded-lg">
      Disponible
    </span>
  ),
  [ResourceStatus.DueSoon]: (
    <span className="flex items-center justify-center text-yellow-600 text-xs bg-yellow-50 px-2 rounded-lg">
      Próximo a vencer
    </span>
  ),
  [ResourceStatus.Completed]: (
    <span className="flex items-center justify-center text-blue-600 text-xs bg-blue-50 px-2 rounded-lg">
      Completado
    </span>
  )
}

export default function ResourceSection({ resources }: Props): JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filteredResources, setFilteredResources] = useState<Array<Resource>>(resources)

  useEffect((): void => {
    if (searchTerm.trim() === "")
      setFilteredResources(resources)
    else {
      const lowerCaseSearchTerm: string = searchTerm.toLowerCase()
      const filtered: Array<Resource> = resources.filter(({ title, description }) =>
        title.toLowerCase().includes(lowerCaseSearchTerm) ||
        description.toLowerCase().includes(lowerCaseSearchTerm)
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
        <CardDescription>Accede a una lista de recursos útiles para tu aprendizaje.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
          <Input placeholder="Buscar recursos..." onChange={(e): void => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <div className="space-y-4">
          {filteredResources.map((resource: Resource): JSX.Element => (
            <Card key={resource.id}>
              <CardHeader>
                <CardTitle className="flex max-md:flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {resourceIcon[resource.type]}
                    {resource.title}
                  </div>
                  <div className="flex gap-1">
                    <span className="flex items-center justify-center px-2 rounded-lg font-semibold text-xs border">{resource.category}</span>
                    {StatusTag[resource.status]}
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
                  {resource.duration && (
                    <p className="text-sm text-muted-foreground">
                      Duración: {resource.duration}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}