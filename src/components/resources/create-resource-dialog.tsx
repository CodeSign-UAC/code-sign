import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import {
  createResourceSchema,
  type CreateResourceForm,
} from '@/modules/resource/resource.schema'
import { Alert, AlertDescription } from '../ui/alert'

export default function CreateResourceDialog() {
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateResourceForm>({
    resolver: zodResolver(createResourceSchema),
    defaultValues: {
      id_category: 0,
      title: '',
      file_url: '',
      short_description: '',
      description: '',
    },
  })

  const onSubmit = async (data: CreateResourceForm) => {
    try {
      const resource = await createResource(data as unknown as MstResource)
      if (resource) {
        toast.success('Recurso creado exitosamente')
        setOpen(false)
        reset()
      }
    } catch (err) {
      toast.error('Error al crear recurso')
      console.error(err)
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

      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear nuevo recurso</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" {...register('title')} />
          </div>
          {errors.title && (
            <Alert className="bg-red-100" variant="destructive">
              <AlertDescription>{errors.title.message}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="short_description">Descripción Corta</Label>
            <TextArea
              id="short_description"
              {...register('short_description')}
            />
            {errors.short_description && (
              <Alert className="bg-red-100" variant="destructive">
                <AlertDescription>
                  {errors.short_description.message}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <ResourceTypeCombobox
            onChange={(value) =>
              setValue('id_category', Number(value), { shouldValidate: true })
            }
          />
          {errors.id_category && (
            <Alert className="bg-red-100" variant="destructive">
              <AlertDescription>{errors.id_category.message}</AlertDescription>
            </Alert>
          )}

          <RichTextEditor
            placeholder="Descripción completa del recurso"
            onChange={(value) =>
              setValue('description', value, { shouldValidate: true })
            }
          />
          {errors.description && (
            <Alert className="bg-red-100" variant="destructive">
              <AlertDescription>{errors.description.message}</AlertDescription>
            </Alert>
          )}

          <SingleFileUpload
            name="file_url"
            onChange={(value) =>
              setValue('file_url', value, { shouldValidate: true })
            }
          />
          {errors.file_url && (
            <Alert className="bg-red-100" variant="destructive">
              <AlertDescription>{errors.file_url.message}</AlertDescription>
            </Alert>
          )}
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
