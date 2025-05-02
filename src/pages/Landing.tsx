
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
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

const Landing = () => {
  return (
    <div className="bg-white min-h-screen w-full text-gray-900 font-sans">
      {/* Navigation */}
      <nav className="px-4 md:px-8 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Mizi.app</h1>
        </div>
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

      {/* Features section */}
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
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
              variants={fadeIn}
              custom={5}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-blue-600 text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Input your lead list</h3>
              <p className="text-gray-600">Upload your target accounts and Mizi automatically reads their website to understand their business.</p>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
              variants={fadeIn}
              custom={6}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-blue-600 text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Find the right angle</h3>
              <p className="text-gray-600">Our AI identifies the perfect approach for each prospect based on their business context and needs.</p>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
              variants={fadeIn}
              custom={7}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-blue-600 text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get perfect copy</h3>
              <p className="text-gray-600">Receive customized outreach templates for both email and LinkedIn that speak directly to your prospect's needs.</p>
            </motion.div>
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
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Mizi.app. All rights reserved.</p>
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
