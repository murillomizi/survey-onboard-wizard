
import React, { useRef, useEffect } from "react";
import ChatSidebar from "@/components/outbound/ChatSidebar";
import CopyPreview from "@/components/outbound/CopyPreview";
import { useOutboundState } from "@/hooks/useOutboundState";
import { useOutboundMessage } from "@/hooks/useOutboundMessage";
import { useOutboundContent } from "@/hooks/useOutboundContent";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const OutboundGenerator = () => {
  const { user } = useAuth();
  const {
    messages,
    setMessages,
    input,
    setInput,
    contentType,
    setContentType,
    isLoading,
    setIsLoading,
    generatedContent,
    setGeneratedContent
  } = useOutboundState();
  
  const {
    handleSendMessage,
    handleKeyDown,
    handleInputChange
  } = useOutboundMessage(
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    setIsLoading,
    generatedContent,
    setGeneratedContent
  );
  
  const {
    handleContentTypeChange,
    handleContentUpdate
  } = useOutboundContent(
    contentType,
    setContentType,
    generatedContent,
    setGeneratedContent
  );
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show welcome message when user first lands on this page
    if (user) {
      toast.success(`Bem-vindo ao gerador de campanhas, ${user.email?.split('@')[0] || 'usuário'}!`);
    }
  }, [user]);

  return (
    <div className="flex h-full min-h-screen bg-minimal-gray-100 overflow-hidden">
      <ChatSidebar 
        messages={messages}
        input={input}
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onSendMessage={handleSendMessage}
        onKeyDown={handleKeyDown}
        chatEndRef={chatEndRef}
      />
      
      <div className="ml-80 flex-1 h-full overflow-y-auto">
        <CopyPreview 
          contentType={contentType}
          generatedContent={generatedContent}
          onContentTypeChange={handleContentTypeChange}
          onContentUpdate={handleContentUpdate}
        />
      </div>
    </div>
  );
};

export default OutboundGenerator;
