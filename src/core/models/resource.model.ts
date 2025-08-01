import { Binoculars, FileTextIcon } from 'lucide-react'

export enum ResourceStatus {
  Available = 'disponible',
  DueSoon = 'próximo a vencer',
  Completed = 'completado',
}

export enum ResourceCategory {
  Document = 'Document',
  Tutorial = 'Tutorial',
}

export const ResourceCategoryIcon = {
  [ResourceCategory.Document]: FileTextIcon,
  [ResourceCategory.Tutorial]: Binoculars,
}

export interface Resource {
  id: number
  title: string
  description: string
  file_url?: string
  duration?: string
  category: ResourceCategory
  created_at?: string
  is_accesible: boolean
}
