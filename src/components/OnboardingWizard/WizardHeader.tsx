import React from 'react';
import WizardMascot from './WizardMascot';
import { WizardHeaderProps } from './types';

const WizardHeader: React.FC<WizardHeaderProps> = ({ step, currentStep, isCompleted }) => {
  return (
    <div className="p-8 md:p-10 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-2xl">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-700 flex items-center gap-2">
          {step.title}
          {step.id === 'welcome' && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2">Novo</span>}
        </h2>
        <WizardMascot step={currentStep} isCompleted={isCompleted} />
      </div>
      <p className="text-gray-700 text-base md:text-lg font-medium">
        {step.description}
        {step.id === 'welcome' && (
          <span className="block mt-1 text-xs text-indigo-600 font-semibold">
            Configure sua campanha de outbound em poucos passos
          </span>
        )}
      </p>
    </div>
  );
};

export default WizardHeader;
