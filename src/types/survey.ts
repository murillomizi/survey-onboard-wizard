
export interface SurveyState {
  surveyData: {
    canal: string;
    csvFile: File | null;
    csvFileName: string;
    websiteUrl: string;
    tamanho: number;
    touchpoints: string;
    tomVoz: string;
    template: string;
    gatilhos: string;
    funnelStage: string;
  };
  isProcessing: boolean;
  processedCount: number;
  totalCount: number;
  isComplete: boolean;
  processingId: string | null;
  parsedCsvData: any[];
  isDownloading: boolean;
}

export type SurveyStateUpdater = (updates: Partial<SurveyState>) => void;
