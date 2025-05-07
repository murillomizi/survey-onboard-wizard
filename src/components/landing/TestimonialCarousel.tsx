
import React from "react";
import { Check } from "lucide-react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const TestimonialCarousel = () => {
  return (
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
  );
};

export default TestimonialCarousel;
