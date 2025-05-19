
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ArrowRight, CheckCircle, Moon, Sun, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import WizardStep from './WizardStep';
import WizardMascot from './WizardMascot';
import { useAuth } from '@/contexts/AuthContext';

type OnboardingData = {
  websiteUrl: string;
  email: string;
  password: string;
  theme: 'light' | 'dark' | 'system';
};

const OnboardingWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    theme: 'system',
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const form = useForm<Partial<OnboardingData>>({
    defaultValues: formData,
  });
  
  const steps = [
    {
      id: 'welcome',
      title: '👋 Bem-vindo!',
      description: 'Vamos configurar sua experiência em poucos passos',
    },
    {
      id: 'company',
      title: '🏢 Sua empresa',
      description: 'Informe o site da sua empresa',
      fields: ['websiteUrl']
    },
    {
      id: 'csv',
      title: '📊 Importar base',
      description: 'Importe sua base de contatos para personalização',
    },
    {
      id: 'login',
      title: '🔐 Login',
      description: 'Entre com suas credenciais para completar a configuração',
      fields: ['email', 'password']
    }
  ];
  
  const progressPercentage = ((currentStep) / (steps.length - 1)) * 100;
  
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    toast({
      title: "Arquivo selecionado",
      description: `${file.name} foi carregado com sucesso.`,
    });
  };
  
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
  
  const saveSurveyData = async (websiteUrl: string, file: File | null) => {
    if (!file) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo CSV para continuar.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      // Parse and prepare CSV data if needed
      // For now we're just saving the file name and website URL
      const { error } = await supabase
        .from('mizi_ai_surveys')
        .insert({
          website_url: websiteUrl,
          csv_file_name: file.name,
          // Leave other fields blank as requested
        });
      
      if (error) {
        console.error('Error saving survey data:', error);
        toast({
          title: "Erro ao salvar dados",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in saveSurveyData:', error);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível salvar os dados do formulário.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const handleComplete = async () => {
    // Get all form data including email and password
    const finalData = { ...formData, ...form.getValues() };
    console.log('Onboarding completed with data:', finalData);
    
    setIsLoggingIn(true);
    
    try {
      // Save survey data to Supabase
      const websiteUrl = finalData.websiteUrl || '';
      const saveSuccess = await saveSurveyData(websiteUrl, selectedFile);
      
      if (!saveSuccess) {
        setIsLoggingIn(false);
        return;
      }
      
      // Use the email and password from the form to sign in
      if (finalData.email && finalData.password) {
        const { error } = await signIn(finalData.email, finalData.password);
        
        if (error) {
          console.error('Login error:', error);
          toast({
            title: "Login falhou",
            description: error.message || "Por favor verifique suas credenciais",
            variant: "destructive",
          });
          setIsLoggingIn(false);
          return;
        }
        
        // Show success message
        toast({
          title: "Onboarding concluído! 🎉",
          description: "Seu espaço de trabalho está pronto para uso.",
        });
        
        setIsCompleted(true);
        
        // Navigate to outbound after successful login
        setTimeout(() => {
          navigate('/outbound');
        }, 1500);
      } else {
        toast({
          title: "Erro de login",
          description: "Email e senha são obrigatórios",
          variant: "destructive",
        });
        setIsLoggingIn(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login falhou",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
      setIsLoggingIn(false);
    }
  };
  
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
              <span>Início</span>
              <span>{Math.round(progressPercentage)}% Concluído</span>
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
                    isCompleted={isCompleted}
                    isLoggingIn={isLoggingIn}
                    onFileSelect={handleFileSelect}
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
                  Voltar
                </Button>
              ) : (
                <div></div>
              )}
              
              <Button
                onClick={handleNext}
                disabled={isLoggingIn}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    {isLoggingIn ? 'Entrando...' : 'Concluir'} {!isLoggingIn && <CheckCircle size={16} />}
                  </>
                ) : (
                  <>
                    Continuar <ArrowRight size={16} />
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
