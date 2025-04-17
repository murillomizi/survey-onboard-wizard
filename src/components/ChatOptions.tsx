
import React from "react";
import { Button } from "@/components/ui/button";

interface ChatOptionProps {
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
}

const ChatOptions = ({ options, onSelect }: ChatOptionProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map((option) => (
        <Button
          key={option.value}
          className="border border-white/20 bg-black/20 text-white hover:bg-white/10 transition-all duration-300"
          onClick={() => onSelect(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};

export default ChatOptions;
