
import { Progress } from '@/components/ui/progress';
import { WizardProgressProps } from './types';

const WizardProgress: React.FC<WizardProgressProps> = ({ currentStep, totalSteps }) => {
  const progressPercentage = ((currentStep) / (totalSteps - 1)) * 100;

  return (
    <div className="px-8">
      <div className="flex items-center justify-between text-xs text-gray-500 mt-6 mb-2">
        <span>Início</span>
        <span>{Math.round(progressPercentage)}% Concluído</span>
      </div>
      <Progress 
        value={progressPercentage} 
        className="h-1.5 bg-gray-100" 
      />
    </div>
  );
};

export default WizardProgress;
