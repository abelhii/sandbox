import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/websocket";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { type AppRouterClient } from "../../../server/src/orpc/router";

const websocket = new WebSocket(
  `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/ws`,
);

const link = new RPCLink({ websocket });

export const wsClient = createORPCClient<AppRouterClient>(link);
export const orpcWs = createTanstackQueryUtils(wsClient);
