export interface MstUser {
  id_user: number
  user_uuid: number
  id_role: number
  first_name: string
  surname: string
  created_at: Date
  updated_at: Date
  last_login_at: Date
  status: number
}

export interface FetchUserRoleDto {
  id_role: number
  id_user: number
  first_name: string
  surname: string
}