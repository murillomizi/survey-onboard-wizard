
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

// Animation variants for smooth transitions
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.7, ease: "easeOut" }
  })
};

const PricingSection = () => {
  // Pricing plans
  const pricingPlans = [
    {
      name: "MVP",
      description: "Perfect for SDRs getting started with personalized outreach",
      price: "150",
      period: "mo",
      color: "bg-white",
      buttonColor: "bg-blue-500 hover:bg-blue-600 text-white",
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
      color: "bg-blue-50",
      buttonColor: "bg-indigo-600 hover:bg-indigo-700 text-white",
      borderColor: "border-blue-100",
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
        
        {/* Updated pricing cards with improved alignment */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
          {pricingPlans.map((plan, i) => (
            <motion.div 
              key={i} 
              className={`relative rounded-xl ${plan.color} border-2 ${plan.borderColor} p-8 shadow-lg flex flex-col`}
              variants={fadeIn}
              custom={9 + i * 0.5}
            >
              {plan.isMostPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-sm font-bold py-1 px-4 rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-6 flex-grow">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                {/* Price display area */}
                <div className="mt-8 mb-8">
                  {plan.price !== "Custom Quote" ? (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center">
                        <span className="text-sm mt-3 mr-1">$</span>
                        <span className="text-5xl font-bold">{plan.price}</span>
                        {plan.period && <span className="text-gray-500 ml-1">/{plan.period}</span>}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">billed monthly</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-bold">{plan.price}</span>
                    </div>
                  )}
                </div>
                
                {/* CTA Button */}
                <Button className={`w-full ${plan.buttonColor}`}>
                  {plan.price === "Custom Quote" ? "Contact Sales" : "Get Started"}
                </Button>
              </div>
              
              {/* Features section */}
              <div className="mt-8 text-left">
                <p className="font-semibold mb-4">Includes:</p>
                <ul className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Limitations section */}
                {plan.limitations && (
                  <div className="mt-6">
                    <p className="font-semibold mb-4">Limitations:</p>
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
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default PricingSection;
