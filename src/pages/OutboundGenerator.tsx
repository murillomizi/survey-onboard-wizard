
import React, { useState, useRef, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Message, ContentType } from "@/types/outbound";
import ChatSidebar from "@/components/outbound/ChatSidebar";
import CopyPreview from "@/components/outbound/CopyPreview";

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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleContentTypeChange = (value: string) => {
    setContentType(value as ContentType);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <ChatSidebar 
        messages={messages}
        input={input}
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onSendMessage={handleSendMessage}
        onKeyDown={handleKeyDown}
        chatEndRef={chatEndRef}
      />
      
      <CopyPreview 
        contentType={contentType}
        generatedContent={generatedContent}
        onContentTypeChange={handleContentTypeChange}
      />
    </div>
  );
};

export default OutboundGenerator;
