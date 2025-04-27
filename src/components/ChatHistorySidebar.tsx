
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Plus, History } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface ChatHistoryProps {
  onSelectSurvey: (surveyId: string) => void;
  onNewCampaign: () => void;
  currentSurveyId: string | null;
}

interface ChatHistoryItem {
  id: string;
  created_at: string;
  canal: string;
  funnel_stage: string;
  isProcessed?: boolean;
}

const ChatHistorySidebar = ({ onSelectSurvey, onNewCampaign, currentSurveyId }: ChatHistoryProps) => {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mizi_ai_surveys')
        .select('id, created_at, canal, funnel_stage')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching chat history:", error);
        toast({
          title: "Erro ao carregar histórico",
          description: "Não foi possível carregar o histórico de chats.",
          variant: "destructive"
        });
        return;
      }

      // For each survey, check if processing is complete
      if (data) {
        const updatedData = await Promise.all(data.map(async (item) => {
          try {
            const { data: progressData } = await supabase.functions.invoke('checkProgress', {
              body: { surveyId: item.id }
            });
            
            return {
              ...item,
              isProcessed: progressData && progressData.isComplete === true
            };
          } catch (err) {
            console.error(`Error checking processing status for ${item.id}:`, err);
            return item;
          }
        }));
        
        setChatHistory(updatedData);
      }
    } catch (error) {
      console.error("Error in fetchChatHistory:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy HH:mm");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const getChatTitle = (item: ChatHistoryItem) => {
    const channelMap: Record<string, string> = {
      'linkedin': 'LinkedIn',
      'cold-email': 'Cold Email'
    };
    
    const funnelMap: Record<string, string> = {
      'topo': 'Topo de Funil',
      'meio': 'Meio de Funil',
      'fim': 'Fim de Funil',
      'cliente': 'Cliente',
      'inbound': 'Inbound'
    };
    
    const channel = channelMap[item.canal] || item.canal;
    const funnel = funnelMap[item.funnel_stage] || item.funnel_stage;
    
    return `${channel} - ${funnel}`;
  };

  return (
    <Sidebar side="left" className="bg-white border-r border-gray-200" data-state="expanded">
      <SidebarHeader className="pb-0">
        <div className="flex justify-between items-center p-2">
          <h2 className="text-lg font-semibold text-gray-800">Histórico</h2>
          <Button 
            onClick={onNewCampaign}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center gap-1 hover:opacity-90"
            size="sm"
          >
            <Plus size={16} />
            Nova Campanha
          </Button>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <History size={14} className="mr-1" />
            Campanhas anteriores
          </SidebarGroupLabel>
          
          <SidebarMenu>
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : chatHistory.length > 0 ? (
              chatHistory.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={currentSurveyId === item.id}
                    onClick={() => onSelectSurvey(item.id)}
                    className="w-full"
                  >
                    <div className="flex flex-col items-start w-full">
                      <span className="font-medium">{getChatTitle(item)}</span>
                      <span className="text-xs text-gray-500">{formatDate(item.created_at)}</span>
                    </div>
                    {item.isProcessed && (
                      <span className="ml-1 h-2 w-2 rounded-full bg-green-500" title="Processamento concluído"></span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            ) : (
              <div className="text-center p-4 text-gray-500">
                Nenhum histórico encontrado
              </div>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default ChatHistorySidebar;
