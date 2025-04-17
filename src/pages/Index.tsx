
import React from "react";
import ChatbotSurvey from "@/components/ChatbotSurvey";

const Index = () => {
  return (
    <div className="min-h-screen bg-survey-bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-2xl font-bold text-survey-text mb-2">Configure sua sequência</h1>
        <p className="text-survey-muted">Converse com nosso assistente para personalizar sua estratégia</p>
      </div>
      
      <div className="w-full max-w-md">
        <ChatbotSurvey />
      </div>
      
      <div className="w-full max-w-md mt-4 text-center">
        <button 
          className="text-survey-muted hover:text-survey-purple text-sm"
          onClick={() => window.history.back()}
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

export default Index;
