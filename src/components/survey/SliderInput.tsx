
import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";

interface SliderInputProps {
  value: number;
  onChange: (value: number[]) => void;
  onComplete: () => void;
}

const SliderInput = ({ value, onChange, onComplete }: SliderInputProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 border border-minimal-gray-200 bg-minimal-white rounded-xl shadow-sm"
    >
      <div className="mb-2">
        <span className="text-minimal-black font-medium">{value} caracteres</span>
      </div>
      <Slider
        defaultValue={[350]}
        max={1000}
        min={100}
        step={10}
        value={[value]}
        onValueChange={onChange}
        className="mb-2"
      />
      <p className="text-minimal-gray-500 text-sm mt-1 italic">
        Recomendado: 350-500 caracteres para maior impacto
      </p>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button 
          onClick={onComplete}
          className="mt-2 bg-minimal-black text-minimal-white hover:bg-minimal-gray-800 transition-all duration-200"
        >
          Confirmar
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default SliderInput;
