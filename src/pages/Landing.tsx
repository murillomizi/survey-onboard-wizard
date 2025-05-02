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
  
  // Animation steps for the workflow process
  const workflowSteps = [
    {
      icon: <Upload className="h-12 w-12 text-blue-500" />,
      title: "Import your contact list",
      description: "Upload your target accounts and Mizi automatically reads their website to understand their business.",
      animation: "animate-float"
    },
    {
      icon: <Settings className="h-12 w-12 text-indigo-500" />,
      title: "Configure your campaign",
      description: "Our AI identifies the perfect approach for each prospect based on their business context and needs.",
      animation: "animate-pulse"
    },
    {
      icon: <Copy className="h-12 w-12 text-purple-500" />,
      title: "Get personalized copy",
      description: "Receive customized outreach templates for both email and LinkedIn that speak directly to your prospect's needs.",
      animation: "animate-scale"
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

      {/* Features section with animated workflow */}
      <motion.section 
        className="px-4 md:px-8 py-16 md:py-20 bg-gray-50"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={4}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Mizi works</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Personalize your outreach with AI that truly understands your target accounts.</p>
          </div>
          
          {/* Workflow Animation Carousel */}
          <div className="mb-16">
            <Carousel
              opts={{ loop: true, align: "center" }}
              className="w-full max-w-4xl mx-auto"
              onSelect={(index) => setActiveStep(index)}
            >
              <CarouselContent>
                {workflowSteps.map((step, index) => (
                  <CarouselItem key={index} className="md:basis-1/1">
                    <Card className="border-0 shadow-lg bg-white rounded-xl overflow-hidden">
                      <CardContent className="flex flex-col items-center p-8">
                        <div className={`mb-6 p-4 rounded-full bg-blue-50 ${step.animation}`}>
                          {step.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                        <p className="text-gray-600 text-center">{step.description}</p>
                        
                        {/* Visual representation of the process */}
                        <div className="mt-8 w-full">
                          {index === 0 && (
                            <div className="flex flex-col items-center">
                              <div className="relative w-full max-w-md h-32 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center bg-blue-50 mb-4">
                                <Users className="text-blue-400 h-10 w-10 animate-pulse" />
                                <div className="absolute -right-2 -top-2 bg-blue-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                                  <span>10</span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500">Your contact list is ready to be processed</p>
                            </div>
                          )}
                          
                          {index === 1 && (
                            <div className="flex flex-col items-center">
                              <div className="grid grid-cols-3 gap-3 w-full max-w-md">
                                <div className="bg-indigo-100 rounded-lg p-3 text-center hover:bg-indigo-200 transition-colors cursor-pointer border-2 border-indigo-300">
                                  <p className="text-xs font-medium text-indigo-800">Friendly</p>
                                </div>
                                <div className="bg-indigo-500 rounded-lg p-3 text-center shadow-md transform scale-110 border-2 border-indigo-600">
                                  <p className="text-xs font-medium text-white">Professional</p>
                                </div>
                                <div className="bg-indigo-100 rounded-lg p-3 text-center hover:bg-indigo-200 transition-colors cursor-pointer border-2 border-indigo-300">
                                  <p className="text-xs font-medium text-indigo-800">Direct</p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 mt-4">Choose the tone that fits your campaign</p>
                            </div>
                          )}
                          
                          {index === 2 && (
                            <div className="flex flex-col items-center">
                              <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-4 w-full max-w-md border border-purple-200">
                                <div className="flex justify-between items-center mb-2">
                                  <p className="text-xs font-semibold text-purple-800">To: prospect@company.com</p>
                                  <Copy className="h-4 w-4 text-purple-600 cursor-pointer hover:text-purple-800" />
                                </div>
                                <div className="bg-white rounded-md p-3 shadow-sm">
                                  <p className="text-sm text-gray-800 leading-relaxed">
                                    Hi [Name], I noticed that [Company] has been focusing on [insight from website]. 
                                    Our solution could help you [personalized value proposition]...
                                  </p>
                                </div>
                                <div className="mt-2 flex justify-between">
                                  <span className="text-xs text-purple-700">Personalized for: Company Inc.</span>
                                  <span className="text-xs text-green-600 font-medium">✓ Ready to send</span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 mt-4">Your personalized outreach is ready</p>
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
                    onClick={() => setActiveStep(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      activeStep === index ? "bg-blue-600 w-8" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>
              <div className="flex justify-center mt-6">
                <CarouselPrevious className="relative inset-0 translate-y-0 -left-4" />
                <CarouselNext className="relative inset-0 translate-y-0 -right-4" />
              </div>
            </Carousel>
          </div>
          
          {/* Three steps summary cards */}
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {workflowSteps.map((step, i) => (
              <motion.div 
                key={i}
                className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
                variants={fadeIn}
                custom={5 + i}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-blue-600 text-xl font-bold">{i + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials/Social proof section (placeholders) */}
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
