
import React from "react";
import { cn } from "@/lib/utils";

type MessageType = "user" | "bot";

interface ChatMessageProps {
  content: React.ReactNode;
  type: MessageType;
  isTyping?: boolean;
}

const ChatMessage = ({ content, type, isTyping = false }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "mb-4 flex",
        type === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-3",
          type === "user"
            ? "bg-survey-purple text-white"
            : "bg-survey-card text-survey-text",
          isTyping && "animate-pulse"
        )}
      >
        {content}
      </div>
    </div>
  );
};

export default ChatMessage;
