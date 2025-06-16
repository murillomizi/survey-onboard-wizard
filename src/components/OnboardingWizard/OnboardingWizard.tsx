import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WizardStep from './WizardStep';
import WizardHeader from './WizardHeader';
import WizardFooter from './WizardFooter';
import WizardProgress from './WizardProgress';
import { useOnboardingWizard } from './useOnboardingWizard';

interface OnboardingWizardProps {
  onComplete?: (surveyId: string) => void;
  onClose?: () => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = (props) => {
  const {
    currentStep,
    formData,
    isCompleted,
    isLoggingIn,
    selectedFile,
    form,
    steps,
    handleFileSelect,
    handleNext,
    handleBack,
  } = useOnboardingWizard();
  
  const handleFinish = (surveyId: string) => {
    if (props.onComplete) props.onComplete(surveyId);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 md:p-6 lg:p-8 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="w-full max-w-xl">
        <motion.div 
          className="wizard-card overflow-visible bg-white shadow-xl rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <WizardHeader 
            step={steps[currentStep]} 
            currentStep={currentStep} 
            isCompleted={isCompleted} 
          />
          
          {/* Progress bar */}
          <WizardProgress 
            currentStep={currentStep} 
            totalSteps={steps.length} 
          />
          
          {/* Main content */}
          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <form>
                  <WizardStep 
                    step={currentStep}
                    form={form}
                    formData={formData}
                    steps={steps}
                    isCompleted={isCompleted}
                    isLoggingIn={isLoggingIn}
                    onFileSelect={handleFileSelect}
                  />
                </form>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Footer */}
          <WizardFooter 
            currentStep={currentStep}
            steps={steps}
            isCompleted={isCompleted}
            isLoggingIn={isLoggingIn}
            onBack={handleBack}
            onNext={handleNext}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
