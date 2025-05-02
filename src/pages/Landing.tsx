import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Upload, Settings, Copy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { Card, CardContent } from "@/components/ui/card";

// Animation variants for smooth transitions
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.7, ease: "easeOut" }
  })
};

const Landing = () => {
  // Workflow steps for the process - Updated for kids
  const workflowSteps = [
    {
      icon: <Upload className="h-12 w-12 text-blue-500" />,
      title: "Import your contact list",
      description: "Upload your target accounts and Mizi automatically reads their website to understand their business.",
      animation: "animate-float",
      kidFriendlyTitle: "Collect Friends",
      kidFriendlyDescription: "Just like gathering your toys for playtime!",
      bgColor: "bg-[#F2FCE2]", // Soft green
      borderColor: "border-[#85D073]",
      characterSrc: "/images/friendly-robot-collecting.svg"
    },
    {
      icon: <Settings className="h-12 w-12 text-indigo-500" />,
      title: "Configure your campaign",
      description: "Our AI identifies the perfect approach for each prospect based on their business context and needs.",
      animation: "animate-pulse",
      kidFriendlyTitle: "Choose Your Adventure",
      kidFriendlyDescription: "Pick how you want to talk to your new friends!",
      bgColor: "bg-[#FEF7CD]", // Soft yellow
      borderColor: "border-[#FFD166]",
      characterSrc: "/images/friendly-robot-thinking.svg"
    },
    {
      icon: <Copy className="h-12 w-12 text-purple-500" />,
      title: "Get personalized copy",
      description: "Receive customized outreach templates for both email and LinkedIn that speak directly to your prospect's needs.",
      animation: "animate-scale",
      kidFriendlyTitle: "Magic Messages Appear!",
      kidFriendlyDescription: "Special letters for each friend that they'll love to read!",
      bgColor: "bg-[#E5DEFF]", // Soft purple
      borderColor: "border-[#A78BFA]",
      characterSrc: "/images/friendly-robot-writing.svg"
    }
  ];

  return (
    <div className="bg-white min-h-screen w-full text-gray-900 font-sans">
      {/* Navigation */}
      <nav className="px-4 md:px-8 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <Logo size="md" />
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Dashboard</Link>
          <Button size="sm" variant="outline" asChild>
            <Link to="/" className="flex items-center gap-1.5">
              <span>Try Mizi Now</span> 
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </nav>

      {/* Hero section */}
      <motion.section 
        className="px-4 md:px-8 py-16 md:py-28 max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={0}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            className="flex justify-center mb-8"
            variants={fadeIn}
            custom={0.5}
          >
            <Logo size="lg" withText={false} />
          </motion.div>
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            variants={fadeIn}
            custom={1}
          >
            AI that actually understands your prospects.
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            variants={fadeIn}
            custom={2}
          >
            Hyper-personalized cold outreach at scale. Get more replies, book more meetings.
          </motion.p>
          <motion.div
            variants={fadeIn}
            custom={3}
          >
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-base px-8 py-6 h-auto">
              <Link to="/" className="flex items-center gap-2">
                Try Mizi Now <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features section with connected workflow cards - Kid-friendly version */}
      <motion.section 
        className="px-4 md:px-8 py-16 md:py-20 bg-gradient-to-b from-white to-blue-50"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={4}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              How Mizi Works
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              It's as easy as 1-2-3! Follow the magic journey:
            </p>
          </div>
          
          {/* Kid-friendly Connected Workflow Cards */}
          <div className="relative max-w-6xl mx-auto mb-20">
            {/* Connection lines between cards */}
            <div className="absolute top-1/2 left-0 w-full h-4 hidden md:block">
              {/* First connection line */}
              <div className="absolute left-[25%] right-[62%] h-4 bg-gradient-to-r from-[#85D073] to-[#FFD166] rounded-full 
                            transform -translate-y-1/2 z-0">
                {/* Arrow decorations on the connection line */}
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 rotate-0">
                  <div className="w-4 h-4 bg-[#FFD166] rounded-full animate-pulse"></div>
                </div>
                <div className="absolute right-16 top-1/2 transform -translate-y-1/2 rotate-0">
                  <div className="w-3 h-3 bg-[#FFD166] rounded-full animate-pulse" 
                      style={{animationDelay: "0.2s"}}></div>
                </div>
                <div className="absolute right-24 top-1/2 transform -translate-y-1/2 rotate-0">
                  <div className="w-2 h-2 bg-[#FFD166] rounded-full animate-pulse"
                      style={{animationDelay: "0.4s"}}></div>
                </div>
              </div>
              
              {/* Second connection line */}
              <div className="absolute left-[63%] right-[25%] h-4 bg-gradient-to-r from-[#FFD166] to-[#A78BFA] rounded-full 
                            transform -translate-y-1/2 z-0">
                {/* Arrow decorations on the connection line */}
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 rotate-0">
                  <div className="w-4 h-4 bg-[#A78BFA] rounded-full animate-pulse"></div>
                </div>
                <div className="absolute right-16 top-1/2 transform -translate-y-1/2 rotate-0">
                  <div className="w-3 h-3 bg-[#A78BFA] rounded-full animate-pulse"
                      style={{animationDelay: "0.2s"}}></div>
                </div>
                <div className="absolute right-24 top-1/2 transform -translate-y-1/2 rotate-0">
                  <div className="w-2 h-2 bg-[#A78BFA] rounded-full animate-pulse"
                      style={{animationDelay: "0.4s"}}></div>
                </div>
              </div>
            </div>
            
            {/* Mobile-friendly connection lines (vertical) */}
            <div className="absolute top-0 left-1/2 h-full w-4 block md:hidden transform -translate-x-1/2">
              {/* First vertical connection */}
              <div className="absolute top-[25%] bottom-[62%] w-4 bg-gradient-to-b from-[#85D073] to-[#FFD166] rounded-full z-0">
                {/* Arrow decorations */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="w-4 h-4 bg-[#FFD166] rounded-full animate-pulse"></div>
                </div>
              </div>
              
              {/* Second vertical connection */}
              <div className="absolute top-[63%] bottom-[25%] w-4 bg-gradient-to-b from-[#FFD166] to-[#A78BFA] rounded-full z-0">
                {/* Arrow decorations */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="w-4 h-4 bg-[#A78BFA] rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            {/* The three workflow cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 relative z-10">
              {workflowSteps.map((step, index) => (
                <motion.div 
                  key={index}
                  className={`${step.bgColor} rounded-2xl p-6 shadow-xl border-4 ${step.borderColor} 
                             relative flex flex-col items-center z-20 max-w-md mx-auto w-full
                             transform transition-all duration-300 hover:-translate-y-2`}
                  variants={fadeIn}
                  custom={5 + index * 0.5}
                >
                  {/* Step number */}
                  <div className="w-14 h-14 rounded-full bg-white border-4 border-dashed 
                               border-blue-300 flex items-center justify-center mb-4 shadow-inner">
                    <span className="text-2xl font-bold text-blue-500">{index + 1}</span>
                  </div>
                  
                  {/* Character image */}
                  <div className={`w-28 h-28 mb-6 ${step.animation}`}>
                    <img 
                      src={step.characterSrc} 
                      alt={step.kidFriendlyTitle}
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-3xl font-bold mb-3 text-center">{step.kidFriendlyTitle}</h3>
                  <p className="text-lg text-gray-700 mb-5 text-center">{step.kidFriendlyDescription}</p>
                  
                  {/* Visual representation of the process */}
                  <div className="w-full mt-auto">
                    {index === 0 && (
                      <div className="flex flex-col items-center">
                        <div className="bg-white/60 p-4 rounded-xl border-2 border-dashed border-green-300">
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
                          <span className="text-sm font-bold bg-green-50 text-green-700 px-3 py-1 rounded-full">
                            Your friends waiting to play!
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {index === 1 && (
                      <div className="flex flex-col items-center">
                        <div className="bg-white/60 p-4 rounded-xl border-2 border-dashed border-yellow-300">
                          <div className="grid grid-cols-3 gap-2">
                            {["Friendly", "Professional", "Direct"].map((tone, i) => {
                              const isSelected = i === 0;
                              const baseClasses = "rounded-xl p-2 text-center transition-all duration-300 cursor-pointer border-2";
                              const colors = [
                                "bg-[#FDE1D3] border-[#F97316] text-orange-800",  // Orange
                                "bg-[#D3E4FD] border-[#0EA5E9] text-blue-800",    // Blue
                                "bg-[#FFDEE2] border-[#F43F5E] text-pink-800",    // Pink
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
                          <span className="text-sm font-bold bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full">
                            Pick your adventure style!
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {index === 2 && (
                      <div className="flex flex-col items-center">
                        <div className="bg-white/60 p-4 rounded-xl border-2 border-dashed border-purple-300 relative overflow-hidden">
                          {/* Magic sparkles animation */}
                          <div className="absolute inset-0 overflow-hidden">
                            {[...Array(10)].map((_, i) => (
                              <div 
                                key={i}
                                className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-ping"
                                style={{
                                  top: `${Math.random() * 100}%`,
                                  left: `${Math.random() * 100}%`,
                                  animationDuration: `${1 + Math.random() * 3}s`,
                                  animationDelay: `${Math.random() * 2}s`
                                }}
                              />
                            ))}
                          </div>
                          
                          {/* Magic message */}
                          <div className="bg-purple-50 rounded-xl p-3 border border-purple-200 relative z-10">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold text-purple-700">Magic Message</span>
                              <Copy className="h-4 w-4 text-purple-600" />
                            </div>
                            <p className="text-sm text-left text-gray-800">
                              <span className="font-bold">Dear Friend,</span><br/>
                              I saw you like 
                              <span className="inline-block animate-bounce mx-1 text-blue-500 font-bold">blocks</span>! 
                              Let's play with my 
                              <span className="inline-block animate-pulse mx-1 text-purple-500 font-bold">magic toys</span>
                              together!
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 text-center">
                          <span className="text-sm font-bold bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                            Your magic letter is ready!
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Adult explanation in smaller text */}
                  <div className="mt-6 text-xs text-gray-500 border-t border-gray-200 pt-4 w-full">
                    <p><strong>{step.title}</strong>: {step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials/Social proof section */}
      <motion.section 
        className="px-4 md:px-8 py-16 md:py-20"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={8}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by growth-focused teams</h2>
            <p className="text-gray-600 text-lg">Companies using Mizi see up to 3x higher response rates</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 w-32 bg-gray-200 rounded-md flex items-center justify-center">
                <p className="text-gray-500 font-medium">LOGO</p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div 
                key={i} 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                variants={fadeIn}
                custom={9 + i}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <p className="font-medium">Customer Name</p>
                    <p className="text-sm text-gray-500">Position, Company</p>
                  </div>
                </div>
                <p className="text-gray-600">"Mizi has completely transformed our outreach strategy. We're seeing response rates we never thought possible with personalized messages at scale."</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="px-4 md:px-8 py-16 md:py-20 bg-gradient-to-r from-blue-50 to-indigo-50"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={12}
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Ready to personalize your outreach?</h2>
          <p className="text-xl text-gray-600 mb-8">Built for agencies, reps and founders who hate generic outreach.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8">
              <Link to="/" className="flex items-center gap-2">
                Try Mizi Now <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              "Personalized at scale", 
              "AI-powered research", 
              "Higher response rates", 
              "More meetings booked"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2 justify-center">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="px-4 md:px-8 py-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <Logo size="sm" withText={false} />
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Mizi.app. All rights reserved.</p>
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-900">Terms</Link>
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-900">Privacy</Link>
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-900">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
