import { DoorOpen } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Button } from '../ui/button'
import type { Resource } from '@/core/models'
import { ResourceCategoryIcon } from '@/core/models/resource.model'

interface Props {
  resource: Resource
}

export default function ResourceCard({ resource }: Props) {
  return (
    <Card key={resource.id}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {(() => {
            const Icon =
              ResourceCategoryIcon[
                resource.category as keyof typeof ResourceCategoryIcon
              ]
            return <Icon />
          })()}
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
        </div>
      </CardContent>
    </Card>
  )
}
