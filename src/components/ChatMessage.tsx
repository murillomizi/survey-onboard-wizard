
import React from "react";
import { cn } from "@/lib/utils";
import { CircleDot, Bot, User } from "lucide-react";

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
        <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 via-violet-400 to-purple-500 p-1 shadow-[0_0_8px_rgba(155,135,245,0.5)]">
          <Bot size={18} className="text-white" />
        </div>
      )}
      
      <div
        className={cn(
          "relative max-w-[80%] rounded-2xl px-4 py-3 backdrop-blur-xl",
          type === "user"
            ? "border border-survey-purple/30 bg-survey-purple/20 text-white shadow-[0_0_8px_rgba(155,135,245,0.3)]"
            : "border border-white/10 bg-black/40 text-survey-text shadow-[0_0_8px_rgba(155,135,245,0.2)]",
          isTyping && "animate-pulse"
        )}
      >
        {isTyping ? (
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-survey-purple"></div>
            <div className="h-2 w-2 animate-pulse rounded-full bg-survey-purple delay-75"></div>
            <div className="h-2 w-2 animate-pulse rounded-full bg-survey-purple delay-150"></div>
          </div>
        ) : (
          <div className="relative">
            {content}
            <div className={cn(
              "absolute inset-0 rounded-2xl opacity-10 pointer-events-none",
              type === "user" 
                ? "bg-gradient-to-r from-survey-purple/20 to-blue-500/20" 
                : "bg-gradient-to-r from-blue-500/10 to-survey-purple/10"
            )}></div>
          </div>
        )}
      </div>
      
      {type === "user" && (
        <div className="ml-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-survey-purple p-1 shadow-[0_0_8px_rgba(155,135,245,0.5)]">
          <User size={18} className="text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
