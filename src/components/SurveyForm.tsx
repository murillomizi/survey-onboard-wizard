import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Upload, Globe, Send, Linkedin } from "lucide-react";
import SurveySlider from "./SurveySlider";
import SurveySelect from "./SurveySelect";

const SurveyForm = () => {
  const [surveyData, setSurveyData] = useState({
    canal: "linkedin",
    csvFile: null as File | null,
    csvFileName: "",
    websiteUrl: "",
    tamanho: 350,
    touchpoints: "3",
    tomVoz: "neutro",
    template: "proposta",
    gatilhos: "sem-gatilho"
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    
    setSurveyData({
      ...surveyData,
      csvFile: file,
      csvFileName: file ? file.name : ""
    });
  };

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSurveyData({
      ...surveyData,
      websiteUrl: e.target.value
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Configurações salvas!",
      description: "Suas preferências de mensagem foram salvas com sucesso.",
    });
    
    console.log("Dados do formulário:", surveyData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-6 w-full max-w-md">
      {/* CSV upload field */}
      <div className="space-y-2">
        <Label htmlFor="csvUpload" className="text-survey-text font-medium flex items-center gap-2">
          <Upload size={18} className="text-survey-muted" />
          Base de prospecção
        </Label>
        <div className="flex items-center gap-2">
          <input
            type="file"
            id="csvUpload"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Input
            readOnly
            value={surveyData.csvFileName || ""}
            placeholder="Nenhum arquivo selecionado"
            className="bg-survey-card text-survey-text border-gray-700 flex-1"
          />
          <Button
            type="button"
            onClick={triggerFileInput}
            className="bg-survey-purple hover:bg-survey-purple/90 text-white"
          >
            Buscar
          </Button>
        </div>
        <p className="text-survey-muted text-sm italic">Importe sua base de prospecção em formato CSV</p>
      </div>

      {/* Website URL input */}
      <div className="space-y-2">
        <Label htmlFor="websiteUrl" className="text-survey-text font-medium flex items-center gap-2">
          <Globe size={18} className="text-survey-muted" />
          Site da empresa
        </Label>
        <Input
          id="websiteUrl"
          type="url"
          placeholder="https://exemplo.com.br"
          value={surveyData.websiteUrl}
          onChange={handleWebsiteChange}
          className="bg-survey-card text-survey-text border-gray-700"
        />
        <p className="text-survey-muted text-sm italic">Insira o site da empresa para personalização das mensagens</p>
      </div>

      <SurveySelect
        title="Canal"
        description="Escolha o canal de comunicação"
        icon="channel"
        options={[
          { value: "linkedin", label: "LinkedIn" },
          { value: "cold-email", label: "Cold E-mail" }
        ]}
        defaultValue={surveyData.canal}
        onChange={(value) => setSurveyData({ ...surveyData, canal: value })}
      />

      <SurveySlider
        title="Tamanho"
        recommendedText="Recomendado: 350-500 caracteres para maior impacto na comunicação"
        initialValue={surveyData.tamanho}
        max={500}
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
