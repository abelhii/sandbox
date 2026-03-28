import { z } from 'zod'

export const SessionSchema = z.object({
  sessionId: z.string().uuid(),
  displayName: z.string(),
})

export type Session = z.infer<typeof SessionSchema>