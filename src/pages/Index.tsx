
import React from "react";
import ChatbotSurvey from "@/components/ChatbotSurvey";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4 font-['Inter',sans-serif]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[650px] mb-8 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-light text-gray-800 tracking-wide"
          >
            Mizi <span className="font-bold">AI</span>
          </motion.h1>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-gray-600 text-base"
        >
          Personalize sua abordagem com IA
        </motion.p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-[650px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <ChatbotSurvey />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="w-full max-w-[650px] mt-6 text-center"
      >
        <button 
          className="text-gray-500 hover:text-gray-700 text-base transition-colors underline underline-offset-4"
          onClick={() => window.history.back()}
        >
          Voltar
        </button>
      </motion.div>
    </div>
  );
};

export default Index;
