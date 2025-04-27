
export interface Message {
  id: number;
  content: React.ReactNode;
  type: "user" | "bot";
}

export interface SurveyStep {
  question: string;
  options?: { value: string; label: string }[];
  field: string;
  inputType?: "text" | "file" | "slider" | "summary";
  description?: string;
}

export interface SurveyData {
  canal: string;
  funnelStage: string;
  csvData: any[];
  websiteUrl: string;
  tamanho: number;
  tomVoz: string;
  gatilhos: string;
}

export type WebhookStatus = "idle" | "checking" | "processing" | "complete" | "error";
