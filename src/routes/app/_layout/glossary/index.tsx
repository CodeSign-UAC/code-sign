import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { TopicDto } from '@/modules/glossary/glossary.model'
import { fetchTopics } from '@/modules/glossary/glossary.service'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { BookOpen, FileText, FolderOpen } from 'lucide-react'
import GlossaryTable from '@/components/glossary/glossary-table'
import { Skeleton } from '@/components/ui/skeleton'
import CreateTopicDialog from '@/components/glossary/create-topic-dialog'
import { Badge } from '@/components/ui/badge'
import { SubtopicActions } from '@/components/glossary/subtopic-actions'
import { TopicActions } from '@/components/glossary/topic-actions'
import GlossaryStats from '@/components/glossary/glossary-stats'
import { useSession } from '@/core/hooks/useSession'

export const Route = createFileRoute('/app/_layout/glossary/')({
  component: RouteComponent
})

function RouteComponent(): React.JSX.Element {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["topicGlossaries"],
    queryFn: () => fetchTopics(),
  })

  const { role } = useSession()
  const hasAdminPermission = role === 'Administrador' || role === 'Profesor'

  const totalTerms: number = data?.reduce((acc, topic) =>
    acc + topic.cat_subtopic.reduce((subAcc, subtopic) =>
      subAcc + (subtopic.mst_glossary?.length || 0), 0
    ), 0
  ) || 0
  const totalTopics: number = data?.length || 0
  const totalSubtopics: number = data?.reduce((acc, topic) =>
    acc + (topic.cat_subtopic?.length || 0), 0
  ) || 0
  const averageTerms: number = totalTopics > 0 ? Math.round(totalTerms / totalTopics) : 0

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-lg hidden sm:block">
              <BookOpen size={24} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Glosario técnico</h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Diccionario especializado con términos y definiciones relevantes
              </p>
            </div>
          </div>
        </div>

        <GlossaryStats
          totalTerms={totalTerms}
          totalTopics={totalTopics}
          totalSubtopics={totalSubtopics}
          averageTerms={averageTerms}
        />
      </div>

      {/* Lista de temas con subtemas */}
      <Card className='gap-1'>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <CardTitle className="text-xl">Temas del glosario</CardTitle>
              <CardDescription>
                Explora los términos organizados por temas y subtemas
              </CardDescription>
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto">
              {hasAdminPermission && <CreateTopicDialog onCreated={refetch} />}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2">
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
                    className="border-b last:border-b-0 px-4 md:px-6"
                  >
                    <div className="flex items-center justify-between py-4 gap-2">
                      <AccordionTrigger className="flex-1 hover:no-underline hover:cursor-pointer p-0">
                        <div className="flex flex-col text-left items-start gap-1 sm:flex-row sm:items-center sm:gap-3">
                          <span className="font-semibold text-lg text-left">{topic.topic}</span>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="secondary">
                              {topic.cat_subtopic?.length || 0} subtema(s)
                            </Badge>
                            <Badge variant="outline">
                              {topicTermsCount} término(s)
                            </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <div className="flex-shrink-0">
                        {hasAdminPermission && (
                          <TopicActions
                            topicId={topic.id_topic}
                            topicName={topic.topic}
                            onChanged={refetch}
                          />
                        )}
                      </div>
                    </div>
                    <AccordionContent className="pb-4 overflow-x-auto">
                      <div className="space-y-4">
                        {/* Subtemas dentro del tema */}
                        {topic.cat_subtopic?.map((subtopic) => {
                          const subtopicTerms = subtopic.mst_glossary || []
                          const subtopicTermsCount = subtopicTerms.length

                          return (
                            <div key={subtopic.id_subtopic} className="bg-muted/30 rounded-lg p-4">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <FolderOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                  <h4 className="font-medium text-base">{subtopic.subtopic_name}</h4>
                                  <Badge variant="secondary" className="ml-0 sm:ml-2">
                                    {subtopicTermsCount} término(s)
                                  </Badge>
                                </div>
                                <div className="flex-shrink-0 self-start sm:self-center">
                                  {hasAdminPermission && (
                                    <SubtopicActions
                                      subtopicId={subtopic.id_subtopic}
                                      subtopicName={subtopic.subtopic_name}
                                      onChanged={refetch}
                                    />
                                  )}
                                </div>
                              </div>

                              {subtopicTermsCount > 0 ? (
                                <GlossaryTable
                                  glossaries={subtopicTerms}
                                  onChanged={refetch}
                                  hasAdminPermission={hasAdminPermission}
                                />
                              ) : (
                                <div className="text-center py-6 bg-background/50 rounded border">
                                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                                  <p className="text-muted-foreground font-medium">
                                    No hay términos en este subtema
                                  </p>
                                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                                    Comience por agregar el primer término a este subtema
                                  </p>
                                </div>
                              )}
                            </div>
                          )
                        })}

                        {(!topic.cat_subtopic || topic.cat_subtopic.length === 0) && (
                          <div className="text-center py-8 bg-muted/20 rounded-lg">
                            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground font-medium">
                              No hay subtemas en este tema
                            </p>
                            <p className="text-sm text-muted-foreground mt-1 mb-4">
                              Comience por crear el primer subtema para organizar los términos
                            </p>
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

      {!isLoading && (!data || data.length === 0) && (
        <Card className="text-center py-12 border-dashed">
          <CardContent>
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay temas creados</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Comience por crear el primer tema para organizar los términos técnicos del glosario.
            </p>
            {hasAdminPermission && <CreateTopicDialog onCreated={refetch} />}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

const LoadingSkeleton = (): React.JSX.Element => (
  <div className="flex items-center justify-between space-x-4 p-4 md:p-6">
    <div className="space-y-2">
      <Skeleton className="h-5 w-[200px]" /> {/* Skeleton del título */}
      <div className="flex gap-2">
        <Skeleton className="h-4 w-[80px]" /> {/* Skeleton de badge 1 */}
        <Skeleton className="h-4 w-[80px]" /> {/* Skeleton de badge 2 */}
      </div>
    </div>
    <Skeleton className="h-8 w-8" /> {/* Skeleton de botón de acciones */}
  </div>
)