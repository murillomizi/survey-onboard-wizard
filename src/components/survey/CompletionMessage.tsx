
import React, { useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

interface CompletionMessageProps {
  processedCount: number;
  totalCount?: number;
  surveyId?: string | null;
}

const CompletionMessage: React.FC<CompletionMessageProps> = ({
  processedCount,
  totalCount,
  surveyId
}) => {
  const safeProcessedCount = isNaN(processedCount) ? 0 : processedCount;
  const safeTotalCount = totalCount && !isNaN(totalCount) ? totalCount : safeProcessedCount;

  useEffect(() => {
    console.log(`CompletionMessage rendered with count: ${processedCount}/${safeTotalCount}, ID: ${surveyId || 'none'}`);
  }, [processedCount, safeTotalCount, surveyId]);

  return (
    <div className="space-y-3">
      <p className="font-medium">🎉 Processamento concluído!</p>
      <p className="text-gray-600">
        {safeProcessedCount > 0 
          ? `${safeProcessedCount}/${safeTotalCount} contatos foram processados com sucesso.`
          : "O processamento foi concluído, mas nenhum contato foi encontrado."}
      </p>
      <div className="mt-3">
        <p className="text-sm text-indigo-600">
          Seus contatos agora têm mensagens personalizadas prontas para engajar seu público!
        </p>
      </div>
      {surveyId && <p className="text-xs text-gray-400 mt-2">ID: {surveyId}</p>}
    </div>
  );
};

export default CompletionMessage;
