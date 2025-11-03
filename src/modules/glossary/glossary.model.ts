import type { TableRecord } from "@/core/models/sql.model"

export interface CatTopic extends TableRecord {
  id_topic: number
  topic: string
}

export interface InsertTopicDto {
  p_topic: string
}

export interface MstGlossary extends TableRecord {
  id_glossary: number
  id_topic: number
  term: string
  description: string
  video_url: string | null
}

export interface InsertGlossaryDto {
  p_id_topic: number
  p_term: string
  p_description: string
  p_video_url: string | null
}

export interface UpdateGlossaryDto { p_id_glossary: number }

export interface TopicGlossariesDto extends CatTopic {
  glossaries: MstGlossary[]
}
