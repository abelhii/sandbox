import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/ws";
import type { IncomingMessage } from "node:http";

import { parseOrCreateSession } from "../middleware/session.ts";
import { appRouter } from "./router/index.ts";

const handler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

// Called once per WS connection upgrade
export function handleWsUpgrade(ws: WebSocket, req: IncomingMessage) {
  try {
    const session = parseOrCreateSession(req.headers.cookie);
    console.log("[WS] session parsed:", session, req.headers.cookie);
    handler.upgrade(ws, { context: { session } });
  } catch (err) {
    console.error("[WS] upgrade failed:", err);
    ws.close();
  }
}
