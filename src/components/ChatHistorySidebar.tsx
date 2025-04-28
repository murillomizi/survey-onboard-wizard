
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PlusCircle, Clock, Loader2, CheckCircle } from "lucide-react";
import { SurveyController } from "@/controllers/SurveyController";
import { supabase } from "@/integrations/supabase/client";

interface ChatHistorySidebarProps {
  onSelectSurvey: (id: string) => void;
  onNewCampaign: () => void;
  currentSurveyId: string | null;
  refresh?: number;
}

interface ChatHistoryItem {
  id: string;
  created_at: string;
  isComplete: boolean;
}

interface GroupedChats {
  today: ChatHistoryItem[];
  lastWeek: ChatHistoryItem[];
  older: ChatHistoryItem[];
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  onSelectSurvey,
  onNewCampaign,
  currentSurveyId,
  refresh = 0,
}) => {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const groupChats = (chats: ChatHistoryItem[]): GroupedChats => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    return chats.reduce((groups: GroupedChats, chat) => {
      const chatDate = new Date(chat.created_at);
      chatDate.setHours(0, 0, 0, 0);
      
      if (chatDate.getTime() === today.getTime()) {
        groups.today.push(chat);
      } else if (chatDate >= lastWeek) {
        groups.lastWeek.push(chat);
      } else {
        groups.older.push(chat);
      }
      
      return groups;
    }, { today: [], lastWeek: [], older: [] });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const history = await SurveyController.getChatHistory();
        console.log("History fetched:", history);
        
        const historyWithStatus = await Promise.all(
          history.map(async (chat) => {
            try {
              // Verificar status processado através da edge function checkProgress
              const status = await supabase.functions.invoke('checkProgress', {
                body: {
                  surveyId: chat.id,
                  fetchData: false
                }
              });
              
              const isComplete = status?.data?.isComplete || false;
              console.log(`Survey ${chat.id} processing status: ${isComplete ? 'Complete' : 'Incomplete'}`);
              
              return {
                ...chat,
                isComplete
              };
            } catch (error) {
              console.error(`Error checking status for survey ${chat.id}:`, error);
              return {
                ...chat,
                isComplete: false
              };
            }
          })
        );
        
        console.log("History with status:", historyWithStatus);
        setChatHistory(historyWithStatus);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [refresh]);

  const renderChatGroup = (chats: ChatHistoryItem[], title: string) => {
    if (chats.length === 0) return null;
    
    return (
      <SidebarGroup>
        <SidebarGroupLabel className="text-gray-900 font-semibold">{title}</SidebarGroupLabel>
        <div className="space-y-2">
          {chats.map((chat) => (
            <Button
              key={chat.id}
              variant="ghost"
              className={`w-full justify-start font-normal text-sm ${
                currentSurveyId === chat.id ? "bg-gray-100 hover:bg-gray-100" : ""
              }`}
              onClick={() => onSelectSurvey(chat.id)}
            >
              <div className="flex items-center text-gray-800 w-full">
                {chat.isComplete ? (
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                ) : (
                  <Clock className="mr-2 h-4 w-4 text-gray-600" />
                )}
                {new Date(chat.created_at).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </Button>
          ))}
        </div>
      </SidebarGroup>
    );
  };

  const groupedChats = groupChats(chatHistory);

  return (
    <Sidebar>
      <SidebarContent className="p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Campanhas</h2>
        <Button
          variant="secondary"
          className="w-full justify-start font-normal text-gray-800"
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
        
        <div className="mt-4">
          {isLoading ? (
            <div className="text-sm text-gray-600 italic">Carregando histórico...</div>
          ) : chatHistory.length === 0 ? (
            <div className="text-sm text-gray-600 italic">Nenhuma campanha criada ainda.</div>
          ) : (
            <>
              {renderChatGroup(groupedChats.today, "Hoje")}
              {renderChatGroup(groupedChats.lastWeek, "Últimos 7 dias")}
              {renderChatGroup(groupedChats.older, "Mais antigos")}
            </>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default ChatHistorySidebar;
