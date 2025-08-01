import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { PlusIcon } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import type { JSX } from 'react/jsx-runtime'
import type { Resource } from '@/core/models'
import { supabase } from '@/lib/supabaseClient'
import ResourceCard from '@/components/card/ResourceCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TextArea } from '@/components/ui/textArea'
import { ResourceCategory, ResourceLabel } from '@/core/models/resource.model'
import { SingleFileUpload } from '@/components/utils/SingleFileUpload'

export const Route = createFileRoute('/app/_layout/resources')({
  component: ResourcePage,
})

function ResourcePage(): JSX.Element {
  const [resources, setResources] = useState<Array<Resource>>([])
  const [open, setOpen] = useState(false)

  async function fetchResources() {
    const { data, error } = await supabase.from('resource').select('*')
    if (error) {
      console.error('Error fetching resources:', error)
      return
    }
    setResources(data as Array<Resource>)
    console.log('Resources fetched:', data)
  }

  useEffect(() => {
    fetchResources()
  }, [])

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as ResourceCategory
    const fileUrl = formData.get('file_url') as string
    const is_accesible = true

    if (!title || !description || !fileUrl) {
      alert('Por favor, complete todos los campos.')
      return
    }

    const { error } = await supabase.from('resource').insert({
      title,
      description,
      category,
      file_url: fileUrl,
      is_accesible,
    })

    if (error) {
      console.error('Error creating resource:', error)
      alert('Error al crear el recurso')
      return
    }

    fetchResources()
    setOpen(false)
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => setOpen(true)} variant="outline">
            <PlusIcon className="mr-2" />
            Nuevo Recurso
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Title>Nuevo Recurso</Dialog.Title>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed inset-0 m-auto max-w-md h-fit max-h-[75vh] bg-white p-4 rounded-2xl shadow">
            <form className="flex flex-col h-full" onSubmit={onSubmit}>
              <div className="flex flex-col gap-6 flex-1 overflow-y-auto">
                <Input
                  name="title"
                  type="text  "
                  placeholder="Titulo del recurso"
                />
                <TextArea
                  name="description"
                  placeholder="Descripción del recurso"
                  className="min-h-24 "
                />
                <select
                  name="category"
                  className="p-2 border rounded"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Seleccione el tipo de recurso
                  </option>
                  {Object.keys(ResourceCategory).map((category) => (
                    <option key={category} value={category}>
                      {ResourceLabel[category as keyof typeof ResourceLabel]}
                    </option>
                  ))}
                </select>
                <SingleFileUpload name="file_url" />
              </div>
              <div className="mt-auto flex justify-end pt-4">
                <Button type="submit" variant="outline">
                  Aceptar
                </Button>
                <Button
                  onClick={() => setOpen(false)}
                  variant="outline"
                  className="ml-2"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
