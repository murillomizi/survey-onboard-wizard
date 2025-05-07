
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
          className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-full bg-minimal-gray-100 text-minimal-black"
        >
          <Bot size={18} />
        </motion.div>
      )}
      
      <div
        className={cn(
          "max-w-[90%] rounded-[18px] px-4 py-3",
          type === "user" 
            ? "bg-minimal-black text-minimal-white text-right" 
            : "bg-minimal-white border border-minimal-gray-200 text-minimal-black shadow-sm text-left",
          isTyping && "min-w-[60px]"
        )}
      >
        {isTyping ? (
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-minimal-gray-400"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, delay: 0.2, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-minimal-gray-400"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, delay: 0.4, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-minimal-gray-400"
            />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[16px] leading-relaxed font-sans"
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
          className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-full bg-minimal-gray-800 text-minimal-white"
        >
          <User size={18} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
