
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Copy, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ChatMessage } from "@/components/ui/chat-bubble";
import { ChatInput } from "@/components/ui/chat-input";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { useToast } from "@/components/ui/use-toast";

// Tipo para mensagens
type Message = {
  id: string;
  content: string;
  type: "user" | "bot";
};

// Tipo para os previews gerados
type GeneratedContent = {
  email: string;
  linkedin: string;
};

const ChatGenerator = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Olá! Sou o assistente da Mizi. Como posso ajudar você a criar mensagens personalizadas hoje?",
      type: "bot",
    },
  ]);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("email");
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>({
    email: "",
    linkedin: "",
  });
  
  const { toast } = useToast();

  // Função para enviar mensagem
  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;
    
    // Adiciona mensagem do usuário
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content,
      type: "user",
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setIsWaitingForResponse(true);
    
    // Simula resposta da API (substitua por chamada real à API)
    setTimeout(() => {
      // Simula resposta do bot
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Estou gerando conteúdo personalizado com base na sua solicitação...",
        type: "bot",
      };
      
      setMessages((prev) => [...prev, botResponse]);
      setIsWaitingForResponse(false);
      
      // Simula conteúdo gerado (substitua por dados reais da API)
      setGeneratedContent({
        email: `Olá [Nome],\n\nEspero que esteja bem. Gostaria de apresentar nossa solução que pode ajudar sua empresa a ${content}.\n\nPodemos conversar sobre como podemos colaborar?\n\nAtenciosamente,\n[Seu Nome]`,
        linkedin: `Olá [Nome]! Vi seu perfil e fiquei interessado em conectar. Nossa empresa tem soluções que podem ajudar com ${content}. Podemos conversar sobre possíveis sinergias?`
      });
    }, 2000);
  };

  // Copia o conteúdo para a área de transferência
  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Conteúdo copiado!",
      description: "O texto foi copiado para a área de transferência.",
      duration: 3000,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-minimal-gray-100">
      {/* Header */}
      <header className="bg-minimal-white border-b border-minimal-gray-200 py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-minimal-black">Mizi AI Generator</h1>
          <Button variant="outline" className="border-minimal-gray-300 hover:bg-minimal-gray-100">
            Voltar para Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-160px)]">
          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-minimal-white rounded-lg border border-minimal-gray-200 shadow-sm overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-minimal-gray-200">
              <h2 className="text-lg font-semibold text-minimal-black">Chat com Mizi AI</h2>
              <p className="text-sm text-minimal-gray-600">Descreva o que você precisa para gerar mensagens personalizadas</p>
            </div>
            
            <div className="flex-grow overflow-auto p-4">
              <ChatMessageList>
                {messages.map((message) => (
                  <ChatMessage variant={message.type === "user" ? "sent" : "received"} key={message.id}>
                    {message.type === "user" ? (
                      <ChatBubbleMessage variant="sent">
                        {message.content}
                      </ChatBubbleMessage>
                    ) : (
                      <ChatBubbleMessage variant="received">
                        {message.content}
                      </ChatBubbleMessage>
                    )}
                  </ChatMessage>
                ))}
              </ChatMessageList>
            </div>
            
            <div className="p-4 border-t border-minimal-gray-200">
              <ChatInput
                placeholder="Digite sua mensagem..."
                onSend={handleSendMessage}
                disabled={isWaitingForResponse}
              />
            </div>
          </motion.div>
          
          {/* Preview Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-minimal-white rounded-lg border border-minimal-gray-200 shadow-sm overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-minimal-gray-200">
              <h2 className="text-lg font-semibold text-minimal-black">Preview</h2>
              <p className="text-sm text-minimal-gray-600">Visualize e copie suas mensagens personalizadas</p>
            </div>
            
            <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
              <div className="px-4 pt-2">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="email" className="flex items-center gap-2">
                    <Mail size={16} />
                    <span>Email</span>
                  </TabsTrigger>
                  <TabsTrigger value="linkedin" className="flex items-center gap-2">
                    <MessageCircle size={16} />
                    <span>LinkedIn</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="flex-grow overflow-auto">
                <TabsContent value="email" className="h-full mt-0 p-4">
                  <Card className="border-2 border-dashed border-minimal-gray-200 h-full">
                    <CardContent className="p-4 h-full flex flex-col">
                      <div className="flex-grow whitespace-pre-wrap overflow-auto">
                        {generatedContent.email || "O conteúdo do email aparecerá aqui após ser gerado."}
                      </div>
                      {generatedContent.email && (
                        <Button 
                          className="mt-4 self-end" 
                          variant="outline" 
                          onClick={() => handleCopyContent(generatedContent.email)}
                        >
                          <Copy size={16} className="mr-2" />
                          Copiar Email
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="linkedin" className="h-full mt-0 p-4">
                  <Card className="border-2 border-dashed border-minimal-gray-200 h-full">
                    <CardContent className="p-4 h-full flex flex-col">
                      <div className="flex-grow whitespace-pre-wrap overflow-auto">
                        {generatedContent.linkedin || "O conteúdo da mensagem para LinkedIn aparecerá aqui após ser gerado."}
                      </div>
                      {generatedContent.linkedin && (
                        <Button 
                          className="mt-4 self-end" 
                          variant="outline" 
                          onClick={() => handleCopyContent(generatedContent.linkedin)}
                        >
                          <Copy size={16} className="mr-2" />
                          Copiar Mensagem
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

// Extraindo o componente ChatBubbleMessage do chat-bubble.tsx para uso local
const ChatBubbleMessage: React.FC<{
  variant?: "sent" | "received";
  children: React.ReactNode;
}> = ({ variant = "received", children }) => {
  return (
    <div
      className={`rounded-lg p-3 ${
        variant === "sent" 
          ? "bg-minimal-black text-minimal-white" 
          : "bg-minimal-gray-100 text-minimal-black"
      }`}
    >
      {children}
    </div>
  );
};

export default ChatGenerator;
