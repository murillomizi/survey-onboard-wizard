
import React, { useState } from "react";
import { Send, Edit, Paperclip } from "lucide-react";
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
  const [isFileInputOpen, setIsFileInputOpen] = useState(false);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log("File selected:", e.target.files[0].name);
      // Here you would handle the file upload
    }
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 w-80 bg-minimal-black text-minimal-white flex flex-col h-screen border-r border-minimal-gray-700 flex-shrink-0 z-10">
      {/* Header with logo */}
      <div className="p-4 border-b border-minimal-gray-700 flex items-center">
        <Logo 
          withText={true} 
          size="md" 
          className="text-minimal-white" 
          projectName="mizi-project-1"
          showProjectArrow={true}
        />
        
        <div className="ml-auto">
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
                Edit model
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs hover:bg-minimal-gray-700">
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs hover:bg-minimal-gray-700">
                Start new conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
        </div>
        
        <div className="p-4 border-t border-minimal-gray-700">
          <div className="bg-minimal-gray-900 rounded-lg flex items-center p-1">
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              onChange={handleFileInputChange} 
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button 
                size="icon" 
                variant="ghost"
                className="h-8 w-8 bg-transparent hover:bg-minimal-gray-800 text-minimal-gray-400 hover:text-minimal-white transition-colors rounded-md"
              >
                <Paperclip size={16} />
              </Button>
            </label>
            
            <ChatInput 
              value={input}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              placeholder="Ask Mizi..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 bg-transparent text-minimal-white border-0 focus-visible:ring-0 focus-visible:outline-none placeholder:text-minimal-gray-400 rounded-md resize-none h-9"
            />
            
            <Button 
              size="icon" 
              className="h-8 w-8 bg-transparent hover:bg-minimal-gray-800 text-minimal-white transition-colors rounded-md"
              onClick={onSendMessage} 
              disabled={isLoading || !input.trim()}
            >
              <Send size={16} />
            </Button>
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
