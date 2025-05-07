
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";

// Animation variants for smooth transitions
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.7, ease: "easeOut" }
  })
};

const HeroSection = () => {
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
  );
};

export default HeroSection;
