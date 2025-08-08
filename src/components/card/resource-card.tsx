import { DoorOpen, Pencil, Trash2 } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Button } from '../ui/button'
import type { Resource } from '@/core/models'
import { resourceCategoryIcon, resourceLabel } from '@/modules/resource/models/resource.model'

interface Props {
  resource: Resource
  onEdit?: () => void
  onDelete?: () => void
}

export default function ResourceCard({ resource, onEdit, onDelete }: Props) {
  return (
    <Card key={resource.id}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {resourceCategoryIcon[resource.category]}
          {resource.title}
          <span className="px-2 rounded-lg font-semibold text-sm border">
            {resource.category}
          </span>
        </CardTitle>
        <CardDescription>{resource.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-center">
          <Button variant={'outline'} className="cursor-pointer">
            <DoorOpen />
            Acceder
          </Button>
          {resource.duration && (
            <p className="text-sm text-muted-foreground">
              Duración: {resource.duration}
            </p>
          )}

          {/* Botón Modificar */}
          {onEdit && (
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={onEdit}
            >
              <Pencil className="mr-2" />
              Modificar
            </Button>
          )}

          {/* Botón Eliminar */}
          {onDelete && (
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={onDelete}
            >
              <Trash2 className="mr-2" />
              Eliminar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
