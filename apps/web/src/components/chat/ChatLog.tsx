import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { Message } from "@sandbox/shared";
import { Button } from "../ui/button";
import { ChatComposer } from "./ChatComposer";
import { ChatMessage } from "./ChatMessage";
import { cn } from "#/lib/utils";

type ChatLogProps = {
  messages?: Message[];
  displayName?: string;
  handleSendMessage: (message: string) => void;
};

export function ChatLog({
  messages,
  displayName,
  handleSendMessage,
}: ChatLogProps) {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const messagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages?.length]);

  useEffect(() => {
    const controller = new AbortController();
    const handleScroll = () => {
      if (!messagesRef.current) return true;
      const { scrollTop, scrollHeight, clientHeight } = messagesRef.current;
      setIsAtBottom(scrollHeight - scrollTop <= clientHeight + 50); // 50px threshold
    };

    const messagesElement = messagesRef.current;
    if (messagesElement) {
      messagesElement.addEventListener("scroll", handleScroll, {
        signal: controller.signal,
      });
    }

    return () => {
      controller.abort();
    };
  }, []);

  if (!messages) {
    return (
      <div className="flex items-center justify-center mt-8">
        <p className="text-gray-500">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-8">
      <div className="relative">
        <div
          ref={messagesRef}
          className="flex flex-col gap-6 mt-4 bg-white/10 p-6 shadow rounded-lg overflow-auto max-h-[50dvh]"
        >
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              displayName={displayName || "Unknown"}
              {...message}
            />
          ))}
        </div>

        <Button
          className={cn(
            "absolute bottom-4 right-8 h-10 w-10 rounded-full hover:bg-gray-400",
            isAtBottom ? "hidden" : "block",
          )}
          onClick={scrollToBottom}
        >
          <ChevronDown />
        </Button>
      </div>

      <ChatComposer onSendMessage={handleSendMessage} />
    </div>
  );
}
