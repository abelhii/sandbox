import { cn } from "#/lib/utils";
import { type Message } from "@sandbox/shared";

type ChatMessageProps = { displayName: string } & Pick<
  Message,
  "content" | "senderName" | "createdAt"
>;

export function ChatMessage({
  content,
  senderName,
  createdAt,
  displayName,
}: ChatMessageProps) {
  const isSender = senderName === displayName;

  return (
    <div
      className={cn(
        "flex flex-col self-start items-start p-2 px-4 w-fit max-w-1/2",
        "text-base leading-8 text-gray-800 rounded-md bg-gray-100/80",
        isSender ? "self-end bg-blue-200/80" : undefined,
      )}
    >
      <p>{content}</p>
      <span className="flex items-center gap-2 text-gray-500">
        <i className="text-sm">{senderName}</i>
        <i className="text-xs">{createdAt.toLocaleString()}</i>
      </span>
    </div>
  );
}
