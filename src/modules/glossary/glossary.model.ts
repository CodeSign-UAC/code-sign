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