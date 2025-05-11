import React, { useState, useRef, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Message, ContentType } from "@/types/outbound";
import ChatSidebar from "@/components/outbound/ChatSidebar";
import CopyPreview from "@/components/outbound/CopyPreview";
import ProspectCard from "@/components/outbound/ProspectCard";
import ProspectFilters from "@/components/outbound/ProspectFilters";
import { mockProspects } from "@/data/prospects";

const OutboundGenerator = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [contentType, setContentType] = useState<ContentType>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState({
    email: "Assunto: Aumente seus resultados com nossa solução inovadora\n\nOlá Maria,\n\nEspero que esteja tudo bem.\n\nEstou entrando em contato porque notei que a TechSolutions tem se destacado no setor de tecnologia, e acredito que nossa solução pode ajudar a potencializar ainda mais seus resultados.\n\nNossos clientes têm obtido:\n• 32% de aumento em conversões\n• Redução de 27% nos custos operacionais\n• ROI positivo em menos de 60 dias\n\nGostaria de compartilhar como aplicamos nossa metodologia para empresas similares à TechSolutions. Podemos agendar 15 minutos para uma demonstração personalizada na próxima semana?\n\nAtenciosamente,\nCarlos Santos\nInova Digital\ncarlos@inovadigital.com",
    linkedin: "Olá Maria! \n\nTenho acompanhado o trabalho da TechSolutions e fiquei realmente impressionado com os resultados que vocês têm alcançado no mercado de tecnologia.\n\nTrabalho com uma solução que tem ajudado empresas como a DataPro a aumentarem suas conversões em 32% e reduzirem custos operacionais em quase um terço.\n\nSeria interessante conversarmos sobre como poderíamos aplicar essa abordagem ao contexto específico da TechSolutions?\n\nPosso compartilhar alguns casos práticos em uma conversa rápida de 15 minutos.\n\nAguardo seu retorno!\n\nCarlos Santos\nInova Digital"
  });
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Prospect handling
  const [currentProspectIndex, setCurrentProspectIndex] = useState(0);
  const [filters, setFilters] = useState({
    industry: "",
    companySize: "",
    seniority: "",
    location: ""
  });
  const [filteredProspects, setFilteredProspects] = useState(mockProspects);

  // Filter prospects
  useEffect(() => {
    let result = mockProspects;
    
    if (filters.industry && filters.industry !== "all") {
      result = result.filter(p => p.industry === filters.industry);
    }
    
    if (filters.companySize && filters.companySize !== "all") {
      result = result.filter(p => p.companySize === filters.companySize);
    }
    
    if (filters.seniority && filters.seniority !== "all") {
      result = result.filter(p => p.jobTitle.includes(filters.seniority));
    }
    
    if (filters.location && filters.location !== "all") {
      result = result.filter(p => p.location === filters.location);
    }
    
    setFilteredProspects(result);
    setCurrentProspectIndex(0);
  }, [filters]);

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

Olá Maria,

Espero que esta mensagem a encontre bem.

Percebi que a TechSolutions tem investido em transformação digital, e gostaria de apresentar nossa ferramenta de software que está ajudando empresas similares a otimizarem seus processos.

Nosso software permite:
• Redução de 40% no tempo gasto em tarefas administrativas
• Aumento de 28% na produtividade da equipe
• Economia de até 22% em custos operacionais

Teria disponibilidade para uma breve demonstração de 15 minutos na próxima semana? Posso mostrar como nossa solução se aplicaria especificamente ao contexto da TechSolutions?

Atenciosamente,
Carlos Santos
Inova Digital | Diretor de Soluções
(11) 98765-4321`;

        newContent.linkedin = `Olá Maria! 

Acompanho o crescimento da TechSolutions e notei o destaque de vocês no setor de tecnologia.

Desenvolvi um software que tem ajudado empresas do mesmo segmento a aumentarem sua eficiência operacional em 32%, principalmente nas áreas de desenvolvimento e gestão de projetos.

Gostaria de compartilhar como isso poderia beneficiar diretamente a TechSolutions, baseado nos desafios que identificamos no mercado.

Podemos agendar 15 minutos para uma conversa na próxima semana?

