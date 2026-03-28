import { ORPCError, os } from "@orpc/server";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";

import { SendMessageSchema } from "@sandbox/shared";
import { db } from "../../db/index.ts";
import { messages } from "../../db/schema.ts";
import { sanitizeContent } from "../../lib/sanitize.ts";
import type { AppContext } from "../context.ts";

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

    return message;
  }),
});
