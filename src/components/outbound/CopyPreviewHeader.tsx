
import React from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CopyPreviewHeaderProps {
  selectedPersonaSource: string | null;
  isPersonaPopoverOpen: boolean;
  setIsPersonaPopoverOpen: (isOpen: boolean) => void;
  handlePersonaSelection: (source: string) => void;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CopyPreviewHeader: React.FC<CopyPreviewHeaderProps> = ({
  selectedPersonaSource,
  isPersonaPopoverOpen,
  setIsPersonaPopoverOpen,
  handlePersonaSelection,
  handleFileInputChange,
}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <Popover open={isPersonaPopoverOpen} onOpenChange={setIsPersonaPopoverOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="h-9 px-4 py-2 justify-start text-sm bg-minimal-white border-minimal-gray-300 text-minimal-gray-800 hover:bg-minimal-gray-100 hover:text-minimal-gray-900 shadow-sm"
          >
            <Users size={16} className="mr-2 text-purple-500" />
            {selectedPersonaSource || "Selecionar persona para campanha"}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-72 p-3 bg-minimal-white border-minimal-gray-300 text-minimal-gray-800 shadow-md"
          align="start"
        >
          <Tabs defaultValue="dataset" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-minimal-gray-100 mb-3">
              <TabsTrigger value="dataset" className="text-xs">Dataset</TabsTrigger>
              <TabsTrigger value="enrichment" className="text-xs">Enrichment</TabsTrigger>
            </TabsList>
            <TabsContent value="dataset" className="mt-2 space-y-2">
              <p className="text-xs text-minimal-gray-600 mb-2">Upload um arquivo CSV ou JSON com seus dados de contato</p>
              <input 
                type="file" 
                id="preview-dataset-upload" 
                className="hidden" 
                accept=".csv,.json" 
                onChange={handleFileInputChange} 
              />
              <label htmlFor="preview-dataset-upload">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs flex items-center gap-2 bg-minimal-gray-100"
                  asChild
                >
                  <span>
                    <Users size={12} />
                    Fazer upload de dataset
                  </span>
                </Button>
              </label>
            </TabsContent>
            <TabsContent value="enrichment" className="mt-2 space-y-2">
              <p className="text-xs text-minimal-gray-600 mb-2">Conecte com uma ferramenta de sales enrichment</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs flex items-center gap-2 bg-minimal-gray-100"
                onClick={() => handlePersonaSelection("Apollo.io")}
              >
                Apollo.io
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs flex items-center gap-2 bg-minimal-gray-100"
                onClick={() => handlePersonaSelection("ZoomInfo")}
              >
                ZoomInfo
              </Button>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
      
      {/* O botão de editar copy foi removido */}
    </div>
  );
};

export default CopyPreviewHeader;
