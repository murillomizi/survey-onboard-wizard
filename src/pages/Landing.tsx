import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

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

const Landing = () => {
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
  
  return (
    <div className="bg-minimal-white min-h-screen w-full text-minimal-black font-sans">
      {/* Navigation - Simplificado */}
      <nav className="px-4 md:px-8 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <Logo size="md" />
        <div className="flex items-center gap-4">
          <Button size="sm" variant="outline" asChild className="border-minimal-gray-300 hover:bg-minimal-gray-100">
            <Link to="/" className="flex items-center gap-1.5">
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span> 
            </Link>
          </Button>
          <Button size="sm" asChild className="bg-minimal-black text-minimal-white hover:bg-minimal-gray-800">
            <Link to="/" className="flex items-center gap-1.5">
              <UserPlus className="h-3.5 w-3.5" />
              <span>Sign Up</span> 
            </Link>
          </Button>
        </div>
      </nav>

      {/* Hero section - Simplificado e minimalista */}
      <motion.section className="px-4 md:px-8 py-16 md:py-28 max-w-7xl mx-auto" initial="hidden" animate="visible" variants={fadeIn} custom={0}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div className="flex justify-center mb-8" variants={fadeIn} custom={0.5}>
            <Logo size="lg" withText={false} />
          </motion.div>
          <motion.h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight" variants={fadeIn} custom={1}>
            AI that actually personalize your approach.
          </motion.h1>
          <motion.p className="text-lg md:text-xl text-minimal-gray-600 mb-12 max-w-2xl mx-auto" variants={fadeIn} custom={2}>
            Hyper-personalized cold outreach at scale. Get more replies, book more meetings.
          </motion.p>
          <motion.div variants={fadeIn} custom={3}>
            <Button size="lg" asChild className="bg-minimal-black text-minimal-white hover:bg-minimal-gray-900 text-base px-8 py-6 h-auto rounded-md">
              <Link to="/" className="flex items-center gap-2">
                Try Mizi Now <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
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
              Rompendo Paradigmas do Outreach
            </h2>
            <p className="text-minimal-gray-600 text-lg max-w-2xl mx-auto">
              A dicotomia tradicional não faz mais sentido. Nossa IA quebra a lógica entre envios personalizados manuais ou envios genéricos automáticos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
            {/* Abordagem Tradicional - Personalização Manual */}
            <motion.div 
              className="bg-minimal-gray-100 rounded-lg p-8 text-center relative" 
              variants={fadeIn} 
              custom={4}
            >
              <h3 className="text-xl font-bold mb-4">Personalização Manual</h3>
              <div className="mb-6 text-minimal-gray-700">
                <p className="mb-4">Abordagem tradicional</p>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center">
                    <span className="inline-block w-4 h-4 rounded-full bg-minimal-gray-400 mr-2"></span>
                    <span>Alta qualidade</span>
                  </li>
                  <li className="flex items-center">
                    <span className="inline-block w-4 h-4 rounded-full bg-minimal-gray-400 mr-2"></span>
                    <span>Extremamente demorado</span>
                  </li>
                  <li className="flex items-center">
                    <span className="inline-block w-4 h-4 rounded-full bg-minimal-gray-400 mr-2"></span>
                    <span>Volume limitado</span>
                  </li>
                </ul>
              </div>
            </motion.div>
            
            {/* Mizi AI - No centro */}
            <motion.div 
              className="bg-minimal-black text-minimal-white rounded-lg p-8 text-center transform md:scale-110 relative z-10 shadow-xl" 
              variants={fadeIn} 
              custom={4.5}
            >
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                <Logo size="sm" />
              </div>
              <h3 className="text-xl font-bold mb-4 mt-2">Mizi AI</h3>
              <div className="mb-6">
                <p className="mb-4">Nova abordagem</p>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center">
                    <span className="inline-block w-4 h-4 rounded-full bg-minimal-white mr-2"></span>
                    <span>Alta qualidade</span>
                  </li>
                  <li className="flex items-center">
                    <span className="inline-block w-4 h-4 rounded-full bg-minimal-white mr-2"></span>
                    <span>Extremamente rápido</span>
                  </li>
                  <li className="flex items-center">
                    <span className="inline-block w-4 h-4 rounded-full bg-minimal-white mr-2"></span>
                    <span>Volume escalável</span>
                  </li>
                </ul>
              </div>
              <Button size="sm" asChild variant="outline" className="border-minimal-white text-minimal-white hover:bg-minimal-white hover:text-minimal-black">
                <Link to="/" className="flex items-center gap-2">
                  Experimentar <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </motion.div>
            
            {/* Abordagem Tradicional - Automação Genérica */}
            <motion.div 
              className="bg-minimal-gray-100 rounded-lg p-8 text-center relative" 
              variants={fadeIn} 
              custom={5}
            >
              <h3 className="text-xl font-bold mb-4">Automação Genérica</h3>
              <div className="mb-6 text-minimal-gray-700">
                <p className="mb-4">Abordagem tradicional</p>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center">
                    <span className="inline-block w-4 h-4 rounded-full bg-minimal-gray-400 mr-2"></span>
                    <span>Baixa qualidade</span>
                  </li>
                  <li className="flex items-center">
                    <span className="inline-block w-4 h-4 rounded-full bg-minimal-gray-400 mr-2"></span>
                    <span>Extremamente rápido</span>
                  </li>
                  <li className="flex items-center">
                    <span className="inline-block w-4 h-4 rounded-full bg-minimal-gray-400 mr-2"></span>
                    <span>Volume escalável</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
          
          {/* Visual de linhas conectando os cards */}
          <div className="hidden md:block relative h-1 max-w-xl mx-auto -mt-32 mb-32">
            <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 border-t-2 border-dashed border-minimal-gray-300"></div>
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-minimal-black"></div>
          </div>
        </div>
      </motion.section>

      {/* Features section - Simplificado para estilo minimalista */}
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

      {/* Testimonials section - Redesenhado para minimalismo */}
      <motion.section className="px-4 md:px-8 py-16 md:py-24 bg-minimal-white" initial="hidden" animate="visible" variants={fadeIn} custom={7}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              See how other sales teams transformed their outreach
            </h2>
            <p className="text-minimal-gray-600 text-lg max-w-2xl mx-auto">
              Real results from real customers
            </p>
          </div>

          {/* Redesigned testimonial carousel */}
          <div className="mt-10 max-w-5xl mx-auto">
            <Carousel 
              opts={{
                align: "center",
                loop: true
              }} 
              className="w-full"
              autoplay={true}
              autoplayInterval={3000}
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-3/4">
                    <div className="p-8 bg-minimal-white rounded-lg border border-minimal-gray-200 shadow-sm">
                      <blockquote className="text-xl italic mb-6">"{testimonial.quote}"</blockquote>
                      <div className="mb-6">
                        <p className="font-bold">{testimonial.name}</p>
                        <p className="text-sm text-minimal-gray-600">{testimonial.role}, {testimonial.company}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="p-4 bg-minimal-gray-100 rounded-lg">
                          <p className="text-minimal-gray-600 mb-1">Before Mizi:</p>
                          <p className="font-medium">{testimonial.before}</p>
                        </div>
                        <div className="p-4 bg-minimal-gray-100 rounded-lg">
                          <p className="text-minimal-gray-600 mb-1">With Mizi:</p>
                          <p className="font-medium">{testimonial.after}</p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Button size="lg" asChild className="bg-minimal-black text-minimal-white hover:bg-minimal-gray-900 text-base px-8 py-3 h-auto rounded-md">
              <Link to="/" className="flex items-center gap-2">
                Save Time with Mizi <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* CTA Section - Simplificado */}
      <motion.section className="px-4 md:px-8 py-16 md:py-24 bg-minimal-gray-100" initial="hidden" animate="visible" variants={fadeIn} custom={12}>
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Ready to personalize your outreach?</h2>
          <p className="text-xl text-minimal-gray-600 mb-10">Built for agencies, reps and founders who hate generic outreach.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild className="bg-minimal-black text-minimal-white hover:bg-minimal-gray-900 text-base px-8 py-6 h-auto rounded-md">
              <Link to="/" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" /> Sign Up Now <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {benefits.map((benefit, i) => (
              <div key={i} className="p-4 border border-minimal-gray-200 rounded-lg bg-minimal-white">
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer - Simplificado */}
      <footer className="px-4 md:px-8 py-8 border-t border-minimal-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <Logo size="sm" withText={false} />
            <p className="text-minimal-gray-500 text-sm">© {new Date().getFullYear()} Mizi.app. All rights reserved.</p>
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/" className="text-sm text-minimal-gray-500 hover:text-minimal-black">Terms</Link>
            <Link to="/" className="text-sm text-minimal-gray-500 hover:text-minimal-black">Privacy</Link>
            <Link to="/" className="text-sm text-minimal-gray-500 hover:text-minimal-black">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
