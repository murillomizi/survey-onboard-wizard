
import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface SliderInputProps {
  value: number;
  onChange: (value: number[]) => void;
  onComplete: () => void;
}

const SliderInput = ({ value, onChange, onComplete }: SliderInputProps) => {
  return (
    <div className="p-4 border border-gray-200 bg-white rounded-xl shadow-sm">
      <div className="mb-2">
        <span className="text-gray-800">{value} caracteres</span>
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
      <p className="text-gray-500 text-sm mt-1 italic">
        Recomendado: 350-500 caracteres para maior impacto
      </p>
      <Button 
        onClick={onComplete}
        className="mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90 transition-all duration-200"
      >
        Confirmar
      </Button>
    </div>
  );
};

export default SliderInput;
