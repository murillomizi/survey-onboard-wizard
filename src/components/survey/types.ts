
import { Message } from "@/hooks/useChatMessages";
import { StepOption } from "@/hooks/useChatbotSurvey";

export interface SurveyMessagesProps {
  messages: Message[];
  isWaitingForResponse: boolean;
  showOptions: {
    options: StepOption[];
    step: number;
    isComplete: boolean;
  } | null;
  showSlider: boolean;
  sliderValue: number;
  onOptionSelect: (value: string) => void;
  onSliderChange: (values: number[]) => void;
  onSliderComplete: () => void;
  isComplete?: boolean;
}

export interface SurveyActionsProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onSubmit: () => void;
  onCheckStatus: () => void;
  isSubmitting: boolean;
  isComplete: boolean;
  processingId: string | null;
}

