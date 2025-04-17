
import React from "react";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { motion } from "framer-motion";

type MessageType = "user" | "bot";

interface ChatMessageProps {
  content: React.ReactNode;
  type: MessageType;
  isTyping?: boolean;
}

const ChatMessage = ({ content, type, isTyping = false }: ChatMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "mb-4 flex items-start",
        type === "user" ? "justify-end" : "justify-start"
      )}
    >
      {type === "bot" && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-white/30 bg-black/60 p-1 hover:border-white/50 transition-all duration-300"
        >
          <Bot size={20} className="text-white" />
        </motion.div>
      )}
      
      <div
        className={cn(
          type === "user" ? "chat-bubble-user" : "chat-bubble-bot",
          isTyping && "animate-pulse"
        )}
      >
        {isTyping ? (
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-white opacity-70"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, delay: 0.2, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-white opacity-70"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, delay: 0.4, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-white opacity-70"
            />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative text-base"
          >
            {content}
          </motion.div>
        )}
      </div>
      
      {type === "user" && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className="ml-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-white/30 bg-black/60 p-1 hover:border-white/50 transition-all duration-300"
        >
          <User size={20} className="text-white" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
