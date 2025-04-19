
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-start gap-3",
        type === "user" ? "justify-end" : "justify-start"
      )}
    >
      {type === "bot" && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600"
        >
          <Bot size={18} />
        </motion.div>
      )}
      
      <div
        className={cn(
          "max-w-[90%] rounded-[18px] px-4 py-3",
          type === "user" 
            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" 
            : "bg-white border border-gray-200 text-gray-800 shadow-sm",
          isTyping && "min-w-[60px]"
        )}
      >
        {isTyping ? (
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-gray-400"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, delay: 0.2, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-gray-400"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, delay: 0.4, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-gray-400"
            />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[16px] leading-[1.6]"
          >
            {content}
          </motion.div>
        )}
      </div>
      
      {type === "user" && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-600"
        >
          <User size={18} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
