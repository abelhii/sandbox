import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import { cors } from "hono/cors";
import { WebSocketServer } from "ws";

import { sessionMiddleware } from "./middleware/session.ts";
import { orpcHandler } from "./orpc/handler.ts";
import { handleWsUpgrade } from "./orpc/ws-handler.ts";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: process.env.WEB_URL ?? "http://localhost:4001",
    credentials: true,
  }),
);

app.use("*", sessionMiddleware);

// Apply rate limiting to all routes, especially important for the RPC endpoint
app.use(
  rateLimiter({
    windowMs: 60 * 1000, // 1 minute
    limit: 20, // 20 messages per minute per window
    keyGenerator: (c) =>
      c.req.header("x-forwarded-for") ?? c.get("session").sessionId, // rate limit by IP or session ID if available
  }),
);

app.get("/health", (c) => c.json({ ok: true }));
app.all("/api/rpc/*", (c) => orpcHandler(c));

const port = Number(process.env.PORT ?? 4001);
const server = serve({ fetch: app.fetch, port, });
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  ws.on('error', (err) => console.error('[WS socket error]', err))
  
  handleWsUpgrade(ws, req)
})

wss.on('error', (err) => console.error('[WSS error]', err))

console.log(`Server running on http://localhost:${port}`);
