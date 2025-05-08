
import React, { useState } from "react";
import { Send, MessageCircle, Edit, Lightbulb, Paperclip, Users, Database } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [isPersonaPopoverOpen, setIsPersonaPopoverOpen] = useState(false);
  const [selectedPersonaSource, setSelectedPersonaSource] = useState<string | null>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log("File selected:", e.target.files[0].name);
      setSelectedPersonaSource(`Dataset: ${e.target.files[0].name}`);
      // Here you would handle the file upload
    }
  };

  const handlePersonaSelection = (source: string) => {
    setSelectedPersonaSource(source);
    setIsPersonaPopoverOpen(false);
  };

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
            <DropdownMenuItem className="text-xs hover:bg-minimal-gray-700" onClick={() => setIsEditModalOpen(true)}>
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
          {/* Persona Selector */}
          <div className="mb-3">
            <Popover open={isPersonaPopoverOpen} onOpenChange={setIsPersonaPopoverOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full h-8 justify-start text-xs bg-minimal-gray-800 border-minimal-gray-700 text-minimal-white hover:bg-minimal-gray-700 hover:text-minimal-white"
                >
                  <Users size={14} className="mr-2 text-purple-400" />
                  {selectedPersonaSource || "Selecionar persona para campanha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-72 p-3 bg-minimal-gray-800 border-minimal-gray-700 text-minimal-white"
                align="start"
              >
                <Tabs defaultValue="dataset" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-minimal-gray-900">
                    <TabsTrigger value="dataset" className="text-xs">Dataset</TabsTrigger>
                    <TabsTrigger value="enrichment" className="text-xs">Enrichment</TabsTrigger>
                  </TabsList>
                  <TabsContent value="dataset" className="mt-2 space-y-2">
                    <p className="text-xs text-minimal-gray-400 mb-2">Upload um arquivo CSV ou JSON com seus dados de contato</p>
                    <input 
                      type="file" 
                      id="dataset-upload" 
                      className="hidden" 
                      accept=".csv,.json" 
                      onChange={handleFileInputChange} 
                    />
                    <label htmlFor="dataset-upload">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-xs flex items-center gap-2 bg-minimal-gray-700"
                        asChild
                      >
                        <span>
                          <Database size={12} />
                          Fazer upload de dataset
                        </span>
                      </Button>
                    </label>
                  </TabsContent>
                  <TabsContent value="enrichment" className="mt-2 space-y-2">
                    <p className="text-xs text-minimal-gray-400 mb-2">Conecte com uma ferramenta de sales enrichment</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs flex items-center gap-2 bg-minimal-gray-700"
                      onClick={() => handlePersonaSelection("Apollo.io")}
                    >
                      Apollo.io
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs flex items-center gap-2 bg-minimal-gray-700"
                      onClick={() => handlePersonaSelection("ZoomInfo")}
                    >
                      ZoomInfo
                    </Button>
                  </TabsContent>
                </Tabs>
              </PopoverContent>
            </Popover>
          </div>

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

          <div className="flex items-center justify-between mt-3 px-1 text-xs text-minimal-gray-400">
            <div className="flex items-center gap-2">
              <MessageCircle size={14} />
              <span>Dê detalhes para melhores resultados</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={isMachineLearningEnabled ? "text-purple-400" : "text-minimal-gray-500"}>ML</span>
              <Switch 
                checked={isMachineLearningEnabled}
                onCheckedChange={setIsMachineLearningEnabled}
                className="h-4 w-7 data-[state=checked]:bg-purple-500"
              />
            </div>
          </div>
          
          {/* Attachment Button */}
          <div className="flex justify-start mt-2 px-1">
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
                className="h-7 px-2 py-1 text-minimal-gray-400 hover:text-minimal-white hover:bg-minimal-gray-800 flex items-center gap-1"
                asChild
              >
                <span>
                  <Paperclip size={14} />
                  <span className="text-xs">Anexar</span>
                </span>
              </Button>
            </label>
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
