export interface MstUser {
  id_user: number
  user_uuid: number
  id_role: number
  first_name: string
  surname?: string
  created_at: Date
  updated_at?: Date
  last_login_at?: Date
  status: number
}

// DTO para la obtención del rol y el nombre del usuario (GET)
export interface GetUserRoleDto extends Pick<MstUser, 'id_user' | 'id_role' | 'first_name' | 'surname'> { }