export enum ResourceStatus {
  Available = "disponible",
  DueSoon = "próximo a vencer",
  Completed = "completado"
}

export interface Resource {
  id: number
  title: string
  type: string
  duration?: string
  category: string
  status: ResourceStatus
  description: string
}
// Averigüen si haremos asignaciones o tareas