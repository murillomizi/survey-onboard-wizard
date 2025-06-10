import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { fadeIn } from "@/components/home/animations";

interface HeroSectionProps {
  onSendMessage: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSendMessage }) => {
  const [chatMessage, setChatMessage] = useState("");

  const handleSendChatMessage = () => {
    if (chatMessage.trim()) {
      toast.success("Message sent! This is a demo - in a real app, this would be processed by an LLM.");
      setChatMessage("");
      onSendMessage();
    }
  };

  return (
    <motion.section 
      className="px-4 md:px-8 py-16 md:py-28 max-w-7xl mx-auto" 
      initial="hidden" 
      animate="visible" 
      variants={fadeIn} 
      custom={0}
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight" 
          variants={fadeIn} 
          custom={1}
        >
          AI that actually.
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-minimal-gray-600 mb-12 max-w-2xl mx-auto" 
          variants={fadeIn} 
          custom={2}
        >
          Hyper-personalized cold outreach at scale. Get more replies, book more meetings.
        </motion.p>
        
        <motion.div variants={fadeIn} custom={3} className="max-w-xl mx-auto">
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-6 px-8 rounded-full text-lg font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
            onClick={onSendMessage}
          >
            Ask Mizi to create a campaign
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
