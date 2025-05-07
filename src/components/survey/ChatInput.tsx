
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const ChatInput = ({ onSend, placeholder = "Digite sua resposta...", disabled = false }: ChatInputProps) => {
  const [currentInput, setCurrentInput] = useState("");

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;
    onSend(currentInput);
    setCurrentInput("");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex-1"
    >
      <Input
        value={currentInput}
        onChange={(e) => setCurrentInput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-minimal-white border-minimal-gray-200 text-minimal-black rounded-full pr-12 focus:border-minimal-black focus:ring-1 focus:ring-minimal-gray-100 transition-all duration-200"
      />
      <Button
        onClick={handleSendMessage}
        disabled={disabled || !currentInput.trim()}
        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-minimal-black text-minimal-white hover:bg-minimal-gray-800 transition-all duration-200 p-0"
      >
        <Send size={14} />
      </Button>
    </motion.div>
  );
};

export default ChatInput;
