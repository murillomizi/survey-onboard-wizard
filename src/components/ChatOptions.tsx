
import React from "react";
import { Button } from "@/components/ui/button";

interface ChatOptionProps {
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
}

const ChatOptions = ({ options, onSelect }: ChatOptionProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {options.map((option) => (
        <Button
          key={option.value}
          className="btn-option text-base font-medium"
          onClick={() => onSelect(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};

export default ChatOptions;
