
import React, { useState } from "react";
import { Send, Settings, Paperclip, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat-input";
import { ChatBubble, ChatBubbleMessage, ChatBubbleAvatar } from "@/components/ui/chat-bubble";
import Logo from "@/components/ui/logo";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import EditOptionsModal from "./EditOptionsModal";

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMachineLearningEnabled, setIsMachineLearningEnabled] = useState(false);
  const [isFileInputOpen, setIsFileInputOpen] = useState(false);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log("File selected:", e.target.files[0].name);
      // Here you would handle the file upload
    }
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 w-80 bg-[#f5f5f7] text-[#1d1d1f] flex flex-col h-screen border-r border-[#e6e6e6] flex-shrink-0 z-10">
      {/* Header with logo */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Logo size="md" />
          <span className="ml-2 text-lg font-medium">Copy AI</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-[#1d1d1f] hover:bg-[#e6e6e6] rounded-full"
            >
              <Settings size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border-[#e6e6e6] shadow-lg text-[#1d1d1f]">
            <DropdownMenuItem className="text-xs hover:bg-[#f5f5f7]" onClick={() => setIsEditModalOpen(true)}>
              Personalizar modelo
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs hover:bg-[#f5f5f7]">
              Configurações
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs hover:bg-[#f5f5f7]">
              Nova conversa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-[#0071e3] rounded-full flex items-center justify-center mb-4">
              <Sparkles size={30} className="text-white" />
            </div>
            <h2 className="text-xl font-medium mb-2">Crie copies perfeitos</h2>
            <p className="text-[#6e6e73] mb-6 max-w-xs">
              Descreva seu produto ou serviço e deixe a IA criar mensagens personalizadas de alto impacto
            </p>
            <div className="flex gap-2 text-[#0071e3]">
              <Button variant="ghost" className="text-xs hover:bg-[#e6e6e6]">
                Ver exemplos
              </Button>
              <span className="text-[#6e6e73]">•</span>
              <Button variant="ghost" className="text-xs hover:bg-[#e6e6e6]">
                Dicas
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <ChatBubble 
                key={index}
                variant={message.role === "user" ? "sent" : "received"}
                className="animate-fade-in"
              >
                {message.role === "assistant" && (
                  <ChatBubbleAvatar fallback="M" className="bg-[#0071e3]" />
                )}
                <ChatBubbleMessage 
                  variant={message.role === "user" ? "sent" : "received"}
                  isLoading={message.isLoading}
                  className={message.role === "user" ? 
                    "bg-[#0071e3] text-white rounded-2xl" : 
                    "bg-[#e6e6e6] text-[#1d1d1f] rounded-2xl"}
                >
                  {message.content}
                </ChatBubbleMessage>
              </ChatBubble>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}
        
        <div className="p-4 bg-white shadow-[0_-1px_0_rgba(0,0,0,0.05)]">
          <div className="relative">
            <ChatInput 
              value={input}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              placeholder="Descreva seu produto ou serviço..."
              disabled={isLoading}
              className="pr-10 bg-[#f5f5f7] text-[#1d1d1f] border-none rounded-2xl shadow-sm"
            />
            <Button 
              size="icon" 
              className={`absolute right-2 top-1/2 -translate-y-1/2 ${input.trim() ? 'bg-[#0071e3]' : 'bg-[#e6e6e6]'} hover:${input.trim() ? 'bg-[#0077ED]' : 'bg-[#e6e6e6]'} text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors`}
              onClick={onSendMessage} 
              disabled={isLoading || !input.trim()}
            >
              <Send size={16} />
            </Button>
          </div>

          {/* Controls row with improved layout */}
          <div className="flex items-center justify-between mt-3 px-1">
            {/* Attachment Button on the left */}
            <div>
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                onChange={handleFileInputChange} 
              />
              <label htmlFor="file-upload">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2 py-1 text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] flex items-center gap-1 rounded-full"
                  asChild
                >
                  <span>
                    <Paperclip size={14} />
                    <span className="text-xs">Anexar</span>
                  </span>
                </Button>
              </label>
            </div>
            
            {/* ML Switch on the right */}
            <div className="flex items-center gap-2">
              <span className={isMachineLearningEnabled ? "text-[#0071e3] text-xs" : "text-[#6e6e73] text-xs"}>IA avançada</span>
              <Switch 
                checked={isMachineLearningEnabled}
                onCheckedChange={setIsMachineLearningEnabled}
                className="h-4 w-7 data-[state=checked]:bg-[#0071e3]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditOptionsModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};

export default ChatSidebar;
