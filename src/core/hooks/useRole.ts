import { useQuery } from "@tanstack/react-query"
import type { GetUserRoleDto } from "../models/user.model"
import { supabase } from "@/lib/supabaseClient"

const fetchUserRole = async (uuid: string): Promise<GetUserRoleDto[]> => {
  try {
    const { data, error } = await supabase.rpc('get_user_by_uuid', {
      p_uuid: uuid,
    })

    if (error) {
      console.error('RPC Error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }

    if (!data || data.length === 0)
      console.warn(`Este usuario no tiene un rol asignado.`)

    return data || null
  } catch (err) {
    console.error('Error inesperado en fetchUserRole:', err)
    throw err
  }
}

export const useUserRole = (uuid: string) => {
  return useQuery({
    queryKey: ["userRole", uuid],
    queryFn: (): Promise<GetUserRoleDto[]> => fetchUserRole(uuid),
    enabled: !!uuid
  });
};
