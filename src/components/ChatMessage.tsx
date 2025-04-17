
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
        "mb-4 flex",
        type === "user" ? "justify-end" : "justify-start"
      )}
    >
      {type === "bot" && (
        <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/20 p-1">
          <Bot size={18} className="text-white" />
        </div>
      )}
      
      <div
        className={cn(
          "relative max-w-[80%] rounded-xl px-4 py-3 backdrop-blur-xl",
          type === "user"
            ? "border border-white/10 bg-white/5 text-white"
            : "border border-white/10 bg-black/30 text-white",
          isTyping && "animate-pulse"
        )}
      >
        {isTyping ? (
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-white opacity-50"></div>
            <div className="h-2 w-2 rounded-full bg-white opacity-50"></div>
            <div className="h-2 w-2 rounded-full bg-white opacity-50"></div>
          </div>
        ) : (
          <div className="relative">
            {content}
          </div>
        )}
      </div>
      
      {type === "user" && (
        <div className="ml-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/20 p-1">
          <User size={18} className="text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
