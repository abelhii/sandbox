import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import { cors } from "hono/cors";
import { WebSocketServer } from "ws";
import { migrate } from "drizzle-orm/node-postgres/migrator";

import { db } from "./db/index.ts";
import { sessionMiddleware } from "./middleware/session.ts";
import { orpcHandler } from "./orpc/handler.ts";
import { handleWsUpgrade } from "./orpc/ws-handler.ts";

async function bootstrap() {
  console.log("Running database migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations complete.");

  const app = new Hono();

  app.use(
    "*",
    cors({
      origin: process.env.WEB_URL ?? "http://localhost:4001",
      credentials: true,
    }),
  );

  app.use("*", sessionMiddleware);

  app.use(
    rateLimiter({
      windowMs: 60 * 1000,
      limit: 20,
      keyGenerator: (c) =>
        c.req.header("x-forwarded-for") ?? c.get("session").sessionId,
    }),
  );

  app.get("/health", (c) => c.json({ ok: true }));
  app.all("/api/rpc/*", (c) => orpcHandler(c));

  const port = Number(process.env.PORT ?? 4001);
  const server = serve({ fetch: app.fetch, port });
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    ws.on("error", (err) => console.error("[WS socket error]", err));
    handleWsUpgrade(ws, req);
  });

  wss.on("error", (err) => console.error("[WSS error]", err));

  console.log(`Server running on http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
