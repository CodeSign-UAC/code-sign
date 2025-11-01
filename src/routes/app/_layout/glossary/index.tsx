import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { TopicGlossariesDto } from '@/modules/glossary/glossary.model'
import { fetchTopicGlossaries } from '@/modules/glossary/glossary.service'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { BookOpen, Search, Plus, FileText, TrendingUp } from 'lucide-react'
import GlossaryTable from '@/components/glossary/glossary-table'
import { Skeleton } from '@/components/ui/skeleton'
import GlossaryActions from '@/components/glossary/glossary-actions'
import CreateTopic from '@/components/glossary/create-topic'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/app/_layout/glossary/')({
  component: RouteComponent,
})

function RouteComponent(): React.JSX.Element {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["topicGlossaries"],
    queryFn: (): Promise<TopicGlossariesDto[]> => fetchTopicGlossaries(),
  })

  // Calcular estadísticas
  const totalTerms = data?.reduce((acc, topic) => acc + topic.glossaries.length, 0) || 0
  const totalTopics = data?.length || 0
  const averageTerms = totalTopics > 0 ? Math.round(totalTerms / totalTopics) : 0

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-lg">
              <BookOpen size={28} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Glosario Técnico</h1>
              <p className="text-muted-foreground mt-1">
                Diccionario especializado con términos y definiciones relevantes para tu aprendizaje
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 py-4 gap-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Términos</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTerms}</div>
              <p className="text-xs text-blue-600">Términos registrados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 py-4 gap-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temas</CardTitle>
              <BookOpen className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTopics}</div>
              <p className="text-xs text-green-600">Categorías activas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200 py-4 gap-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio</CardTitle>
              <TrendingUp className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageTerms}</div>
              <p className="text-xs text-amber-600">Términos por tema</p>
            </CardContent>
          </Card>
        </div>

        {/* Barra de búsqueda y botón agregar tema */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar términos o temas..."
                className="pl-10"
              />
            </div>
          </div>
          <CreateTopic onCreated={refetch} />
        </div>
      </div>

      <Card className='gap-1'>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Temas del Glosario</CardTitle>
              <CardDescription>
                Explora los términos organizados por categorías temáticas
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2 p-6">
              {Array.from({ length: 5 }).map((_, index: number) => (
                <LoadingSkeleton key={index} />
              ))}
            </div>
          ) : (
            <Accordion type="multiple" className="w-full">
              {data?.map((topic: TopicGlossariesDto): React.JSX.Element => {
                const idTopic: number = topic.id_topic
                return (
                  <AccordionItem
                    key={idTopic}
                    value={`topic-${idTopic}`}
                    className="border-b last:border-b-0 px-6"
                  >
                    <div className="flex items-center justify-between py-4">
                      <AccordionTrigger className="flex-1 hover:no-underline hover:cursor-pointer p-0">
                        <div className="flex flex-col text-left items-start">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-lg">{topic.topic}</span>
                            <Badge variant="secondary" className="ml-2">
                              {topic.glossaries.length} términos
                            </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <GlossaryActions glossary={topic} />
                    </div>
                    <AccordionContent className="pb-4 overflow-hidden">
                      <div className="bg-muted/30 rounded-lg p-1">
                        {topic.glossaries.length > 0 ? (
                          <GlossaryTable glossaries={topic.glossaries} onChanged={refetch} />
                        ) : (
                          <div className="text-center py-8">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground font-medium">No hay términos en este tema</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Comienza agregando el primer término a este tema
                            </p>
                            <Button variant="outline" className="mt-4">
                              <Plus className="h-4 w-4 mr-2" />
                              Agregar Término
                            </Button>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Estado vacío */}
      {!isLoading && (!data || data.length === 0) && (
        <Card className="text-center py-12 border-dashed">
          <CardContent>
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay temas creados</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Comienza creando tu primer tema para organizar los términos técnicos de tu glosario.
            </p>
            <CreateTopic onCreated={refetch} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

const LoadingSkeleton = (): React.JSX.Element => (
  <div className="flex items-center space-x-4 p-4">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="space-y-2 flex-1">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-3 w-[200px]" />
    </div>
    <Skeleton className="h-8 w-8 rounded-full" />
  </div>
)