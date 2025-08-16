import { supabase } from "@/lib/supabaseClient"
import type { GetTopicDto, InsertGlossaryDto, InsertTopicDto, TopicGlossariesDto, UpdateGlossaryDto } from "./glossary.model"
import type { PostgrestError } from "@supabase/supabase-js"

const rcpError = (error: PostgrestError) => {
  return {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
  }
}

export const fetchTopicGlossaries = async (): Promise<TopicGlossariesDto[]> => {
  try {
    const { data, error } = await supabase.rpc('get_topics_with_glossaries')

    if (error) {
      console.error('RPC Error:', rcpError(error))
      throw error
    }

    if (!data || data.length === 0)
      console.warn(`No se encontraron glosarios para los temas.`)

    return data || null
  } catch (err) {
    console.error('Error inesperado en get_topics_with_glossaries:', err)
    throw err
  }
}

export const createGlossaryTerm = async (glossary: InsertGlossaryDto): Promise<void> => {
  try {
    const { error } = await supabase.rpc('create_glossary_term', glossary)

    if (error) {
      console.error('RPC Error:', rcpError(error))
      throw error
    }
  } catch (err) {
    console.error('Error inesperado en create_glossary_term:', err)
    throw err
  }
}

export const fetchTopics = async (): Promise<GetTopicDto[]> => {
  try {
    const { data, error } = await supabase.rpc('get_topics')

    if (error) {
      console.error('RPC Error:', rcpError(error))
      throw error
    }

    if (!data || data.length === 0)
      console.warn(`No se encontraron temas.`)

    return data || []
  } catch (err) {
    console.error('Error inesperado en fetchTopics:', err)
    throw err
  }
}

export const insertTopic = async (topic: InsertTopicDto): Promise<void> => {
  try {
    const { error } = await supabase.rpc('create_topic', topic)

    if (error) {
      console.error('RPC Error:', rcpError(error))
      throw error
    }
  } catch (err) {
    console.error('Error inesperado en fetchTopics:', err)
    throw err
  }
}

export const deleteGlossary = async (id: UpdateGlossaryDto): Promise<void> => {
  try {
    const { error } = await supabase.rpc('delete_glossary', id)

    if (error) {
      console.error('RPC Error:', rcpError(error))
      throw error
    }
  } catch (err) {
    console.error('Error inesperado en deleteGlossary:', err)
    throw err
  }
}