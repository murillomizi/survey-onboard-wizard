
import React from "react";
import { X, Save, FileText, MessageSquare, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";

interface TemplateConfigMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (templateConfig: TemplateConfig) => void;
}

export interface TemplateConfig {
  characterLength: number;
  tone: string;
  trigger: string;
  cta: string;
  personalization: string;
  template: string;
  audience: string;
}

const TemplateConfigMenu: React.FC<TemplateConfigMenuProps> = ({ 
  isOpen, 
  onClose, 
  onApplyTemplate 
}) => {
  const [templateConfig, setTemplateConfig] = React.useState<TemplateConfig>({
    characterLength: 300,
    tone: "professional",
    trigger: "pain_point",
    cta: "meeting",
    personalization: "low",
    template: "default",
    audience: "decision_makers"
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
    { value: "casual", label: "Casual" },
    { value: "direct", label: "Direto" }
  ];

  const triggerOptions = [
    { value: "pain_point", label: "Ponto de dor" },
    { value: "benefit", label: "Benefício" },
    { value: "curiosity", label: "Curiosidade" },
    { value: "social_proof", label: "Prova social" },
    { value: "scarcity", label: "Escassez" }
  ];

  const ctaOptions = [
    { value: "meeting", label: "Agendar reunião" },
    { value: "demo", label: "Solicitar demonstração" },
    { value: "trial", label: "Teste gratuito" },
    { value: "reply", label: "Pedir resposta" },
    { value: "download", label: "Download de material" }
  ];

  const templateOptions = [
    { value: "default", label: "Padrão" },
    { value: "pains_solution", label: "Dor → Solução" },
    { value: "question_answer", label: "Pergunta → Resposta" },
    { value: "story_offer", label: "História → Oferta" },
    { value: "data_insight", label: "Dados → Insight" }
  ];

  const audienceOptions = [
    { value: "decision_makers", label: "Tomadores de decisão" },
    { value: "technical", label: "Técnico" },
    { value: "executives", label: "Executivos" },
    { value: "managers", label: "Gerentes" },
    { value: "small_business", label: "Pequenas empresas" }
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[540px] p-6 overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2">
            <FileText size={20} />
            Configuração do Template
          </SheetTitle>
          <SheetDescription>
            Personalize as características do seu template para gerar o copy perfeito
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4 space-y-6">
          {/* Character Length Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="character-length">Tamanho do texto</Label>
              <span className="text-xs text-muted-foreground">{templateConfig.characterLength} caracteres</span>
            </div>
            <Slider 
              id="character-length"
              min={100} 
              max={1000} 
              step={50} 
              value={[templateConfig.characterLength]}
              onValueChange={(values) => handleChange('characterLength', values[0])}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Curto</span>
              <span>Médio</span>
              <span>Longo</span>
            </div>
          </div>
          
          {/* Tone of Voice */}
          <div className="space-y-2">
            <Label htmlFor="tone">Tom de voz</Label>
            <Select 
              value={templateConfig.tone} 
              onValueChange={(value) => handleChange('tone', value)}
            >
              <SelectTrigger id="tone">
                <SelectValue placeholder="Selecione o tom" />
              </SelectTrigger>
              <SelectContent>
                {toneOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Define como sua mensagem será percebida pelo destinatário
            </p>
          </div>
          
          {/* Trigger Type */}
          <div className="space-y-2">
            <Label htmlFor="trigger">Tipo de gatilho</Label>
            <Select 
              value={templateConfig.trigger} 
              onValueChange={(value) => handleChange('trigger', value)}
            >
              <SelectTrigger id="trigger">
                <SelectValue placeholder="Selecione o gatilho" />
              </SelectTrigger>
              <SelectContent>
                {triggerOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              O elemento que irá despertar o interesse do leitor
            </p>
          </div>

          {/* Call to Action */}
          <div className="space-y-2">
            <Label htmlFor="cta">Chamada para ação (CTA)</Label>
            <Select 
              value={templateConfig.cta} 
              onValueChange={(value) => handleChange('cta', value)}
            >
              <SelectTrigger id="cta">
                <SelectValue placeholder="Selecione o CTA" />
              </SelectTrigger>
              <SelectContent>
                {ctaOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              O que você deseja que o destinatário faça após ler sua mensagem
            </p>
          </div>
          
          {/* Template Structure */}
          <div className="space-y-2">
            <Label htmlFor="template">Estrutura do template</Label>
            <Select 
              value={templateConfig.template} 
              onValueChange={(value) => handleChange('template', value)}
            >
              <SelectTrigger id="template">
                <SelectValue placeholder="Selecione a estrutura" />
              </SelectTrigger>
              <SelectContent>
                {templateOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              A estrutura que será utilizada para organizar o conteúdo
            </p>
          </div>

          {/* Target Audience */}
          <div className="space-y-2">
            <Label htmlFor="audience">Público-alvo</Label>
            <Select 
              value={templateConfig.audience} 
              onValueChange={(value) => handleChange('audience', value)}
            >
              <SelectTrigger id="audience">
                <SelectValue placeholder="Selecione o público" />
              </SelectTrigger>
              <SelectContent>
                {audienceOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              O tipo de pessoa para quem você está escrevendo
            </p>
          </div>
          
          {/* Personalization Level */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="personalization">Nível de personalização</Label>
              <span className="text-xs text-muted-foreground capitalize">{templateConfig.personalization}</span>
            </div>
            <Select 
              value={templateConfig.personalization} 
              onValueChange={(value) => handleChange('personalization', value)}
            >
              <SelectTrigger id="personalization">
                <SelectValue placeholder="Selecione o nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baixo</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="high">Alto</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Quanto mais personalizado, maior a chance de engajamento
            </p>
          </div>
          
          {/* Custom Instructions */}
          <div className="space-y-2">
            <Label htmlFor="custom-instructions">Instruções personalizadas</Label>
            <Textarea 
              id="custom-instructions" 
              placeholder="Digite instruções adicionais para o template..."
              className="h-20 resize-none"
            />
          </div>
        </div>
        
        <SheetFooter className="pt-4">
          <div className="flex justify-between w-full">
            <SheetClose asChild>
              <Button variant="outline">
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </SheetClose>
            <Button onClick={handleApplyTemplate}>
              <Save className="mr-2 h-4 w-4" />
              Aplicar Template
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default TemplateConfigMenu;
