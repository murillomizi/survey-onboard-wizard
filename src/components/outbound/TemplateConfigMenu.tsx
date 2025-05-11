
import React, { useState } from "react";
import { X, Save, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PopoverContent } from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";

export interface TemplateConfig {
  characterLength: number;
  tone: string;
  trigger: string;
  cta: string;
  personalization: string;
}

interface TemplateConfigMenuProps {
  onApplyTemplate: (templateConfig: TemplateConfig) => void;
  onClose: () => void;
}

const TemplateConfigMenu: React.FC<TemplateConfigMenuProps> = ({ 
  onApplyTemplate,
  onClose
}) => {
  const [templateConfig, setTemplateConfig] = useState<TemplateConfig>({
    characterLength: 300,
    tone: "professional",
    trigger: "pain_point",
    cta: "meeting",
    personalization: "low",
  });

  const handleChange = (field: keyof TemplateConfig, value: string | number) => {
    setTemplateConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyTemplate = () => {
    onApplyTemplate(templateConfig);
    toast({
      title: "Template aplicado!",
      description: "As configurações do template foram aplicadas com sucesso."
    });
    onClose();
  };

  const toneOptions = [
    { value: "professional", label: "Profissional" },
    { value: "friendly", label: "Amigável" },
    { value: "enthusiastic", label: "Entusiasmado" },
    { value: "formal", label: "Formal" },
  ];

  const triggerOptions = [
    { value: "pain_point", label: "Ponto de dor" },
    { value: "benefit", label: "Benefício" },
    { value: "curiosity", label: "Curiosidade" },
  ];

  const ctaOptions = [
    { value: "meeting", label: "Agendar reunião" },
    { value: "demo", label: "Solicitar demonstração" },
    { value: "reply", label: "Pedir resposta" },
  ];

  return (
    <PopoverContent 
      className="w-72 p-4 rounded-xl border border-minimal-gray-700 bg-minimal-black text-minimal-white"
      sideOffset={8}
      align="start"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <FileText size={16} />
          Template
        </h3>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 text-minimal-gray-400 hover:text-minimal-white hover:bg-minimal-gray-800"
          onClick={onClose}
        >
          <X size={14} />
        </Button>
      </div>
      
      <div className="space-y-4">
        {/* Character Length Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="character-length" className="text-xs">Tamanho</Label>
            <span className="text-xs text-minimal-gray-400">{templateConfig.characterLength}</span>
          </div>
          <Slider 
            id="character-length"
            min={100} 
            max={500} 
            step={50} 
            value={[templateConfig.characterLength]}
            onValueChange={(values) => handleChange('characterLength', values[0])}
            className="py-1"
          />
        </div>
        
        {/* Tone of Voice */}
        <div className="space-y-1">
          <Label htmlFor="tone" className="text-xs">Tom de voz</Label>
          <Select 
            value={templateConfig.tone} 
            onValueChange={(value) => handleChange('tone', value)}
          >
            <SelectTrigger id="tone" className="h-8 text-xs bg-minimal-gray-800 border-minimal-gray-700">
              <SelectValue placeholder="Selecione o tom" />
            </SelectTrigger>
            <SelectContent className="bg-minimal-gray-800 border-minimal-gray-700 text-minimal-white">
              {toneOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Trigger Type */}
        <div className="space-y-1">
          <Label htmlFor="trigger" className="text-xs">Gatilho</Label>
          <Select 
            value={templateConfig.trigger} 
            onValueChange={(value) => handleChange('trigger', value)}
          >
            <SelectTrigger id="trigger" className="h-8 text-xs bg-minimal-gray-800 border-minimal-gray-700">
              <SelectValue placeholder="Selecione o gatilho" />
            </SelectTrigger>
            <SelectContent className="bg-minimal-gray-800 border-minimal-gray-700 text-minimal-white">
              {triggerOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Call to Action */}
        <div className="space-y-1">
          <Label htmlFor="cta" className="text-xs">CTA</Label>
          <Select 
            value={templateConfig.cta} 
            onValueChange={(value) => handleChange('cta', value)}
          >
            <SelectTrigger id="cta" className="h-8 text-xs bg-minimal-gray-800 border-minimal-gray-700">
              <SelectValue placeholder="Selecione o CTA" />
            </SelectTrigger>
            <SelectContent className="bg-minimal-gray-800 border-minimal-gray-700 text-minimal-white">
              {ctaOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Personalization Level */}
        <div className="space-y-1">
          <Label htmlFor="personalization" className="text-xs">Personalização</Label>
          <Select 
            value={templateConfig.personalization} 
            onValueChange={(value) => handleChange('personalization', value)}
          >
            <SelectTrigger id="personalization" className="h-8 text-xs bg-minimal-gray-800 border-minimal-gray-700">
              <SelectValue placeholder="Nível" />
            </SelectTrigger>
            <SelectContent className="bg-minimal-gray-800 border-minimal-gray-700 text-minimal-white">
              <SelectItem value="low">Baixo</SelectItem>
              <SelectItem value="medium">Médio</SelectItem>
              <SelectItem value="high">Alto</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-minimal-gray-700">
        <Button 
          onClick={handleApplyTemplate}
          className="w-full h-8 text-xs bg-minimal-gray-800 hover:bg-minimal-gray-700"
        >
          <Save className="mr-2 h-3 w-3" />
          Aplicar
        </Button>
      </div>
    </PopoverContent>
  );
};

export default TemplateConfigMenu;
