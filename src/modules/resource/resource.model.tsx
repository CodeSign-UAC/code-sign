export interface MstResource {
  id_resource: number
  id_category: number
  title: string
  description: string
  file_url?: string
  created_At: Date
  updated_At: Date
  status: 1 | 2 | 3
}