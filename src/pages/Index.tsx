
import React from "react";
import ChatbotSurvey from "@/components/ChatbotSurvey";
import { CircleDot } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 font-['Exo_2',sans-serif]">
      <div className="w-full max-w-md mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <h1 className="text-4xl font-light text-white tracking-wide">Mizi <span className="font-bold">AI</span></h1>
          <div className="flex items-center gap-1.5 text-sm text-gray-200 bg-white/5 px-2.5 py-1 rounded-full border border-white/20">
            <CircleDot size={14} className="text-white animate-pulse" />
            <span>Online</span>
          </div>
        </div>
        <p className="text-gray-300 text-base">Converse com a nossa IA para personalizar a abordagem para sua base</p>
      </div>
      
      <div className="w-full max-w-md bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-xl overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.3)]">
        <ChatbotSurvey />
      </div>
      
      <div className="w-full max-w-md mt-6 text-center">
        <button 
          className="text-gray-300 hover:text-white text-base transition-colors underline underline-offset-4"
          onClick={() => window.history.back()}
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

export default Index;
