import { Textarea } from "#/components/ui/textarea";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/chat-room")({
  component: RouteComponent,
});

function RouteComponent() {
  const [messages, setMessages] = useState<string[]>([]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      // Handle sending the message here
      const message = event.currentTarget.value.trim();
      console.log("Message sent:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
      event.currentTarget.value = ""; // Clear the textarea after sending
    }
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

        {messages.length > 0 && (
          <div className="mt-4 bg-white/10 p-4 shadow rounded-lg">
            {messages.map((message, index) => (
              <p
                key={index}
                className="m-0 text-base leading-8 text-gray-800 rounded-md bg-gray-100/80 p-2 px-4 mb-2"
              >
                {message}
              </p>
            ))}
          </div>
        )}

        <Textarea
          className="mt-4"
          placeholder="Type your message here..."
          onKeyDown={handleKeyDown}
        />
      </section>
    </main>
  );
}
