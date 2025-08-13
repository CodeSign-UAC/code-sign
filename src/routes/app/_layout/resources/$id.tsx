import { useAuth } from '@/modules/auth/auth.provider'
import type { MstResource } from '@/modules/resource/resource.model'
import { fetchResourceByIdWithUserStatus } from '@/modules/resource/resource.service'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { categoryIcon, categoryValue } from '@/modules/resource/resource.util'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { InfoIcon, LucideDownload, LucideFile } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/app/_layout/resources/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const [resource, setResources] = useState<MstResource | null>()
  const [isLoading, setIsLoading] = useState(true)
  const [fileData, setFileData] = useState<{
    type: 'image' | 'video' | 'pdf' | 'other'
    contentType: string | null
    contentLength: string | null
  }>()
  const { user_id } = useAuth()
  const { id } = useParams({ from: '/app/_layout/resources/$id' })

  useEffect(() => {
    const fetchResource = async () => {
      if (user_id === undefined || id === undefined) {
        notFound()
        return
      }

      if (isNaN(Number(id))) {
        console.error('Invalid resource id:', id)
        notFound()
        return
      }

      const data = await fetchResourceByIdWithUserStatus(Number(id), user_id)
      console.log(data)
      if (!data) {
        console.error('Resource not found or inaccessible:', id)
        notFound()
      }

      setResources(data)
    }
    fetchResource()
  }, [id, user_id])

  useEffect(() => {
    if (!resource?.file_url) {
      return
    }

    const fetchFileData = async () => {
      if (!resource?.file_url) {
        return
      }

      try {
        const response = await fetch(resource.file_url, { method: 'HEAD' })

        if (!response.ok) {
          console.error('Failed to fetch file data:', resource.file_url)
          return
        }
        const typeMap: Record<string, 'image' | 'video' | 'pdf'> = {
          'application/pdf': 'pdf',
        }

        const contentType = response.headers.get('content-type')
        const contentLength = response.headers.get('content-length')

        const type = contentType?.startsWith('image/')
          ? 'image'
          : contentType?.startsWith('video/')
            ? 'video'
            : typeMap[contentType || ''] || 'other'

        setFileData({
          type,
          contentType,
          contentLength,
        })
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching file info:', error)
      }
    }

    fetchFileData()
  }, [resource])

  return (
    <div className="space-y-4">
      {isLoading ? (
        <Skeleton className="w-3xs h-8"></Skeleton>
      ) : (
        <h1 className="text-3xl font-medium text-gray-600">
          {resource?.title || 'Recurso'}
        </h1>
      )}
      {resource && resource?.has_completed == null && (
        <Alert className="bg-red-100" variant="destructive">
          <InfoIcon />
          <AlertDescription>
            Aún no eres parte del seguimiento de este recurso. Puedes unirte al
            seguimiento haciendo clic en el botón de abajo.
          </AlertDescription>
        </Alert>
      )}
      <section className="grid lg:grid-cols-3 gap-4">
        {isLoading ? (
          <Skeleton className="lg:col-span-2 aspect-video"></Skeleton>
        ) : (
          <div className="bg-gray-100 w-full h-auto rounded-xl lg:col-span-2 flex items-center justify-center overflow-hidden">
            {fileData &&
              {
                image: (
                  <img
                    src={resource?.file_url}
                    alt={resource?.title || 'Recurso'}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ),
                video: (
                  <video
                    src={resource?.file_url}
                    controls
                    className="w-full h-full rounded-xl aspect-video"
                  />
                ),
                pdf: (
                  <iframe
                    src={resource?.file_url}
                    className="w-full h-full rounded-xl aspect-square"
                    title="PDF Preview"
                  />
                ),
                other: (
                  <div className="flex flex-col gap-2 justify-center items-center my-16 text-center">
                    <LucideFile className="size-12" />
                    <span>{resource?.title || 'Recurso'}</span>
                    <Button variant="outline" asChild>
                      <Link to={resource?.file_url}>
                        <LucideDownload />
                        Descargar Recurso
                      </Link>
                    </Button>
                  </div>
                ),
              }[fileData.type]}
          </div>
        )}

        <Card className="h-fit w-full lg:w-auto p-4">
          <CardHeader className="p-0">
            {isLoading ? (
              <>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold leading-none">
                  Detalles del Recurso
                </h2>
                <p className="text-sm">{resource?.short_description}</p>
              </>
            )}
          </CardHeader>
          {!isLoading && (
            <>
              <CardContent className="p-0">
                <ul className="flex flex-col gap-4 mt-2">
                  {resource?.id_category && (
                    <li className="flex gap-2">
                      {categoryIcon[resource?.id_category]}
                      <span>{categoryValue[resource?.id_category]}</span>
                    </li>
                  )}
                  {resource?.has_completed != null && (
                    <li>
                      <Badge
                        variant={
                          resource.has_completed ? 'default' : 'destructive'
                        }
                      >
                        {resource.has_completed
                          ? 'Completado'
                          : 'No completado'}
                      </Badge>
                    </li>
                  )}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 p-0 flex-wrap">
                {resource && resource?.has_completed == null && (
                  <Button variant="secondary">Unirme al seguimiento</Button>
                )}
                <Button variant="secondary">Eliminar</Button>
                <Button variant="outline">Modificar</Button>
              </CardFooter>
            </>
          )}
        </Card>
      </section>
      <section className="space-y-8">
        {isLoading ? (
          <>
            <Skeleton className="w-full h-8 mb-2"></Skeleton>
            <Skeleton className="w-full h-4 mb-2"></Skeleton>
            <Skeleton className="w-1/2 h-4 mb-2"></Skeleton>
          </>
        ) : (
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: resource?.description || '' }}
          ></div>
        )}
      </section>
    </div>
  )
}
