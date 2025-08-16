import type { TableRecord } from "@/core/models/sql.model"

export interface CatTopic extends TableRecord {
  id_topic: number
  topic: string
}

export interface MstGlossary extends TableRecord {
  id_topic: number
  term: string
  description: string
  video_url: string | null
}

export interface TopicGlossariesDto extends CatTopic {
  glossaries: MstGlossary[]
}

export interface InsertGlossaryDto {
  p_id_topic: number
  p_term: string
  p_description: string
  p_video_url: string | null
}

export interface InsertTopicDto {
  p_topic: string
}

export interface GetTopicDto {
  p_id_topic: number
  p_topic: string
}