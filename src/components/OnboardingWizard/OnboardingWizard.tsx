
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

type OnboardingData = {
  email: string;
  password: string;
  name: string;
  role: string;
  company: string;
  teamSize: string;
  interests: string[];
  goal: string;
  theme: 'light' | 'dark' | 'system';
};

const OnboardingWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    theme: 'system',
    interests: []
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  
  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      navigate('/outbound');
    }
  }, [user, navigate]);
  
  const form = useForm<Partial<OnboardingData>>({
    defaultValues: formData,
  });
  
  const steps = [
    {
      id: 'authentication',
      title: '🔐 Create Account',
      description: 'Set up your account to get started',
      fields: ['email', 'password']
    },
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
      
      // For first step (authentication), create account but don't sign in yet
      if (currentStep === 0) {
        const { email, password } = form.getValues();
        
        if (!email || !password) {
          toast({
            title: "Error",
            description: "Email and password are required",
            variant: "destructive"
          });
          return;
        }
        
        try {
          setIsAuthenticating(true);
          
          // Check if email already exists
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
          });
          
          if (signUpError) {
            // If error is "User already registered", we can proceed
            if (!signUpError.message.includes("already registered")) {
              throw new Error(signUpError.message);
            }
          }
          
          // Success or user already registered - we proceed either way
          console.log('Account creation initiated for:', email);
          
        } catch (error) {
          console.error('Error during account creation:', error);
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "An unexpected error occurred",
            variant: "destructive"
          });
          setIsAuthenticating(false);
          return;
        } finally {
          setIsAuthenticating(false);
        }
      }
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
  
  const handleComplete = async () => {
    // Submit all collected data
    const finalData = { ...formData, ...form.getValues() };
    console.log('Onboarding completed with data:', finalData);
    
    try {
      setIsAuthenticating(true);
      
      // Get the email and password from the first step
      const { email, password } = finalData;
      
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      console.log('Signing in with:', email);
      
      // Update user metadata with the collected information
      const { error: userUpdateError } = await supabase.auth.updateUser({
        data: {
          name: finalData.name,
          company: finalData.company,
          role: finalData.role,
          teamSize: finalData.teamSize,
          interests: finalData.interests,
          goal: finalData.goal,
          theme: finalData.theme,
        }
      });
      
      if (userUpdateError) {
        console.error('Error updating user data:', userUpdateError);
      }
      
      // Save onboarding data to the mizi_ai_surveys table
      const { error: surveyError } = await supabase
        .from('mizi_ai_surveys')
        .insert({
          funnel_stage: "Onboarding",
          csv_data: {
            name: finalData.name,
            company: finalData.company,
            role: finalData.role,
            teamSize: finalData.teamSize,
            interests: finalData.interests,
            goal: finalData.goal,
            theme: finalData.theme,
          }
        });
      
      if (surveyError) {
        console.error('Error saving survey data:', surveyError);
      }
      
      // Sign in with the created account
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        throw new Error(signInError.message);
      }
      
      // Show success message
      toast({
        title: "Onboarding completed! 🎉",
        description: "Your workspace is ready to use.",
      });
      
      setIsCompleted(true);
      
      // Redirect to outbound after a short delay
      setTimeout(() => {
        navigate("/outbound");
      }, 1500);
      
    } catch (error) {
      console.error('Error during onboarding completion:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsAuthenticating(false);
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
          className="wizard-card overflow-visible bg-white rounded-xl shadow-lg"
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
                    isCompleted={isCompleted}
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
                  disabled={isAuthenticating}
                >
                  <ArrowLeft size={16} />
                  Back
                </Button>
              ) : (
                <div></div>
              )}
              
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
                disabled={isAuthenticating}
              >
                {isAuthenticating ? (
                  "Processing..."
                ) : currentStep === steps.length - 1 ? (
                  <>
                    Complete <CheckCircle size={16} />
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
