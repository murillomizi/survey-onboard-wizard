
import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string;
  onSend: (message: string) => void;
  disabled?: boolean;
  initialValue?: string;
}

export function ChatInput({
  className,
  placeholder = "Digite sua mensagem...",
  onSend,
  disabled = false,
  initialValue = "",
  ...props
}: ChatInputProps) {
  const [value, setValue] = React.useState(initialValue);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={cn("flex items-center space-x-2", className)}
      {...props}
    >
      <Textarea
        ref={textareaRef}
        placeholder={placeholder}
        className="max-h-12 px-4 py-3 bg-minimal-white text-sm placeholder:text-minimal-gray-500 rounded-full border border-minimal-gray-200 focus-visible:border-minimal-gray-300 resize-none flex-1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
      />
      <Button
        size="icon"
        className="rounded-full w-10 h-10 bg-minimal-black text-minimal-white hover:bg-minimal-gray-800 flex-shrink-0"
        disabled={!value.trim() || disabled}
        onClick={handleSend}
        type="button"
      >
        <Send className="h-4 w-4" />
        <span className="sr-only">Enviar mensagem</span>
      </Button>
    </div>
  );
}
