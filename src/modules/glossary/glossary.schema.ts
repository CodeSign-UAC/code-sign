import z from "zod";

export const topicSchema = z.object({
  topic: z.string().min(1, { error: "El tema es requerido" })
})

export const subtopicSchema = z.object({
  subtopic_name: z.string().min(1, "El nombre del subtema es requerido")
})

export const glossarySchema = z.object({
  term: z.string().min(1, "El término es requerido"),
  description: z.string().min(1, "La descripción es requerida")
})

export type TopicSchema = z.infer<typeof topicSchema>
export type SubtopicSchema = z.infer<typeof subtopicSchema>
export type GlossarySchema = z.infer<typeof glossarySchema>