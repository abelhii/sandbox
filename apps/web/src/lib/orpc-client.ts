import { createORPCClient } from "@orpc/client";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { RPCLink } from "@orpc/client/fetch";
import { type AppRouterClient } from "../../../server/src/orpc/router/index.ts";

const link = new RPCLink({
  url: `${import.meta.env.VITE_API_URL ?? "http://localhost:4000"}/api/rpc`,
  fetch: (request, init) => {
    return globalThis.fetch(request, {
      ...init,
      credentials: "include",
    });
  },
});

const client = createORPCClient<AppRouterClient>(link);
export const orpc = createTanstackQueryUtils<AppRouterClient>(client);
