import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import { TextArea } from '../ui/textArea'
import ResourceTypeCombobox from './resource-type-combobox'
import RichTextEditor from '../utils/rich-text-editor'
import { SingleFileUpload } from '../utils/SingleFileUpload'
import { createResource } from '@/modules/resource/resource.service'
import type { MstResource } from '@/modules/resource/resource.model'
import { toast } from 'sonner'

export default function CreateResourceDialog() {
  interface dataModel {
    id_category: number
    title: string
    file_url: string
    short_description: string
    description: string
  }

  const [open, setOpen] = useState(false)
  const [data, setData] = useState<dataModel>({
    id_category: 0,
    title: '',
    file_url: '',
    short_description: '',
    description: '',
  })

  const setDynamicData = (field: keyof dataModel, value: string | number) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!data) return
      const resource = await createResource(data as unknown as MstResource)

      if (resource) {
        toast.success('Recurso creado exitosamente')
        setOpen(false)
      }
    } catch (error) {
      toast.error('Error al crear recurso')
      console.error('Error al crear recurso:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus />
          Nuevo Recurso
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear nuevo recurso</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Título del recurso"
              value={data?.title}
              onChange={(e) => setDynamicData('title', e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="short_description">Descripción Corta</Label>
            <TextArea
              id="short_description"
              placeholder="Descripción corta del recurso"
              className="min-h-14"
              value={data?.short_description}
              onChange={(e) =>
                setDynamicData('short_description', e.target.value)
              }
              maxLength={120}
              required
            />
          </div>
          <ResourceTypeCombobox
            onChange={(value) => setDynamicData('id_category', Number(value))}
          />
          <RichTextEditor
            placeholder="Descripción completa del recurso"
            onChange={(value) => setDynamicData('description', value)}
          />
          <SingleFileUpload
            name="file_url"
            onChange={(value) => setDynamicData('file_url', value)}
          />
          <DialogFooter className="mt-6">
            <Button type="submit">Aceptar</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
