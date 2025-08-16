import { supabase } from '@/lib/supabaseClient'
import type { MstResource } from './resource.model'
import type { PostgrestError } from '@supabase/supabase-js'

const rcpError = (error: PostgrestError) => {
  return {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
  }
}

export const fetchUserResources = async (
  userId: number,
): Promise<MstResource[]> => {
  try {
    const { data, error } = await supabase.rpc('search_resources_by_user_id', {
      p_id_user: userId,
    })

    if (error) {
      console.error('RPC Error:', rcpError(error))
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

export const fetchAllResources = async (): Promise<MstResource[]> => {
  try {
    const { data, error } = await supabase.rpc('get_available_resources')
    if (error) {
      console.error('No se pudieron obtener todos los recursos:', error)
      throw error
    }

    if (!data || data.length === 0)
      console.warn('No se encontraron recursos disponibles.')

    return data || []
  } catch (err) {
    console.error('Error inesperado en fetchAllResources:', err)
    throw err
  }
}

export const deleteResource = async (id: number): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('delete_resource', {
      p_id_resource: id,
    })

    if (error) {
      console.error('Error al eliminar recurso:', rcpError(error))
      throw error
    }

    return data
  } catch (err) {
    console.error('Error inesperado en deleteResource:', err)
    throw err
  }
}

export const createResource = async (
  data: MstResource,
): Promise<{ v_id_resource: number } | null> => {
  try {
    const { data: resource, error } = await supabase.rpc('create_resource', {
      ...data,
    })

    if (error) {
      console.error('Error al crear recurso:', rcpError(error))
      throw error
    }

    return resource
  } catch (err) {
    console.error('Error inesperado en createResource:', err)
    throw err
  }
}

export const fetchResourceByIdWithUserStatus = async (
  id: number,
  userId: number,
): Promise<MstResource | null> => {
  try {
    const { data, error } = await supabase.rpc(
      'get_resource_by_id_with_user_status',
      {
        p_id_resource: id,
        p_id_user: userId,
      },
    )

    if (error) {
      console.error('RPC Error:', rcpError(error))

      throw error
    }

    if (!data || data.length === 0) {
      console.warn(`No se encontró el recurso con ID: ${id}`)
      return null
    }

    return data[0]
  } catch (err) {
    console.error('Error inesperado en fetchResourceByIdWithUserStatus:', err)
    throw err
  }
}
