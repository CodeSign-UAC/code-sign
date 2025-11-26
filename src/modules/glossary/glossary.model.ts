import type { TableRecord } from "@/core/models/sql.model"
export interface CatTopic extends TableRecord {
  id_topic: number
  topic: string
}
export interface InsertTopicDto {
  topic: string
}
export interface InsertSubtopicDto {
  id_topic: number
  subtopic_name: string
}

export interface InsertGlossaryDto {
  id_subtopic: number
  term: string
  description: string
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

export interface UpdateGlossaryDto { id_glossary: number }

export interface MstGlossary extends TableRecord {
  id_glossary: number
  id_subtopic: number
  term: string
  description: string
}

export interface TopicDto extends CatTopic {
  glossaries: MstGlossary[]
}

export interface UpdateTopicDto {
  id_topic: number
  topic: string
}

export interface UpdateSubtopicDto {
  id_subtopic: number
  subtopic_name: string
}

export interface UpdateTermDto {
  id_glossary: number
  term: string
  description: string
}