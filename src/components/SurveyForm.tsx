
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import SurveySlider from "./SurveySlider";
import SurveySelect from "./SurveySelect";

const SurveyForm = () => {
  const [surveyData, setSurveyData] = useState({
    tamanho: 150,
    touchpoints: "3",
    tomVoz: "neutro",
    template: "proposta",
    gatilhos: "sem-gatilho"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Configurações salvas!",
      description: "Suas preferências de mensagem foram salvas com sucesso.",
    });
    
    console.log("Dados do formulário:", surveyData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full max-w-md">
      <SurveySlider
        title="Tamanho"
        recommendedText="Recomendado: 80-200 caracteres para maior taxa de resposta"
        initialValue={surveyData.tamanho}
        onChange={(value) => setSurveyData({ ...surveyData, tamanho: value })}
      />

      <SurveySelect
        title="Touchpoints"
        description="Número de interações planejadas para esta sequência"
        icon="touchpoints"
        options={[
          { value: "1", label: "1" },
          { value: "2", label: "2" },
          { value: "3", label: "3" },
          { value: "4", label: "4" },
          { value: "5", label: "5" }
        ]}
        defaultValue={surveyData.touchpoints}
        onChange={(value) => setSurveyData({ ...surveyData, touchpoints: value })}
      />

      <SurveySelect
        title="Tom de voz"
        description="Tom balanceado e objetivo"
        icon="voice"
        options={[
          { value: "amigavel", label: "Amigável" },
          { value: "neutro", label: "Neutro" },
          { value: "formal", label: "Formal" },
          { value: "autoritario", label: "Autoritário" }
        ]}
        defaultValue={surveyData.tomVoz}
        onChange={(value) => setSurveyData({ ...surveyData, tomVoz: value })}
      />

      <SurveySelect
        title="Template"
        description="Destaca o valor principal oferecido ao cliente"
        icon="template"
        options={[
          { value: "proposta", label: "Proposta de Valor" },
          { value: "solucao", label: "Solução de Problema" },
          { value: "case", label: "Case de Sucesso" },
          { value: "desconto", label: "Oferta com Desconto" }
        ]}
        defaultValue={surveyData.template}
        onChange={(value) => setSurveyData({ ...surveyData, template: value })}
      />

      <SurveySelect
        title="Gatilhos"
        description="Mensagem sem gatilhos de persuasão"
        icon="triggers"
        options={[
          { value: "sem-gatilho", label: "Sem gatilho" },
          { value: "escassez", label: "Escassez" },
          { value: "urgencia", label: "Urgência" },
          { value: "social", label: "Prova Social" }
        ]}
        defaultValue={surveyData.gatilhos}
        onChange={(value) => setSurveyData({ ...surveyData, gatilhos: value })}
      />

      <Button 
        type="submit" 
        className="mt-6 bg-survey-purple hover:bg-survey-purple/90 text-white"
      >
        Continuar
      </Button>
    </form>
  );
};

export default SurveyForm;
