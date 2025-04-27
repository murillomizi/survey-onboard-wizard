
export interface Option {
  value: string;
  label: string;
}

export interface StepConfig {
  question: string;
  options?: Option[];
  field: string;
  inputType?: string;
  description?: string;
}

export interface Message {
  id: number;
  content: React.ReactNode;
  type: "user" | "bot";
}
