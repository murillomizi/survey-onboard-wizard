import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Send, Upload, Paperclip } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatOptions from "./ChatOptions";
import { Slider } from "@/components/ui/slider";

interface Message {
  id: number;
  content: React.ReactNode;
  type: "user" | "bot";
}

const ChatbotSurvey = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [showOptions, setShowOptions] = useState<{
    options: { value: string; label: string }[];
    step: number;
  } | null>(null);
  const [showSlider, setShowSlider] = useState(false);
  const [sliderValue, setSliderValue] = useState(350);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [surveyData, setSurveyData] = useState({
    canal: "",
    funnelStage: "",
    csvFile: null as File | null,
    csvFileName: "",
    websiteUrl: "",
    tamanho: 350,
    touchpoints: "",
    tomVoz: "",
    template: "",
    gatilhos: ""
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const steps = [
    {
      question: "Olá! Vamos configurar sua sequência de mensagens. Qual canal você quer usar para sua comunicação?",
      options: [
        { value: "linkedin", label: "LinkedIn" },
        { value: "cold-email", label: "Cold E-mail" }
      ],
      field: "canal"
    },
    {
      question: "Ótimo! Em que estágio do funil de vendas está sua base de contatos?",
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
      question: "Qual site da empresa você quer usar para personalizar as mensagens?",
      field: "websiteUrl",
      inputType: "text"
    },
    {
      question: "Vamos definir o tamanho da sua mensagem. Mova o controle deslizante para escolher o número de caracteres (recomendado: 350-500 caracteres para maior impacto):",
      field: "tamanho",
      inputType: "slider"
    },
    {
      question: "Quantos touchpoints você planeja para esta sequência?",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" }
      ],
      field: "touchpoints"
    },
    {
      question: "Qual tom de voz você prefere para suas mensagens?",
      options: [
        { value: "amigavel", label: "Amigável" },
        { value: "neutro", label: "Neutro" },
        { value: "formal", label: "Formal" },
        { value: "autoritario", label: "Autoritário" }
      ],
      field: "tomVoz"
    },
    {
      question: "Qual template você gostaria de usar?",
      options: [
        { value: "proposta", label: "Proposta de Valor" },
        { value: "solucao", label: "Solução de Problema" },
        { value: "case", label: "Case de Sucesso" },
        { value: "desconto", label: "Oferta com Desconto" }
      ],
      field: "template"
    },
    {
      question: "Por último, gostaria de aplicar algum gatilho de persuasão?",
      options: [
        { value: "sem-gatilho", label: "Sem gatilho" },
        { value: "escassez", label: "Escassez" },
        { value: "urgencia", label: "Urgência" },
        { value: "social", label: "Prova Social" }
      ],
      field: "gatilhos"
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

  const addMessage = (content: React.ReactNode, type: "user" | "bot") => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), content, type }
    ]);
  };

  useEffect(() => {
    if (messages.length === 0) {
      addMessage(steps[0].question, "bot");
      
      if (steps[0].options) {
        setShowOptions({
          options: steps[0].options,
          step: 0
        });
      }
    }
  }, []);

  const handleSendMessage = () => {
    if (!currentInput.trim() && !showSlider) return;

    setShowOptions(null);
    setShowSlider(false);
    setIsWaitingForResponse(true);

    const currentStepData = steps[currentStep];
    
    if (currentStepData.field === "websiteUrl") {
      addMessage(currentInput, "user");
      setSurveyData({ ...surveyData, websiteUrl: currentInput });
    }

    setCurrentInput("");

    setTimeout(() => {
      setIsWaitingForResponse(false);
      moveToNextStep();
    }, 1000);
  };

  const handleOptionSelect = (value: string) => {
    if (!showOptions) return;
    
    const selectedOption = showOptions.options.find(opt => opt.value === value);
    if (!selectedOption) return;

    setShowOptions(null);
    setIsWaitingForResponse(true);

    addMessage(selectedOption.label, "user");

    const fieldName = steps[currentStep].field as keyof typeof surveyData;
    setSurveyData(prev => ({ ...prev, [fieldName]: value }));

    setTimeout(() => {
      setIsWaitingForResponse(false);
      moveToNextStep();
    }, 1000);
  };

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value[0]);
  };

  const handleSliderComplete = () => {
    addMessage(`${sliderValue} caracteres`, "user");
    setSurveyData({ ...surveyData, tamanho: sliderValue });
    setShowSlider(false);
    setIsWaitingForResponse(true);

    setTimeout(() => {
      setIsWaitingForResponse(false);
      moveToNextStep();
    }, 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type !== "text/csv") {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo CSV.",
        variant: "destructive"
      });
      return;
    }
    
    if (file) {
      addMessage(`Arquivo: ${file.name}`, "user");
      setSurveyData({
        ...surveyData,
        csvFile: file,
        csvFileName: file.name
      });
      
      setIsWaitingForResponse(true);
      setTimeout(() => {
        setIsWaitingForResponse(false);
        moveToNextStep();
      }, 1000);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const moveToNextStep = () => {
    const nextStep = currentStep + 1;
    
    if (nextStep < steps.length) {
      setCurrentStep(nextStep);
      addMessage(steps[nextStep].question, "bot");
      
      if (steps[nextStep].options) {
        setShowOptions({
          options: steps[nextStep].options,
          step: nextStep
        });
      }
      
      if (steps[nextStep].inputType === "slider") {
        setShowSlider(true);
      }
      
      if (steps[nextStep].inputType === "summary") {
        const summaryContent = (
          <div>
            <p><strong>Canal:</strong> {getOptionLabel("canal", surveyData.canal)}</p>
            <p><strong>Estágio do Funil:</strong> {getOptionLabel("funnelStage", surveyData.funnelStage)}</p>
            <p><strong>Site:</strong> {surveyData.websiteUrl}</p>
            <p><strong>Tamanho:</strong> {surveyData.tamanho} caracteres</p>
            <p><strong>Touchpoints:</strong> {surveyData.touchpoints}</p>
            <p><strong>Tom de voz:</strong> {getOptionLabel("tomVoz", surveyData.tomVoz)}</p>
            <p><strong>Template:</strong> {getOptionLabel("template", surveyData.template)}</p>
            <p><strong>Gatilhos:</strong> {getOptionLabel("gatilhos", surveyData.gatilhos)}</p>
            <p><strong>Arquivo:</strong> {surveyData.csvFileName || "Nenhum arquivo selecionado"}</p>
          </div>
        );
        addMessage(summaryContent, "bot");
        
        setTimeout(() => {
          addMessage("Tudo pronto para continuar?", "bot");
        }, 1000);
      }
    } else {
      addMessage("Obrigado por completar a pesquisa! Clique em 'Continuar' para prosseguir.", "bot");
    }
  };

  const getOptionLabel = (field: string, value: string): string => {
    const step = steps.find(s => s.field === field);
    if (!step || !step.options) return value;
    
    const option = step.options.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const handleSubmit = () => {
    toast({
      title: "Configurações salvas!",
      description: "Suas preferências de mensagem foram salvas com sucesso.",
    });
    
    console.log("Dados do formulário:", surveyData);
  };

  return (
    <div className="flex flex-col h-[600px] bg-survey-bg rounded-lg shadow-lg">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            type={message.type}
          />
        ))}
        
        {isWaitingForResponse && (
          <ChatMessage content="..." type="bot" isTyping={true} />
        )}
        
        {showOptions && (
          <div className="mb-4">
            <ChatOptions
              options={showOptions.options}
              onSelect={handleOptionSelect}
            />
          </div>
        )}
        
        {showSlider && (
          <div className="mb-4 p-4 bg-survey-card rounded-lg">
            <div className="mb-2">
              <span className="text-survey-text">{sliderValue} caracteres</span>
            </div>
            <Slider
              defaultValue={[350]}
              max={1000}
              step={10}
              value={[sliderValue]}
              onValueChange={handleSliderChange}
              onValueCommit={handleSliderComplete}
              className="mb-2"
            />
            <p className="text-survey-muted text-sm italic">
              Recomendado: 350-500 caracteres para maior impacto
            </p>
            <Button 
              onClick={handleSliderComplete}
              className="mt-2 bg-survey-purple hover:bg-survey-purple/90 text-white"
            >
              Confirmar
            </Button>
          </div>
        )}
        
        {currentStep === 8 && (
          <div className="mb-4 bg-survey-card p-4 rounded-lg text-survey-text">
            <p className="font-semibold mb-2">🚀 Maximize a Personalização da IA</p>
            <p className="text-sm mb-2">
              Quanto mais dados você incluir no seu CSV, mais precisa e personalizada será a estratégia de comunicação.
            </p>
            <p className="text-xs text-survey-muted italic">
              Exemplos de dados úteis: nome completo, cargo, empresa, e-mail, histórico de interações, principais desafios, interesses profissionais, etc.
            </p>
          </div>
        )}
        
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div ref={chatEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-700 bg-survey-card">
        <div className="flex items-center gap-2">
          {currentStep === 8 && (
            <Button
              type="button"
              onClick={triggerFileUpload}
              className="bg-survey-purple hover:bg-survey-purple/90 text-white"
            >
              <Paperclip size={18} />
              Upload CSV
            </Button>
          )}
          
          {currentStep < 8 && showOptions === null && !showSlider && (
            <>
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Digite sua resposta..."
                className="flex-1 bg-survey-bg text-survey-text border-gray-700"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-survey-purple hover:bg-survey-purple/90 text-white"
              >
                <Send size={18} />
              </Button>
            </>
          )}
          
          {currentStep === steps.length - 1 && (
            <Button
              onClick={handleSubmit}
              className="w-full bg-survey-purple hover:bg-survey-purple/90 text-white"
            >
              Continuar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotSurvey;
