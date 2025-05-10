
import React from "react";
import { Send, BarChart3, BriefcaseBusiness, PenLine, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CopyPreviewFooter: React.FC = () => {
  // Função para lidar com a seleção de opções
  const handleOptionSelect = (option: string) => {
    console.log(`Opção selecionada: ${option}`);
    // Aqui você poderia implementar a lógica para abrir um modal específico 
    // baseado na opção selecionada ou enviar para um callback
    
    toast({
      title: "Opção selecionada",
      description: `Você selecionou: ${option}`
    });
  };

  return (
    <div className="p-4 bg-gradient-to-r from-minimal-white to-minimal-gray-100 border-t border-minimal-gray-300 flex justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-minimal-gray-300 bg-minimal-white hover:bg-minimal-gray-100"
          >
            Personalizar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 bg-white" align="start">
          <DropdownMenuLabel>Características do Copy</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => handleOptionSelect("tom")}>
              <PenLine className="mr-2 h-4 w-4" />
              <div className="flex flex-col">
                <span>Tom de Comunicação</span>
                <span className="text-xs text-gray-500">Formal, casual, amigável ou direto</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOptionSelect("objetivo")}>
              <Target className="mr-2 h-4 w-4" />
              <div className="flex flex-col">
                <span>Objetivo Principal</span>
                <span className="text-xs text-gray-500">Agendar reunião, demonstração ou feedback</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOptionSelect("setor")}>
              <BriefcaseBusiness className="mr-2 h-4 w-4" />
              <div className="flex flex-col">
                <span>Setor de Atuação</span>
                <span className="text-xs text-gray-500">Tecnologia, saúde, educação, finanças</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOptionSelect("beneficios")}>
              <Zap className="mr-2 h-4 w-4" />
              <div className="flex flex-col">
                <span>Benefícios a Destacar</span>
                <span className="text-xs text-gray-500">ROI, tempo, qualidade, redução de custos</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOptionSelect("dados")}>
              <BarChart3 className="mr-2 h-4 w-4" />
              <div className="flex flex-col">
                <span>Dados e Estatísticas</span>
                <span className="text-xs text-gray-500">Incluir métricas e estudos de caso</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button 
        className="bg-minimal-black hover:bg-minimal-gray-800 text-minimal-white flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        onClick={() => {
          toast({
            title: "Copy exportado!",
            description: "O conteúdo foi salvo em seus rascunhos."
          });
        }}
      >
        <Send size={16} />
        Salvar Copy
      </Button>
    </div>
  );
};

export default CopyPreviewFooter;
