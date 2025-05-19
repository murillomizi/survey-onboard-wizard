
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ArrowRight, CheckCircle, Moon, Sun, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import WizardStep from './WizardStep';
import WizardMascot from './WizardMascot';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type OnboardingData = {
  name: string;
  role: string;
  company: string;
  teamSize: string;
  interests: string[];
  goal: string;
  theme: 'light' | 'dark' | 'system';
  email: string;
  password: string;
  csvData?: any[];
  csvFileName?: string;
};

const OnboardingWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    theme: 'system',
    interests: []
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const form = useForm<Partial<OnboardingData>>({
    defaultValues: formData,
  });
  
  const steps = [
    {
      id: 'welcome',
      title: '👋 Welcome!',
      description: 'Let\'s set up your workspace in just a few quick steps',
    },
    {
      id: 'profile',
      title: '👤 About you',
      description: 'Help us personalize your experience',
      fields: ['name', 'role', 'company']
    },
    {
      id: 'team',
      title: '👥 Team details',
      description: 'Tell us about your team size',
      fields: ['teamSize']
    },
    {
      id: 'interests',
      title: '✨ Your interests',
      description: 'We\'ll customize your dashboard based on these',
      fields: ['interests']
    },
    {
      id: 'goals',
      title: '🎯 Your main goal',
      description: 'What brings you here today?',
      fields: ['goal']
    },
    {
      id: 'appearance',
      title: '🎨 Choose your theme',
      description: 'Select your preferred appearance',
      fields: ['theme']
    },
    {
      id: 'csvUpload',
      title: '📊 Import Data',
      description: 'Upload your CSV file with prospect data',
      fields: ['csvData']
    },
    {
      id: 'login',
      title: '🔐 Login',
      description: 'Enter your credentials to complete the setup',
      fields: ['email', 'password']
    }
  ];
  
  const progressPercentage = ((currentStep) / (steps.length - 1)) * 100;
  
  const handleNext = async () => {
    const currentFields = steps[currentStep]?.fields || [];
    
    if (currentFields.length > 0) {
      // Validate current step fields
      const isValid = await form.trigger(currentFields as any);
      if (!isValid) return;
      
      // Update form data
      const currentValues = form.getValues();
      setFormData(prev => ({ ...prev, ...currentValues }));
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFileUpload = (file: File, data: any[]) => {
    form.setValue('csvData', data);
    form.setValue('csvFileName', file.name);
    setFormData(prev => ({ 
      ...prev, 
      csvData: data,
      csvFileName: file.name
    }));

    console.log('CSV data saved to form:', data);
  };
  
  const saveDataToSupabase = async (data: Partial<OnboardingData>) => {
    try {
      setIsSaving(true);
      
      if (!data.csvData || !data.csvData.length) {
        toast({
          title: "Erro nos dados",
          description: "Nenhum dado CSV encontrado para salvar",
          variant: "destructive",
        });
        setIsSaving(false);
        return false;
      }
      
      // Limitar a quantidade de linhas salvas para evitar problemas de tamanho
      const csvDataToSave = data.csvData.length > 100 
        ? data.csvData.slice(0, 100) 
        : data.csvData;
        
      console.log('Sending data to Supabase:', {
        csv_data: csvDataToSave,
        csv_file_name: data.csvFileName
      });
      
      const { data: savedData, error } = await supabase
        .from('mizi_ai_surveys')
        .insert([
          {
            csv_data: csvDataToSave,
            csv_file_name: data.csvFileName
          }
        ])
        .select();
      
      if (error) {
        console.error('Error saving to Supabase:', error);
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar seus dados. Tente novamente.",
          variant: "destructive",
        });
        setIsSaving(false);
        return false;
      }
      
      console.log('Data saved successfully:', savedData);
      toast({
        title: "Dados salvos",
        description: "Seus dados foram salvos com sucesso!",
      });
      
      setIsSaving(false);
      return true;
    } catch (error) {
      console.error('Unexpected error saving data:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
      setIsSaving(false);
      return false;
    }
  };
  
  const handleComplete = async () => {
    // Get all form data including email and password
    const finalData = { ...formData, ...form.getValues() };
    console.log('Onboarding completed with data:', finalData);
    
    // First save CSV data to Supabase
    setIsSaving(true);
    const saveSuccess = await saveDataToSupabase(finalData);
    setIsSaving(false);
    
    if (!saveSuccess) {
      console.error('Failed to save data to Supabase');
      return;
    }
    
    setIsLoggingIn(true);
    
    try {
      // Use the email and password from the form to sign in
      if (finalData.email && finalData.password) {
        const { error } = await signIn(finalData.email, finalData.password);
        
        if (error) {
          console.error('Login error:', error);
          toast({
            title: "Login failed",
            description: error.message || "Please check your credentials",
            variant: "destructive",
          });
          setIsLoggingIn(false);
          return;
        }
        
        // Show success message
        toast({
          title: "Onboarding completed! 🎉",
          description: "Your workspace is ready to use.",
        });
        
        setIsCompleted(true);
        
        // Navigate to outbound after successful login
        setTimeout(() => {
          navigate('/outbound');
        }, 1500);
      } else {
        toast({
          title: "Login error",
          description: "Email and password are required",
          variant: "destructive",
        });
        setIsLoggingIn(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoggingIn(false);
    }
  };
  
  const handleSelectInterest = (interest: string) => {
    const currentInterests = form.getValues('interests') || [];
    
    if (currentInterests.includes(interest)) {
      form.setValue('interests', currentInterests.filter(i => i !== interest));
    } else {
      form.setValue('interests', [...currentInterests, interest]);
    }
  };
  
  const interestOptions = [
    { value: 'productivity', label: '⚡ Productivity', icon: '⚡' },
    { value: 'collaboration', label: '👥 Collaboration', icon: '👥' },
    { value: 'analytics', label: '📊 Analytics', icon: '📊' },
    { value: 'automation', label: '🤖 Automation', icon: '🤖' },
    { value: 'design', label: '🎨 Design', icon: '🎨' },
    { value: 'development', label: '👨‍💻 Development', icon: '👨‍💻' }
  ];
  
  const teamSizeOptions = [
    { value: 'solo', label: 'Just me' },
    { value: 'small', label: '2-10 people' },
    { value: 'medium', label: '11-50 people' },
    { value: 'large', label: '51-200 people' },
    { value: 'enterprise', label: '200+ people' }
  ];
  
  const goalOptions = [
    { value: 'personal', label: 'Personal productivity' },
    { value: 'team', label: 'Team collaboration' },
    { value: 'project', label: 'Project management' },
    { value: 'customer', label: 'Customer management' }
  ];
  
  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System default', icon: Sparkles }
  ];
  
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 md:p-6 lg:p-8 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="w-full max-w-xl">
        <motion.div 
          className="wizard-card overflow-visible"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                {steps[currentStep].title}
              </h2>
              
              <WizardMascot step={currentStep} isCompleted={isCompleted} />
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              {steps[currentStep].description}
            </p>
          </div>
          
          {/* Progress bar */}
          <div className="px-8">
            <div className="flex items-center justify-between text-xs text-gray-500 mt-6 mb-2">
              <span>Start</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-1.5 bg-gray-100" 
            />
          </div>
          
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
                    interestOptions={interestOptions}
                    teamSizeOptions={teamSizeOptions}
                    goalOptions={goalOptions}
                    themeOptions={themeOptions}
                    handleSelectInterest={handleSelectInterest}
                    handleFileUpload={handleFileUpload}
                    isCompleted={isCompleted}
                    isLoggingIn={isLoggingIn}
                    isSaving={isSaving}
                  />
                </form>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Footer */}
          {!isCompleted && (
            <div className="p-6 md:p-8 border-t border-gray-100 flex justify-between">
              {currentStep > 0 ? (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex items-center gap-2 text-gray-600"
                >
                  <ArrowLeft size={16} />
                  Back
                </Button>
              ) : (
                <div></div>
              )}
              
              <Button
                onClick={handleNext}
                disabled={isLoggingIn || isSaving}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    {isLoggingIn ? 'Logging in...' : isSaving ? 'Saving...' : 'Complete'} {!isLoggingIn && !isSaving && <CheckCircle size={16} />}
                  </>
                ) : (
                  <>
                    Continue <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
