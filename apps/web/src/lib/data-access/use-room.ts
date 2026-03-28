import { useMutation, useQuery } from "@tanstack/react-query";

import { orpc } from "#/lib/orpc-client";
import { roomsQueryKeys } from "./keys";

export function useListRooms() {
  return useQuery(
    orpc.rooms.list.queryOptions({
      queryKey: roomsQueryKeys.lists(),
    }),
  );
}

export function useCreateRoom() {
  return useMutation(orpc.rooms.create.mutationOptions());
}
