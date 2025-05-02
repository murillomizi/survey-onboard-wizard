import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Upload, Settings, Copy, Users, Clock, ZapIcon, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  // Time-saving comparison scenarios
  const timeComparisonScenarios = [
    {
      title: "The Manual Method",
      description: "Hours researching each prospect individually",
      time: "8+ hours",
      icon: <Clock className="h-8 w-8 text-red-500" />,
      color: "bg-red-50 border-red-200",
      problems: [
        "Research fatigue leads to shortcuts",
        "Inconsistent quality across outreach",
        "Limited scalability - you can only do so many per day"
      ]
    },
    {
      title: "The Generic Blast",
      description: "One message sent to everyone",
      time: "15 minutes",
      icon: <ZapIcon className="h-8 w-8 text-amber-500" />,
      color: "bg-amber-50 border-amber-200",
      problems: [
        "Terrible response rates (<1%)",
        "Damages your reputation and domain",
        "Wastes valuable prospects"
      ]
    },
    {
      title: "The Mizi Way",
      description: "AI-powered personalization at scale",
      time: "1 hour",
      icon: <TrendingUp className="h-8 w-8 text-green-500" />,
      color: "bg-green-50 border-green-200",
      benefits: [
        "3X higher response rates",
        "Consistent quality personalization",
        "Scales with your prospect list size"
      ]
    }
  ];

  // Pricing plans - Updated with new prices
  const pricingPlans = [
    {
      name: "MVP",
      description: "Perfect for SDRs getting started with personalized outreach",
      price: "150",
      period: "mo",
      color: "bg-gray-50",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      borderColor: "border-gray-200",
      features: [
        "Up to 100 personalized messages",
        "Email templates",
        "Basic AI personalization",
        "Export to CSV",
        "Email support"
      ],
      limitations: [
        "No LinkedIn integration",
        "No custom branding",
        "Basic analytics only"
      ]
    },
    {
      name: "SCALE",
      description: "For sales teams looking to scale personalized outreach",
      price: "Custom Quote",
      period: "",
      color: "bg-indigo-50",
      buttonColor: "bg-indigo-600 hover:bg-indigo-700",
      borderColor: "border-indigo-200",
      features: [
        "Unlimited personalized messages",
        "Email & LinkedIn templates",
        "Advanced AI personalization",
        "CRM integration",
        "Team collaboration",
        "Custom branding",
        "Advanced analytics dashboard",
        "Priority support"
      ],
      isMostPopular: true
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

      {/* Features section with connected workflow cards - SDR/BDR version */}
      <motion.section 
        className="px-4 md:px-8 py-16 md:py-20 bg-gradient-to-b from-white to-gray-50" // Updated to a subtle gradient
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
                <motion.div 
                  key={index}
                  className={`${step.bgColor} rounded-2xl p-6 shadow-lg border-2 ${step.borderColor} 
                             relative flex flex-col items-center z-20 max-w-md mx-auto w-full
                             transform transition-all duration-300 hover:-translate-y-2`}
                  variants={fadeIn}
                  custom={5 + index * 0.5}
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
                  
                  {/* Visual representation of the process - keep these with their existing styles but update any color references */}
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
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* New Section: Time-saving Personalization Comparison */}
      <motion.section 
        className="px-4 md:px-8 py-16 md:py-24 bg-white"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={7}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
              Stop Wasting Time on Personalization
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              There's a better way to personalize your outreach without spending hours or settling for generic templates
            </p>
          </div>

          {/* Visual Time Comparison Cards - updated with minimalist colors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {timeComparisonScenarios.map((scenario, index) => (
              <motion.div
                key={index}
                className={`rounded-xl p-6 border-2 shadow-lg ${
                  index === 0 ? "bg-gray-50 border-gray-200" : 
                  index === 1 ? "bg-blue-50 border-blue-200" : 
                  "bg-indigo-50 border-indigo-200"
                } transition-all duration-300 hover:-translate-y-2`}
                variants={fadeIn}
                custom={7.5 + index * 0.2}
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">{scenario.title}</h3>
                  {scenario.icon}
                </div>
                
                <p className="text-gray-600 mb-4">{scenario.description}</p>
                
                {/* Time indicator */}
                <div className="flex items-center justify-center mb-8">
                  <div className={`rounded-full py-2 px-8 ${
                    index === 0 ? "bg-gray-100 text-gray-700" :
                    index === 1 ? "bg-blue-100 text-blue-700" :
                    "bg-indigo-100 text-indigo-700"
                  }`}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      <span className="text-xl font-bold">{scenario.time}</span>
                    </div>
                  </div>
                </div>
                
                {/* Problems or Benefits list */}
                <ul className="space-y-3">
                  {scenario.problems ? (
                    scenario.problems.map((problem, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0">
                          <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-600 text-sm">✕</span>
                          </div>
                        </div>
                        <span className="text-gray-700">{problem}</span>
                      </li>
                    ))
                  ) : (
                    scenario.benefits && scenario.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0">
                          <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center">
                            <Check className="h-3 w-3 text-indigo-600" />
                          </div>
                        </div>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))
                  )}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Carousel of Testimonials/Examples */}
          <div className="mt-20 max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">See how other sales teams transformed their outreach</h3>
            
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {[
                  {
                    quote: "Our response rates jumped from 2% to 7% after switching to Mizi's personalized approach.",
                    name: "Alex Rodriguez",
                    role: "BDR Manager",
                    company: "SalesTech Inc.",
                    before: "22 hours per week on research",
                    after: "5 hours per week, triple the results"
                  },
                  {
                    quote: "I was spending 2 hours per day on prospect research. Now I use that time for actual calls.",
                    name: "Sarah Johnson",
                    role: "SDR Team Lead",
                    company: "GrowthMetrics",
                    before: "15 prospects researched daily",
                    after: "50+ personalized outreach messages daily"
                  },
                  {
                    quote: "Mizi helped me stop sending generic templates while still maintaining my outreach volume.",
                    name: "Michael Chen",
                    role: "Sales Development Rep",
                    company: "CloudScale",
                    before: "1.5% response rate with templates",
                    after: "6.2% response rate with Mizi"
                  }
                ].map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-3/4">
                    <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Avatar/image placeholder */}
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-400 to-blue-400 flex items-center justify-center text-white text-xl font-bold">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        
                        <div className="flex-1">
                          <blockquote className="text-lg italic mb-4">"{testimonial.quote}"</blockquote>
                          <div className="mb-4">
                            <p className="font-bold">{testimonial.name}</p>
                            <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-4 text-sm">
                            <div className="flex-1 bg-white p-3 rounded-lg border border-red-200">
                              <p className="text-gray-500 mb-1">Before Mizi:</p>
                              <p className="font-medium text-red-700">{testimonial.before}</p>
                            </div>
                            <div className="flex-1 bg-white p-3 rounded-lg border border-green-200">
                              <p className="text-gray-500 mb-1">With Mizi:</p>
                              <p className="font-medium text-green-700">{testimonial.after}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-8 gap-4">
                <CarouselPrevious className="static transform-none" />
                <CarouselNext className="static transform-none" />
              </div>
            </Carousel>
          </div>

          {/* CTA for this section */}
          <div className="mt-16 text-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8">
              <Link to="/" className="flex items-center gap-2">
                Save Time with Mizi <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Pricing section - Updated with new prices */}
      <motion.section 
        className="px-4 md:px-8 py-16 md:py-24 bg-white"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={8}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Choose the plan that fits your outreach needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div 
                key={i} 
                className={`relative rounded-xl ${plan.color} border-2 ${plan.borderColor} p-8 shadow-lg`}
                variants={fadeIn}
                custom={9 + i * 0.5}
              >
                {plan.isMostPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-sm font-bold py-1 px-4 rounded-full">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {plan.price !== "Custom Quote" ? (
                      <>
                        <span className="text-sm align-top mt-1">$</span>
                        <span className="text-5xl font-bold">{plan.price}</span>
                        {plan.period && <span className="text-gray-500">/{plan.period}</span>}
                      </>
                    ) : (
                      <span className="text-3xl font-bold">{plan.price}</span>
                    )}
                  </div>
                  {plan.price !== "Custom Quote" && (
                    <p className="text-sm text-gray-500 mb-6">billed monthly</p>
                  )}
                  
                  <Button className={`w-full ${plan.buttonColor}`}>
                    {plan.price === "Custom Quote" ? "Contact Sales" : "Get Started"}
                  </Button>
                </div>
                
                <div className="space-y-4 mt-8">
                  <p className="font-semibold">Includes:</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.limitations && (
                    <>
                      <p className="font-semibold mt-6">Limitations:</p>
                      <ul className="space-y-3 text-gray-500">
                        {plan.limitations.map((limitation, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <div className="h-5 w-5 flex items-center justify-center mt-0.5 shrink-0">
                              <div className="h-1 w-5 bg-gray-300 rounded-full"></div>
                            </div>
                            <span>{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Feature comparison table */}
          <div className="mt-16 mb-8">
            <h3 className="text-2xl font-bold text-center mb-8">Feature comparison</h3>
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Feature</TableHead>
                    <TableHead className="text-center">MVP</TableHead>
                    <TableHead className="text-center">SCALE</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "Personalized messages", mvp: "100/month", scale: "Unlimited" },
                    { name: "Email templates", mvp: true, scale: true },
                    { name: "LinkedIn templates", mvp: false, scale: true },
                    { name: "AI personalization", mvp: "Basic", scale: "Advanced" },
                    { name: "CRM integration", mvp: false, scale: true },
                    { name: "Team collaboration", mvp: false, scale: true },
                    { name: "Analytics", mvp: "Basic", scale: "Advanced" },
                    { name: "Support", mvp: "Email", scale: "Priority" }
                  ].map((feature, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{feature.name}</TableCell>
                      <TableCell className="text-center">
                        {typeof feature.mvp === "boolean" ? (
                          feature.mvp ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : 
                          <div className="h-5 w-5 flex items-center justify-center mx-auto">
                            <div className="h-1 w-5 bg-gray-300 rounded-full"></div>
                          </div>
                        ) : feature.mvp}
                      </TableCell>
                      <TableCell className="text-center">
                        {typeof feature.scale === "boolean" ? (
                          feature.scale ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : 
                          <div className="h-5 w-5 flex items-center justify-center mx-auto">
                            <div className="h-1 w-5 bg-gray-300 rounded-full"></div>
                          </div>
                        ) : feature.scale}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          {/* FAQ Teaser */}
          <div className="text-center mt-16">
            <p className="text-lg text-gray-600 mb-4">Have questions about our plans?</p>
            <Button variant="outline" size="lg" className="border-indigo-200 hover:bg-indigo-50">
              <Link to="/" className="flex items-center gap-2">
                Contact Sales <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
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
