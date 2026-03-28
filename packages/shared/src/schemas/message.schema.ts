import { z } from 'zod'

export const MessageSchema = z.object({
  id: z.string(),
  roomId: z.string(),
  content: z.string(),
  senderName: z.string(),
  sessionId: z.string(),
  createdAt: z.coerce.date(),
})

export const SendMessageSchema = z.object({
  roomId: z.string(),
  content: z.string().min(1).max(2000),
})

export type Message = z.infer<typeof MessageSchema>
export type SendMessage = z.infer<typeof SendMessageSchema>