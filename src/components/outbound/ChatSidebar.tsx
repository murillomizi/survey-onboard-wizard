
import React from "react";
import { Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat-input";
import { ChatBubble, ChatBubbleMessage, ChatBubbleAvatar } from "@/components/ui/chat-bubble";
import Logo from "@/components/ui/logo";

type Message = {
  content: string;
  role: "user" | "assistant";
  isLoading?: boolean;
};

interface ChatSidebarProps {
  messages: Message[];
  input: string;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  messages,
  input,
  isLoading,
  onInputChange,
  onSendMessage,
  onKeyDown,
  chatEndRef,
}) => {
  return (
    <div className="w-80 bg-minimal-black text-minimal-white flex flex-col h-full border-r border-minimal-gray-700 flex-shrink-0">
      {/* Header with logo */}
      <div className="p-4 border-b border-minimal-gray-700 flex items-center justify-between">
        <Logo size="md" />
        <span className="text-xs text-minimal-gray-400 font-medium flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Assistente ativo
        </span>
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <ChatBubble 
              key={index}
              variant={message.role === "user" ? "sent" : "received"}
              className="animate-fade-in"
            >
              {message.role === "assistant" && (
                <ChatBubbleAvatar fallback="M" className="bg-gradient-to-br from-gray-700 to-gray-900" />
              )}
              <ChatBubbleMessage 
                variant={message.role === "user" ? "sent" : "received"}
                isLoading={message.isLoading}
                className={message.role === "user" ? 
                  "bg-minimal-gray-800 text-minimal-white rounded-xl" : 
                  "bg-minimal-gray-700 text-minimal-white rounded-xl"}
              >
                {message.content}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}
          <div ref={chatEndRef} />
        </div>
        
        <div className="p-4 border-t border-minimal-gray-700 bg-minimal-gray-900/50">
          <div className="relative">
            <ChatInput 
              value={input}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              placeholder="Descreva seu produto ou serviço..."
              disabled={isLoading}
              className="pr-10 bg-minimal-gray-800 text-minimal-white border-minimal-gray-700 rounded-xl"
            />
            <Button 
              size="icon" 
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent hover:bg-minimal-gray-700 text-minimal-white transition-colors"
              onClick={onSendMessage} 
              disabled={isLoading || !input.trim()}
            >
              <Send size={18} />
            </Button>
          </div>

          <div className="mt-3 flex items-center gap-2 px-1">
            <MessageCircle size={14} className="text-minimal-gray-400" />
            <p className="text-xs text-minimal-gray-400">Dê detalhes sobre seu produto e público-alvo para melhores resultados</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
