
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Loader, Download } from "lucide-react";

interface SurveyFooterProps {
  currentStep: number;
  totalSteps: number;
  currentInput: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onFileUpload: () => void;
  onSubmit: () => void;
  onCheckStatus: () => void;
  onDownload?: () => void;
  isSubmitting: boolean;
  isDownloading: boolean;
  showInput: boolean;
  processingId: string | null;
  isComplete?: boolean;
  processedCount?: number;
}

const SurveyFooter: React.FC<SurveyFooterProps> = ({
  currentStep,
  totalSteps,
  currentInput,
  onInputChange,
  onSendMessage,
  onFileUpload,
  onSubmit,
  onCheckStatus,
  onDownload,
  isSubmitting,
  isDownloading,
  showInput,
  processingId,
  isComplete,
  processedCount
}) => {
  // Determine se o último passo está ativo
  const isLastStep = currentStep === totalSteps - 1;
  
  // Determinar se deve mostrar o botão de download direto na barra de ações
  const showDownloadButton = isComplete && processingId && processedCount && processedCount > 0 && onDownload;
  
  return (
    <div className="p-4 border-t border-gray-100 bg-white rounded-b-xl">
      <div className="flex items-center gap-2 max-w-[600px] mx-auto">
        {currentStep === 6 && (
          <Button
            type="button"
            onClick={onFileUpload}
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200"
          >
            <Paperclip size={18} />
            Upload CSV
          </Button>
        )}
        
        {showInput && !isComplete && (
          <div className="relative flex-1">
            <Input
              value={currentInput}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
              placeholder="Digite sua resposta..."
              className="w-full bg-gray-50 border-gray-200 text-gray-800 rounded-full pr-12 focus:border-blue-300 focus:ring-1 focus:ring-blue-100 transition-all duration-200"
            />
            <Button
              onClick={onSendMessage}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90 transition-all duration-200 p-0"
            >
              <Send size={14} />
            </Button>
          </div>
        )}
        
        {isComplete && showDownloadButton ? (
          <Button
            onClick={onDownload}
            disabled={isDownloading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-sm hover:shadow-md hover:opacity-90 transition-all duration-200"
          >
            {isDownloading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Baixando...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Baixar Campanha Personalizada
              </>
            )}
          </Button>
        ) : isLastStep && (
          <Button
            onClick={processingId ? onCheckStatus : onSubmit}
            disabled={isSubmitting || isDownloading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-sm hover:shadow-md hover:opacity-90 transition-all duration-200"
          >
            {isSubmitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : processingId ? (
              'Consultar Status'
            ) : (
              'Continuar'
            )}
          </Button>
        )}
      </div>
      
      {isComplete && !showInput && (
        <div className="text-center mt-4">
          <p className="text-sm text-indigo-600 italic">
            Suas mensagens personalizadas estão prontas para impulsionar seu engajamento!
          </p>
        </div>
      )}
    </div>
  );
};

export default SurveyFooter;
