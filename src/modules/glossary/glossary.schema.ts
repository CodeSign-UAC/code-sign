import z from "zod";

export const glossarySchema = z.object({
  id_topic: z.number().min(1),
  term: z.string().min(2, {
    error: "El término debe tener al menos dos letras"
  }),
  description: z.string().min(2).max(500),
  video_url: z.string().nullable()
})

export const topicSchema = z.object({
  topic: z.string().min(2, {
    error: "El tema debe tener al menos dos letras"
  })
})

export type GlossarySchema = z.infer<typeof glossarySchema>
export type TopicSchema = z.infer<typeof topicSchema>