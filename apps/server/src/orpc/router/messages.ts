import { eventIterator, ORPCError, os } from "@orpc/server";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";

import { SendMessageSchema } from "@sandbox/shared";
import { db } from "../../db/index.ts";
import { messages } from "../../db/schema.ts";
import { sanitizeContent } from "../../lib/sanitize.ts";
import { roomManager } from "../../ws/room-manager.ts";
import type { AppContext } from "../context.ts";
import { RoomEvent, RoomEventSchema } from "../../schemas/room-event.schema.ts";

const o = os.$context<AppContext>();

export const messagesRouter = o.router({
  list: o
    .input(
      z.object({
        roomId: z.string(),
        limit: z.number().min(1).max(100).default(50),
      }),
    )
    .handler(async ({ input }) => {
      return await db
        .select()
        .from(messages)
        .where(eq(messages.roomId, input.roomId))
        .orderBy(asc(messages.createdAt))
        .limit(input.limit);
    }),

  send: o.input(SendMessageSchema).handler(async ({ input, context }) => {
    const safeContent = sanitizeContent(input.content);

    // reject if sanitisation emptied the message
    if (!safeContent) {
      throw new ORPCError("BAD_REQUEST", {
        message: "Message content is invalid",
      });
    }

    const [message] = await db
      .insert(messages)
      .values({
        id: crypto.randomUUID(),
        roomId: input.roomId,
        content: safeContent,
        senderName: context.session.displayName,
        sessionId: context.session.sessionId,
      })
      .returning();

    roomManager.emit(input.roomId, {
      type: "message",
      data: message,
    });

    return message;
  }),

  subscribe: o
    .input(z.object({ roomId: z.string() }))
    .output(eventIterator(RoomEventSchema))
    .handler(async function* ({ input, context, signal }) {
      console.log("[subscribe] context:", context);
      console.log("[subscribe] input:", input);

      const { roomId } = input;
      const { session } = context;

      if (!session) {
        throw new ORPCError("UNAUTHORIZED", { message: "No session found" });
      }

      // Queue bridges the push-based EventEmitter into a pull-based async iterator
      const queue: RoomEvent[] = [];
      let resolve: (() => void) | null = null;

      const unsubscribe = roomManager.subscribe(roomId, (event) => {
        queue.push(event);
        resolve?.(); // wake up the generator if it's waiting
        resolve = null;
      });

      roomManager.join(roomId, session.sessionId, session.displayName);

      try {
        while (!signal.aborted) {
          if (queue.length > 0) {
            yield queue.shift()!;
          } else {
            // Wait for the next event or for signal to abort
            await new Promise<void>((res) => {
              resolve = res;
              signal.addEventListener("abort", resolve, { once: true });
            });
          }
        }
      } finally {
        unsubscribe();
        roomManager.leave(roomId, session.sessionId, session.displayName);
      }
    }),
});
