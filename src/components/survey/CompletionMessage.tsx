
import React, { useEffect } from 'react';
import { Download, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface CompletionMessageProps {
  processedCount: number;
  totalCount?: number;
  onDownload: () => void;
  isDownloading: boolean;
  surveyId?: string | null;
}

const CompletionMessage: React.FC<CompletionMessageProps> = ({
  processedCount,
  totalCount,
  onDownload,
  isDownloading,
  surveyId
}) => {
  const safeProcessedCount = isNaN(processedCount) ? 0 : processedCount;
  const safeTotalCount = totalCount && !isNaN(totalCount) ? totalCount : safeProcessedCount;

  useEffect(() => {
    console.log(`CompletionMessage rendered with count: ${processedCount}/${safeTotalCount}, ID: ${surveyId || 'none'}`);
  }, [processedCount, safeTotalCount, surveyId]);

  const handleSafeDownload = () => {
    try {
      if (safeProcessedCount <= 0) {
        toast({
          title: "Atenção",
          description: "Não há contatos processados para download",
          variant: "default"
        });
        return;
      }
      onDownload();
    } catch (error) {
      console.error("Erro ao iniciar download:", error);
      toast({
        title: "Erro no download",
        description: "Não foi possível iniciar o download. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-3">
      <p className="font-medium">🎉 Processamento concluído!</p>
      <p className="text-gray-600">
        {safeProcessedCount > 0 
          ? `${safeProcessedCount}/${safeTotalCount} contatos foram processados com sucesso.`
          : "O processamento foi concluído, mas nenhum contato foi encontrado."}
      </p>
      <div className="mt-3">
        <p className="text-sm text-indigo-600 mb-2">
          Seus contatos agora têm mensagens personalizadas prontas para engajar seu público!
        </p>
      </div>
      <Button
        onClick={handleSafeDownload}
        disabled={isDownloading || safeProcessedCount <= 0}
        className="w-full mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
      >
        {isDownloading ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Gerando arquivo...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Baixar Campanha Personalizada
          </>
        )}
      </Button>
      {surveyId && <p className="text-xs text-gray-400 mt-2">ID: {surveyId}</p>}
    </div>
  );
};

export default CompletionMessage;
