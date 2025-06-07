
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
          <div className="relative bg-minimal-black rounded-full shadow-lg p-1">
            <Input
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask Mizi to create a campaign..."
              className="w-full bg-minimal-black text-minimal-white border-0 pr-12 py-6 h-auto text-base focus:ring-0 focus:outline-none placeholder:text-minimal-gray-400 rounded-full"
              onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
              <Button
                onClick={handleSendChatMessage}
                disabled={!chatMessage.trim()}
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full bg-transparent hover:bg-minimal-gray-800 text-minimal-white"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
