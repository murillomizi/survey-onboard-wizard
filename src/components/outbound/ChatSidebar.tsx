
import React from "react";
import { Send, MessageCircle, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat-input";
import { ChatBubble, ChatBubbleMessage, ChatBubbleAvatar } from "@/components/ui/chat-bubble";
import Logo from "@/components/ui/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  settings: {
    canal: string;
    funnelStage: string;
    websiteUrl: string;
    tamanho: number;
    tomVoz: string;
    gatilhos: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSettingsChange: (field: string, value: any) => void;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  messages,
  input,
  isLoading,
  settings,
  onInputChange,
  onSendMessage,
  onKeyDown,
  onSettingsChange,
  chatEndRef,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  return (
    <div className="fixed left-0 top-0 bottom-0 w-80 bg-minimal-black text-minimal-white flex flex-col h-screen border-r border-minimal-gray-700 flex-shrink-0 z-10">
      {/* Header with logo */}
      <div className="p-4 border-b border-minimal-gray-700 flex items-center justify-between">
        <Logo size="md" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-minimal-gray-400 hover:text-minimal-white hover:bg-minimal-gray-800"
            >
              <Edit size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-minimal-gray-800 border-minimal-gray-700 text-minimal-white">
            <DropdownMenuItem 
              className="text-xs hover:bg-minimal-gray-700"
              onClick={() => setIsEditModalOpen(true)}
            >
              Editar modelo
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs hover:bg-minimal-gray-700">
              Configurações
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs hover:bg-minimal-gray-700">
              Começar nova conversa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
      
      {/* Modal de edição */}
      <EditOptionsModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        currentSettings={settings}
        onSettingsChange={onSettingsChange}
      />
    </div>
  );
};

export default ChatSidebar;
