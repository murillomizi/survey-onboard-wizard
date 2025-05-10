
import React, { useState, useRef, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Message, ContentType } from "@/types/outbound";
import ChatSidebar from "@/components/outbound/ChatSidebar";
import CopyPreview from "@/components/outbound/CopyPreview";

const OutboundGenerator = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [contentType, setContentType] = useState<ContentType>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState({
    email: "Assunto: Aumente seus resultados com nossa solução inovadora\n\nOlá {nome},\n\nEspero que esteja tudo bem.\n\nEstou entrando em contato porque notei que a {empresa} tem se destacado no setor de {setor}, e acredito que nossa solução pode ajudar a potencializar ainda mais seus resultados.\n\nNossos clientes têm obtido:\n• 32% de aumento em conversões\n• Redução de 27% nos custos operacionais\n• ROI positivo em menos de 60 dias\n\nGostaria de compartilhar como aplicamos nossa metodologia para empresas similares à {empresa}. Podemos agendar 15 minutos para uma demonstração personalizada na próxima semana?\n\nAtenciosamente,\n{seu nome}\n{sua empresa}\n{seu contato}",
    linkedin: "Olá {nome}! \n\nTenho acompanhado o trabalho da {empresa} e fiquei realmente impressionado com os resultados que vocês têm alcançado no mercado de {setor}.\n\nTrabalho com uma solução que tem ajudado empresas como a {empresa concorrente} a aumentarem suas conversões em 32% e reduzirem custos operacionais em quase um terço.\n\nSeria interessante conversarmos sobre como poderíamos aplicar essa abordagem ao contexto específico da {empresa}?\n\nPosso compartilhar alguns casos práticos em uma conversa rápida de 15 minutos.\n\nAguardo seu retorno!"
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
        newContent.email = `Assunto: Transforme a eficiência da sua equipe com nossa solução de software

Olá {nome},

Espero que esta mensagem o encontre bem.

Percebi que a {empresa} tem investido em transformação digital, e gostaria de apresentar nossa ferramenta de software que está ajudando empresas similares a otimizarem seus processos.

Nosso software permite:
• Redução de 40% no tempo gasto em tarefas administrativas
• Aumento de 28% na produtividade da equipe
• Economia de até 22% em custos operacionais

Teria disponibilidade para uma breve demonstração de 15 minutos na próxima semana? Posso mostrar como nossa solução se aplicaria especificamente ao contexto da {empresa}.

Atenciosamente,
{seu nome}
{sua empresa} | {seu cargo}
{seu telefone}`;

        newContent.linkedin = `Olá {nome}! 

Acompanho o crescimento da {empresa} e notei o destaque de vocês no setor de tecnologia.

Desenvolvi um software que tem ajudado empresas do mesmo segmento a aumentarem sua eficiência operacional em 32%, principalmente nas áreas de {área específica}.

Gostaria de compartilhar como isso poderia beneficiar diretamente a {empresa}, baseado nos desafios que identificamos no mercado.

Podemos agendar 15 minutos para uma conversa na próxima semana?`;
      } else if (input.toLowerCase().includes("serviço") || input.toLowerCase().includes("servico")) {
        botResponse = "Entendi que você oferece serviços. Criei um copy personalizado para sua oferta de serviços.";
        newContent.email = `Assunto: Como podemos elevar os resultados da {empresa} com nossos serviços

Olá {nome},

Espero que esteja tudo bem.

Analisei o mercado em que a {empresa} atua e identifiquei oportunidades onde nossos serviços de {tipo de serviço} poderiam gerar impacto significativo para vocês.

Ao trabalhar com clientes como {empresa similar}, conseguimos:
• Aumentar a retenção de clientes em 35%
• Melhorar as métricas de satisfação em 42%
• Reduzir custos operacionais em 20%

Gostaria de apresentar brevemente nossa abordagem e como ela se aplicaria especificamente aos desafios da {empresa}.

Teria disponibilidade para uma conversa de 20 minutos na próxima semana?

Atenciosamente,
{seu nome}
{sua empresa}
{seu telefone}`;

        newContent.linkedin = `Olá {nome}!

Como especialista em {área de serviço}, tenho acompanhado o trabalho da {empresa} e notei que poderíamos contribuir significativamente com seu crescimento.

Recentemente, ajudamos a {empresa similar} a superar desafios muito parecidos com os que vocês enfrentam, resultando em {benefício específico} em apenas {período} de trabalho.

Seria possível uma breve conversa para mostrar como poderíamos aplicar essa metodologia ao contexto específico da {empresa}?`;
      } else {
        botResponse = "Baseado no que você compartilhou, preparei algumas sugestões de copy personalizadas para outbound. Você pode editá-las conforme sua necessidade específica.";
        newContent.email = `Assunto: Oportunidade para ampliar resultados na {empresa}

Olá {nome},

Espero que esta mensagem o encontre bem.

Meu nome é {seu nome} da {sua empresa}, e temos ajudado organizações como a {empresa} a superarem desafios semelhantes aos que vocês enfrentam atualmente no mercado.

Nossos clientes têm conseguido:
• {benefício principal} em {período curto}
• {segundo benefício} sem aumentar custos operacionais
• {terceiro benefício} mesmo em cenários econômicos desafiadores

Gostaria de compartilhar brevemente como podemos aplicar essa mesma abordagem ao contexto específico da {empresa}.

Teria disponibilidade para uma conversa de 15 minutos na próxima semana?

Atenciosamente,
{seu nome}
{sua empresa} | {seu cargo}
{seu telefone}`;

        newContent.linkedin = `Olá {nome}!

Tenho acompanhado o trabalho da {empresa} e fiquei impressionado com {conquista/característica da empresa}.

Na {sua empresa}, desenvolvemos uma solução que tem ajudado empresas do seu setor a {benefício principal}, mesmo em um cenário de mercado desafiador.

Gostaria de compartilhar como isso poderia se aplicar especificamente ao contexto da {empresa}, considerando os desafios atuais que vocês enfrentam.

Podemos agendar uma conversa rápida na próxima semana?`;
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

  const handleContentUpdate = (type: ContentType, newContent: string) => {
    setGeneratedContent(prev => ({
      ...prev,
      [type]: newContent
    }));
    
    toast({
      title: "Copy atualizado",
      description: `O conteúdo do ${type === "email" ? "email" : "LinkedIn"} foi atualizado com sucesso.`
    });
  };

  return (
    <div className="flex h-screen bg-minimal-gray-100">
      <ChatSidebar 
        messages={messages}
        input={input}
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onSendMessage={handleSendMessage}
        onKeyDown={handleKeyDown}
        chatEndRef={chatEndRef}
      />
      
      <div className="ml-80 flex-1 h-full overflow-hidden">
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
