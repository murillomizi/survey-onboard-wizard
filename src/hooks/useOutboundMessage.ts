import { RefObject } from "react";
import { Message } from "@/types/outbound";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const useOutboundMessage = (
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  input: string,
  setInput: React.Dispatch<React.SetStateAction<string>>,
  isLoading: boolean,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  generatedContent: { email: string; linkedin: string },
  setGeneratedContent: React.Dispatch<React.SetStateAction<{ email: string; linkedin: string }>>,
  setShowOnboarding: React.Dispatch<React.SetStateAction<boolean>>,
  setInitialDialogTab: React.Dispatch<React.SetStateAction<string>>,
  setShowLoginDialog: React.Dispatch<React.SetStateAction<boolean>>
) => {

  const { user } = useAuth();

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
        botResponse = "I understand you work with software. I've created a personalized copy for your software product.";
        // Keep the Portuguese content for the email and LinkedIn examples
        newContent.email = `Assunto: Transforme a eficiência da sua equipe com nossa solução de software

Olá Maria,

Espero que esta mensagem a encontre bem.

Percebi que a TechSolutions tem investido em transformação digital, e gostaria de apresentar nossa ferramenta de software que está ajudando empresas similares a otimizarem seus processos.

Nosso software permite:
• Redução de 40% no tempo gasto em tarefas administrativas
• Aumento de 28% na produtividade da equipe
• Economia de até 22% em custos operacionais

Teria disponibilidade para uma breve demonstração de 15 minutos na próxima semana? Posso mostrar como nossa solução se aplicaria especificamente ao contexto da TechSolutions.

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
        botResponse = "I understand you offer services. I've created a personalized copy for your service offering.";
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
        botResponse = "Based on what you shared, I've prepared some personalized outbound copy suggestions. You can edit them to match your specific needs.";
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

  const handleAskMizi = () => {
    if (user) {
      setShowOnboarding(true); // Usuário logado: abre direto o onboarding
    } else {
      setInitialDialogTab("register"); // Usuário não logado: pede cadastro/login
      setShowLoginDialog(true);
    }
  };

  return {
    handleSendMessage,
    handleKeyDown,
    handleInputChange,
    handleAskMizi,
  };
};
