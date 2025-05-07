
import React from "react";
import { motion } from "framer-motion";
import { Upload, Settings, Copy, Users } from "lucide-react";
import WorkflowStep from "./WorkflowStep";

// Animation variants for smooth transitions
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.7, ease: "easeOut" }
  })
};

const WorkflowSection = () => {
  // Workflow steps for the process - Updated for SDRs/BDRs with more minimalist colors
  const workflowSteps = [
    {
      icon: <Upload className="h-12 w-12 text-blue-500" />,
      title: "Import your contact list",
      description: "Upload your target accounts and Mizi automatically reads their website to understand their business.",
      animation: "animate-float",
      sdrbdrTitle: "Identify Decision Makers",
      sdrbdrDescription: "Import your prospect list and let our AI analyze their business context for maximum relevance.",
      bgColor: "bg-gray-50", // Updated to minimalist gray
      borderColor: "border-gray-200",
      characterSrc: "/images/friendly-robot-collecting.svg"
    },
    {
      icon: <Settings className="h-12 w-12 text-indigo-500" />,
      title: "Configure your campaign",
      description: "Our AI identifies the perfect approach for each prospect based on their business context and needs.",
      animation: "animate-pulse",
      sdrbdrTitle: "Personalize at Scale",
      sdrbdrDescription: "Select approach and tone to match your ICP - casual, formal, or direct without sacrificing personalization.",
      bgColor: "bg-blue-50", // Updated to light blue
      borderColor: "border-blue-200",
      characterSrc: "/images/friendly-robot-thinking.svg"
    },
    {
      icon: <Copy className="h-12 w-12 text-purple-500" />,
      title: "Get personalized copy",
      description: "Receive customized outreach templates for both email and LinkedIn that speak directly to your prospect's needs.",
      animation: "animate-scale",
      sdrbdrTitle: "Drive Higher Response Rates",
      sdrbdrDescription: "Deploy hyper-personalized messages that reference prospects' business challenges and spark genuine interest.",
      bgColor: "bg-indigo-50", // Updated to light indigo
      borderColor: "border-indigo-200",
      characterSrc: "/images/friendly-robot-writing.svg"
    }
  ];

  return (
    <motion.section 
      className="px-4 md:px-8 py-16 md:py-20 bg-gradient-to-b from-white to-gray-50"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      custom={4}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
            Simplify Your Outreach Workflow
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            From prospect identification to personalized messaging in three simple steps
          </p>
        </div>
        
        {/* SDR/BDR-focused Connected Workflow Cards */}
        <div className="relative max-w-6xl mx-auto mb-20">
          {/* Connection lines between cards */}
          <div className="absolute top-1/2 left-0 w-full h-4 hidden md:block">
            {/* First connection line */}
            <div className="absolute left-[25%] right-[62%] h-4 bg-gradient-to-r from-gray-300 to-blue-300 rounded-full 
                          transform -translate-y-1/2 z-0">
              {/* Arrow decorations on the connection line */}
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2 rotate-0">
                <div className="w-4 h-4 bg-blue-300 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute right-16 top-1/2 transform -translate-y-1/2 rotate-0">
                <div className="w-3 h-3 bg-blue-300 rounded-full animate-pulse" 
                    style={{animationDelay: "0.2s"}}></div>
              </div>
              <div className="absolute right-24 top-1/2 transform -translate-y-1/2 rotate-0">
                <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"
                    style={{animationDelay: "0.4s"}}></div>
              </div>
            </div>
            
            {/* Second connection line */}
            <div className="absolute left-[63%] right-[25%] h-4 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full 
                          transform -translate-y-1/2 z-0">
              {/* Arrow decorations on the connection line */}
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2 rotate-0">
                <div className="w-4 h-4 bg-indigo-300 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute right-16 top-1/2 transform -translate-y-1/2 rotate-0">
                <div className="w-3 h-3 bg-indigo-300 rounded-full animate-pulse"
                    style={{animationDelay: "0.2s"}}></div>
              </div>
              <div className="absolute right-24 top-1/2 transform -translate-y-1/2 rotate-0">
                <div className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse"
                    style={{animationDelay: "0.4s"}}></div>
              </div>
            </div>
          </div>
          
          {/* Mobile-friendly connection lines (vertical) */}
          <div className="absolute top-0 left-1/2 h-full w-4 block md:hidden transform -translate-x-1/2">
            {/* First vertical connection */}
            <div className="absolute top-[25%] bottom-[62%] w-4 bg-gradient-to-b from-gray-300 to-blue-300 rounded-full z-0">
              {/* Arrow decorations */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="w-4 h-4 bg-blue-300 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            {/* Second vertical connection */}
            <div className="absolute top-[63%] bottom-[25%] w-4 bg-gradient-to-b from-blue-300 to-indigo-300 rounded-full z-0">
              {/* Arrow decorations */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="w-4 h-4 bg-indigo-300 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* The three workflow cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 relative z-10">
            {workflowSteps.map((step, index) => (
              <WorkflowStep 
                key={index} 
                index={index} 
                step={step} 
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default WorkflowSection;
