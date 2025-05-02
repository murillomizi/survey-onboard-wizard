
import React from "react";
import { SurveyData } from "./types";
import { getOptionLabel } from "./SurveySteps";

interface SurveySummaryProps {
  surveyData: SurveyData;
  csvFileName: string | null;
}

const SurveySummary = ({ surveyData, csvFileName }: SurveySummaryProps) => {
  return (
    <div>
      <p className="mb-2 text-gray-500">E-mail para recebimento: {surveyData.userEmail}</p>
      <p><strong>Canal:</strong> {getOptionLabel("canal", surveyData.canal)}</p>
      <p><strong>Estágio do Funil:</strong> {getOptionLabel("funnelStage", surveyData.funnelStage)}</p>
      <p><strong>Site:</strong> {surveyData.websiteUrl}</p>
      <p><strong>Tamanho:</strong> {surveyData.tamanho} caracteres</p>
      <p><strong>Tom de voz:</strong> {getOptionLabel("tomVoz", surveyData.tomVoz)}</p>
      <p><strong>Gatilhos:</strong> {getOptionLabel("gatilhos", surveyData.gatilhos)}</p>
      <p>
        <strong>Arquivo CSV:</strong> {csvFileName ? 
          `${csvFileName} - ${surveyData.csvData.length} registros carregados` : 
          "Nenhum arquivo carregado"
        }
      </p>
    </div>
  );
};

export default SurveySummary;
