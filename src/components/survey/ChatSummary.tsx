
import React from "react";

interface ChatSummaryProps {
  surveyData: {
    canal: string;
    funnelStage: string;
    websiteUrl: string;
    tamanho: number;
    tomVoz: string;
    gatilhos: string;
  };
  csvFileName: string;
  totalCount: number;
}

// Helper function to get readable labels for options
const getReadableLabel = (field: string, value: string): string => {
  const optionMaps: Record<string, Record<string, string>> = {
    canal: {
      'linkedin': 'LinkedIn',
      'cold-email': 'Cold Email'
    },
    funnelStage: {
      'topo': 'Topo de Funil',
      'meio': 'Meio de Funil',
      'fim': 'Fim de Funil',
      'cliente': 'Cliente',
      'inbound': 'Inbound'
    },
    tomVoz: {
      'formal': 'Formal',
      'informal': 'Informal',
      'neutro': 'Neutro',
      'consultivo': 'Consultivo',
      'curioso': 'Curioso',
      'inovador': 'Inovador'
    },
    gatilhos: {
      'sem-gatilho': 'Sem gatilho',
      'reciprocidade': 'Reciprocidade',
      'compromisso': 'Compromisso e Consistência',
      'prova-social': 'Prova Social',
      'simpatia': 'Simpatia',
      'autoridade': 'Autoridade',
      'escassez': 'Escassez',
      'consenso': 'Consenso'
    }
  };

  return optionMaps[field]?.[value] || value;
};

export const ChatSummary: React.FC<ChatSummaryProps> = ({ 
  surveyData, 
  csvFileName, 
  totalCount 
}) => {
  const csvInfo = csvFileName && totalCount > 0
    ? `${csvFileName} (${totalCount} registros)`
    : "Nenhum arquivo carregado";

  return (
    <div className="space-y-1.5">
      <p><strong>Canal:</strong> {getReadableLabel('canal', surveyData.canal)}</p>
      <p><strong>Estágio do Funil:</strong> {getReadableLabel('funnelStage', surveyData.funnelStage)}</p>
      <p><strong>Site:</strong> {surveyData.websiteUrl}</p>
      <p><strong>Tamanho:</strong> {surveyData.tamanho} caracteres</p>
      <p><strong>Tom de voz:</strong> {getReadableLabel('tomVoz', surveyData.tomVoz)}</p>
      <p><strong>Gatilhos:</strong> {getReadableLabel('gatilhos', surveyData.gatilhos)}</p>
      <p><strong>Arquivo CSV:</strong> {csvInfo}</p>
    </div>
  );
};
