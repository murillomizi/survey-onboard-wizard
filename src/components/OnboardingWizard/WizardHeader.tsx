
import React from 'react';
import WizardMascot from './WizardMascot';
import { WizardHeaderProps } from './types';

const WizardHeader: React.FC<WizardHeaderProps> = ({ step, currentStep, isCompleted }) => {
  return (
    <div className="p-6 md:p-8 border-b border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
          {step.title}
        </h2>
        
        <WizardMascot step={currentStep} isCompleted={isCompleted} />
      </div>
      <p className="text-gray-600 text-sm md:text-base">
        {step.description}
      </p>
    </div>
  );
};

export default WizardHeader;
