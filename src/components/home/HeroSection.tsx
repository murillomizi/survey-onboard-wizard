
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
        <motion.div
          className="mb-6 flex justify-center"
          variants={fadeIn}
          custom={0}
        >
          <div className="bg-minimal-black rounded-full p-3 inline-flex">
            <svg width="36" height="36" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="miziGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="50%" stopColor="#C8C8C9" />
                  <stop offset="100%" stopColor="#8E9196" />
                </linearGradient>
              </defs>
              <path 
                d="M165.712 34.288C172.945 41.522 173.511 52.568 167.088 60.555L114.823 124.784L167.088 189.014C173.511 197.001 172.945 208.047 165.712 215.28C158.478 222.514 147.432 223.08 139.445 216.657L80.664 169.527L21.884 216.657C13.897 223.08 2.851 222.514 -4.383 215.28C-11.616 208.047 -12.183 197.001 -5.759 189.014L46.504 124.784L-5.759 60.555C-12.183 52.568 -11.616 41.522 -4.383 34.288C2.851 27.055 13.897 26.489 21.884 32.912L80.664 80.042L139.445 32.912C147.432 26.489 158.478 27.055 165.712 34.288Z" 
                fill="url(#miziGradient)" 
                transform="scale(0.8) translate(20, 10)" 
              />
            </svg>
          </div>
        </motion.div>
        
        <motion.span 
          className="inline-block bg-minimal-gray-100 text-minimal-gray-800 text-sm font-medium px-3 py-1 rounded-full mb-4"
          variants={fadeIn}
          custom={1}
        >
          Unlike ChatGPT — Specialized for Outbound Success
        </motion.span>
        
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight" 
          variants={fadeIn} 
          custom={2}
        >
          AI that actually <span className="text-blue-600">personalize</span> your approach.
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-minimal-gray-600 mb-6 max-w-2xl mx-auto" 
          variants={fadeIn} 
          custom={3}
        >
          Where ChatGPT fails at cold outreach, Mizi excels. Get hyper-personalized campaigns that generate 3x more replies.
        </motion.p>
        
        <motion.div
          className="mb-10"
          variants={fadeIn}
          custom={4}
        >
          <div className="flex flex-wrap gap-3 justify-center">
            <span className="bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              35% Higher Response Rates
            </span>
            <span className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              Built for Cold Outreach
            </span>
            <span className="bg-purple-50 text-purple-700 text-xs font-medium px-3 py-1 rounded-full flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              Advanced Personalization
            </span>
          </div>
        </motion.div>
        
        <motion.div variants={fadeIn} custom={5} className="max-w-xl mx-auto">
          <div className="relative bg-minimal-black rounded-full shadow-lg p-1">
            <Input
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask Mizi to create a campaign (not ChatGPT)..."
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
