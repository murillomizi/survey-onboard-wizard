
import React from "react";
import { Button } from "@/components/ui/button";
import SurveySlider from "./SurveySlider";
import SurveySelect from "./SurveySelect";
import LoadingOverlay from "./LoadingOverlay";
import FileUpload from "./survey/FileUpload";
import WebsiteInput from "./survey/WebsiteInput";
import { useSurveyForm } from "@/hooks/useSurveyForm";

const SurveyForm = () => {
  const {
    surveyData,
    setSurveyData,
    isProcessing,
    processedCount,
    totalCount,
    setTotalCount,
    isComplete,
    processingId,
    setParsedCsvData,
    handleSubmit,
    handleDownload
  } = useSurveyForm();

  const handleFileSelect = (file: File, data: any[]) => {
    setSurveyData({
      ...surveyData,
      csvFile: file,
      csvFileName: file.name
    });
    setParsedCsvData(data);
    setTotalCount(data.length);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6 w-full max-w-md">
        <FileUpload
          fileName={surveyData.csvFileName}
          onFileSelect={handleFileSelect}
        />

        <WebsiteInput
          value={surveyData.websiteUrl}
          onChange={(value) => setSurveyData({ ...surveyData, websiteUrl: value })}
        />

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
          max={1000}
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
          disabled={isProcessing}
        >
          {isProcessing ? "Processando..." : "Continuar"}
        </Button>
      </form>

      {isProcessing && (
        <LoadingOverlay 
          processedCount={processedCount}
          totalCount={totalCount}
          isComplete={isComplete}
          onDownload={handleDownload}
          surveyId={processingId}
        />
      )}
    </>
  );
};

export default SurveyForm;
