
import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";

interface SurveySliderProps {
  title: string;
  recommendedText: string;
  onChange: (value: number) => void;
  initialValue?: number;
  max?: number;
  step?: number;
  min?: number;
}

const SurveySlider = ({
  title,
  recommendedText,
  onChange,
  initialValue = 350,
  max = 500,
  step = 10,
  min = 100
}: SurveySliderProps) => {
  const [value, setValue] = useState<number>(initialValue);

  const handleValueChange = (val: number[]) => {
    setValue(val[0]);
    onChange(val[0]);
  };

  return (
    <div className="mb-6 w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-survey-text font-medium">{title}</span>
        <span className="text-survey-purple">{value} caracteres</span>
      </div>
      <Slider
        value={[value]}
        max={max}
        min={min}
        step={step}
        onValueChange={handleValueChange}
        className="py-4"
      />
      <p className="text-survey-muted text-sm mt-1 italic">{recommendedText}</p>
    </div>
  );
};

export default SurveySlider;
