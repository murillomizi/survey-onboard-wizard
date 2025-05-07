
import React from "react";
import { motion } from "framer-motion";
import { Users, Copy } from "lucide-react";

// Animation variants for smooth transitions
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.7, ease: "easeOut" }
  })
};

export interface WorkflowStepProps {
  index: number;
  step: {
    icon: React.ReactNode;
    title: string;
    description: string;
    animation: string;
    sdrbdrTitle: string;
    sdrbdrDescription: string;
    bgColor: string;
    borderColor: string;
    characterSrc: string;
  };
  customFadeIn?: number;
}

const WorkflowStep = ({ index, step, customFadeIn = 5 }: WorkflowStepProps) => {
  return (
    <motion.div 
      className={`${step.bgColor} rounded-2xl p-6 shadow-lg border-2 ${step.borderColor} 
                  relative flex flex-col items-center z-20 max-w-md mx-auto w-full
                  transform transition-all duration-300 hover:-translate-y-2`}
      variants={fadeIn}
      custom={customFadeIn + index * 0.5}
    >
      {/* Step number */}
      <div className="w-14 h-14 rounded-full bg-white border-2 border-dashed 
                    border-gray-300 flex items-center justify-center mb-4 shadow-inner">
        <span className="text-2xl font-bold text-gray-700">{index + 1}</span>
      </div>
      
      {/* Character image */}
      <div className={`w-28 h-28 mb-6 ${step.animation}`}>
        <img 
          src={step.characterSrc} 
          alt={step.sdrbdrTitle}
          className="w-full h-full object-contain" 
        />
      </div>
      
      {/* Content */}
      <h3 className="text-3xl font-bold mb-3 text-center text-gray-800">{step.sdrbdrTitle}</h3>
      <p className="text-lg text-gray-700 mb-5 text-center">{step.sdrbdrDescription}</p>
      
      {/* Visual representation of the process */}
      <div className="w-full mt-auto">
        {index === 0 && (
          <div className="flex flex-col items-center">
            <div className="bg-white/80 p-4 rounded-xl border-2 border-dashed border-gray-300">
              {/* Animated characters representing contacts */}
              <div className="flex gap-2 flex-wrap justify-center">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    className={`bg-white rounded-full h-12 w-12 flex items-center justify-center shadow-md animate-bounce`}
                    style={{ 
                      animationDuration: `${1 + i * 0.2}s`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  >
                    <Users className={`text-blue-${400 + i * 100} h-6 w-6`} />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 text-center">
              <span className="text-sm font-bold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                Target accounts ready for outreach
              </span>
            </div>
          </div>
        )}
        
        {index === 1 && (
          <div className="flex flex-col items-center">
            <div className="bg-white/80 p-4 rounded-xl border-2 border-dashed border-blue-200">
              <div className="grid grid-cols-3 gap-2">
                {["Friendly", "Professional", "Direct"].map((tone, i) => {
                  const isSelected = i === 0;
                  const baseClasses = "rounded-xl p-2 text-center transition-all duration-300 cursor-pointer border-2";
                  const colors = [
                    "bg-blue-50 border-blue-300 text-blue-800",  // Blue
                    "bg-gray-50 border-gray-300 text-gray-800",  // Gray
                    "bg-indigo-50 border-indigo-300 text-indigo-800",  // Indigo
                  ];
                  
                  return (
                    <div 
                      key={i}
                      className={`
                        ${baseClasses} ${colors[i]}
                        ${isSelected ? 'transform scale-110 shadow-lg animate-pulse' : 'opacity-70'}
                      `}
                    >
                      <div className="mb-1">
                        <span className="text-lg">
                          {i === 0 ? '😊' : i === 1 ? '👔' : '🎯'}
                        </span>
                      </div>
                      <p className="text-xs font-bold">{tone}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-3 text-center">
              <span className="text-sm font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                Select your outreach approach
              </span>
            </div>
          </div>
        )}
        
        {index === 2 && (
          <div className="flex flex-col items-center">
            <div className="bg-white/80 p-4 rounded-xl border-2 border-dashed border-indigo-200 relative overflow-hidden">
              {/* Magic sparkles animation */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-2 h-2 bg-indigo-200 rounded-full animate-ping"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDuration: `${1 + Math.random() * 3}s`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>
              
              {/* Personalized message */}
              <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100 relative z-10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-indigo-700">Personalized Outreach</span>
                  <Copy className="h-4 w-4 text-indigo-600" />
                </div>
                <p className="text-sm text-left text-gray-800">
                  <span className="font-bold">Hi [Name],</span><br/>
                  I noticed your team at
                  <span className="inline-block animate-pulse mx-1 text-blue-600 font-bold">[Company]</span> 
                  is focusing on 
                  <span className="inline-block animate-bounce mx-1 text-indigo-600 font-bold">[Pain Point]</span>
                  this quarter...
                </p>
              </div>
            </div>
            <div className="mt-3 text-center">
              <span className="text-sm font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                AI-crafted personalized messages
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Professional explanation */}
      <div className="mt-6 text-xs text-gray-500 border-t border-gray-200 pt-4 w-full">
        <p><strong>{step.title}</strong>: {step.description}</p>
      </div>
    </motion.div>
  );
};

export default WorkflowStep;
