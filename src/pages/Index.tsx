
import React from "react";
import { motion } from "framer-motion";
import ChatbotSurvey from "@/components/ChatbotSurvey";
import Logo from "@/components/ui/logo";

const Index = () => {
  return (
    <div className="min-h-screen bg-minimal-white flex flex-col items-center justify-start p-4 font-['Inter',sans-serif]">
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
          <Logo size="lg" className="transform scale-150" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-minimal-gray-600 text-lg mt-2"
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
        <div className="transform transition-all duration-500 hover:shadow-lg hover:scale-[1.01] rounded-xl overflow-hidden">
          <ChatbotSurvey />
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
