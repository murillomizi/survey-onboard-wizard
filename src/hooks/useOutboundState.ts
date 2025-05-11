
import { useState } from "react";
import { Message, ContentType } from "@/types/outbound";
import { toast } from "@/components/ui/use-toast";

export const useOutboundState = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [contentType, setContentType] = useState<ContentType>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState({
    email: "Assunto: Aumente seus resultados com nossa solução inovadora\n\nOlá Maria,\n\nEspero que esteja tudo bem.\n\nEstou entrando em contato porque notei que a TechSolutions tem se destacado no setor de tecnologia, e acredito que nossa solução pode ajudar a potencializar ainda mais seus resultados.\n\nNossos clientes têm obtido:\n• 32% de aumento em conversões\n• Redução de 27% nos custos operacionais\n• ROI positivo em menos de 60 dias\n\nGostaria de compartilhar como aplicamos nossa metodologia para empresas similares à TechSolutions. Podemos agendar 15 minutos para uma demonstração personalizada na próxima semana?\n\nAtenciosamente,\nCarlos Santos\nInova Digital\ncarlos@inovadigital.com",
    linkedin: "Olá Maria! \n\nTenho acompanhado o trabalho da TechSolutions e fiquei realmente impressionado com os resultados que vocês têm alcançado no mercado de tecnologia.\n\nTrabalho com uma solução que tem ajudado empresas como a DataPro a aumentarem suas conversões em 32% e reduzirem custos operacionais em quase um terço.\n\nSeria interessante conversarmos sobre como poderíamos aplicar essa abordagem ao contexto específico da TechSolutions?\n\nPosso compartilhar alguns casos práticos em uma conversa rápida de 15 minutos.\n\nAguardo seu retorno!\n\nCarlos Santos\nInova Digital"
  });

  return {
    messages,
    setMessages,
    input,
    setInput,
    contentType,
    setContentType,
    isLoading,
    setIsLoading,
    generatedContent,
    setGeneratedContent,
  };
};
