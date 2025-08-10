import type { TableRecord } from "@/core/models/sql.model"

export interface MstResource extends TableRecord {
  id_resource: number
  id_category: number
  title: string
  description: string
  file_url?: string
}