import type { UserDto } from "@/modules/user/user.model"
import { supabase } from "@/lib/supabaseClient"

const fetchUser = async (uuid: string): Promise<UserDto[]> => {
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
    console.error('Error inesperado en fetchUser:', err)
    throw err
  }
}

export {
  fetchUser
}