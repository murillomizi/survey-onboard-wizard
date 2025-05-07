
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import WorkflowSection from "@/components/landing/WorkflowSection";
import TestimonialCarousel from "@/components/landing/TestimonialCarousel";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import CallToAction from "@/components/landing/CallToAction";

const Landing = () => {
  return (
    <div className="bg-white min-h-screen w-full text-gray-900 font-sans">
      {/* Navigation */}
      <Header />

      {/* Hero section */}
      <HeroSection />

      {/* Features section with connected workflow cards - SDR/BDR version */}
      <WorkflowSection />

      {/* New Section: Basic Testimonials Carousel */}
      <section className="px-4 md:px-8 py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
              Stop Wasting Time on Personalization
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              There's a better way to personalize your outreach without spending hours or settling for generic templates
            </p>
          </div>

          <TestimonialCarousel />

          {/* CTA for this section */}
          <div className="mt-16 text-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8">
              <Link to="/" className="flex items-center gap-2">
                Save Time with Mizi <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing section */}
      <PricingSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Final CTA Section */}
      <CallToAction />
    </div>
  );
};

export default Landing;
