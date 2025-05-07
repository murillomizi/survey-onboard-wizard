
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Animation variants for smooth transitions
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.7, ease: "easeOut" }
  })
};

const FAQSection = () => {
  const faqs = [
    {
      question: "How is Mizi different from generic AI platforms?",
      answer: "Mizi is specifically designed for sales outreach personalization. Unlike generic AI tools, Mizi analyzes your prospects' business context to generate highly relevant messages that drive engagement and response."
    },
    {
      question: "Can I integrate Mizi with my CRM?",
      answer: "Yes, our Scale plan includes integrations with popular CRMs like Salesforce, HubSpot, and Pipedrive. This allows for seamless workflow and data synchronization."
    },
    {
      question: "How long does it take to get started?",
      answer: "Most users are up and running within minutes. Simply upload your prospect list, choose your personalization approach, and start receiving AI-generated personalized messages."
    },
    {
      question: "Is there a limit on the number of messages I can generate?",
      answer: "Our MVP plan includes up to 100 personalized messages per month. The Scale plan offers unlimited message generation to support larger sales teams."
    }
  ];

  return (
    <motion.section 
      className="px-4 md:px-8 py-16 md:py-24 bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      custom={10}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 text-lg">
            Everything you need to know about Mizi's AI-powered outreach
          </p>
        </div>
        
        <div className="mb-12">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8">
            <Link to="/" className="flex items-center gap-2">
              Sign Up Now <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.section>
  );
};

export default FAQSection;
