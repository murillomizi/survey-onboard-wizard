
import React from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { download } from "lucide-react";

interface ProcessedDataDownloadProps {
  surveyId: string;
  onDownloadComplete?: () => void;
}

const ProcessedDataDownload: React.FC<ProcessedDataDownloadProps> = ({ 
  surveyId,
  onDownloadComplete 
}) => {
  const handleDownload = async () => {
    try {
      // Buscar dados processados
      const { data: messages } = await supabase
        .from('mizi_ai_personalized_return')
        .select('*')
        .eq('mizi_ai_id', surveyId);

      if (!messages?.length) {
        console.error('No data found');
        return;
      }

      // Preparar cabeçalhos do CSV
      const headers = ['Primeiro Nome', 'Cargo', 'Empresa', 'Email', 'Copy Personalizada'];
      
      // Converter dados para formato CSV
      const csvRows = [
        headers.join(','),
        ...messages.map(msg => {
          return [
            msg["primeiro nome"] || '',
            msg.cargo || '',
            msg.empresa || '',
            msg.email || '',
            `"${(msg.copy || '').replace(/"/g, '""')}"` // Escapa aspas duplas no texto
          ].join(',');
        })
      ];

      // Criar blob e iniciar download
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `processed_messages_${surveyId}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      onDownloadComplete?.();
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      className="bg-green-500 hover:bg-green-600 text-white"
    >
      <download className="mr-2" />
      Download CSV Processado
    </Button>
  );
};

export default ProcessedDataDownload;
