import React from 'react';
import { motion } from 'framer-motion';
import { UseFormReturn } from 'react-hook-form';
import { Check, AtSign, Loader, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

type WizardStepProps = {
  step: number;
  form: UseFormReturn<any>;
  formData: any;
  steps: any[];
  isCompleted: boolean;
  isLoggingIn?: boolean;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  const { register, formState: { errors }, watch, setValue } = form;
  const navigate = useNavigate();
  const { user } = useAuth();

  if (isCompleted) {
  return (
    <div className="py-8 flex justify-center items-center min-h-[60vh]">
      <motion.div 
        className="flex flex-col items-center text-center bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full border border-gray-100"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4 shadow-lg">
          <Check className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-2">Tudo pronto!</h3>
        <p className="text-gray-600 mb-6 text-lg">
          Seus dados foram salvos. Vamos começar a personalizar suas campanhas!
        </p>
        <Button
          onClick={async () => {
            navigate("/outbound");
          }}
          className="w-full max-w-xs bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium shadow-md hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
        >
          Concluir
        </Button>
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
            Vamos configurar sua campanha de outbound
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Precisamos de algumas informações para personalizar suas mensagens de maneira eficiente.
          </p>
        </div>
      );
      
    case 1: // Channel selection
      return (
        <div className="space-y-6">
          <Label className="block mb-3">Qual canal você vai utilizar na sua campanha?</Label>
          <RadioGroup 
            defaultValue={formData.canal || ""}
            onValueChange={(value) => setValue('canal', value)}
            className="grid grid-cols-2 gap-3"
          >
            <div className={`flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer ${watch('canal') === 'linkedin' ? 'border-indigo-500 bg-indigo-50' : ''}`}>
              <RadioGroupItem value="linkedin" id="linkedin" />
              <Label htmlFor="linkedin" className="cursor-pointer">LinkedIn</Label>
            </div>
            <div className={`flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer ${watch('canal') === 'cold-email' ? 'border-indigo-500 bg-indigo-50' : ''}`}>
              <RadioGroupItem value="cold-email" id="cold-email" />
              <Label htmlFor="cold-email" className="cursor-pointer">Cold Email</Label>
            </div>
          </RadioGroup>
          {errors.canal && (
            <span className="text-sm text-red-500 mt-1 block">
              {errors.canal.message as string}
            </span>
          )}
        </div>
      );

    case 2: // Company website
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
      
    case 3: // Tone of voice
      return (
        <div className="space-y-6">
          <Label className="block mb-3">Qual tom de voz você prefere para suas mensagens?</Label>
          <RadioGroup 
            defaultValue={formData.tomVoz || ""}
            onValueChange={(value) => setValue('tomVoz', value)}
            className="grid grid-cols-2 gap-3"
          >
            {[
              { value: 'formal', label: 'Formal' },
              { value: 'informal', label: 'Informal' },
              { value: 'consultivo', label: 'Consultivo' },
              { value: 'inovador', label: 'Inovador' },
              { value: 'curioso', label: 'Curioso' },
              { value: 'neutro', label: 'Neutro' }
            ].map(option => (
              <div 
                key={option.value}
                className={`flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer ${watch('tomVoz') === option.value ? 'border-indigo-500 bg-indigo-50' : ''}`}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer">{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          {errors.tomVoz && (
            <span className="text-sm text-red-500 mt-1 block">
              {errors.tomVoz.message as string}
            </span>
          )}
        </div>
      );

    case 4: // Message length
      return (
        <div className="space-y-6">
          <div>
            <Label className="wizard-label" htmlFor="tamanho">
              Tamanho da mensagem (em caracteres)
            </Label>
            <div className="mt-6">
              <Slider
                defaultValue={[formData.tamanho || 350]}
                max={1000}
                min={100}
                step={10}
                onValueChange={(value) => setValue('tamanho', value[0])}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>100</span>
                <span className="font-medium text-indigo-600">{watch('tamanho') || 350}</span>
                <span>1000</span>
              </div>
              <p className="text-gray-500 text-sm mt-3 italic">
                Recomendado: 350-500 caracteres para maior impacto
              </p>
            </div>
          </div>
        </div>
      );

    case 5: // Persuasion trigger
      return (
        <div className="space-y-6">
          <Label className="block mb-3">Gatilho de persuasão para suas mensagens</Label>
          <RadioGroup 
            defaultValue={formData.gatilhos || ""}
            onValueChange={(value) => setValue('gatilhos', value)}
            className="grid grid-cols-2 gap-3"
          >
            {[
              { value: 'sem-gatilho', label: 'Sem gatilho' },
              { value: 'reciprocidade', label: 'Reciprocidade' },
              { value: 'compromisso', label: 'Compromisso' },
              { value: 'prova-social', label: 'Prova Social' },
              { value: 'autoridade', label: 'Autoridade' },
              { value: 'escassez', label: 'Escassez' }
            ].map(option => (
              <div 
                key={option.value}
                className={`flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer ${watch('gatilhos') === option.value ? 'border-indigo-500 bg-indigo-50' : ''}`}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer">{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          {errors.gatilhos && (
            <span className="text-sm text-red-500 mt-1 block">
              {errors.gatilhos.message as string}
            </span>
          )}
        </div>
      );
      
    case 6: // CSV upload
      return (
        <div className="space-y-6">
          <div>
            <Label className="wizard-label" htmlFor="csvFile">
              Importar base de contatos (CSV)
            </Label>
            <div className="mt-2 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <div className="flex flex-col items-center">
                <FileText className="h-8 w-8 text-gray-400 mb-2" />
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Arraste e solte seu arquivo CSV ou 
                  </p>
                  <label htmlFor="file-upload" className="relative cursor-pointer">
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      Procurar arquivo
                    </Button>
                    <input
                      id="file-upload"
                      name="csvFile"
                      type="file"
                      accept=".csv"
                      className="sr-only"
                      onChange={onFileSelect}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">CSV até 10MB</p>
                {formData.csvFileName && (
                  <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm text-green-700">{formData.csvFileName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
      
    default:
      return null;
  }
};

export default WizardStep;
