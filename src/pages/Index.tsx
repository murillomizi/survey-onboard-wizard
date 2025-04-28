
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ChatbotSurvey from "@/components/ChatbotSurvey";
import ChatHistorySidebar from "@/components/ChatHistorySidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);
  const [showSurveyForm, setShowSurveyForm] = useState(true);
  const [refresh, setRefresh] = useState(0); // Chave de atualização para forçar re-renderização
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(false);
  const lastRefreshedRef = useRef<number>(Date.now());
  const currentSurveyIdRef = useRef<string | null>(null);

  // Efeito para sincronizar a ref com o estado
  useEffect(() => {
    currentSurveyIdRef.current = selectedSurveyId;
  }, [selectedSurveyId]);

  const handleSelectSurvey = async (surveyId: string) => {
    try {
      // Não recarregue se já estivermos visualizando este chat
      if (surveyId === currentSurveyIdRef.current || loadingRef.current) {
        console.log("Avoiding reload of the same survey or during loading", {
          surveyId,
          currentId: currentSurveyIdRef.current,
          isLoading: loadingRef.current
        });
        return;
      }
      
      console.log("Selecting survey:", surveyId);
      loadingRef.current = true;
      setIsLoading(true);
      
      // Primeiro esconda o formulário do chat
      setShowSurveyForm(false);
      
      // Breve atraso para garantir que o componente seja desmontado
      setTimeout(() => {
        // Defina o novo ID do chat
        setSelectedSurveyId(surveyId);
        
        // Gere uma nova chave de atualização para forçar recriação do componente
        setRefresh(prev => prev + 1);
        
        // Mostre o formulário do chat com o novo ID
        setShowSurveyForm(true);
        
        // Adicione um pequeno atraso antes de concluir o carregamento para garantir que os componentes sejam montados corretamente
        setTimeout(() => {
          setIsLoading(false);
          loadingRef.current = false;
        }, 300);
      }, 150);
      
    } catch (error) {
      console.error("Error selecting survey:", error);
      toast({
        title: "Erro ao carregar chat",
        description: "Não foi possível carregar os dados do chat selecionado.",
        variant: "destructive"
      });
      setIsLoading(false);
      loadingRef.current = false;
    }
  };

  const handleNewCampaign = () => {
    if (loadingRef.current) {
      console.log("Avoiding new campaign during loading");
      return;
    }
    
    console.log("Starting new campaign");
    loadingRef.current = true;
    setIsLoading(true);
    
    // Esconda o formulário atual
    setShowSurveyForm(false);
    
    // Redefina o ID do chat para null para iniciar um novo chat
    setTimeout(() => {
      setSelectedSurveyId(null);
      currentSurveyIdRef.current = null;
      // Force a atualização do componente ChatbotSurvey
      setRefresh(prev => prev + 1);
      setShowSurveyForm(true);
      
      setTimeout(() => {
        setIsLoading(false);
        loadingRef.current = false;
      }, 300);
    }, 150);
  };

  // Função para lidar com o envio bem-sucedido do formulário
  const handleFormSubmit = async (newSurveyId: string) => {
    // Atualize o ID do chat selecionado para o novo
    console.log("Form submitted successfully with ID:", newSurveyId);
    setSelectedSurveyId(newSurveyId);
    currentSurveyIdRef.current = newSurveyId;
    
    // Evite atualizações muito frequentes
    const now = Date.now();
    if (now - lastRefreshedRef.current > 1000) { // Atualize apenas se mais de 1 segundo desde a última atualização
      lastRefreshedRef.current = now;
      
      // Atualize a barra lateral do histórico de chat para mostrar a nova entrada
      setTimeout(() => {
        setRefresh(prev => prev + 1);
      }, 500);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-[#FAFAFA] flex w-full font-['Inter',sans-serif]">
        <ChatHistorySidebar 
          onSelectSurvey={handleSelectSurvey}
          onNewCampaign={handleNewCampaign}
          currentSurveyId={selectedSurveyId}
          refresh={refresh}
        />
        
        <div className="flex-1 flex flex-col items-center justify-start p-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-[800px] flex items-center gap-3 mb-4"
          >
            <h1 className="text-2xl font-light text-gray-800 tracking-wide">
              Mizi <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">AI</span>
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.6,
              ease: "easeOut"
            }}
            className="w-full max-w-[800px]"
          >
            <div className="transform transition-all duration-500 hover:scale-[1.01]">
              {showSurveyForm && (
                <ChatbotSurvey 
                  key={`survey-${selectedSurveyId}-${refresh}`}
                  initialSurveyId={selectedSurveyId} 
                  onSubmitSuccess={handleFormSubmit}
                  isLoading={isLoading}
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
