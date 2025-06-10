import { Progress } from '@/components/ui/progress';
import { WizardProgressProps } from './types';

const WizardProgress: React.FC<WizardProgressProps> = ({ currentStep, totalSteps }) => {
  const progressPercentage = ((currentStep) / (totalSteps - 1)) * 100;

  return (
    <div className="px-10 pt-6 pb-2">
      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <span className="font-semibold">Início</span>
        <div className="flex items-center">
          <span className="font-bold text-indigo-600 text-lg">{Math.round(progressPercentage)}%</span>
          <span className="ml-1 text-base">Concluído</span>
        </div>
      </div>
      <Progress 
        value={progressPercentage} 
        className="h-3 bg-gray-200 rounded-full shadow-inner" 
        indicatorClassName="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
      />
    </div>
  );
};

export default WizardProgress;
