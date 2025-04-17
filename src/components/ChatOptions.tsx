
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
          className="relative border border-white/20 bg-black/40 backdrop-blur-xl text-white hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] overflow-hidden group"
          onClick={() => onSelect(option.value)}
        >
          <span className="relative z-10">{option.label}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Button>
      ))}
    </div>
  );
};

export default ChatOptions;
