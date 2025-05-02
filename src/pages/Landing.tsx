import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Upload, Settings, Copy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
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
  const [activeStep, setActiveStep] = useState(0);
  
  // Animation steps for the workflow process - Updated for kids
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

  // Function to handle carousel navigation
  const handleSetActiveStep = (index: number) => {
    setActiveStep(index);
  };

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

      {/* Features section with animated workflow - Now more kid-friendly! */}
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
          
          {/* Kid-friendly Workflow Animation Carousel */}
          <div className="mb-16">
            <Carousel
              opts={{ loop: true, align: "center" }}
              className="w-full max-w-4xl mx-auto"
              onSelect={(index) => handleSetActiveStep(index)}
            >
              <CarouselContent>
                {workflowSteps.map((step, index) => (
                  <CarouselItem key={index} className="md:basis-1/1">
                    <Card className={`border-4 ${step.borderColor} shadow-lg ${step.bgColor} rounded-xl overflow-hidden`}>
                      <CardContent className="flex flex-col items-center p-8">
                        {/* Fun character or mascot */}
                        <div className={`w-32 h-32 mb-6 ${step.animation}`}>
                          {/* Will fall back to the icon if SVG isn't available */}
                          {step.characterSrc ? 
                            <img 
                              src={step.characterSrc} 
                              alt={step.kidFriendlyTitle}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                document.getElementById(`icon-fallback-${index}`)!.style.display = 'flex';
                              }} 
                              className="w-full h-full object-contain" 
                            /> :
                            <div id={`icon-fallback-${index}`} className={`mb-6 p-4 rounded-full ${step.bgColor}`}>
                              {step.icon}
                            </div>
                          }
                        </div>
                        
                        {/* Kid-friendly step number */}
                        <div className="w-12 h-12 mb-4 rounded-full bg-white border-4 border-dashed border-blue-400 flex items-center justify-center">
                          <span className="text-2xl font-bold text-blue-500">{index + 1}</span>
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-2 text-center">{step.kidFriendlyTitle}</h3>
                        <p className="text-gray-700 text-center text-lg mb-6">{step.kidFriendlyDescription}</p>
                        
                        {/* Adult explanation in smaller text */}
                        <div className="mt-2 text-sm text-gray-500 border-t border-gray-200 pt-4 w-full text-center">
                          <p><strong>{step.title}</strong>: {step.description}</p>
                        </div>
                        
                        {/* Visual representation of the process - More playful */}
                        <div className="mt-8 w-full">
                          {index === 0 && (
                            <div className="flex flex-col items-center">
                              <div className="relative w-full max-w-md h-40 border-4 border-dashed border-blue-300 rounded-2xl flex items-center justify-center bg-blue-50 mb-4 overflow-hidden">
                                {/* Animated characters representing contacts */}
                                <div className="flex gap-3">
                                  {[...Array(5)].map((_, i) => (
                                    <div 
                                      key={i}
                                      className={`bg-white rounded-full h-14 w-14 flex items-center justify-center shadow-md animate-bounce`}
                                      style={{ 
                                        animationDuration: `${1 + i * 0.2}s`,
                                        animationDelay: `${i * 0.1}s`
                                      }}
                                    >
                                      <Users className={`text-blue-${400 + i * 100} h-8 w-8`} />
                                    </div>
                                  ))}
                                </div>
                                <div className="absolute -right-2 -top-2 bg-blue-500 text-white text-lg rounded-full h-10 w-10 flex items-center justify-center border-2 border-white">
                                  <span>10</span>
                                </div>
                              </div>
                              <p className="text-lg text-blue-700 font-medium">Your friends are ready to play!</p>
                            </div>
                          )}
                          
                          {index === 1 && (
                            <div className="flex flex-col items-center">
                              <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                                {["Friendly", "Professional", "Direct"].map((tone, i) => {
                                  const isSelected = i === 1;
                                  const baseClasses = "rounded-2xl p-5 text-center transition-all duration-300 cursor-pointer border-4";
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
                                        ${isSelected ? 'transform scale-110 shadow-lg animate-pulse' : 'opacity-70 hover:opacity-100'}
                                      `}
                                    >
                                      <div className="mb-2">
                                        {/* Emoji icons */}
                                        <span className="text-2xl">
                                          {i === 0 ? '😊' : i === 1 ? '👔' : '🎯'}
                                        </span>
                                      </div>
                                      <p className="text-base font-bold">{tone}</p>
                                    </div>
                                  );
                                })}
                              </div>
                              <p className="text-lg text-blue-700 font-medium mt-6">Pick your favorite color!</p>
                            </div>
                          )}
                          
                          {index === 2 && (
                            <div className="flex flex-col items-center">
                              <div className="bg-white rounded-2xl p-6 w-full max-w-md border-4 border-purple-300 shadow-lg relative overflow-hidden">
                                {/* Magic sparkles animation */}
                                <div className="absolute inset-0 overflow-hidden">
                                  {[...Array(20)].map((_, i) => (
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
                                
                                <div className="relative z-10">
                                  <div className="flex justify-between items-center mb-4">
                                    <p className="text-sm font-bold text-purple-800 bg-purple-100 px-3 py-1 rounded-full">Magic Message</p>
                                    <Copy className="h-5 w-5 text-purple-600 cursor-pointer hover:text-purple-800" />
                                  </div>
                                  
                                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 shadow-inner border border-purple-100">
                                    <p className="text-lg text-gray-800 leading-relaxed">
                                      <span className="font-bold">Dear Friend,</span><br/>
                                      I saw you like 
                                      <span className="inline-block animate-bounce mx-1 text-blue-500 font-bold">building blocks</span>
                                      ! I have cool 
                                      <span className="inline-block animate-pulse mx-1 text-purple-500 font-bold">magic blocks</span>
                                      to show you!<br/>
                                      <span className="font-bold">Let's play together!</span>
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="mt-4 flex justify-between">
                                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">For: Building Block Store</span>
                                  <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">✓ Ready to send!</span>
                                </div>
                              </div>
                              <p className="text-lg text-blue-700 font-medium mt-6">Your magic letter is ready!</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-8 gap-2">
                {workflowSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleSetActiveStep(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      activeStep === index 
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 w-12 shadow-md" 
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>
              <div className="flex justify-center mt-6 gap-8">
                <CarouselPrevious className="relative inset-0 translate-y-0 -left-4 h-12 w-12 rounded-full border-4 border-blue-300 bg-white text-blue-500 hover:bg-blue-50" />
                <CarouselNext className="relative inset-0 translate-y-0 -right-4 h-12 w-12 rounded-full border-4 border-blue-300 bg-white text-blue-500 hover:bg-blue-50" />
              </div>
            </Carousel>
          </div>
          
          {/* Three steps summary cards - Kid-friendly version */}
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
            {workflowSteps.map((step, i) => (
              <motion.div 
                key={i}
                className={`${step.bgColor} p-8 rounded-2xl shadow-lg border-4 ${step.borderColor}`}
                variants={fadeIn}
                custom={5 + i}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 border-4 border-dashed border-blue-300 shadow-inner">
                  <span className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-500 bg-clip-text text-transparent">{i + 1}</span>
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.kidFriendlyTitle}</h3>
                <p className="text-gray-700 text-lg">{step.kidFriendlyDescription}</p>
                
                {/* Icon at the bottom */}
                <div className="mt-4 flex justify-end">
                  <div className={`p-3 rounded-full ${i === 0 ? 'bg-blue-100' : i === 1 ? 'bg-yellow-100' : 'bg-purple-100'}`}>
                    {step.icon}
                  </div>
                </div>
              </motion.div>
            ))}
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
