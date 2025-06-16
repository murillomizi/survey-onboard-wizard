import React, { useRef } from "react";
import ChatSidebar from "@/components/outbound/ChatSidebar";
import CopyPreview from "@/components/outbound/CopyPreview";
import { useOutboundState } from "@/hooks/useOutboundState";
import { useOutboundMessage } from "@/hooks/useOutboundMessage";
import { useOutboundContent } from "@/hooks/useOutboundContent";
import { useParams } from "react-router-dom";

const OutboundPage = () => {
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

  // Pega o surveyId da URL (usado internamente pelo CopyPreview)
  const { surveyId } = useParams();

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

export default OutboundPage; 