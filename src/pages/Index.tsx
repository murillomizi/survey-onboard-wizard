
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LogIn, UserPlus, Check, Package, Rocket, TrendingUp, Star, Shield, Loader, Send, Mail, Info, Copyright, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/logo";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { LoginDialog } from "@/components/ui/login-dialog";
import ChatInput from "@/components/survey/ChatInput";

// Animation variants for smooth transitions
const fadeIn = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [initialDialogTab, setInitialDialogTab] = useState<"login" | "register">("login");
  const [chatMessage, setChatMessage] = useState("");
  
  // Check for existing session
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  
  const handleOpenLoginDialog = () => {
    setInitialDialogTab("login");
    setShowLoginDialog(true);
    console.log("Opening login dialog");
  };
  
  const handleOpenRegisterDialog = () => {
    setInitialDialogTab("register");
    setShowLoginDialog(true);
    console.log("Opening register dialog with register tab");
  };

  const handleSendChatMessage = () => {
    if (chatMessage.trim()) {
      toast.success("Message sent! This is a demo - in a real app, this would be processed by an LLM.");
      setChatMessage("");
      handleOpenRegisterDialog(); // Optional: Open register dialog after sending message
    }
  };
  
  // Workflow steps para o processo - Reestilizado para minimalista
  const workflowSteps = [{
    title: "Identify Decision Makers",
    description: "Import your prospect list and let our AI analyze their business context for maximum relevance.",
    step: "01"
  }, {
    title: "Personalize at Scale",
    description: "Select approach and tone to match your ICP - casual, formal, or direct without sacrificing personalization.",
    step: "02"
  }, {
    title: "Automate Your Outreach",
    description: "Deploy hyper-personalized messages that reference prospects' business challenges and spark genuine interest.",
    step: "03"
  }];

  // Depoimentos simplificados
  const testimonials = [{
    quote: "Our response rates jumped from 2% to 7% after switching to Mizi's personalized approach.",
    name: "Alex Rodriguez",
    role: "BDR Manager",
    company: "SalesTech Inc.",
    before: "22 hours per week on research",
    after: "5 hours per week, triple the results"
  }, {
    quote: "I was spending 2 hours per day on prospect research. Now I use that time for actual calls.",
    name: "Sarah Johnson",
    role: "SDR Team Lead",
    company: "GrowthMetrics",
    before: "15 prospects researched daily",
    after: "50+ personalized outreach messages daily"
  }, {
    quote: "Mizi helped me stop sending generic templates while still maintaining my outreach volume.",
    name: "Michael Chen",
    role: "Sales Development Rep",
    company: "CloudScale",
    before: "1.5% response rate with templates",
    after: "6.2% response rate with Mizi"
  }];

  // Benefícios simplificados
  const benefits = [
    "3X higher response rates",
    "Consistent quality personalization",
    "Scales with your prospect list size",
    "More meetings booked"
  ];
  
  // Dados da tabela comparativa - com colunas "Qualidade" e "ROI" removidas
  const comparisonData = {
    categories: [
      "Personalization", 
      "Scalability", 
      "Speed", 
      "Cost-effectiveness",
      "Continuous learning"
    ],
    solutions: [
      {
        name: "Mizi AI",
        description: "Our specialized AI platform for outreach",
        ratings: [5, 5, 5, 5, 5],
        benefits: [
          "Deep personalization based on real business context",
          "Ability to process large volumes while maintaining high quality",
          "Automatic ICP analysis and relevant personalization",
          "Messages that reference specific prospect challenges",
          "Continuous learning with your feedback and results"
        ],
        highlight: true
      },
      {
        name: "Generic LLMs",
        description: "ChatGPT and similar tools for outreach",
        ratings: [3, 4, 1, 4, 3],
        benefits: [
          "Superficial personalization without business context",
          "Requires advanced prompt engineering",
          "Inconsistent output depending on prompt",
          "No specific optimization for B2B sales"
        ],
        highlight: false
      },
      {
        name: "Manual Prospecting",
        description: "SDRs manually researching and writing",
        ratings: [5, 1, 1, 1, 2],
        benefits: [
          "High personalization, but extremely time-consuming",
          "Impossible to scale without increasing team size",
          "Quality varies according to the professional",
          "High cost per personalized contact"
        ],
        highlight: false
      },
      {
        name: "Traditional Platforms",
        description: "Outreach automation tools",
        ratings: [1, 5, 5, 3, 1],
        benefits: [
          "Automation without real personalization",
          "High scalability with generic templates",
          "Typically low response rate (1-2%)",
          "No contextual intelligence about the prospect"
        ],
        highlight: false
      }
    ]
  };
  
  // Planos de preços - modificado para remover o Free Trial
  const pricingPlans = [
    {
      name: "MVP",
      description: "Ideal for growing sales teams",
      price: "Contact our team",
      duration: "",
      icon: Rocket,
      features: [
        "Up to 500 prospects",
        "Advanced personalization",
        "Custom templates",
        "Priority email support",
        "Analytics dashboard",
        "Team collaboration"
      ],
      highlightedFeature: "Most popular choice",
      cta: "Talk to Sales",
      popular: true,
      color: "bg-minimal-black text-minimal-white"
    },
    {
      name: "Scale",
      description: "Enterprise-level personalization",
      price: "Contact our team",
      duration: "",
      icon: TrendingUp,
      features: [
        "Unlimited prospects",
        "Elite personalization",
        "Custom integration",
        "Dedicated account manager",
        "Advanced analytics",
        "API access",
        "White-label options"
      ],
      highlightedFeature: "Ultimate solution",
      cta: "Contact Sales",
      popular: false,
      color: "bg-minimal-gray-100"
    }
  ];
  
  const getRatingColor = (rating) => {
    switch(rating) {
      case 1: return "text-red-500";
      case 2: return "text-orange-400";
      case 3: return "text-yellow-500"; 
      case 4: return "text-green-400";
      case 5: return "text-green-600 font-bold";
      default: return "";
    }
  };
  
  const getRatingText = (rating) => {
    switch(rating) {
      case 1: return "Weak";
      case 2: return "Basic";
      case 3: return "Average"; 
      case 4: return "Good";
      case 5: return "Excellent";
      default: return "";
    }
  };

  return (
    <div className="bg-minimal-white min-h-screen w-full text-minimal-black font-sans">
      {/* Login Dialog */}
      <LoginDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog}
        initialTab={initialDialogTab}
      />
      
      {/* Navigation - Simplificado */}
      <nav className="px-4 md:px-8 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <Logo size="md" />
        <div className="flex items-center gap-4">
          <Button 
            size="sm" 
            variant="outline" 
            className="border-minimal-gray-300 hover:bg-minimal-gray-100"
            onClick={handleOpenLoginDialog}
          >
            <LogIn className="h-3.5 w-3.5 mr-1.5" />
            <span>Login</span> 
          </Button>
          <Button 
            size="sm" 
            className="bg-minimal-black text-minimal-white hover:bg-minimal-gray-800"
            onClick={handleOpenRegisterDialog}
          >
            <UserPlus className="h-3.5 w-3.5 mr-1.5" />
            <span>Sign Up</span>
          </Button>
        </div>
      </nav>

      {/* Hero section */}
      <motion.section className="px-4 md:px-8 py-16 md:py-28 max-w-7xl mx-auto" initial="hidden" animate="visible" variants={fadeIn} custom={0}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight" variants={fadeIn} custom={1}>
            AI that actually personalize your approach.
          </motion.h1>
          <motion.p className="text-lg md:text-xl text-minimal-gray-600 mb-12 max-w-2xl mx-auto" variants={fadeIn} custom={2}>
            Hyper-personalized cold outreach at scale. Get more replies, book more meetings.
          </motion.p>
          <motion.div variants={fadeIn} custom={3} className="max-w-xl mx-auto">
            {/* Chat Input replacing the Button */}
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

      {/* New Section: Breaking Traditional Approach */}
      <motion.section 
        className="px-4 md:px-8 py-16 md:py-24 bg-minimal-white" 
        initial="hidden" 
        animate="visible" 
        variants={fadeIn} 
        custom={3.5}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Breaking the Outreach Paradigm
            </h2>
            <p className="text-minimal-gray-600 text-lg max-w-2xl mx-auto">
              The traditional dichotomy no longer makes sense. Our AI breaks the logic between manual personalized outreach and generic automated sends.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
            {/* Traditional Approach - Manual Personalization */}
            <motion.div 
              className="bg-minimal-gray-100 rounded-lg p-8 text-center relative overflow-hidden" 
              variants={fadeIn} 
              custom={4}
            >
              <div className="absolute top-3 right-3">
                <svg viewBox="0 0 24 24" width="24" height="24" className="opacity-20">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Manual Personalization</h3>
              <div className="mb-6 text-minimal-gray-700">
                <p className="mb-4">Traditional approach</p>
                <ul className="space-y-3 text-left">
                  <li className="flex items-center">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-minimal-gray-300 mr-2">✓</span>
                    <span>High quality</span>
                  </li>
                  <li className="flex items-center">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-minimal-gray-300 mr-2">✗</span>
                    <span>Extremely time-consuming</span>
                  </li>
                  <li className="flex items-center">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-minimal-gray-300 mr-2">✗</span>
                    <span>Limited volume</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-6 border-t border-minimal-gray-200">
                <div className="flex items-center justify-center">
                  <span className="text-xs text-minimal-gray-500">HUMAN EFFORT</span>
                  <div className="w-24 h-2 mx-2 bg-minimal-gray-200 rounded-full">
                    <div className="w-full h-full bg-minimal-gray-700 rounded-full"></div>
                  </div>
                  <span className="text-xs text-minimal-gray-500">HIGH</span>
                </div>
              </div>
            </motion.div>
            
            {/* Mizi AI - In the center */}
            <motion.div 
              className="bg-minimal-black text-minimal-white rounded-lg p-8 text-center transform md:scale-110 relative z-10 shadow-xl overflow-hidden" 
              variants={fadeIn} 
              custom={4.5}
            >
              <div className="absolute top-3 right-3">
                <svg viewBox="0 0 24 24" width="24" height="24" className="opacity-20">
                  <circle cx="12" cy="12" r="9" fill="none" stroke="white" strokeWidth="2" />
                  <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 mt-2">Mizi AI</h3>
              <div className="mb-6">
                <p className="mb-4">New approach</p>
                <ul className="space-y-3 text-left">
                  <li className="flex items-center">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-minimal-white mr-2">✓</span>
                    <span>High quality</span>
                  </li>
                  <li className="flex items-center">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-minimal-white mr-2">✓</span>
                    <span>Extremely fast</span>
                  </li>
                  <li className="flex items-center">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-minimal-white mr-2">✓</span>
                    <span>Scalable volume</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-6 border-t border-minimal-gray-700">
                {/* Button removed from here */}
              </div>
            </motion.div>
            
            {/* Traditional Approach - Generic Automation */}
            <motion.div 
              className="bg-minimal-gray-100 rounded-lg p-8 text-center relative overflow-hidden" 
              variants={fadeIn} 
              custom={5}
            >
              <div className="absolute top-3 right-3">
                <svg viewBox="0 0 24 24" width="24" height="24" className="opacity-20">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M7 8h10M7 12h10M7 16h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Generic Automation</h3>
              <div className="mb-6 text-minimal-gray-700">
                <p className="mb-4">Traditional approach</p>
                <ul className="space-y-3 text-left">
                  <li className="flex items-center">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-minimal-gray-300 mr-2">✗</span>
                    <span>Low quality</span>
                  </li>
                  <li className="flex items-center">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-minimal-gray-300 mr-2">✓</span>
                    <span>Extremely fast</span>
                  </li>
                  <li className="flex items-center">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-minimal-gray-300 mr-2">✓</span>
                    <span>Scalable volume</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-6 border-t border-minimal-gray-200">
                <div className="flex items-center justify-center">
                  <span className="text-xs text-minimal-gray-500">GENERIC</span>
                  <div className="w-24 h-2 mx-2 bg-minimal-gray-200 rounded-full">
                    <div className="w-full h-full bg-minimal-gray-400 rounded-full"></div>
                  </div>
                  <span className="text-xs text-minimal-gray-500">TEMPLATED</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Connecting line visuals - Improved for better visual explanation */}
          <div className="hidden md:flex justify-center items-center relative h-20 mt-8 mb-16">
            {/* Left arrow */}
            <div className="absolute left-1/4 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
              <svg width="60" height="60" viewBox="0 0 60 60" className="opacity-30">
                <path d="M30,10 L50,30 L45,35 L35,25 L35,50 L25,50 L25,25 L15,35 L10,30 L30,10 Z" fill="#000000" />
              </svg>
            </div>
            
            {/* Right arrow */}
            <div className="absolute right-1/4 transform translate-x-1/2 top-1/2 -translate-y-1/2">
              <svg width="60" height="60" viewBox="0 0 60 60" className="opacity-30">
                <path d="M30,10 L50,30 L45,35 L35,25 L35,50 L25,50 L25,25 L15,35 L10,30 L30,10 Z" fill="#000000" />
              </svg>
            </div>
            
            {/* Middle circle with Mizi logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 w-16 h-16 bg-minimal-black rounded-full flex items-center justify-center shadow-lg">
              <Logo size="sm" withText={false} className="transform scale-75" />
            </div>
            
            <div className="w-full max-w-xl h-0.5 bg-minimal-gray-200"></div>
          </div>
          
          {/* Text explanation of the paradigm shift */}
          <div className="max-w-2xl mx-auto text-center mt-8">
            <p className="text-minimal-gray-600">
              Mizi AI creates a new category - combining the high quality of manual personalization with the speed and scale of automation. This isn't just an incremental improvement; it's a fundamental shift in how outreach works.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Features section */}
      <motion.section className="px-4 md:px-8 py-16 md:py-24 bg-minimal-gray-100" initial="hidden" animate="visible" variants={fadeIn} custom={4}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Simplify Your Outreach Workflow
            </h2>
            <p className="text-minimal-gray-600 text-lg max-w-2xl mx-auto">
              From prospect identification to personalized messaging in three simple steps
            </p>
          </div>
          
          {/* Steps minimalista */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {workflowSteps.map((step, index) => (
              <motion.div 
                key={index} 
                className="bg-minimal-white p-8 rounded-lg border border-minimal-gray-200
                        transition-all duration-300 hover:shadow-lg hover:-translate-y-2"
                variants={fadeIn} 
                custom={5 + index * 0.5}
              >
                <div className="mb-6">
                  <span className="text-5xl font-light text-minimal-gray-300">{step.step}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-minimal-gray-600 mb-6">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Comparison table */}
      <motion.section 
        className="px-4 md:px-8 py-16 md:py-28 bg-minimal-white" 
        initial="hidden" 
        animate="visible" 
        variants={fadeIn} 
        custom={6}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Mizi AI vs. Traditional Solutions
            </h2>
            <p className="text-minimal-gray-600 text-lg max-w-2xl mx-auto">
              See how we compare to other approaches in the market
            </p>
          </div>
          
          {/* Comparison table for desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <Table className="w-full border-collapse">
              <TableHeader>
                <TableRow className="bg-minimal-gray-50">
                  <TableHead className="w-[180px] text-base font-bold">Solution</TableHead>
                  {comparisonData.categories.map((category, idx) => (
                    <TableHead key={idx} className="text-base font-bold text-center">
                      {category}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.solutions.map((solution, idx) => (
                  <TableRow 
                    key={idx} 
                    className={`${solution.highlight ? 'bg-minimal-gray-100' : ''} hover:bg-minimal-gray-50`}
                  >
                    <TableCell className="align-top">
                      <div className="font-bold text-lg mb-1">
                        {solution.name}
                      </div>
                      <div className="text-sm text-minimal-gray-600">{solution.description}</div>
                    </TableCell>
                    
                    {solution.ratings.map((rating, rIdx) => (
                      <TableCell key={rIdx} className="text-center align-middle">
                        <span className={`text-lg ${getRatingColor(rating)}`}>
                          {"★".repeat(rating)}{"☆".repeat(5-rating)}
                        </span>
                        <div className="text-xs mt-1">{getRatingText(rating)}</div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Responsive comparison table for mobile */}
          <div className="lg:hidden space-y-8">
            {comparisonData.solutions.map((solution, idx) => (
              <div 
                key={idx}
                className={`p-6 rounded-lg border ${solution.highlight ? 'border-minimal-black ring-2 ring-minimal-black' : 'border-minimal-gray-200'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-bold text-xl mb-1">{solution.name}</div>
                    <div className="text-sm text-minimal-gray-600">{solution.description}</div>
                  </div>
                </div>
                
                <div className="space-y-3 mt-6">
                  {comparisonData.categories.map((category, cIdx) => (
                    <div key={cIdx} className="grid grid-cols-2 gap-2">
                      <div className="text-minimal-gray-600">{category}</div>
                      <div className={`${getRatingColor(solution.ratings[cIdx])} text-right`}>
                        {"★".repeat(solution.ratings[cIdx])}{"☆".repeat(5-solution.ratings[cIdx])}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-minimal-gray-200">
                  <div className="font-medium mb-2">Key Benefits:</div>
                  <ul className="text-sm space-y-1 list-disc pl-5">
                    {solution.benefits.map((benefit, bIdx) => (
                      <li key={bIdx}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Button 
              size="lg" 
              className="bg-minimal-black text-minimal-white hover:bg-minimal-gray-900 text-base px-8 py-3 h-auto rounded-md"
              onClick={handleOpenRegisterDialog}
            >
              Try Mizi Now <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Pricing Plans Section - Modificada para ter apenas dois planos */}
      <motion.section 
        className="px-4 md:px-8 py-16 md:py-28 bg-minimal-gray-100" 
        initial="hidden" 
        animate="visible" 
        variants={fadeIn} 
        custom={7}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Choose Your Mizi Plan
            </h2>
            <p className="text-minimal-gray-600 text-lg max-w-2xl mx-auto">
              Flexible options to meet your outreach needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => {
              const PlanIcon = plan.icon;
              return (
                <motion.div
                  key={index}
                  className={`rounded-xl overflow-hidden border ${plan.popular ? 'border-minimal-black ring-2 ring-minimal-black' : 'border-minimal-gray-200'}`}
                  variants={fadeIn}
                  custom={7.5 + index * 0.5}
                >
                  <Card className={`h-full ${plan.color}`}>
                    <CardHeader className="text-center pb-4">
                      <div className="mx-auto mb-4 p-2 rounded-full bg-opacity-10 bg-white inline-flex">
                        <PlanIcon className="h-8 w-8" />
                      </div>
                      <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                      <CardDescription className={`${plan.color === 'bg-minimal-black text-minimal-white' ? 'text-minimal-gray-300' : 'text-minimal-gray-500'}`}>
                        {plan.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center pt-4 pb-6">
                      <div className="mb-6">
                        <span className="text-xl font-bold">{plan.price}</span>
                      </div>
                      
                      {plan.popular && (
                        <Badge className="mx-auto mb-6 bg-minimal-white text-minimal-black hover:bg-minimal-gray-100">
                          Most Popular
                        </Badge>
                      )}
                      
                      <ul className={`space-y-3 text-left mb-8 ${plan.color === 'bg-minimal-black text-minimal-white' ? 'text-minimal-gray-100' : 'text-minimal-gray-700'}`}>
                        {plan.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-start">
                            <Check className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="pt-2 pb-6 flex justify-center">
                      <Button 
                        className={plan.color === 'bg-minimal-black text-minimal-white' 
                          ? "w-full bg-minimal-white text-minimal-black hover:bg-minimal-gray-100" 
                          : "w-full bg-minimal-black text-minimal-white hover:bg-minimal-gray-800"}
                        size="lg"
                        onClick={handleOpenLoginDialog}
                      >
                        {plan.cta}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          
          <div className="text-center mt-12 pt-8 border-t border-minimal-gray-200">
            <p className="text-minimal-gray-600 mb-6">
              To learn more about our plans and pricing, contact our sales team.
            </p>
            <Button variant="outline" size="lg" className="border-minimal-gray-300" onClick={handleOpenLoginDialog}>
              <Shield className="h-4 w-4 mr-2" /> Talk to Sales Team
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Footer Section - Changed from black background to white */}
      <motion.footer 
        className="px-4 md:px-8 py-10 md:py-16 bg-minimal-white text-minimal-black border-t border-minimal-gray-200" 
        initial="hidden" 
        animate="visible" 
        variants={fadeIn} 
        custom={8}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-minimal-gray-200">
            {/* Company Information */}
            <div>
              <Logo size="md" />
              <p className="text-minimal-gray-600 mt-4 text-sm">
                Revolutionizing B2B outreach with AI-powered personalization at scale.
              </p>
              <div className="flex gap-4 mt-6">
                <a href="#" className="text-minimal-black hover:text-minimal-gray-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                <a href="#" className="text-minimal-black hover:text-minimal-gray-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-minimal-black font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-minimal-gray-600">
                <li>
                  <a href="#" className="hover:text-minimal-black transition-colors">Home</a>
                </li>
                <li>
                  <a href="#" className="hover:text-minimal-black transition-colors">About Us</a>
                </li>
                <li>
                  <a href="#" className="hover:text-minimal-black transition-colors">Features</a>
                </li>
                <li>
                  <a href="#" className="hover:text-minimal-black transition-colors">Pricing</a>
                </li>
                <li>
                  <a href="#" className="hover:text-minimal-black transition-colors">Contact</a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-minimal-black font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-minimal-gray-600">
                <li>
                  <a href="#" className="hover:text-minimal-black transition-colors">
                    <span className="flex items-center gap-2">
                      <Info size={16} />
                      <span>Terms of Service</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-minimal-black transition-colors">
                    <span className="flex items-center gap-2">
                      <Shield size={16} />
                      <span>Privacy Policy</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-minimal-black transition-colors">
                    <span className="flex items-center gap-2">
                      <Copyright size={16} />
                      <span>Copyright Notice</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-minimal-black transition-colors">
                    <span className="flex items-center gap-2">
                      <Settings size={16} />
                      <span>Cookie Settings</span>
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-minimal-black font-bold mb-4">Contact Us</h4>
              <ul className="space-y-4 text-minimal-gray-600">
                <li className="flex items-start gap-2">
                  <Mail size={18} className="mt-1 flex-shrink-0" />
                  <span>contact@mizi.ai</span>
                </li>
                <li>
                  <Button 
                    variant="outline" 
                    className="w-full border-minimal-gray-300 hover:bg-minimal-gray-100 hover:border-minimal-gray-400"
                    onClick={handleOpenLoginDialog}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    <span>Send Message</span>
                  </Button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="md:flex justify-between items-center text-minimal-gray-600 text-sm">
            <div className="mb-4 md:mb-0 flex items-center">
              <Copyright size={16} className="mr-2" />
              <p>2025 Mizi AI. All rights reserved.</p>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <a href="#" className="hover:text-minimal-black transition-colors">Security</a>
              <a href="#" className="hover:text-minimal-black transition-colors">Accessibility</a>
              <a href="#" className="hover:text-minimal-black transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;
