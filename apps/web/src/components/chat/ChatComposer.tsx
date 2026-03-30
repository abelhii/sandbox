import { cn } from "#/lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type ChatComposerProps = {
  className?: string;
  placeholder?: string;
  onSendMessage: (message: string) => void;
};

export function ChatComposer({
  className,
  placeholder = "Type your message here...",
  onSendMessage,
}: ChatComposerProps) {
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get("message")?.toString().trim();
    if (message) {
      onSendMessage(message);
      e.currentTarget.reset();
    }
  };

  return (
    <form autoComplete="off" className={cn("mt-4 flex gap-2", className)} onSubmit={handleSubmit}>
      <Input name="message" placeholder={placeholder} className="h-12 px-6"/>
      <Button type="submit" className="h-12 w-20 bg-green-500">
        Send
      </Button>
    </form>
  );
}
