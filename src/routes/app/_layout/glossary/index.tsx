import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
import type { TopicGlossariesDto } from '@/modules/glossary/glossary.model'
import { fetchTopicGlossaries } from '@/modules/glossary/glossary.service'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Gavel } from 'lucide-react'
import GlossaryTable from '@/components/glossary/glossary-table'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import GlossaryActions from '@/components/glossary/glossary-actions'
import CreateTopic from '@/components/glossary/create-topic'

export const Route = createFileRoute('/app/_layout/glossary/')({
  component: RouteComponent,
})

function RouteComponent(): React.JSX.Element {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["topicGlossaries"],
    queryFn: (): Promise<TopicGlossariesDto[]> => fetchTopicGlossaries(),
  })

  return (
    <div className="space-y-8 overflow-hidden">
      <div className='flex flex-col space-y-4'>
        <div>
          <div className='flex items-center gap-2'>
            <Gavel size={32} />
            <h1 className="text-xl font-semibold">Glosario técnico</h1>
          </div>
          <p className="text-base font-normal">Aquí encontrarás términos y definiciones relevantes para tu aprendizaje.</p>
        </div>

        <div className='flex justify-between items-center'>
          <span className='text-muted-foreground'>{data?.length} tema(s)</span>
          <CreateTopic onCreated={refetch} />
        </div>
      </div>

      {/* Contenedor de acordeones */}
      <Card>
        <CardContent>
          {isLoading &&
            Array.from({ length: 7 }).map((_, index: number): React.JSX.Element => (
              <LoadingSkeleton key={index} />
            ))
          }

          <Accordion type='multiple' className='w-full'>
            {data?.map((topic: TopicGlossariesDto): React.JSX.Element => {
              const idTopic: number = topic.id_topic
              return (
                <AccordionItem key={idTopic} value={`topic-${idTopic}`}>
                  <div className="flex items-center justify-between pr-3">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:cursor-pointer">
                      <div className="flex flex-col text-left">
                        <span className="font-medium">{topic.topic}</span>
                        <span className="text-sm text-muted-foreground">{topic.glossaries.length} término(s)</span>
                      </div>
                    </AccordionTrigger>
                    <GlossaryActions glossary={topic} />
                  </div>
                  <AccordionContent className="px-4 pb-4 overflow-hidden">
                    <div className="overflow-x-auto rounded-md border">
                      {topic.glossaries.length > 0 ? (
                        <GlossaryTable glossaries={topic.glossaries} onChanged={refetch} />
                      ) : (
                        <p className="p-4 text-center text-muted-foreground">No hay ningún término para este tema.</p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div >
  )
}

const LoadingSkeleton = (): React.JSX.Element => (
  <div className="flex items-center space-x-4 p-4">
    <div className="space-y-2 w-full">
      <Skeleton className="h-3 w-[30%]" />
      <Skeleton className="h-3 w-[15%]" />
      <Separator />
    </div>
  </div>
)
