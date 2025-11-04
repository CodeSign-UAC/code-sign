import { supabase } from "@/lib/supabaseClient"
import type { InsertGlossaryDto, InsertTopicDto, TopicDto, UpdateGlossaryDto } from "./glossary.model"
import type { PostgrestError } from "@supabase/supabase-js"

const rcpError = (error: PostgrestError) => {
  return {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
  }
}

export const fetchTopics = async (): Promise<TopicDto[]> => {
  const { data: topics, error: topicsError } = await supabase
    .from('cat_topic')
    .select('*')
    .eq('status', 1)
    .order('id_topic')

  if (topicsError) {
    console.error('Error fetching topics:', topicsError)
    throw topicsError
  }

  if (!topics || topics.length === 0) {
    return []
  }

  const { data: subtopics, error: subtopicsError } = await supabase
    .from('cat_subtopic')
    .select('*')
    .eq('status', 1)
    .in('id_topic', topics.map(t => t.id_topic))
    .order('id_subtopic')

  if (subtopicsError) {
    console.error('Error fetching subtopics:', subtopicsError)
    throw subtopicsError
  }

  const { data: glossaries, error: glossariesError } = await supabase
    .from('mst_glossary')
    .select('*')
    .eq('status', 1)
    .in('id_subtopic', subtopics?.map(s => s.id_subtopic) || [])
    .order('id_glossary')

  if (glossariesError) {
    console.error('Error fetching glossaries:', glossariesError)
    throw glossariesError
  }

  const result: TopicDto[] = topics.map(topic => {
    const topicSubtopics = subtopics?.filter(st => st.id_topic === topic.id_topic) || []

    const subtopicsWithGlossaries = topicSubtopics.map(subtopic => {
      const subtopicGlossaries = glossaries?.filter(g => g.id_subtopic === subtopic.id_subtopic) || []
      return {
        ...subtopic,
        mst_glossary: subtopicGlossaries
      }
    })

    return {
      ...topic,
      cat_subtopic: subtopicsWithGlossaries
    }
  })

  return result
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

// export const fetchTopics = async (): Promise<{ id_topic: number; topic: string }[]> => {
//   try {
//     const { data, error } = await supabase
//       .from('cat_topic')
//       .select('id_topic, topic')
//       .neq('status', 3)
//       .order('id_topic')

//     if (error) {
//       console.error('Supabase query error:', error)
//       throw error
//     }

//     if (!data || data.length === 0) {
//       console.warn('No se encontraron temas.')
//     }

//     return data || []
//   } catch (err) {
//     console.error('Error inesperado en fetchTopics:', err)
//     throw err
//   }
// }

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