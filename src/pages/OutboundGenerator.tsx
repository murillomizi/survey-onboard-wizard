
import React, { useState } from "react";
import { 
  Copy, 
  Send, 
  MessageSquare 
} from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ChatMessage from "@/components/ChatMessage";
import { ChatInput } from "@/components/ui/chat-input";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

type MessageType = {
  content: string;
  type: "user" | "bot";
};

type ContentType = "email" | "linkedin";

const OutboundGenerator = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      content: "Olá! Eu sou seu assistente para criação de cópias de outbound. Como posso ajudar hoje? Você pode me dar detalhes sobre seu público-alvo, produto ou serviço e objetivo da mensagem.",
      type: "bot"
    }
  ]);
  const [contentType, setContentType] = useState<ContentType>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState({
    email: "Aqui será exibido seu copy para email de outbound...",
    linkedin: "Aqui será exibido seu copy para mensagem de LinkedIn..."
  });

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    
    // Adiciona a mensagem do usuário
    setMessages([...messages, { content: message, type: "user" }]);
    
    // Simula carregamento
    setIsLoading(true);
    
    // Simula resposta do bot (em produção, seria uma chamada API)
    setTimeout(() => {
      let botResponse = "";
      let newContent = {
        email: generatedContent.email,
        linkedin: generatedContent.linkedin
      };
      
      // Lógica simples para simular resposta baseada no input
      if (message.toLowerCase().includes("software")) {
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
      } else if (message.toLowerCase().includes("serviço") || message.toLowerCase().includes("servico")) {
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
      
      // Atualiza estados
      setMessages(prevMessages => [...prevMessages, { content: botResponse, type: "bot" }]);
      setGeneratedContent(newContent);
      setIsLoading(false);
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Conteúdo copiado!",
      description: "O texto foi copiado para a área de transferência."
    });
  };

  return (
    <div className="container mx-auto py-6 min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold text-center mb-6">Gerador de Copy para Outbound</h1>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row gap-6 flex-1"
      >
        {/* Chat LLM - Lado esquerdo */}
        <Card className="w-full md:w-1/2 flex flex-col border-minimal-gray-300 shadow-lg">
          <div className="p-4 bg-minimal-gray-100 border-b border-minimal-gray-300 flex items-center gap-2">
            <MessageSquare size={20} />
            <h2 className="text-lg font-semibold">Chat Assistente</h2>
          </div>
          
          <div className="flex-1 flex flex-col h-[500px]">
            <ChatMessageList className="flex-1">
              {messages.map((msg, index) => (
                <ChatMessage 
                  key={index} 
                  content={msg.content} 
                  type={msg.type}
                  isTyping={index === messages.length - 1 && isLoading && msg.type === "bot"}
                />
              ))}
              {isLoading && (
                <ChatMessage 
                  content="" 
                  type="bot"
                  isTyping={true}
                />
              )}
            </ChatMessageList>
            
            <div className="p-4 border-t border-minimal-gray-300">
              <ChatInput 
                onSend={handleSendMessage}
                placeholder="Descreva seu produto ou serviço..."
                disabled={isLoading}
              />
            </div>
          </div>
        </Card>
        
        {/* Preview de Copy - Lado direito */}
        <Card className="w-full md:w-1/2 flex flex-col border-minimal-gray-300 shadow-lg">
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
            <Button 
              variant="default"
              className="bg-minimal-black hover:bg-minimal-gray-800"
              onClick={() => {
                toast({
                  title: "Copy exportado!",
                  description: "O conteúdo foi salvo em seus rascunhos."
                });
              }}
            >
              Salvar Copy
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default OutboundGenerator;
