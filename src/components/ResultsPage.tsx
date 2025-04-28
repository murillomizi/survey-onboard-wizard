
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Download, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface ResultsPageProps {
  surveyId: string | null;
  onBackToStart: () => void;
}

interface PersonalizedMessage {
  id: string;
  copy: string | null;
  primeiro_nome: string | null;
  cargo: string | null;
  empresa: string | null;
  email: string | null;
}

const ResultsPage = ({ surveyId, onBackToStart }: ResultsPageProps) => {
  const [messages, setMessages] = useState<PersonalizedMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchMessages = async () => {
      if (!surveyId) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('mizi_ai_personalized_return')
          .select('*')
          .eq('mizi_ai_id', surveyId);
        
        if (error) {
          console.error('Error fetching personalized messages:', error);
          toast({
            title: "Erro ao carregar mensagens",
            description: "Não foi possível carregar as mensagens personalizadas.",
            variant: "destructive"
          });
          return;
        }
        
        setMessages(data || []);
      } catch (err) {
        console.error('Error in fetchMessages:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
  }, [surveyId]);
  
  const handleDownloadCsv = () => {
    try {
      // Convert messages to CSV format
      const headers = ['Nome', 'Cargo', 'Empresa', 'Email', 'Mensagem Personalizada'];
      const csvRows = [
        headers.join(','),
        ...messages.map(msg => {
          return [
            msg.primeiro_nome || '',
            msg.cargo || '',
            msg.empresa || '',
            msg.email || '',
            `"${(msg.copy || '').replace(/"/g, '""')}"` // Escape quotes in CSV
          ].join(',');
        })
      ];
      
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `mensagens-personalizadas-${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download concluído!",
        description: "Suas mensagens personalizadas foram baixadas com sucesso."
      });
    } catch (err) {
      console.error('Error downloading CSV:', err);
      toast({
        title: "Erro ao fazer download",
        description: "Não foi possível baixar as mensagens personalizadas.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-white rounded-xl">
      <div className="p-3 border-b border-gray-100 flex items-center">
        <Button
          onClick={onBackToStart}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 mr-2 hover:bg-gray-100"
        >
          <ArrowLeft size={16} className="text-gray-500" />
        </Button>
        <h2 className="text-lg font-medium text-gray-800">Suas mensagens personalizadas</h2>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <h3 className="text-md font-medium text-blue-800 mb-2">
              🎉 Suas mensagens personalizadas estão prontas!
            </h3>
            <p className="text-sm text-blue-700">
              Foram geradas {messages.length} mensagens personalizadas baseadas no seu CSV e configurações.
              Clique no botão abaixo para baixar todas as mensagens.
            </p>
          </div>
        </motion.div>
        
        <Button 
          onClick={handleDownloadCsv}
          className="w-full mb-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-sm hover:shadow-md hover:opacity-90 transition-all duration-200"
        >
          <Download size={18} className="mr-2" />
          Baixar mensagens personalizadas (CSV)
        </Button>
        
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-700 mb-2">
            Visualização prévia ({Math.min(3, messages.length)} de {messages.length})
          </h3>
          
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>
              ))}
            </div>
          ) : (
            messages.slice(0, 3).map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="p-4 border border-gray-200 rounded-xl bg-gray-50"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-medium text-sm text-gray-700">
                    {message.primeiro_nome || 'Contato'} 
                  </span>
                  {message.cargo && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{message.cargo}</span>
                    </>
                  )}
                  {message.empresa && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{message.empresa}</span>
                    </>
                  )}
                </div>
                <p className="text-gray-800 text-sm whitespace-pre-wrap">
                  {message.copy || "Mensagem personalizada indisponível."}
                </p>
              </motion.div>
            ))
          )}
          
          {messages.length > 3 && (
            <div className="text-center py-2 text-gray-500 text-sm italic">
              + {messages.length - 3} outras mensagens disponíveis no arquivo CSV
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-100">
        <Button 
          onClick={onBackToStart}
          variant="outline"
          className="w-full"
        >
          Voltar para o início
        </Button>
      </div>
    </div>
  );
};

export default ResultsPage;
