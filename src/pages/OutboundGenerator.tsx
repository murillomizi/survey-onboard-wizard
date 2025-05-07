
import React, { useState, useRef, useEffect } from "react";
import { 
  Copy, 
  Send, 
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat-input";
import { toast } from "@/components/ui/use-toast";
import ChatMessage from "@/components/ChatMessage";

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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
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
      {/* Chat LLM - Dark theme fixed sidebar */}
      <div className="w-[350px] bg-minimal-black text-white flex flex-col h-full border-r border-gray-800">
        <div className="p-4 border-b border-gray-800 flex items-center gap-3">
          <MessageSquare size={20} />
          <h2 className="text-lg font-medium">Assistente de Outbound</h2>
        </div>
        
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                content={message.content}
                type={message.role === "user" ? "user" : "bot"}
                isTyping={message.isLoading}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t border-gray-800">
            <div className="relative">
              <ChatInput 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Descreva seu produto ou serviço..."
                disabled={isLoading}
                className="pr-10 bg-gray-800 text-white border-gray-700 focus-visible:ring-gray-600"
              />
              <Button 
                size="icon" 
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent hover:bg-gray-700 text-white"
                onClick={handleSendMessage} 
                disabled={isLoading || !input.trim()}
                aria-label="Enviar mensagem"
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Area - Clean, minimal design */}
      <div className="flex-1 bg-white overflow-y-auto">
        <div className="max-w-4xl mx-auto py-8 px-6 h-full flex flex-col">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-bold text-gray-900">Gerador de Copy para Outbound</h1>
            <p className="text-gray-600 mt-1">
              Crie mensagens personalizadas com base na conversa com nosso assistente
            </p>
          </motion.div>
          
          <Card className="flex-1 overflow-hidden shadow-sm border-gray-200">
            <CardHeader className="bg-gray-50 border-b border-gray-100 pb-2">
              <Tabs 
                defaultValue="email" 
                onValueChange={(value) => setContentType(value as ContentType)}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 w-[300px]">
                  <TabsTrigger value="email">Email de Outbound</TabsTrigger>
                  <TabsTrigger value="linkedin">Mensagem LinkedIn</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent className="p-0 flex-1 overflow-y-auto">
              <TabsContent value="email" className="m-0 p-0 h-full">
                <div className="p-6 h-full">
                  <div className="bg-white rounded-lg p-6 border border-gray-200 relative h-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-3 right-3 bg-white border-gray-200 hover:bg-gray-50"
                      onClick={() => copyToClipboard(generatedContent.email)}
                    >
                      <Copy size={15} className="mr-1" />
                      Copiar
                    </Button>
                    <div className="mt-6 text-left whitespace-pre-wrap font-sans text-gray-800">
                      {generatedContent.email}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="linkedin" className="m-0 p-0 h-full">
                <div className="p-6 h-full">
                  <div className="bg-white rounded-lg p-6 border border-gray-200 relative h-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-3 right-3 bg-white border-gray-200 hover:bg-gray-50"
                      onClick={() => copyToClipboard(generatedContent.linkedin)}
                    >
                      <Copy size={15} className="mr-1" />
                      Copiar
                    </Button>
                    <div className="mt-6 text-left whitespace-pre-wrap font-sans text-gray-800">
                      {generatedContent.linkedin}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
            
            <CardFooter className="px-4 py-3 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between items-center w-full">
                <p className="text-sm text-gray-500">
                  {contentType === "email" ? "Email de Outbound" : "Mensagem LinkedIn"}
                </p>
                <Button 
                  className="bg-black hover:bg-gray-800 text-white"
                  onClick={() => {
                    toast({
                      title: "Copy salvo!",
                      description: "O conteúdo foi salvo em seus rascunhos."
                    });
                  }}
                >
                  Salvar Copy
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OutboundGenerator;
