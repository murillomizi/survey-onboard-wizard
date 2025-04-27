
import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  processedCount: number;
  totalCount: number;
  isComplete: boolean;
  onDownload: () => void;
  surveyId: string | null;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  processedCount,
  totalCount,
  isComplete,
  onDownload,
  surveyId
}) => {
  useEffect(() => {
    // Display the survey ID in the console for debugging
    if (surveyId) {
      console.log(`LoadingOverlay monitoring survey ID: ${surveyId}`);
    }
  }, [surveyId]);

  useEffect(() => {
    // Log when the component detects completion
    if (isComplete) {
      console.log("LoadingOverlay: Processing complete, showing download button");
    }
  }, [isComplete]);
  
  return (
    <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        {!isComplete ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 text-survey-purple animate-spin" />
            <h3 className="text-xl font-semibold text-gray-800">
              Processando sua campanha
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-survey-purple h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${Math.max(5, (processedCount / totalCount) * 100)}%` }}
              ></div>
            </div>
            <p className="text-gray-600 text-center">
              Processados {processedCount}/{totalCount} contatos
            </p>
            {surveyId && (
              <p className="text-xs text-gray-400">ID: {surveyId}</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Processamento concluído!
            </h3>
            <p className="text-gray-600 text-center">
              Todos os {totalCount} contatos foram processados com sucesso.
            </p>
            <button 
              onClick={onDownload}
              className="w-full py-2.5 px-5 bg-survey-purple text-white rounded-lg hover:bg-survey-purple/90 transition-colors"
            >
              Baixar minha campanha personalizada
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;
