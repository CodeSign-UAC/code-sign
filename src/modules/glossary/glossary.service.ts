import { supabase } from "@/lib/supabaseClient"
import type { InsertGlossaryDto, InsertSubtopicDto, InsertTopicDto, TopicDto, UpdateSubtopicDto, UpdateTermDto, UpdateTopicDto } from "./glossary.model"
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

export const insertTopic = async ({ topic }: InsertTopicDto): Promise<void> => {
  try {
    const { error } = await supabase
      .from('cat_topic')
      .insert({ topic })

    if (error) {
      console.error('Supabase insert error:', error)
      throw error
    }
  } catch (err) {
    console.error('Error inesperado en insertTopic:', err)
    throw err
  }
}

export const insertSubtopic = async (subtopic: InsertSubtopicDto): Promise<void> => {
  try {
    const { error } = await supabase
      .from('cat_subtopic')
      .insert({
        id_topic: subtopic.id_topic,
        subtopic_name: subtopic.subtopic_name,
      })

    if (error) {
      console.error('Supabase insert error:', error)
      throw error
    }
  } catch (err) {
    console.error('Error inesperado en insertSubtopic:', err)
    throw err
  }
}

export const insertGlossaryTerm = async (glossary: InsertGlossaryDto): Promise<void> => {
  try {
    const { error } = await supabase
      .from('mst_glossary')
      .insert({
        id_subtopic: glossary.id_subtopic,
        term: glossary.term,
        description: glossary.description,
      })

    if (error) {
      console.error('Supabase insert error:', error)
      throw error
    }
  } catch (err) {
    console.error('Error inesperado en insertGlossaryTerm:', err)
    throw err
  }
}

export const deleteTopic = async (topicId: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('cat_topic')
      .update({ status: 3 })
      .eq('id_topic', topicId)

    if (error) throw error
  } catch (err) {
    console.error('Error deleting topic:', err)
    throw err
  }
}

export const deleteSubtopic = async (subtopicId: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('cat_subtopic')
      .update({ status: 3 })
      .eq('id_subtopic', subtopicId)

    if (error) throw error
  } catch (err) {
    console.error('Error deleting subtopic:', err)
    throw err
  }
}

export const deleteTerm = async (termId: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('mst_glossary')
      .update({ status: 3 })
      .eq('id_glossary', termId)

    if (error) throw error
  } catch (err) {
    console.error('Error inesperado en deleteTerm:', err)
    throw err
  }
}

export const updateTopic = async (topic: UpdateTopicDto): Promise<void> => {
  try {
    const { error } = await supabase
      .from('cat_topic')
      .update({
        topic: topic.topic,
        updated_at: new Date().toISOString()
      })
      .eq('id_topic', topic.id_topic)

    if (error) throw error
  } catch (err) {
    console.error('Error updating topic:', err)
    throw err
  }
}

export const updateSubtopic = async (subtopic: UpdateSubtopicDto): Promise<void> => {
  try {
    const { error } = await supabase
      .from('cat_subtopic')
      .update({
        subtopic_name: subtopic.subtopic_name,
        updated_at: new Date().toISOString()
      })
      .eq('id_subtopic', subtopic.id_subtopic)

    if (error) throw error
  } catch (err) {
    console.error('Error updating subtopic:', err)
    throw err
  }
}

export const updateTerm = async (term: UpdateTermDto): Promise<void> => {
  try {
    const { error } = await supabase
      .from('mst_glossary')
      .update({
        term: term.term,
        description: term.description,
        updated_at: new Date().toISOString()
      })
      .eq('id_glossary', term.id_glossary)

    if (error) throw error
  } catch (err) {
    console.error('Error updating term:', err)
    throw err
  }
}