
import React, { useState } from "react";
import { X, Save } from "lucide-react";
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
import { toast } from "@/components/ui/use-toast";

interface CopyFeatureEditorProps {
  isOpen: boolean;
  onClose: () => void;
  featureType: string; // 'tom', 'objetivo', 'setor', 'beneficios', 'dados'
  onApplyChanges: (changes: any) => void;
}

const CopyFeatureEditor: React.FC<CopyFeatureEditorProps> = ({ 
  isOpen, 
  onClose, 
  featureType,
  onApplyChanges 
}) => {
  const [formData, setFormData] = useState({});
  
  const getTitle = () => {
    switch (featureType) {
      case 'tom': return "Tom de Comunicação";
      case 'objetivo': return "Objetivo Principal";
      case 'setor': return "Setor de Atuação";
      case 'beneficios': return "Benefícios a Destacar";
      case 'dados': return "Dados e Estatísticas";
      default: return "Editar Característica";
    }
  };
  
  const getDescription = () => {
    switch (featureType) {
      case 'tom': return "Escolha o tom de comunicação para seu copy de outbound";
      case 'objetivo': return "Defina o objetivo principal da sua mensagem";
      case 'setor': return "Selecione o setor de atuação do seu público-alvo";
      case 'beneficios': return "Destaque os principais benefícios da sua solução";
      case 'dados': return "Adicione dados e estatísticas para fortalecer seu copy";
      default: return "Personalize as características do seu copy";
    }
  };
  
  const handleSave = () => {
    onApplyChanges(formData);
    toast({
      title: "Alterações aplicadas!",
      description: `As configurações de ${getTitle().toLowerCase()} foram atualizadas.`
    });
    onClose();
  };
  
  const renderFormFields = () => {
    switch (featureType) {
      case 'tom':
        return (
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="communication-tone">Escolha o tom</Label>
              <Select onValueChange={(value) => setFormData({...formData, tone: value})}>
                <SelectTrigger id="communication-tone">
                  <SelectValue placeholder="Selecione o tom" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Amigável</SelectItem>
                  <SelectItem value="direct">Direto</SelectItem>
                  <SelectItem value="professional">Profissional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="politeness-level">Nível de formalidade</Label>
              <Select onValueChange={(value) => setFormData({...formData, politeness: value})}>
                <SelectTrigger id="politeness-level">
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very-formal">Muito Formal</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="neutral">Neutro</SelectItem>
                  <SelectItem value="informal">Informal</SelectItem>
                  <SelectItem value="very-informal">Muito Informal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 'objetivo':
        return (
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="main-goal">Objetivo principal</Label>
              <Select onValueChange={(value) => setFormData({...formData, goal: value})}>
                <SelectTrigger id="main-goal">
                  <SelectValue placeholder="Selecione o objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Agendar reunião</SelectItem>
                  <SelectItem value="demo">Solicitar demonstração</SelectItem>
                  <SelectItem value="feedback">Pedir feedback</SelectItem>
                  <SelectItem value="info">Compartilhar informação</SelectItem>
                  <SelectItem value="introduction">Apresentação inicial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="call-to-action">Chamada para ação</Label>
              <Input 
                id="call-to-action" 
                placeholder="Ex: Podemos agendar 15 minutos para conversar?"
                onChange={(e) => setFormData({...formData, cta: e.target.value})}
              />
            </div>
          </div>
        );
        
      // Podemos continuar com os outros casos de forma semelhante
      default:
        return (
          <div className="pt-4">
            <Textarea
              placeholder="Insira as informações personalizadas para esta característica"
              className="h-32"
              onChange={(e) => setFormData({...formData, customContent: e.target.value})}
            />
          </div>
        );
    }
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[540px] p-6">
        <SheetHeader className="pb-4">
          <SheetTitle>{getTitle()}</SheetTitle>
          <SheetDescription>{getDescription()}</SheetDescription>
        </SheetHeader>
        
        <div className="py-4">
          {renderFormFields()}
        </div>
        
        <SheetFooter className="pt-4">
          <div className="flex justify-between w-full">
            <SheetClose asChild>
              <Button variant="outline">
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </SheetClose>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Aplicar Alterações
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CopyFeatureEditor;
