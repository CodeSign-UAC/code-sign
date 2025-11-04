import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { TopicDto } from '@/modules/glossary/glossary.model'
import { fetchTopics } from '@/modules/glossary/glossary.service'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { BookOpen, Search, FileText, TrendingUp, FolderOpen } from 'lucide-react'
import GlossaryTable from '@/components/glossary/glossary-table'
import { Skeleton } from '@/components/ui/skeleton'
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
    queryFn: () => fetchTopics(),
  })

  const totalTerms = data?.reduce((acc, topic) =>
    acc + topic.cat_subtopic.reduce((subAcc, subtopic) =>
      subAcc + (subtopic.mst_glossary?.length || 0), 0
    ), 0
  ) || 0

  const totalTopics = data?.length || 0
  const totalSubtopics = data?.reduce((acc, topic) =>
    acc + (topic.cat_subtopic?.length || 0), 0
  ) || 0

  const averageTerms = totalTopics > 0 ? Math.round(totalTerms / totalTopics) : 0

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-lg">
              <BookOpen size={24} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Glosario Técnico</h1>
              <p className="text-muted-foreground mt-1">
                Diccionario especializado con términos y definiciones relevantes para tu aprendizaje
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          <Card className="border-blue-200 py-4 gap-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Términos</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTerms}</div>
              <p className="text-xs text-muted-foreground">Términos registrados</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 py-4 gap-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temas</CardTitle>
              <BookOpen className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTopics}</div>
              <p className="text-xs text-muted-foreground">Categorías principales</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 py-4 gap-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subtemas</CardTitle>
              <FolderOpen className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSubtopics}</div>
              <p className="text-xs text-muted-foreground">Subcategorías</p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 py-4 gap-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio</CardTitle>
              <TrendingUp className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageTerms}</div>
              <p className="text-xs text-muted-foreground">Términos por tema</p>
            </CardContent>
          </Card>
        </div>

        {/* Por implementar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar términos, temas o subtemas..."
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de temas con subtemas */}
      <Card className='gap-1'>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Temas del Glosario</CardTitle>
              <CardDescription>
                Explora los términos organizados por temas y subtemas
              </CardDescription>
            </div>
            <CreateTopic onCreated={refetch} />
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
              {data?.map((topic: TopicDto): React.JSX.Element => {
                const idTopic: number = topic.id_topic
                const topicTermsCount = topic.cat_subtopic?.reduce((acc, subtopic) =>
                  acc + (subtopic.mst_glossary?.length || 0), 0
                ) || 0

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
                            <div className="flex gap-2">
                              <Badge variant="secondary">
                                {topic.cat_subtopic?.length || 0} subtema(s)
                              </Badge>
                              <Badge variant="outline">
                                {topicTermsCount} término(s)
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                    </div>
                    <AccordionContent className="pb-4 overflow-hidden">
                      <div className="space-y-4">
                        {/* Subtemas dentro del tema */}
                        {topic.cat_subtopic?.map((subtopic) => {
                          const subtopicTerms = subtopic.mst_glossary || []
                          const subtopicTermsCount = subtopicTerms.length

                          return (
                            <div key={subtopic.id_subtopic} className="bg-muted/30 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                                  <h4 className="font-medium text-base">{subtopic.subtopic_name}</h4>
                                  <Badge variant="secondary" className="ml-2">
                                    {subtopicTermsCount} término(s)
                                  </Badge>
                                </div>
                                {/* <GlossaryActions
                                  subtopic={subtopic}
                                  topicId={topic.id_topic}
                                  onChanged={refetch}
                                /> */}
                              </div>

                              {subtopicTermsCount > 0 ? (
                                <GlossaryTable
                                  glossaries={subtopicTerms}
                                  onChanged={refetch}
                                />
                              ) : (
                                <div className="text-center py-6 bg-background/50 rounded border">
                                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                                  <p className="text-muted-foreground font-medium">
                                    No hay términos en este subtema
                                  </p>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Comienza agregando el primer término a este subtema
                                  </p>
                                </div>
                              )}
                            </div>
                          )
                        })}

                        {/* Estado vacío para tema sin subtemas */}
                        {(!topic.cat_subtopic || topic.cat_subtopic.length === 0) && (
                          <div className="text-center py-8 bg-muted/20 rounded-lg">
                            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground font-medium">
                              No hay subtemas en este tema
                            </p>
                            <p className="text-sm text-muted-foreground mt-1 mb-4">
                              Comienza creando el primer subtema para organizar los términos
                            </p>
                            <Button variant="outline">
                              <FolderOpen className="h-4 w-4 mr-2" />
                              Agregar Subtema
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

      {/* Estado vacío global */}
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