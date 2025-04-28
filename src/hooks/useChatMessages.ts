
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export interface Message {
  id: number;
  content: React.ReactNode;
  type: "user" | "bot";
}

export const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  
  const addMessage = (content: React.ReactNode, type: "user" | "bot") => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), content, type }
    ]);
  };

  return {
    messages,
    setMessages,
    addMessage
  };
};
