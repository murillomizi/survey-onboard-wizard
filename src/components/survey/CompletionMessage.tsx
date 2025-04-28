
import React from 'react';
import { Download, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompletionMessageProps {
  processedCount: number;
  onDownload: () => void;
  isDownloading: boolean;
}

const CompletionMessage: React.FC<CompletionMessageProps> = ({
  processedCount,
  onDownload,
  isDownloading
}) => {
  return (
    <div className="space-y-2">
      <p className="font-medium">🎉 Processamento concluído!</p>
      <p className="text-gray-600">
        Todos os {processedCount} contatos foram processados com sucesso.
      </p>
      <Button
        onClick={onDownload}
        disabled={isDownloading}
        className="mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
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
    </div>
  );
};

export default CompletionMessage;
