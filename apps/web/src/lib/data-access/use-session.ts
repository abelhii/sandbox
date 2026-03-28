import { useQuery } from "@tanstack/react-query";
import { orpc } from "../orpc-client";
import { sessionQueryKeys } from "./keys";

export function useSession() {
  return useQuery(
    orpc.me.queryOptions({
      queryKey: sessionQueryKeys.all,
      staleTime: Infinity,
    }),
  );
}
