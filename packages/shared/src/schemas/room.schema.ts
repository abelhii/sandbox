import { z } from 'zod'

export const RoomSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.coerce.date(),
})

export const CreateRoomSchema = z.object({
  name: z.string().min(1).max(50),
})

export type Room = z.infer<typeof RoomSchema>
export type CreateRoom = z.infer<typeof CreateRoomSchema>