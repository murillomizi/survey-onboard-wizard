
import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatSidebar from "@/components/outbound/ChatSidebar";
import CopyPreview from "@/components/outbound/CopyPreview";
import { useOutboundState } from "@/hooks/useOutboundState";
import { useOutboundMessage } from "@/hooks/useOutboundMessage";
import { useOutboundContent } from "@/hooks/useOutboundContent";
import { useAuth } from "@/contexts/AuthContext";

const OutboundGenerator = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
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
  
  // Ensure the user is logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Show loading state while checking auth
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

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
