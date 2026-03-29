import { MessageSchema } from "@sandbox/shared";
import { z } from "zod";

export const RoomEventSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("message"), data: MessageSchema }),
  z.object({
    type: z.literal("user_joined"),
    displayName: z.string(),
    timestamp: z.date(),
  }),
  z.object({
    type: z.literal("user_left"),
    displayName: z.string(),
    timestamp: z.date(),
  }),
]);

export type RoomEvent = z.infer<typeof RoomEventSchema>;
