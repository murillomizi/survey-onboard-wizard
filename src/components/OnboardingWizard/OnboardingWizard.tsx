
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import WizardStep from './WizardStep';
import WizardMascot from './WizardMascot';

type OnboardingData = {
  canal: string;
  websiteUrl: string;
  tomVoz: string;
  tamanho: number;
  gatilhos: string;
  csvFileName: string;
  userEmail: string;
};

const OnboardingWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    tamanho: 350,
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<Partial<OnboardingData>>({
    defaultValues: formData,
  });
  
  const steps = [
    {
      id: 'welcome',
      title: '👋 Bem-vindo!',
      description: 'Vamos configurar suas campanhas em poucos passos',
    },
    {
      id: 'canal',
      title: '📱 Canal',
      description: 'Qual canal você vai usar para suas campanhas',
      fields: ['canal']
    },
    {
      id: 'website',
      title: '🏢 Website',
      description: 'Informe o site da sua empresa',
      fields: ['websiteUrl']
    },
    {
      id: 'tom-voz',
      title: '🎭 Tom de Voz',
      description: 'Escolha o tom de voz para suas mensagens',
      fields: ['tomVoz']
    },
    {
      id: 'tamanho',
      title: '📏 Comprimento',
      description: 'Escolha o tamanho das suas mensagens',
      fields: ['tamanho']
    },
    {
      id: 'gatilho',
      title: '🎯 Gatilhos',
      description: 'Selecione um gatilho de persuasão',
      fields: ['gatilhos']
    },
    {
      id: 'csv',
      title: '📊 Base de dados',
      description: 'Importe sua base de contatos',
      fields: ['csvFile']
    },
    {
      id: 'email',
      title: '📧 Email',
      description: 'Informe seu email para receber os resultados',
      fields: ['userEmail']
    }
  ];
  
  const progressPercentage = ((currentStep) / (steps.length - 1)) * 100;
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      setFormData(prev => ({ ...prev, csvFileName: file.name }));
      toast({
        title: "Arquivo selecionado",
        description: `${file.name} foi carregado com sucesso.`,
      });
    }
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
  
  const saveSurveyData = async () => {
    try {
      // Get all form data
      const finalData = { ...formData, ...form.getValues() };
      
      // Prepare CSV data if file is selected
      let csvData = [];
      if (selectedFile) {
        try {
          const text = await selectedFile.text();
          const rows = text.split('\n');
          const headers = rows[0].split(',');
          
          for (let i = 1; i < Math.min(rows.length, 101); i++) {
            if (rows[i].trim()) {
              const values = rows[i].split(',');
              const row = {};
              for (let j = 0; j < headers.length; j++) {
                row[headers[j].trim()] = values[j] ? values[j].trim() : '';
              }
              csvData.push(row);
            }
          }
          console.log('Parsed CSV data:', csvData.length, 'rows');
        } catch (e) {
          console.error('Error parsing CSV:', e);
          csvData = []; // Reset if parsing fails
        }
      }
      
      // Insert data into Supabase
      const { error } = await supabase
        .from('mizi_ai_surveys')
        .insert({
          website_url: finalData.websiteUrl || '',
          canal: finalData.canal || '',
          tone_of_voice: finalData.tomVoz || '',
          message_length: finalData.tamanho || 350,
          persuasion_trigger: finalData.gatilhos || '',
          csv_file_name: finalData.csvFileName || '',
          csv_data: csvData.length > 0 ? csvData : null
        });
      
      if (error) {
        console.error('Error saving data to Supabase:', error);
        toast({
          title: "Erro ao salvar dados",
          description: error.message || "Não foi possível salvar os dados. Tente novamente.",
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in saveSurveyData:', error);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível processar sua solicitação.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const handleComplete = async () => {
    setIsLoggingIn(true);
    
    try {
      // Save survey data to Supabase
      const saveSuccess = await saveSurveyData();
      
      if (!saveSuccess) {
        setIsLoggingIn(false);
        return;
      }
      
      // Show success message
      toast({
        title: "Dados salvos com sucesso! 🎉",
        description: "Suas campanhas personalizadas serão enviadas para seu email.",
      });
      
      setIsCompleted(true);
      
      // Navigate to outbound after successful submission
      setTimeout(() => {
        navigate('/outbound');
      }, 1500);
    } catch (error) {
      console.error('Error in handleComplete:', error);
      toast({
        title: "Erro",
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
          className="wizard-card overflow-visible bg-white shadow-xl rounded-2xl"
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
                    {isLoggingIn ? 'Processando...' : 'Concluir'} {!isLoggingIn && <CheckCircle size={16} />}
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
