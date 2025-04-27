
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip } from "lucide-react";

interface ChatInputProps {
  currentInput: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onFileUpload: () => void;
  showFileUpload?: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  currentInput,
  onInputChange,
  onSend,
  onFileUpload,
  showFileUpload = false,
  disabled = false
}) => {
  return (
    <div className="flex items-center gap-2 w-full">
      {showFileUpload && (
        <Button
          type="button"
          onClick={onFileUpload}
          className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200"
        >
          <Paperclip size={18} />
          Upload CSV
        </Button>
      )}
      
      {!showFileUpload && !disabled && (
        <div className="relative w-full">
          <Input
            value={currentInput}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onSend()}
            placeholder="Digite sua resposta..."
            className="w-full bg-gray-50 border-gray-200 text-gray-800 rounded-full pr-12 focus:border-blue-300 focus:ring-1 focus:ring-blue-100 transition-all duration-200"
          />
          <Button
            onClick={onSend}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90 transition-all duration-200 p-0"
          >
            <Send size={14} />
          </Button>
        </div>
      )}
    </div>
  );
};

