
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
        "mb-6 flex",
        type === "user" ? "justify-end" : "justify-start"
      )}
    >
      {type === "bot" && (
        <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10 border border-white/20 p-1 shadow-[0_0_8px_rgba(255,255,255,0.2)]">
          <Bot size={18} className="text-white" />
        </div>
      )}
      
      <div
        className={cn(
          "relative max-w-[80%] rounded-2xl px-4 py-3 backdrop-blur-xl",
          type === "user"
            ? "border border-white/20 bg-white/10 text-white shadow-[0_0_8px_rgba(255,255,255,0.1)]"
            : "border border-white/10 bg-black/40 text-white shadow-[0_0_8px_rgba(0,0,0,0.2)]",
          isTyping && "animate-pulse"
        )}
      >
        {isTyping ? (
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
            <div className="h-2 w-2 animate-pulse rounded-full bg-white delay-75"></div>
            <div className="h-2 w-2 animate-pulse rounded-full bg-white delay-150"></div>
          </div>
        ) : (
          <div className="relative">
            {content}
            <div className={cn(
              "absolute inset-0 rounded-2xl opacity-10 pointer-events-none",
              type === "user" 
                ? "bg-gradient-to-r from-white/20 to-white/10" 
                : "bg-gradient-to-r from-white/10 to-white/5"
            )}></div>
          </div>
        )}
      </div>
      
      {type === "user" && (
        <div className="ml-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/20 p-1 shadow-[0_0_8px_rgba(255,255,255,0.2)]">
          <User size={18} className="text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
