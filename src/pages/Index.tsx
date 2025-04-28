import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ChatbotSurvey from "@/components/ChatbotSurvey";
import ChatHistorySidebar from "@/components/ChatHistorySidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);
  const [showSurveyForm, setShowSurveyForm] = useState(true);
  const [refresh, setRefresh] = useState(0); // Add a refresh key to force re-rendering

  const handleSelectSurvey = (surveyId: string) => {
    setSelectedSurveyId(surveyId);
    setShowSurveyForm(true);
  };

  const handleNewCampaign = () => {
    // Reset the survey ID to null to start a fresh chat
    setSelectedSurveyId(null);
    setShowSurveyForm(true);
    // Force a refresh of the ChatbotSurvey component
    setRefresh(prev => prev + 1);
  };

  // Function to handle successful form submission
  const handleFormSubmit = async (newSurveyId: string) => {
    // Update the selected survey ID to the new one
    setSelectedSurveyId(newSurveyId);
    
    // Wait briefly to ensure data is available
    setTimeout(async () => {
      try {
        // Refresh the chat history sidebar to show the new entry
        const sidebar = document.querySelector('[data-sidebar="sidebar"]');
        if (sidebar) {
          // Trigger a rerender if needed
          setRefresh(prev => prev + 1);
        }
      } catch (error) {
        console.error("Error refreshing after submission:", error);
      }
    }, 500);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-[#FAFAFA] flex w-full font-['Inter',sans-serif]">
        <ChatHistorySidebar 
          onSelectSurvey={handleSelectSurvey}
          onNewCampaign={handleNewCampaign}
          currentSurveyId={selectedSurveyId}
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
                  key={refresh}
                  initialSurveyId={selectedSurveyId} 
                  onSubmitSuccess={handleFormSubmit}
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