Carlos Santos
Inova Digital`;
      } else if (input.toLowerCase().includes("serviço") || input.toLowerCase().includes("servico")) {
        botResponse = "Entendi que você oferece serviços. Criei um copy personalizado para sua oferta de serviços.";
        newContent.email = `Assunto: Como podemos elevar os resultados da TechSolutions com nossos serviços

Olá Maria,

Espero que esteja tudo bem.

Analisei o mercado em que a TechSolutions atua e identifiquei oportunidades onde nossos serviços de consultoria poderiam gerar impacto significativo para vocês.

Ao trabalhar com clientes como DataPro, conseguimos:
• Aumentar a retenção de clientes em 35%
• Melhorar as métricas de satisfação em 42%
• Reduzir custos operacionais em 20%

Gostaria de apresentar brevemente nossa abordagem e como ela se aplicaria especificamente aos desafios da TechSolutions.

Teria disponibilidade para uma conversa de 20 minutos na próxima semana?

Atenciosamente,
Carlos Santos
Inova Digital
(11) 98765-4321`;

        newContent.linkedin = `Olá Maria!

Como especialista em consultoria de tecnologia, tenho acompanhado o trabalho da TechSolutions e notei que poderíamos contribuir significativamente com seu crescimento.

Recentemente, ajudamos a DataPro a superar desafios muito parecidos com os que vocês enfrentam, resultando em 35% de aumento na retenção de clientes em apenas 3 meses de trabalho.

Seria possível uma breve conversa para mostrar como poderíamos aplicar essa metodologia ao contexto específico da TechSolutions?

Carlos Santos
Inova Digital`;
      } else {
        botResponse = "Baseado no que você compartilhou, preparei algumas sugestões de copy personalizadas para outbound. Você pode editá-las conforme sua necessidade específica.";
        newContent.email = `Assunto: Oportunidade para ampliar resultados na TechSolutions

Olá Maria,

Espero que esta mensagem a encontre bem.

Meu nome é Carlos Santos da Inova Digital, e temos ajudado organizações como a TechSolutions a superarem desafios semelhantes aos que vocês enfrentam atualmente no mercado.

Nossos clientes têm conseguido:
• 30% de aumento em vendas em apenas 90 dias
• Redução de 25% nos custos operacionais sem impactar qualidade
• 40% mais leads qualificados mesmo em cenários econômicos desafiadores

Gostaria de compartilhar brevemente como podemos aplicar essa mesma abordagem ao contexto específico da TechSolutions.

Teria disponibilidade para uma conversa de 15 minutos na próxima semana?

Atenciosamente,
Carlos Santos
Inova Digital | Diretor de Negócios
(11) 98765-4321`;

        newContent.linkedin = `Olá Maria!

Tenho acompanhado o trabalho da TechSolutions e fiquei impressionado com seu crescimento no último trimestre.

Na Inova Digital, desenvolvemos uma solução que tem ajudado empresas do seu setor a aumentarem seu ROI em 40%, mesmo em um cenário de mercado desafiador.

Gostaria de compartilhar como isso poderia se aplicar especificamente ao contexto da TechSolutions, considerando os desafios atuais que vocês enfrentam.

Podemos agendar uma conversa rápida na próxima semana?

Carlos Santos
Inova Digital`;
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

  const handlePreviousProspect = () => {
    setCurrentProspectIndex(prev => 
      prev > 0 ? prev - 1 : filteredProspects.length - 1
    );
  };

  const handleNextProspect = () => {
    setCurrentProspectIndex(prev => 
      prev < filteredProspects.length - 1 ? prev + 1 : 0
    );
  };

  const resetFilters = () => {
    setFilters({
      industry: "",
      companySize: "",
      seniority: "",
      location: ""
    });
  };

  return (
    <div className="flex h-full min-h-screen bg-white overflow-hidden font-sans">
      <ChatSidebar 
        messages={messages}
        input={input}
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onSendMessage={handleSendMessage}
        onKeyDown={handleKeyDown}
        chatEndRef={chatEndRef}
      />
      
      <div className="ml-80 flex-1 h-full overflow-y-auto pb-6">
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
