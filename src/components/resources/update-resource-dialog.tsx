    import { useState, useEffect } from 'react'
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
    import { TextArea } from '../ui/textArea'
    import ResourceTypeCombobox from './resource-type-combobox'
    import RichTextEditor from '../utils/rich-text-editor'
    import { SingleFileUpload } from '../utils/SingleFileUpload'
    import { toast } from 'sonner'
    import { supabase } from '@/lib/supabaseClient'
    import { Alert, AlertDescription } from '../ui/alert'
    import { createResourceSchema, type CreateResourceForm } from '@/modules/resource/resource.schema'

    interface UpdateResourceDialogProps {
    resource: any 
    onClose: () => void
    }

    export default function UpdateResourceDialog({ resource, onClose }: UpdateResourceDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<CreateResourceForm>({
        resolver: zodResolver(createResourceSchema),
        defaultValues: {
        title: resource.title,
        short_description: resource.short_description,
        description: resource.description,
        file_url: resource.file_url,
        id_category: resource.id_category,
        },
    })

    useEffect(() => {
        if (resource?.description) {
        setValue('description', resource.description)
        }
    }, [resource, setValue])


    const onSubmit = async (data: CreateResourceForm) => {
            try {
        setLoading(true)
        const { error } = await supabase.rpc('update_mst_resource', {
            p_id_resource: resource.id_resource,
            p_id_category: data.id_category,
            p_title: data.title,
            p_short_description: data.short_description,
            p_file_url: data.file_url,
            p_description: data.description,
        })
        if (error) throw error

        toast.success('Recurso actualizado exitosamente')
        setOpen(false)
        onClose()
        } catch (err: any) {
        console.error('Error actualizando recurso:', err)
        toast.error('Error al actualizar recurso: ' + err.message)
        } finally {
        setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant="outline">Modificar</Button>
        </DialogTrigger>

        <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader>
            <DialogTitle>Modificar recurso</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" {...register('title')} />
                {errors.title && (
                <Alert className="bg-red-100" variant="destructive">
                    <AlertDescription>{errors.title.message}</AlertDescription>
                </Alert>
                )}
            </div>

            <div className="grid gap-2">
                <Label htmlFor="short_description">Descripción Corta</Label>
                <TextArea id="short_description" {...register('short_description')} />
                {errors.short_description && (
                <Alert className="bg-red-100" variant="destructive">
                    <AlertDescription>{errors.short_description.message}</AlertDescription>
                </Alert>
                )}
            </div>

            <ResourceTypeCombobox
            defaultValue={String(resource?.id_category)}
            onChange={(value) => setValue('id_category', Number(value), { shouldValidate: true })}
            />
            {errors.id_category && (
                <Alert className="bg-red-100" variant="destructive">
                <AlertDescription>{errors.id_category.message}</AlertDescription>
                </Alert>
            )}

            <RichTextEditor
                value={resource?.description || ''}
                placeholder="Descripción completa del recurso"
                onChange={(value) => setValue('description', value, { shouldValidate: true })}
                />
            {errors.description && (
                <Alert variant="destructive">
                <AlertDescription>{errors.description.message}</AlertDescription>
                </Alert>
            )}

            <SingleFileUpload
                name="file_url"
                onChange={(value) => setValue('file_url', value, { shouldValidate: true })}
            />
            {errors.file_url && (
                <Alert className="bg-red-100" variant="destructive">
                <AlertDescription>{errors.file_url.message}</AlertDescription>
                </Alert>
            )}

            <DialogFooter className="mt-6">
                <Button type="submit" disabled={loading}>Actualizar</Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            </DialogFooter>
            </form>
        </DialogContent>
        </Dialog>
    )
    }
