import { createFileRoute } from "@tanstack/react-router";

import { ChatLog } from "#/components/chat/ChatLog";
import {
  useListMessages,
  useSendMessage,
  useSubscribeToMessages,
} from "#/lib/data-access/use-messages";
import { useSession } from "#/lib/data-access/use-session";

export const Route = createFileRoute("/chat-room")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: session } = useSession();
  const { data: messages } = useListMessages("test-room");
  const { mutate: sendMessage } = useSendMessage();

  useSubscribeToMessages("test-room");

  const handleSendMessage = (message: string) => {
    sendMessage({ roomId: "test-room", content: message });
  };

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">Chat room</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          A small starter with room to grow.
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          TanStack Start gives you type-safe routing, server functions, and
          modern SSR defaults. Use this as a clean foundation, then layer in
          your own routes, styling, and add-ons.
        </p>

        <ChatLog
          messages={messages}
          displayName={session?.displayName}
          handleSendMessage={handleSendMessage}
        />
      </section>
    </main>
  );
}
