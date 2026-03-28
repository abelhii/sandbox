import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { orpc } from "#/lib/orpc-client";
import { messagesQueryKeys } from "./keys";

export function useListMessages(roomId: string) {
  return useQuery(
    orpc.messages.list.queryOptions({
      input: { roomId },
      queryKey: messagesQueryKeys.list(roomId),
    }),
  );
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation(
    orpc.messages.send.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: messagesQueryKeys.lists() });
      },
    }),
  );
}
