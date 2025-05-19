
import React from 'react';
import { motion } from 'framer-motion';
import { UseFormReturn } from 'react-hook-form';
import { Check, LucideIcon, AtSign, Loader } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CSVFileUpload from '@/components/survey/CSVFileUpload';

type WizardStepProps = {
  step: number;
  form: UseFormReturn<any>;
  formData: any;
  steps: any[];
  isCompleted: boolean;
  isLoggingIn?: boolean;
  onFileSelect: (file: File) => void;
};

const WizardStep: React.FC<WizardStepProps> = ({
  step,
  form,
  formData,
  steps,
  isCompleted,
  isLoggingIn = false,
  onFileSelect
}) => {
  const { register, formState: { errors } } = form;
  
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
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Tudo pronto!</h3>
          <p className="text-gray-600 mb-6">
            Seu espaço de trabalho está pronto para uso. Vamos começar!
          </p>
          <motion.div 
            className="w-full max-w-xs bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Ir para o Dashboard
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
            Bem-vindo ao seu novo espaço de trabalho
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Vamos ajudá-lo a configurar tudo em apenas alguns passos simples.
          </p>
        </div>
      );
      
    case 1: // Company step (only website field)
      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="wizard-label" htmlFor="websiteUrl">
                Site da empresa
              </Label>
              <Input
                {...register('websiteUrl', { required: 'Site da empresa é obrigatório' })}
                id="websiteUrl"
                type="url"
                className={`wizard-input ${errors.websiteUrl ? 'border-red-300 focus:border-red-500' : ''}`}
                placeholder="https://minhaempresa.com.br"
              />
              {errors.websiteUrl && (
                <span className="text-sm text-red-500 mt-1 block">
                  {errors.websiteUrl.message as string}
                </span>
              )}
            </div>
          </div>
        </div>
      );
      
    case 2: // CSV import step
      return (
        <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <CSVFileUpload onFileSelect={onFileSelect} />
        </div>
      );
      
    case 3: // Login step
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
                  placeholder="seu@email.com"
                  {...register('email', { 
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email inválido"
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
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                {...register('password', { 
                  required: 'Senha é obrigatória',
                  minLength: {
                    value: 6,
                    message: 'A senha deve ter pelo menos 6 caracteres'
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
          
          {isLoggingIn && (
            <div className="flex justify-center pt-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Loader className="animate-spin h-5 w-5" />
                <span>Entrando...</span>
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
