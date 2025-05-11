
import React, { useState } from "react";
import { Send, Paperclip, History, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat-input";
import { ChatBubble, ChatBubbleMessage, ChatBubbleAvatar } from "@/components/ui/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import Logo from "@/components/ui/logo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import EditOptionsModal from "./EditOptionsModal";
import TemplateConfigMenu from "./TemplateConfigMenu";
import { toast } from "@/components/ui/use-toast";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

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
  const [isFileInputOpen, setIsFileInputOpen] = useState(false);
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log("File selected:", e.target.files[0].name);
      // Here you would handle the file upload
    }
  };
  
  const handleApplyTemplate = (templateConfig: any) => {
    console.log("Template config applied:", templateConfig);
    toast({
      title: "Template aplicado!",
      description: "As configurações do template foram aplicadas com sucesso."
    });
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 w-80 bg-minimal-black text-minimal-white flex flex-col h-screen border-r border-minimal-gray-700 flex-shrink-0 z-10">
      {/* Header with logo */}
      <div className="p-3 border-b border-minimal-gray-700 flex items-center">
        <Logo 
          withText={true} 
          size="md" 
          className="text-minimal-white" 
          projectName="mizi-project-1"
          showProjectArrow={true}
        />
        
        <div className="ml-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0 text-minimal-gray-400 hover:text-minimal-white hover:bg-minimal-gray-800"
            onClick={() => console.log("History clicked")}
          >
            <History size={16} />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Use ChatMessageList for better scroll handling */}
        <ChatMessageList className="flex-1 pb-1 pt-2">
          {messages.map((message, index) => (
            <ChatBubble 
              key={index}
              variant={message.role === "user" ? "sent" : "received"}
              className="animate-fade-in"
            >
              {message.role === "assistant" && (
                <ChatBubbleAvatar fallback="M" className="bg-gradient-to-br from-purple-600 to-orange-500" />
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
        </ChatMessageList>
        
        <div className="p-3 border-t border-minimal-gray-700 bg-minimal-gray-900/50">
          <div className="relative">
            <ChatInput 
              value={input}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              placeholder="Ask Mizi..."
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

          {/* Controls row with attachment and template buttons - more compact */}
          <div className="flex items-center justify-between mt-2 px-1">
            {/* Template Button */}
            <Popover open={isTemplateMenuOpen} onOpenChange={setIsTemplateMenuOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 py-0 text-minimal-gray-400 hover:text-minimal-white hover:bg-minimal-gray-800 flex items-center gap-1"
                >
                  <FileText size={14} />
                  <span className="text-xs">Template</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top" align="start" sideOffset={5} className="p-0 w-72">
                <TemplateConfigMenu 
                  onApplyTemplate={handleApplyTemplate}
                  onClose={() => setIsTemplateMenuOpen(false)}
                />
              </PopoverContent>
            </Popover>
            
            {/* Attachment Button */}
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
                  className="h-6 px-2 py-0 text-minimal-gray-400 hover:text-minimal-white hover:bg-minimal-gray-800 flex items-center gap-1"
                  asChild
                >
                  <span>
                    <Paperclip size={14} />
                    <span className="text-xs">Attach</span>
                  </span>
                </Button>
              </label>
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
