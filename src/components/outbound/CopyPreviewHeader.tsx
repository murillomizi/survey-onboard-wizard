
import React, { useState } from "react";
import { Users, Building2, ArrowLeftRight, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

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
  handleFileInputChange
}) => {
  const [companyWebsite, setCompanyWebsite] = useState<string>('');
  const [isCompanyPopoverOpen, setIsCompanyPopoverOpen] = useState(false);

  const handleCompanyWebsiteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCompanyPopoverOpen(false);
    toast({
      title: "Site da empresa salvo",
      description: "As informações da empresa foram atualizadas com sucesso."
    });
  };
  
  return <div className="flex flex-col items-center justify-between mb-8">
      <div className="connection-container w-full flex items-center justify-between relative mb-2">
        {/* Botão Persona */}
        <Popover open={isPersonaPopoverOpen} onOpenChange={setIsPersonaPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 px-4 py-2 justify-start text-sm bg-minimal-white border-minimal-gray-300 text-minimal-gray-800 hover:bg-minimal-gray-100 hover:text-minimal-gray-900 shadow-sm">
              <Users size={16} className="mr-2 text-purple-500" />
              Persona
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3 bg-minimal-white border-minimal-gray-300 text-minimal-gray-800 shadow-md" align="start">
            <Tabs defaultValue="dataset" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-minimal-gray-100 mb-3">
                <TabsTrigger value="dataset" className="text-xs">Dataset</TabsTrigger>
                <TabsTrigger value="enrichment" className="text-xs">Enrichment</TabsTrigger>
              </TabsList>
              <TabsContent value="dataset" className="mt-2 space-y-2">
                <p className="text-xs text-minimal-gray-600 mb-2">Upload um arquivo CSV ou JSON com seus dados de contato</p>
                <input type="file" id="preview-dataset-upload" className="hidden" accept=".csv,.json" onChange={handleFileInputChange} />
                <label htmlFor="preview-dataset-upload">
                  <Button variant="outline" size="sm" className="w-full text-xs flex items-center gap-2 bg-minimal-gray-100" asChild>
                    <span>
                      <Users size={12} />
                      Fazer upload de dataset
                    </span>
                  </Button>
                </label>
              </TabsContent>
              <TabsContent value="enrichment" className="mt-2 space-y-2">
                <p className="text-xs text-minimal-gray-600 mb-2">Conecte com uma ferramenta de sales enrichment</p>
                <Button variant="outline" size="sm" className="w-full text-xs flex items-center gap-2 bg-minimal-gray-100" onClick={() => handlePersonaSelection("Apollo.io")}>
                  Apollo.io
                </Button>
                <Button variant="outline" size="sm" className="w-full text-xs flex items-center gap-2 bg-minimal-gray-100" onClick={() => handlePersonaSelection("ZoomInfo")}>
                  ZoomInfo
                </Button>
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>
        
        {/* Connector Element between Persona and Sua Empresa */}
        <div className="connector absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center">
          <div className="h-0.5 w-12 bg-gradient-to-r from-purple-500 to-transparent"></div>
          <div className="mx-2">
            <ArrowLeftRight size={16} className="text-purple-500" />
          </div>
          <div className="h-0.5 w-12 bg-gradient-to-l from-purple-500 to-transparent"></div>
        </div>
        

        {/* Botão Sua Empresa */}
        <Popover open={isCompanyPopoverOpen} onOpenChange={setIsCompanyPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 px-4 py-2 justify-start text-sm bg-minimal-white border-minimal-gray-300 text-minimal-gray-800 hover:bg-minimal-gray-100 hover:text-minimal-gray-900 shadow-sm">
              <Building2 size={16} className="mr-2 text-purple-500" />
              Sua Empresa
              {companyWebsite && <span className="ml-2 text-xs text-minimal-gray-500 max-w-24 truncate">({companyWebsite})</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3 bg-minimal-white border-minimal-gray-300 text-minimal-gray-800 shadow-md" align="end">
            <form onSubmit={handleCompanyWebsiteSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="company-website" className="block text-sm font-medium text-minimal-gray-700 mb-1">
                    Site da empresa
                  </label>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-minimal-gray-100 border border-r-0 border-minimal-gray-300 rounded-l-md">
                      <Link2 size={16} className="text-minimal-gray-500" />
                    </div>
                    <Input
                      id="company-website"
                      type="url"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      placeholder="www.suaempresa.com"
                      className="rounded-l-none"
                    />
                  </div>
                  <p className="mt-1 text-xs text-minimal-gray-500">
                    Adicione o site da sua empresa para personalizar seu outbound
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-minimal-black text-white hover:bg-minimal-gray-800"
                >
                  Salvar informações
                </Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>
      </div>

      {/* Visual Result Text */}
      <div className="copy-formation-text text-center mt-2">
        <p className="text-sm text-minimal-gray-600 italic">Combinando persona e empresa para criar cópias personalizadas</p>
      </div>
    </div>;
};

export default CopyPreviewHeader;
