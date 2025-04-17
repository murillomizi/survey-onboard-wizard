
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ChatOptionProps {
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
}

const ChatOptions = ({ options, onSelect }: ChatOptionProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-wrap gap-2 mt-3"
    >
      {options.map((option, index) => (
        <motion.div
          key={option.value}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Button
            className="btn-option text-base font-medium relative overflow-hidden group"
            onClick={() => onSelect(option.value)}
          >
            <span className="relative z-10">{option.label}</span>
            <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ChatOptions;
