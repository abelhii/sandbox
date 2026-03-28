import { os } from "@orpc/server";
import { z } from "zod";
import { eq } from "drizzle-orm";

import { CreateRoomSchema } from "@sandbox/shared";
import { db } from "../../db/index.ts";
import { rooms } from "../../db/schema.ts";
import type { AppContext } from "../context.ts";

const o = os.$context<AppContext>();

export const roomsRouter = o.router({
  list: o.handler(async () => {
    return await db.select().from(rooms).orderBy(rooms.createdAt);
  }),

  get: o.input(z.object({ id: z.string() })).handler(async ({ input }) => {
    const [room] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, input.id))
      .limit(1);

    if (!room) throw new Error("Room not found");
    return room;
  }),

  create: o.input(CreateRoomSchema).handler(async ({ input }) => {
    const [room] = await db
      .insert(rooms)
      .values({
        id: crypto.randomUUID(),
        name: input.name,
      })
      .returning();

    return room;
  }),
});
