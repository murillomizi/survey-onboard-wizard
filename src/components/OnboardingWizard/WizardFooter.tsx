
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
    <div className="p-6 md:p-8 border-t border-gray-100 flex justify-between">
      {currentStep > 0 ? (
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600"
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>
      ) : (
        <div></div>
      )}
      
      <Button
        onClick={onNext}
        disabled={isLoggingIn}
        className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
      >
        {currentStep === steps.length - 1 ? (
          <>
            {isLoggingIn ? 'Processando...' : 'Concluir'} {!isLoggingIn && <CheckCircle size={16} />}
          </>
        ) : (
          <>
            Continuar <ArrowRight size={16} />
          </>
        )}
      </Button>
    </div>
  );
};

export default WizardFooter;
