
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PlusCircle, Clock, Loader2 } from "lucide-react";
import { SurveyController } from "@/controllers/SurveyController";

interface ChatHistorySidebarProps {
  onSelectSurvey: (id: string) => void;
  onNewCampaign: () => void;
  currentSurveyId: string | null;
  refresh?: number;
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  onSelectSurvey,
  onNewCampaign,
  currentSurveyId,
  refresh = 0,
}) => {
  const [chatHistory, setChatHistory] = useState<{
    id: string;
    created_at: string;
    title: string;
    description: string;
    canal: string;
    websiteUrl: string;
    csvRowCount: number;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Usando o controller em vez de chamar diretamente o Supabase
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const history = await SurveyController.getChatHistory();
        setChatHistory(history);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [refresh]);

  return (
    <Sidebar>
      <SidebarContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Campanhas</h2>
        <Button
          variant="secondary"
          className="w-full justify-start font-normal"
          onClick={onNewCampaign}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Campanha
            </>
          )}
        </Button>
        
        <div className="mt-4 space-y-2">
          {isLoading ? (
            <div className="text-sm text-gray-500 italic">Carregando histórico...</div>
          ) : chatHistory.length === 0 ? (
            <div className="text-sm text-gray-500 italic">Nenhuma campanha criada ainda.</div>
          ) : (
            chatHistory.map((chat) => (
              <Button
                key={chat.id}
                variant="ghost"
                className={`w-full justify-start font-normal text-sm ${
                  currentSurveyId === chat.id ? "bg-gray-100 hover:bg-gray-100" : ""
                }`}
                onClick={() => onSelectSurvey(chat.id)}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex flex-col">
                    <div className="flex items-center text-gray-600">
                      <Clock className="mr-2 h-4 w-4" />
                      {new Date(chat.created_at).toLocaleString('pt-BR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="mt-1 text-gray-800">{chat.canal}</div>
                    <div className="text-xs text-gray-500">
                      {chat.csvRowCount} leads para processar
                    </div>
                  </div>
                </div>
              </Button>
            ))
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default ChatHistorySidebar;
