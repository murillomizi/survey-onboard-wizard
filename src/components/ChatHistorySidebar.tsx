
import React, { useState, useEffect, useRef } from "react";
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
  title?: string;
  description?: string;
  canal?: string;
  websiteUrl?: string;
  csvRowCount?: number;
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
  const fetchedRef = useRef<boolean>(false);
  const refreshCountRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);
  const fetchInProgressRef = useRef<boolean>(false);

  // Efeito para limpar flags no desmonte
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

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

  // Função de busca aprimorada para evitar chamadas de API redundantes
  const fetchHistory = async () => {
    if (isLoading || fetchInProgressRef.current || !isMountedRef.current) {
      console.log("Skipping fetch history due to loading or fetch in progress", {
        isLoading,
        fetchInProgress: fetchInProgressRef.current,
        isMounted: isMountedRef.current
      });
      return;
    }
    
    fetchInProgressRef.current = true;
    setIsLoading(true);
    console.log("Fetching chat history...");
    
    try {
      const history = await SurveyController.getChatHistory();
      
      if (!isMountedRef.current) return;
      console.log("Received history items:", history.length);
      
      // Processar no máximo 15 itens mais recentes para melhorar a performance
      const historyToProcess = history.slice(0, 15);
      
      // Tentativa em lote para verificar os status
      const batchSize = 5;
      const processedHistory: ChatHistoryItem[] = [];
      
      // Processar em lotes pequenos para evitar muitas chamadas simultâneas
      for (let i = 0; i < historyToProcess.length; i += batchSize) {
        if (!isMountedRef.current) break;
        
        const batch = historyToProcess.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(async (chat) => {
            try {
              if (!isMountedRef.current) return { ...chat, isComplete: false };
              
              const status = await supabase.functions.invoke('checkProgress', {
                body: {
                  surveyId: chat.id,
                  fetchData: false
                }
              });
              
              return {
                ...chat,
                isComplete: status?.data?.isComplete || false
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
        
        processedHistory.push(...batchResults);
      }
      
      if (isMountedRef.current) {
        console.log("Setting chat history with processed items:", processedHistory.length);
        setChatHistory(processedHistory);
        fetchedRef.current = true;
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      if (isMountedRef.current) {
        setChatHistory([]);  // Set to empty array on error to avoid issues with undefined
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
        fetchInProgressRef.current = false;
      }
    }
  };

  useEffect(() => {
    // Apenas busque se a atualização realmente mudou ou carga inicial
    if (refreshCountRef.current !== refresh || !fetchedRef.current) {
      console.log("Triggering history fetch due to refresh change or initial load", {
        currentRefresh: refresh,
        previousRefresh: refreshCountRef.current,
        initialLoad: !fetchedRef.current
      });
      refreshCountRef.current = refresh;
      fetchHistory();
    }
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
              Carregando...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Campanha
            </>
          )}
        </Button>
        
        <div className="mt-4">
          {isLoading && chatHistory.length === 0 ? (
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
