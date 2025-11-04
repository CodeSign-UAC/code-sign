import type { TableRecord } from "@/core/models/sql.model"

export interface CatTopic extends TableRecord {
  id_topic: number
  topic: string
}

export interface InsertTopicDto {
  p_topic: string
}

export interface TopicDto extends TableRecord {
  id_topic: number
  topic: string
  cat_subtopic: SubtopicDto[]
}

export interface SubtopicDto extends TableRecord {
  id_subtopic: number
  id_topic: number
  subtopic_name: string
  mst_glossary: MstGlossary[]
}

export interface MstGlossary extends TableRecord {
  id_glossary: number
  id_subtopic: number
  term: string
  description: string
}


export interface InsertGlossaryDto {
  p_id_topic: number
  p_term: string
  p_description: string
}

export interface UpdateGlossaryDto { p_id_glossary: number }

export interface TopicDto extends CatTopic {
  glossaries: MstGlossary[]
}
