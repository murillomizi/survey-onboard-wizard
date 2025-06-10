import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WizardFooterProps } from './types';

const WizardFooter: React.FC<WizardFooterProps> = ({ 
  currentStep, 
  steps, 
  isCompleted, 
  isLoggingIn, 
  onBack, 
  onNext 
}) => {
  if (isCompleted) {
    return null;
  }

  return (
    <div className="p-8 md:p-10 border-t border-gray-100 flex justify-between bg-gradient-to-r from-indigo-50 to-purple-50 rounded-b-2xl shadow-md mt-2">
      {currentStep > 0 ? (
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 border-gray-300 bg-white hover:bg-gray-100 shadow-sm px-6 py-3 rounded-xl text-base font-medium"
        >
          <ArrowLeft size={18} />
          Voltar
        </Button>
      ) : (
        <div></div>
      )}
      <Button
        onClick={onNext}
        disabled={isLoggingIn}
        className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 px-8 py-3 rounded-xl text-base font-semibold shadow-md transition-all duration-200"
      >
        {currentStep === steps.length - 1 ? (
          <>
            {isLoggingIn ? 'Processando...' : 'Concluir'} {!isLoggingIn && <CheckCircle size={18} />}
          </>
        ) : (
          <>
            Continuar <ArrowRight size={18} />
          </>
        )}
      </Button>
    </div>
  );
};

export default WizardFooter;
