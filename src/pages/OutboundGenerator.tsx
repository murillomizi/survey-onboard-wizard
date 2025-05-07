
import React, { useState, useRef, useEffect } from "react";
import { 
  Copy, 
  Send, 
  MessageSquare 
} from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat-input";
import { toast } from "@/components/ui/use-toast";
import { 
  ChatMessageList
} from "@/components/ui/chat-message-list";
import { 
  ChatBubble, 
  ChatBubbleMessage, 
  ChatBubbleAvatar 
} from "@/components/ui/chat-bubble";
import Logo from "@/components/ui/logo";

type Message = {
  content: string;
  role: "user" | "assistant";
  isLoading?: boolean;
};

type ContentType = "email" | "linkedin";

const OutboundGenerator = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Olá! Eu sou seu assistente para criação de cópias de outbound. Como posso ajudar hoje? Você pode me dar detalhes sobre seu público-alvo, produto ou serviço e objetivo da mensagem.",
      role: "assistant"
    }
  ]);
  const [input, setInput] = useState("");
  const [contentType, setContentType] = useState<ContentType>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState({
    email: "Aqui será exibido seu copy para email de outbound...",
    linkedin: "Aqui será exibido seu copy para mensagem de LinkedIn..."
  });
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom when new messages are added
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = { content: input, role: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // Set loading state
    setIsLoading(true);
    
    // Add temporary loading message
    setMessages(prev => [...prev, { content: "", role: "assistant", isLoading: true }]);
    
    // Simulate AI response (would be replaced with actual API call)
    setTimeout(() => {
      // Remove loading message
      setMessages(prev => prev.filter(msg => !msg.isLoading));
      
      let botResponse = "";
      let newContent = {
        email: generatedContent.email,
        linkedin: generatedContent.linkedin
      };
      
      // Simple logic to simulate response based on input
      if (input.toLowerCase().includes("software")) {
        botResponse = "Entendi que você trabalha com software. Criei um copy personalizado para seu produto de software.";
        newContent.email = `Assunto: Aumente a produtividade da sua equipe com nossa solução

Olá {nome},

Percebi que sua empresa tem investido em ferramentas digitais recentemente e acredito que nossa solução de software pode ajudar a otimizar ainda mais os processos da {empresa}.

Nossos clientes têm conseguido aumentar a produtividade em até 30% nos primeiros 3 meses de uso. Gostaria de uma breve demonstração de 15 minutos para mostrar como podemos ajudar especificamente o seu time?

Atenciosamente,
{seu nome}`;

        newContent.linkedin = `Olá {nome}! 

Acompanho o crescimento da {empresa} e notei que vocês estão expandindo a área de tecnologia. 

Nosso software tem ajudado empresas similares a reduzirem custos operacionais em 25%. 

Podemos conversar sobre como isso se aplicaria ao seu contexto? Tenho disponibilidade na próxima semana.`;
      } else if (input.toLowerCase().includes("serviço") || input.toLowerCase().includes("servico")) {
        botResponse = "Legal! Criei um copy personalizado para seu serviço de consultoria.";
        newContent.email = `Assunto: Transforme resultados com nossa consultoria especializada

Olá {nome},

Acompanhando o mercado, percebi que a {empresa} está enfrentando desafios similares aos que nossos atuais clientes superaram com nossa consultoria.

Temos ajudado empresas do seu segmento a aumentarem seus resultados em média 40% após implementarem nossas recomendações estratégicas.

Podemos marcar uma conversa de 20 minutos para discutir como podemos criar um plano personalizado para a {empresa}?

Atenciosamente,
{seu nome}`;

        newContent.linkedin = `Olá {nome}!

Sou especialista em {área da consultoria} e tenho trabalhado com empresas do setor de {setor} como a sua.

Recentemente ajudamos a {empresa similar} a superar o desafio de {problema comum} em apenas 2 meses de trabalho.

Seria interessante conversarmos sobre como podemos aplicar esta metodologia na {empresa}?`;
      } else {
        botResponse = "Baseado no que você compartilhou, preparei algumas sugestões de copy para outbound. Você pode personalizá-las conforme sua necessidade específica.";
        newContent.email = `Assunto: Oportunidade de parceria que pode interessar à {empresa}

Olá {nome},

Meu nome é {seu nome} da {sua empresa}, e estamos ajudando empresas como a {empresa} a superarem o desafio de {problema comum no setor}.

Nossos clientes têm conseguido {benefício principal} após implementarem nossa solução.

Teria disponibilidade para uma conversa de 15 minutos na próxima semana para explorarmos como podemos gerar resultados similares para você?

Atenciosamente,
{seu nome}`;

        newContent.linkedin = `Olá {nome}!

Vi que você trabalha na {empresa} como {cargo} e acredito que posso agregar valor ao seu trabalho.

Na {sua empresa}, temos ajudado profissionais como você a {benefício principal} através de {sua solução/produto}.

Podemos conversar sobre como isso poderia beneficiar especificamente os desafios que a {empresa} enfrenta atualmente?`;
      }
      
      setMessages(prev => [...prev, { content: botResponse, role: "assistant" }]);
      setGeneratedContent(newContent);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Conteúdo copiado!",
      description: "O texto foi copiado para a área de transferência."
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Chat LLM - Fixed sidebar with dark theme */}
      <div className="w-80 bg-minimal-black text-minimal-white flex flex-col h-full border-r border-minimal-gray-700 flex-shrink-0">
        {/* Header with logo */}
        <div className="p-4 border-b border-minimal-gray-700 flex items-center justify-center">
          <Logo size="md" />
        </div>
        
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <ChatBubble 
                key={index}
                variant={message.role === "user" ? "sent" : "received"}
              >
                {message.role === "assistant" && (
                  <ChatBubbleAvatar fallback="AI" />
                )}
                <ChatBubbleMessage 
                  variant={message.role === "user" ? "sent" : "received"}
                  isLoading={message.isLoading}
                  className={message.role === "user" ? "bg-minimal-gray-800" : "bg-minimal-gray-700"}
                >
                  {message.content}
                </ChatBubbleMessage>
              </ChatBubble>
            ))}
            <div ref={chatEndRef} />
          </div>
          
          <div className="p-4 border-t border-minimal-gray-700">
            <div className="relative flex items-center">
              <ChatInput 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Descreva seu produto ou serviço..."
                disabled={isLoading}
                className="pr-10 bg-minimal-gray-800 text-minimal-white border-minimal-gray-700"
              />
              <Button 
                size="icon" 
                className="absolute right-2 bg-transparent hover:bg-minimal-gray-700 text-minimal-white"
                onClick={handleSendMessage} 
                disabled={isLoading || !input.trim()}
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Preview de Copy - Conteúdo principal */}
      <div className="flex-1 bg-minimal-white p-6 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-center mb-6">Gerador de Copy para Outbound</h1>
          
          <Card className="border-minimal-gray-300 shadow-lg">
            <div className="p-4 bg-minimal-gray-100 border-b border-minimal-gray-300">
              <Tabs defaultValue="email" onValueChange={(value) => setContentType(value as ContentType)}>
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <CardContent className="flex-1 p-6">
              <div className="bg-minimal-white border border-minimal-gray-200 rounded-lg p-6 min-h-[400px] relative">
                <pre className="font-sans text-left whitespace-pre-wrap">
                  {contentType === "email" ? generatedContent.email : generatedContent.linkedin}
                </pre>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-minimal-white hover:bg-minimal-gray-100"
                  onClick={() => copyToClipboard(contentType === "email" ? generatedContent.email : generatedContent.linkedin)}
                >
                  <Copy size={16} className="mr-1" />
                  Copiar
                </Button>
              </div>
            </CardContent>
            
            <div className="p-4 border-t border-minimal-gray-300 flex justify-end">
              <button 
                className="bg-minimal-black hover:bg-minimal-gray-800 text-minimal-white px-6 py-2 rounded-md transition-all duration-200"
                onClick={() => {
                  toast({
                    title: "Copy exportado!",
                    description: "O conteúdo foi salvo em seus rascunhos."
                  });
                }}
              >
                Salvar Copy
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default OutboundGenerator;
