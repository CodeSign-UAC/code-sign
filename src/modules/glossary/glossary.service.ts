import { supabase } from "@/lib/supabaseClient"
import type { TopicGlossariesDto } from "./glossary.model"

const fetchTopicGlossaries = async (): Promise<TopicGlossariesDto[]> => {
  try {
    const { data, error } = await supabase.rpc('get_topics_with_glossaries')

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
      console.warn(`No se encontraron glosarios para los temas.`)
    return []
  }
    return data
  } catch (err) {
    console.error('Error inesperado en get_topics_with_glossaries:', err)
    throw err
  }
}

export {
  fetchTopicGlossaries
}
