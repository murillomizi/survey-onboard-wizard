import React from "react";
import ChatbotSurvey from "@/components/ChatbotSurvey";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 font-['Inter',sans-serif]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mb-8 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-light text-white tracking-wide"
          >
            Mizi <span className="font-bold">AI</span>
          </motion.h1>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-gray-300 text-base"
        >
          Personalize sua estratégia com IA
        </motion.p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-md bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-xl overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.3)] hover:border-white/30 transition-all duration-300"
      >
        <ChatbotSurvey />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="w-full max-w-md mt-6 text-center"
      >
        <button 
          className="text-gray-300 hover:text-white text-base transition-colors underline underline-offset-4"
          onClick={() => window.history.back()}
        >
          Voltar
        </button>
      </motion.div>
    </div>
  );
};

export default Index;
