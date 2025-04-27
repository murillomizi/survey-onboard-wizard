
import React from 'react';
import { motion } from 'framer-motion';
import { UseFormReturn } from 'react-hook-form';
import { Check, LucideIcon } from 'lucide-react';

type WizardStepProps = {
  step: number;
  form: UseFormReturn<any>;
  formData: any;
  steps: any[];
  interestOptions: { value: string; label: string; icon: string }[];
  teamSizeOptions: { value: string; label: string }[];
  goalOptions: { value: string; label: string }[];
  themeOptions: { value: string; label: string; icon: LucideIcon }[];
  handleSelectInterest: (interest: string) => void;
  isCompleted: boolean;
};

const WizardStep: React.FC<WizardStepProps> = ({
  step,
  form,
  formData,
  steps,
  interestOptions,
  teamSizeOptions,
  goalOptions,
  themeOptions,
  handleSelectInterest,
  isCompleted
}) => {
  const { register, watch, formState: { errors } } = form;
  
  if (isCompleted) {
    return (
      <div className="py-8">
        <motion.div 
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">All set!</h3>
          <p className="text-gray-600 mb-6">
            Your workspace is ready to use. Let's get started!
          </p>
          <motion.div 
            className="w-full max-w-xs bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Go to Dashboard
          </motion.div>
        </motion.div>
      </div>
    );
  }
  
  switch(step) {
    case 0: // Welcome step
      return (
        <div className="py-8 text-center space-y-4">
          <motion.div 
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-indigo-100 flex items-center justify-center"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-4xl">✨</span>
          </motion.div>
          
          <h3 className="text-xl font-bold text-gray-800">
            Welcome to your new workspace
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            We'll help you set everything up in just a few steps. It'll only take a minute or two.
          </p>
        </div>
      );
      
    case 1: // Profile step
      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="wizard-label" htmlFor="name">
                Your name
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                id="name"
                className={`wizard-input ${errors.name ? 'border-red-300 focus:border-red-500' : ''}`}
                placeholder="John Doe"
                autoComplete="name"
              />
              {errors.name && (
                <span className="text-sm text-red-500 mt-1 block">
                  {errors.name.message as string}
                </span>
              )}
            </div>
            
            <div>
              <label className="wizard-label" htmlFor="role">
                Job title
              </label>
              <input
                {...register('role', { required: 'Job title is required' })}
                id="role"
                className={`wizard-input ${errors.role ? 'border-red-300 focus:border-red-500' : ''}`}
                placeholder="Product Manager"
                autoComplete="organization-title"
              />
              {errors.role && (
                <span className="text-sm text-red-500 mt-1 block">
                  {errors.role.message as string}
                </span>
              )}
            </div>
            
            <div>
              <label className="wizard-label" htmlFor="company">
                Company name
              </label>
              <input
                {...register('company', { required: 'Company name is required' })}
                id="company"
                className={`wizard-input ${errors.company ? 'border-red-300 focus:border-red-500' : ''}`}
                placeholder="Acme Inc."
                autoComplete="organization"
              />
              {errors.company && (
                <span className="text-sm text-red-500 mt-1 block">
                  {errors.company.message as string}
                </span>
              )}
            </div>
          </div>
        </div>
      );
      
    case 2: // Team size step
      return (
        <div>
          <fieldset className="space-y-3">
            <legend className="sr-only">Team size</legend>
            <p className="text-sm text-gray-500 mb-3">
              How many people will be working in this workspace?
            </p>
            
            {teamSizeOptions.map((option) => (
              <label 
                key={option.value}
                className={`radio-card flex items-center ${watch('teamSize') === option.value ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  {...register('teamSize', { required: 'Please select a team size' })}
                  value={option.value}
                  className="sr-only"
                />
                <span className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0 mr-3 flex items-center justify-center">
                  {watch('teamSize') === option.value && (
                    <motion.span 
                      className="w-2 h-2 rounded-full bg-indigo-500"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </span>
                <span>{option.label}</span>
              </label>
            ))}
            
            {errors.teamSize && (
              <span className="text-sm text-red-500 mt-1 block">
                {errors.teamSize.message as string}
              </span>
            )}
          </fieldset>
        </div>
      );
      
    case 3: // Interests step
      return (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            Select all that interest you (pick at least one)
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {interestOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelectInterest(option.value)}
                className={`radio-card flex flex-col items-center justify-center py-4 ${
                  watch('interests')?.includes(option.value) ? 'selected' : ''
                }`}
              >
                <span className="text-2xl mb-1">{option.icon}</span>
                <span className="text-sm">{option.label.split(' ')[1]}</span>
                
                {watch('interests')?.includes(option.value) && (
                  <motion.div 
                    className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="text-white w-3 h-3" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
          
          {errors.interests && (
            <span className="text-sm text-red-500 mt-3 block">
              {errors.interests.message as string}
            </span>
          )}
        </div>
      );
      
    case 4: // Goal step
      return (
        <div>
          <fieldset className="space-y-3">
            <legend className="sr-only">Main goal</legend>
            <p className="text-sm text-gray-500 mb-3">
              What's your main goal with our platform?
            </p>
            
            {goalOptions.map((option) => (
              <label 
                key={option.value}
                className={`radio-card flex items-center ${watch('goal') === option.value ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  {...register('goal', { required: 'Please select a goal' })}
                  value={option.value}
                  className="sr-only"
                />
                <span className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0 mr-3 flex items-center justify-center">
                  {watch('goal') === option.value && (
                    <motion.span 
                      className="w-2 h-2 rounded-full bg-indigo-500"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </span>
                <span>{option.label}</span>
              </label>
            ))}
            
            {errors.goal && (
              <span className="text-sm text-red-500 mt-1 block">
                {errors.goal.message as string}
              </span>
            )}
          </fieldset>
        </div>
      );
      
    case 5: // Appearance step
      return (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            Choose your preferred appearance
          </p>
          
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              return (
                <label 
                  key={option.value}
                  className={`radio-card flex flex-col items-center justify-center py-4 text-center ${
                    watch('theme') === option.value ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    {...register('theme')}
                    value={option.value}
                    className="sr-only"
                  />
                  <Icon className="mb-2 h-6 w-6" />
                  <span className="text-sm">{option.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      );
      
    default:
      return null;
  }
};

export default WizardStep;
