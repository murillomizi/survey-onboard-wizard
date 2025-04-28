
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ChatOptionProps {
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
  isComplete?: boolean;
}

const ChatOptions = ({ options, onSelect, isComplete = false }: ChatOptionProps) => {
  if (isComplete) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-wrap gap-2 mt-3"
    >
      {options.map((option, index) => (
        <motion.div
          key={option.value}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.08 }}
          whileHover={{ y: -2, scale: 1.02 }}
        >
          <Button
            className="bg-white border border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 shadow-sm hover:shadow transition-all duration-200"
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ChatOptions;
