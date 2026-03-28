import { os, type RouterClient } from "@orpc/server";
import { roomsRouter } from "./rooms.ts";
import { messagesRouter } from "./messages.ts";
import type { AppContext } from "../context.ts";

const o = os.$context<AppContext>();

export const appRouter = o.router({
  rooms: roomsRouter,
  messages: messagesRouter,
});

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<AppRouter>;
