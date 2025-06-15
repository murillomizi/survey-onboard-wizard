import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { OnboardingData, WizardStep } from './types';

export const useOnboardingWizard = () => {
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
  
  const steps: WizardStep[] = [
    {
      id: 'welcome',
      title: '👋 Bem-vindo!',
      description: 'Vamos configurar suas campanhas em poucos passos',
    },
    {
      id: 'website',
      title: '🏢 Website',
      description: 'Informe o site da sua empresa',
      fields: ['websiteUrl']
    },
    {
      id: 'canal',
      title: '📱 Canal',
      description: 'Qual canal você vai usar para suas campanhas',
      fields: ['canal']
    },
    {
      id: 'tamanho',
      title: '📏 Comprimento',
      description: 'Escolha o tamanho das suas mensagens',
      fields: ['tamanho']
    },
    {
      id: 'tom-voz',
      title: '🎭 Tom de Voz',
      description: 'Escolha o tom de voz para suas mensagens',
      fields: ['tomVoz']
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
      description: 'Sua campanha está pronta!',
      fields: ['userEmail']
    }
  ];
  
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
      const { data, error } = await supabase
        .from('mizi_ai_surveys')
        .insert({
          website_url: finalData.websiteUrl || '',
          canal: finalData.canal || '',
          tone_of_voice: finalData.tomVoz || '',
          message_length: finalData.tamanho || 350,
          persuasion_trigger: finalData.gatilhos || '',
          csv_file_name: finalData.csvFileName || '',
          csv_data: csvData.length > 0 ? csvData : null
        })
        .select('id')
        .single();
      
      if (error) {
        console.error('Error saving data to Supabase:', error);
        toast({
          title: "Erro ao salvar dados",
          description: error.message || "Não foi possível salvar os dados. Tente novamente.",
          variant: "destructive",
        });
        return null;
      }
      
      return data?.id || null;
    } catch (error) {
      console.error('Error in saveSurveyData:', error);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível processar sua solicitação.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  const handleComplete = async () => {
    setIsLoggingIn(true);
    
    try {
      // Salva e pega o ID do survey criado
      const surveyId = await saveSurveyData();
      if (!surveyId) {
        setIsLoggingIn(false);
        return;
      }

      // Preparar dados para o webhook do Make
      const formValues = form.getValues();
      const dataToSend = {
        canal: formValues.canal || '',
        websiteUrl: formValues.websiteUrl || '',
        tomVoz: formValues.tomVoz || '',
        tamanho: formValues.tamanho || 350,
        gatilhos: formValues.gatilhos || '',
        userEmail: formValues.userEmail || '',
        csvFileName: formData.csvFileName || '',
        csvData: formData.csvData || []
      };

      console.log("🚀 Preparando envio para o Make:", dataToSend);

      try {
        console.log("📡 Iniciando requisição para o webhook...");
        const res = await fetch("https://hook.us2.make.com/gpd3vy1vrctlgjhgh3lihuub42smaifa", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(dataToSend),
        });

        const responseText = await res.text();
        console.log("📥 Status da resposta:", res.status);
        console.log("📄 Corpo da resposta:", responseText);
        console.log("🔍 Headers da resposta:", Object.fromEntries(res.headers.entries()));

        if (!res.ok) {
          throw new Error(`Erro HTTP ${res.status}: ${responseText}`);
        }

        console.log("✅ Dados enviados com sucesso para o Make!");
        
        // Show success message
        toast({
          title: "Dados salvos com sucesso! 🎉",
          description: "Suas campanhas personalizadas serão enviadas para seu email.",
        });
        
        setIsCompleted(true);
        
        // Navigate to outbound after successful submission
        setTimeout(() => {
          navigate(`/onboarding-success/${surveyId}`);
        }, 1500);

      } catch (err) {
        console.error("❌ Erro detalhado ao enviar para o Make:", {
          error: err,
          data: dataToSend
        });
        
        toast({
          title: "Aviso",
          description: "Os dados foram salvos, mas houve um erro ao enviar para o sistema externo. Nossa equipe foi notificada.",
          variant: "destructive",
        });
        
        // Continue with navigation despite webhook error
        setIsCompleted(true);
        setTimeout(() => {
          navigate(`/onboarding-success/${surveyId}`);
        }, 1500);
      }

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

  return {
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
    handleComplete
  };
};
