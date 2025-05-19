import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UseFormReturn } from 'react-hook-form';
import { Check, LucideIcon, AtSign, Loader, Upload, Globe, Link2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';

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
  handleFileUpload?: (file: File, data: any[]) => void;
  isCompleted: boolean;
  isLoggingIn?: boolean;
  isSaving?: boolean;
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
  handleFileUpload,
  isCompleted,
  isLoggingIn = false,
  isSaving = false
}) => {
  const { register, watch, formState: { errors } } = form;
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setCsvError('Please select a CSV file');
      return;
    }
    
    setIsUploading(true);
    setCsvFileName(file.name);
    setCsvError(null);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log('CSV parsed:', results);
        if (results.data && Array.isArray(results.data)) {
          if (handleFileUpload) {
            handleFileUpload(file, results.data);
          }
        }
        setIsUploading(false);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        setCsvError('Error parsing the CSV file');
        setIsUploading(false);
      }
    });
  };
  
  const getOptionLabel = (field: string, value: string): string => {
    const step = steps.find(s => s.field === field);
    if (!step || !step.options) return value;
    
    const option = step.options.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return false;

    // Add http:// if the URL doesn't have a protocol
    let urlToTest = url;
    if (!/^https?:\/\//i.test(urlToTest)) {
      urlToTest = 'http://' + urlToTest;
    }
    try {
      new URL(urlToTest);
      return true;
    } catch (e) {
      return false;
    }
  };

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
      
    case 2: // Company step - Modificado para mostrar apenas o campo de website
      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="wizard-label flex items-center gap-2" htmlFor="companyWebsite">
                <Globe className="h-4 w-4" /> Site da empresa
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Link2 className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  {...register('companyWebsite', { 
                    required: 'O site da empresa é obrigatório',
                    validate: (value) => validateUrl(value) || 'Por favor, insira uma URL válida'
                  })}
                  id="companyWebsite"
                  className={`wizard-input pl-10 ${errors.companyWebsite ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="www.suaempresa.com.br"
                />
              </div>
              {errors.companyWebsite && (
                <span className="text-sm text-red-500 mt-1 block">
                  {errors.companyWebsite.message as string}
                </span>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Adicione o site da sua empresa para personalizar seu outbound
              </p>
            </div>
          </div>
        </div>
      );
      
    case 3: // Team size step
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
      
    case 4: // Interests step
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
      
    case 5: // Goal step
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
      
    case 6: // Appearance step
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

    case 7: // CSV Upload step
      return (
        <div className="space-y-6">
          <div className="mb-4 border border-blue-100 bg-blue-50 p-4 rounded-xl text-gray-700">
            <p className="font-semibold mb-2">🚀 Maximize a Personalização da IA</p>
            <p className="text-sm mb-2">
              Quanto mais dados você incluir no seu CSV, mais precisa e personalizada será a estratégia de comunicação.
            </p>
            <p className="text-xs text-gray-500 italic">
              Exemplos de dados úteis: nome completo, cargo, empresa, e-mail, histórico de interações, principais desafios, interesses profissionais, etc.
            </p>
          </div>
          
          <div className="flex flex-col items-center p-6 border-2 border-dashed border-minimal-gray-300 rounded-lg bg-minimal-gray-50">
            <input
              type="file"
              id="csvFile"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <label htmlFor="csvFile">
              <div className="mb-4 flex flex-col items-center cursor-pointer">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                  <Upload className="h-8 w-8 text-indigo-600" />
                </div>
                <span className="font-medium text-gray-800">Selecione seu arquivo CSV</span>
                <span className="text-sm text-gray-500">ou arraste e solte aqui</span>
              </div>
            </label>
            
            {isUploading && (
              <div className="mt-4 flex items-center justify-center">
                <Loader className="animate-spin h-5 w-5 mr-2 text-indigo-500" />
                <span>Processando arquivo...</span>
              </div>
            )}
            
            {csvFileName && !isUploading && (
              <div className="mt-4 p-3 bg-minimal-gray-100 border rounded-md flex items-center text-minimal-gray-700 w-full">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                <span className="text-sm">{csvFileName}</span>
              </div>
            )}
            
            {csvError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700 w-full">
                <span className="text-sm">{csvError}</span>
              </div>
            )}
          </div>
          
          {!csvFileName && !isUploading && (
            <div className="text-center text-gray-500 text-sm mt-4">
              O arquivo CSV deve conter informações sobre seus prospects
            </div>
          )}
        </div>
      );
      
    case 8: // Login step
      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSign className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className="pl-10 w-full"
                />
              </div>
              {errors.email && (
                <span className="text-sm text-red-500 mt-1 block">
                  {errors.email.message as string}
                </span>
              )}
            </div>
            
            <div>
              <Label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                className="w-full"
              />
              {errors.password && (
                <span className="text-sm text-red-500 mt-1 block">
                  {errors.password.message as string}
                </span>
              )}
            </div>
          </div>
          
          {(isLoggingIn || isSaving) && (
            <div className="flex justify-center pt-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Loader className="animate-spin h-5 w-5" />
                <span>{isSaving ? 'Saving data...' : 'Logging in...'}</span>
              </div>
            </div>
          )}
        </div>
      );
      
    default:
      return null;
  }
};

export default WizardStep;
