import { supabase } from "@/lib/supabaseClient"
import type { InsertGlossaryDto, InsertTopicDto, TopicGlossariesDto, UpdateGlossaryDto } from "./glossary.model"
import type { PostgrestError } from "@supabase/supabase-js"

const rcpError = (error: PostgrestError) => {
  return {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
  }
}

export const fetchTopicGlossaries = async () => {
  const { data: topics, error: topicsError } = await supabase
    .from('cat_topic')
    .select('*')
    .order('id_topic')

  if (topicsError) {
    console.error('Error fetching topics:', topicsError)
    throw topicsError
  }

  const { data: glossaries, error: glossariesError } = await supabase
    .from('mst_glossary')
    .select('*')
    .neq('status', 3)
    .in('id_topic', topics.map(t => t.id_topic))

  if (glossariesError) {
    console.error('Error fetching glossaries:', glossariesError);
    throw glossariesError
  }

  const topicsWithGlossaries = topics.map(topic => {
    const topicGlossaries = glossaries.filter(g => g.id_topic === topic.id_topic)
    return {
      ...topic,
      glossaries: topicGlossaries.map(g => ({
        id_glossary: g.id_glossary,
        id_topic: g.id_topic,
        term: g.term,
        description: g.description,
        video_url: g.video_url,
        status: g.status,
        created_at: g.created_at,
        updated_at: g.updated_at
      }))
    }
  })

  return topicsWithGlossaries
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

export const fetchTopics = async (): Promise<{ id_topic: number; topic: string }[]> => {
  try {
    const { data, error } = await supabase
      .from('cat_topic')
      .select('id_topic, topic')
      .neq('status', 3)
      .order('id_topic')

    if (error) {
      console.error('Supabase query error:', error)
      throw error
    }

    if (!data || data.length === 0) {
      console.warn('No se encontraron temas.')
    }

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