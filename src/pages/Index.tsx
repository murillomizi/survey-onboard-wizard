
import React from "react";
import { motion } from "framer-motion";
import ChatbotSurvey from "@/components/ChatbotSurvey";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-start p-4 font-['Inter',sans-serif]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[800px] text-center mt-8 mb-6"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <h1 className="text-5xl font-light text-gray-800 tracking-wide">
            Mizi <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">AI</span>
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-gray-600 text-lg"
        >
          Personalize sua abordagem com IA
        </motion.p>
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
          <ChatbotSurvey />
        </div>
      </motion.div>
      
      <Toaster />
    </div>
  );
};

export default Index;
