import type { TableRecord } from "@/core/models/sql.model"

export interface MstUser extends TableRecord {
  id_user: number
  user_uuid: number
  id_role: number
  first_name: string
  surname?: string
  last_login_at?: Date
}

// DTO para la obtención del rol y el nombre del usuario (GET)
export interface UserDto extends Pick<MstUser, 'id_user' | 'id_role' | 'first_name' | 'surname'> { }