
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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

const CallToAction = () => {
  return (
    <motion.section 
      className="px-4 md:px-8 py-16 md:py-24 bg-white"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      custom={11}
    >
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
          Ready to transform your outreach?
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
          Join hundreds of sales professionals who are getting more replies and booking more meetings with Mizi.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8">
            <Link to="/" className="flex items-center gap-2">
              Sign Up Now <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-lg">
            <Link to="/">
              Schedule a Demo
            </Link>
          </Button>
        </div>
      </div>
    </motion.section>
  );
};

export default CallToAction;
