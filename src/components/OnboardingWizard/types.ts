
export type OnboardingData = {
  canal: string;
  websiteUrl: string;
  tomVoz: string;
  tamanho: number;
  gatilhos: string;
  csvFileName: string;
  userEmail: string;
};

export type WizardStep = {
  id: string;
  title: string;
  description: string;
  fields?: string[];
};

export type WizardFooterProps = {
  currentStep: number;
  steps: WizardStep[];
  isCompleted: boolean;
  isLoggingIn: boolean;
  onBack: () => void;
  onNext: () => void;
};

export type WizardHeaderProps = {
  step: WizardStep;
  currentStep: number;
  isCompleted: boolean;
};

export type WizardProgressProps = {
  currentStep: number;
  totalSteps: number;
};
