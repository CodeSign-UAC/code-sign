import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { TopicGlossariesDto } from '@/modules/glossary/glossary.model'
import { fetchTopicGlossaries } from '@/modules/glossary/glossary.service'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Gavel } from 'lucide-react'
import React, { useEffect } from 'react'
import GlossaryTable from '@/components/glossary/glossary-table'

export const Route = createFileRoute('/app/_layout/glossary')({
  component: RouteComponent,
})

export const getTopicGlossariesQuery = () => {
  return useQuery({
    queryKey: ["topicGlossaries"],
    queryFn: (): Promise<TopicGlossariesDto[]> => fetchTopicGlossaries(),
  })
}

function RouteComponent(): React.JSX.Element {
  const { data, isLoading } = getTopicGlossariesQuery()


  useEffect(() => {
    if (data) {
      console.log("Fetched topic glossaries:", data)
    }
  }, [data])

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
          <Button>Agregar término</Button>
        </div>
      </div>

      <Card>
        <CardContent>
          <Accordion type='multiple' className='w-full'>
            {data?.map((topic: TopicGlossariesDto): React.JSX.Element => {
              const idTopic: number = topic.id_topic
              return (
                <AccordionItem key={idTopic} value={`topic-${idTopic}`}>
                  <div className="flex items-center justify-between pr-3">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:cursor-pointer">
                      <div className="flex flex-col text-left">
                        <span className="font-medium">{topic.topic}</span>
                      </div>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent className="px-4 pb-4 overflow-hidden">
                    <div className="overflow-x-auto rounded-md border">
                      {topic.glossaries.length > 0 ? (
                        <GlossaryTable glossaries={topic.glossaries} />
                      ) : (
                        <p className="p-4 text-center text-muted-foreground">No hay términos para este tema.</p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}