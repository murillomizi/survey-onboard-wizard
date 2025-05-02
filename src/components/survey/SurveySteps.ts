
import { SurveyStep } from "./types";

export const surveySteps: SurveyStep[] = [
  {
    question: "Olá! Vamos configurar sua sequência de mensagens. Escolha o canal para sua comunicação:",
    options: [
      { value: "linkedin", label: "LinkedIn" },
      { value: "cold-email", label: "Cold E-mail" }
    ],
    field: "canal"
  },
  {
    question: "Em que estágio do funil de vendas está sua base de contatos?",
    options: [
      { value: "topo", label: "Topo de Funil" },
      { value: "meio", label: "Meio de Funil" },
      { value: "fim", label: "Fim de Funil" },
      { value: "cliente", label: "Cliente Existente" },
      { value: "inbound", label: "Leads de Ação de Inbound" }
    ],
    field: "funnelStage"
  },
  {
    question: "Qual é o site da sua empresa?",
    field: "websiteUrl",
    inputType: "text"
  },
  {
    question: "Vamos definir o tamanho da sua mensagem. Mova o controle deslizante para escolher o número de caracteres (recomendado: 350-500 caracteres para maior impacto):",
    field: "tamanho",
    inputType: "slider"
  },
  {
    question: "Qual tom de voz você prefere para suas mensagens?",
    options: [
      { value: "formal", label: "Formal" },
      { value: "informal", label: "Informal" },
      { value: "neutro", label: "Neutro" },
      { value: "consultivo", label: "Consultivo" },
      { value: "curioso", label: "Curioso" },
      { value: "inovador", label: "Inovador" }
    ],
    field: "tomVoz"
  },
  {
    question: "Por último, gostaria de aplicar algum gatilho de persuasão?",
    options: [
      { value: "sem-gatilho", label: "Sem gatilho" },
      { value: "reciprocidade", label: "Reciprocidade" },
      { value: "compromisso", label: "Compromisso e Consistência" },
      { value: "prova-social", label: "Prova Social" },
      { value: "simpatia", label: "Simpatia" },
      { value: "autoridade", label: "Autoridade" },
      { value: "escassez", label: "Escassez" },
      { value: "consenso", label: "Consenso" }
    ],
    field: "gatilhos"
  },
  {
    question: "Qual é o e-mail onde você gostaria de receber sua base de contatos personalizada?",
    field: "userEmail",
    inputType: "text"
  },
  {
    question: "Agora, você pode fazer upload da sua base de prospecção em formato CSV. Quanto mais dados você fornecer, mais personalizada e precisa será a análise da IA!",
    description: "Dica: Inclua o máximo de informações possível, como nome, cargo, empresa, e-mail, histórico de interações, etc. Dados completos permitem que a IA crie estratégias de comunicação extremamente personalizadas e relevantes.",
    field: "csvFile",
    inputType: "file"
  },
  {
    question: "Perfeito! Aqui está o resumo das suas escolhas:",
    field: "summary",
    inputType: "summary"
  }
];

export const getOptionLabel = (field: string, value: string): string => {
  const step = surveySteps.find(s => s.field === field);
  if (!step || !step.options) return value;
  
  const option = step.options.find(opt => opt.value === value);
  return option ? option.label : value;
};
