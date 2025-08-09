import { supabase } from '@/lib/supabaseClient'
import type { MstResource } from './resource.model'

export const fetchUserResources = async (userId: number): Promise<MstResource[]> => {
  try {
    const { data, error } = await supabase.rpc('search_resources_by_user_id', {
      p_id_user: userId,
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
      console.warn(`Ningún recurso encontrado para el usuario ID: ${userId}`)

    return data || []
  } catch (err) {
    console.error('Error inesperado en fetchUserResources:', err)
    throw err
  }
}