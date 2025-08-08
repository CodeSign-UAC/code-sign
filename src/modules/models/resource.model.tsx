export enum ResourceStatus {
  Available = 'disponible',
  DueSoon = 'próximo a vencer',
  Completed = 'completado'
}

export interface Resource {
  id: number
  title: string
  description: string
  file_url?: string
  duration?: string
  is_accesible: boolean
  created_at?: string
  idCategory: number
}
