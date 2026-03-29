import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { orpc } from "#/lib/orpc-client";
import { messagesQueryKeys } from "./keys";
import { orpcWs, wsClient } from "../orpc-ws-client";
import { useEffect } from "react";
import type { Message } from "@sandbox/shared";

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

export function useSubscribeToMessages(roomId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const controller = new AbortController();

    async function startSubscription() {
      const iterator = await wsClient.messages.subscribe(
        { roomId },
        { signal: controller.signal },
      );

      try {
        for await (const event of iterator) {
          switch (event.type) {
            case "message":
              queryClient.setQueryData(
                messagesQueryKeys.list(roomId),
                (prev: Message[] | undefined) => [...(prev ?? []), event.data],
              );
              console.log(`New message from ${event.data.senderName}: ${event.data.content}`);
              break;
            case "user_joined":
              console.log(`${event.displayName} joined`);
              break;
            case "user_left":
              console.log(`${event.displayName} left`);
              break;
          }
        }
      } finally {
        await iterator.return?.();
      }
    }

    startSubscription();

    return () => controller.abort();
  }, [roomId]);
}
