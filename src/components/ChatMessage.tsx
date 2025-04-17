
import React from "react";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

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
        "mb-4 flex items-start",
        type === "user" ? "justify-end" : "justify-start"
      )}
    >
      {type === "bot" && (
        <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-white/30 bg-black/60 p-1">
          <Bot size={20} className="text-white" />
        </div>
      )}
      
      <div
        className={cn(
          type === "user" ? "chat-bubble-user" : "chat-bubble-bot",
          isTyping && "animate-pulse"
        )}
      >
        {isTyping ? (
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-white opacity-70"></div>
            <div className="h-2 w-2 rounded-full bg-white opacity-70"></div>
            <div className="h-2 w-2 rounded-full bg-white opacity-70"></div>
          </div>
        ) : (
          <div className="relative text-base">
            {content}
          </div>
        )}
      </div>
      
      {type === "user" && (
        <div className="ml-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-white/30 bg-black/60 p-1">
          <User size={20} className="text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
