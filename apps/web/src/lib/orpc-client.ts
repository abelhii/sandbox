import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

import { type AppRouterClient } from "../../../server/src/orpc/router";

const link = new RPCLink({
  url: `${import.meta.env.VITE_API_URL ?? "http://localhost:4000"}/api/rpc`,
  fetch: (request, init) => {
    return globalThis.fetch(request, {
      ...init,
      credentials: "include",
    });
  },
});

export const client = createORPCClient<AppRouterClient>(link);
export const orpc = createTanstackQueryUtils<AppRouterClient>(client);
