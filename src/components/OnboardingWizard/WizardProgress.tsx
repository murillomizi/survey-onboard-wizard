
import { Progress } from '@/components/ui/progress';
import { WizardProgressProps } from './types';

const WizardProgress: React.FC<WizardProgressProps> = ({ currentStep, totalSteps }) => {
  const progressPercentage = ((currentStep) / (totalSteps - 1)) * 100;

  return (
    <div className="px-8">
      <div className="flex items-center justify-between text-xs text-gray-500 mt-6 mb-2">
        <span>Início</span>
        <div className="flex items-center">
          <span className="font-medium text-indigo-600">{Math.round(progressPercentage)}%</span>
          <span className="ml-1">Concluído</span>
        </div>
      </div>
      <Progress 
        value={progressPercentage} 
        className="h-2 bg-gray-100" 
        indicatorClassName="bg-gradient-to-r from-indigo-500 to-purple-600"
      />
    </div>
  );
};

export default WizardProgress;
