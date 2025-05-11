
import React, { useState } from "react";
import { Users, Building2, ArrowLeftRight, Link2, Check } from "lucide-react";
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
  const [urlIsValid, setUrlIsValid] = useState<boolean | null>(null);
  
  const validateUrl = (url: string): boolean => {
    if (!url) return false;

    // Add http:// if the URL doesn't have a protocol
    let urlToTest = url;
    if (!/^https?:\/\//i.test(urlToTest)) {
      urlToTest = 'http://' + urlToTest;
    }
    try {
      new URL(urlToTest);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCompanyWebsite(value);
    if (value) {
      setUrlIsValid(validateUrl(value));
    } else {
      setUrlIsValid(null);
    }
  };
  
  const formatDisplayUrl = (url: string): string => {
    // Remove protocol for display
    return url.replace(/^https?:\/\//i, '');
  };
  
  const handleCompanyWebsiteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyWebsite || !validateUrl(companyWebsite)) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida para o site da empresa.",
        variant: "destructive"
      });
      return;
    }
    setIsCompanyPopoverOpen(false);
    toast({
      title: "Site da empresa salvo",
      description: "As informações da empresa foram atualizadas com sucesso."
    });
  };

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Botão Persona */}
      <Popover open={isPersonaPopoverOpen} onOpenChange={setIsPersonaPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-10 px-4 py-2 justify-start text-sm flex-1 bg-minimal-white border-minimal-gray-200 text-minimal-gray-800 hover:bg-minimal-gray-50 hover:text-minimal-gray-900">
            <Users size={18} className="mr-2 text-minimal-black" />
            <span className="font-medium">Persona</span>
            {selectedPersonaSource && <span className="ml-2 text-xs text-minimal-gray-500 max-w-24 truncate">({selectedPersonaSource})</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-3 bg-minimal-white border-minimal-gray-200 text-minimal-gray-800 shadow-md" align="start">
          <Tabs defaultValue="dataset" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-minimal-gray-50 mb-3">
              <TabsTrigger value="dataset" className="text-xs">Dataset</TabsTrigger>
              <TabsTrigger value="enrichment" className="text-xs">Enrichment</TabsTrigger>
            </TabsList>
            <TabsContent value="dataset" className="mt-2 space-y-2">
              <p className="text-xs text-minimal-gray-600 mb-2">Upload um arquivo CSV ou JSON com seus dados de contato</p>
              <input type="file" id="preview-dataset-upload" className="hidden" accept=".csv,.json" onChange={handleFileInputChange} />
              <label htmlFor="preview-dataset-upload">
                <Button variant="outline" size="sm" className="w-full text-xs flex items-center gap-2 bg-minimal-gray-50" asChild>
                  <span>
                    <Users size={12} className="text-black" />
                    Fazer upload de dataset
                  </span>
                </Button>
              </label>
            </TabsContent>
            <TabsContent value="enrichment" className="mt-2 space-y-2">
              <p className="text-xs text-minimal-gray-600 mb-2">Conecte com uma ferramenta de sales enrichment</p>
              <Button variant="outline" size="sm" className="w-full text-xs flex items-center gap-2 bg-minimal-gray-50" onClick={() => handlePersonaSelection("Apollo.io")}>
                Apollo.io
              </Button>
              <Button variant="outline" size="sm" className="w-full text-xs flex items-center gap-2 bg-minimal-gray-50" onClick={() => handlePersonaSelection("ZoomInfo")}>
                ZoomInfo
              </Button>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
      
      {/* Botão Sua Empresa */}
      <Popover open={isCompanyPopoverOpen} onOpenChange={setIsCompanyPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-10 px-4 py-2 justify-start text-sm flex-1 bg-minimal-white border-minimal-gray-200 text-minimal-gray-800 hover:bg-minimal-gray-50 hover:text-minimal-gray-900">
            <Building2 size={18} className="mr-2 text-minimal-black" />
            <span className="font-medium">Sua Empresa</span>
            {companyWebsite && <span className="ml-2 text-xs text-minimal-gray-500 max-w-24 truncate">({formatDisplayUrl(companyWebsite)})</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-3 bg-minimal-white border-minimal-gray-200 text-minimal-gray-800 shadow-md" align="end">
          <form onSubmit={handleCompanyWebsiteSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="company-website" className="block text-sm font-medium text-minimal-gray-700 mb-1">
                  Site da empresa
                </label>
                <div className="flex relative">
                  <div className="flex items-center px-3 bg-minimal-gray-50 border border-r-0 border-minimal-gray-200 rounded-l-md">
                    <Link2 size={16} className={`${urlIsValid === true ? 'text-green-500' : urlIsValid === false ? 'text-red-500' : 'text-black'}`} />
                  </div>
                  <Input id="company-website" type="text" value={companyWebsite} onChange={handleUrlChange} placeholder="www.suaempresa.com" className={`rounded-l-none ${urlIsValid === true ? 'border-green-500 focus:border-green-500' : urlIsValid === false ? 'border-red-500 focus:border-red-500' : ''}`} />
                  {urlIsValid === true && <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <Check size={16} className="text-green-500" />
                    </div>}
                </div>
                {urlIsValid === false && <p className="mt-1 text-xs text-red-500">
                    Por favor, insira uma URL válida (ex: empresa.com)
                  </p>}
                <p className="mt-1 text-xs text-minimal-gray-500">
                  Adicione o site da sua empresa para personalizar seu outbound
                </p>
              </div>
              
              <Button type="submit" className="w-full bg-minimal-black text-white hover:bg-minimal-gray-800" disabled={urlIsValid === false || urlIsValid === null}>
                Salvar informações
              </Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CopyPreviewHeader;
