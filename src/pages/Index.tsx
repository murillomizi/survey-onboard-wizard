
import React from "react";
import ChatbotSurvey from "@/components/ChatbotSurvey";
import { CircleDot } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 font-['Exo_2',sans-serif]">
      <div className="w-full max-w-md mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h1 className="text-3xl font-light text-white tracking-wide">Mizi <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">AI</span></h1>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <CircleDot size={12} className="text-white" />
            <span>Online</span>
          </div>
        </div>
        <p className="text-gray-500">Converse com nosso assistente para personalizar sua estratégia</p>
      </div>
      
      <div className="w-full max-w-md bg-black/50 backdrop-blur-md border border-white/10 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
        <ChatbotSurvey />
      </div>
      
      <div className="w-full max-w-md mt-4 text-center">
        <button 
          className="text-gray-500 hover:text-white text-sm transition-colors"
          onClick={() => window.history.back()}
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

export default Index;
