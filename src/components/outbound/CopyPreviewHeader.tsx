
import React, { useState } from "react";
import { Users, Building2, ArrowLeftRight, Link2, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";

interface Prospect {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  email?: string;
  photo?: string;
}

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
  const [isProspectPopoverOpen, setIsProspectPopoverOpen] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);

  // Mock prospects data - in a real app this would be fetched from the database
  const [prospects, setProspects] = useState<Prospect[]>([
    { 
      id: "1", 
      firstName: "Maria", 
      lastName: "Silva", 
      jobTitle: "CTO", 
      company: "TechSolutions" 
    },
    { 
      id: "2", 
      firstName: "João", 
      lastName: "Santos", 
      jobTitle: "CEO", 
      company: "DataPro" 
    },
    { 
      id: "3", 
      firstName: "Ana", 
      lastName: "Ferreira", 
      jobTitle: "Marketing Director", 
      company: "MediaGroup" 
    },
    { 
      id: "4", 
      firstName: "Pedro", 
      lastName: "Costa", 
      jobTitle: "Sales Manager", 
      company: "SalesForce" 
    },
    { 
      id: "5", 
      firstName: "Carla", 
      lastName: "Oliveira", 
      jobTitle: "HR Director", 
      company: "TalentHub" 
    }
  ]);
  
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

  const handleSelectProspect = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setIsProspectPopoverOpen(false);
    toast({
      title: "Prospect selecionado",
      description: `O copy será personalizado para ${prospect.firstName} ${prospect.lastName}.`
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="flex flex-col items-center justify-between mb-4">
      {/* Prospect Card Section */}
      <div className="w-full bg-white border border-minimal-gray-200 rounded-lg shadow-sm mb-6 p-4">
        <h3 className="text-sm font-medium text-minimal-gray-700 mb-2">Prospect selecionado:</h3>
        
        <Popover open={isProspectPopoverOpen} onOpenChange={setIsProspectPopoverOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between items-center border-minimal-gray-300 text-minimal-gray-800 hover:bg-minimal-gray-100 shadow-sm"
            >
              {selectedProspect ? (
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2 bg-purple-100 text-purple-800">
                    <span>{getInitials(selectedProspect.firstName, selectedProspect.lastName)}</span>
                  </Avatar>
                  <div className="text-left">
                    <div className="font-medium">{`${selectedProspect.firstName} ${selectedProspect.lastName}`}</div>
                    <div className="text-xs text-minimal-gray-500">{`${selectedProspect.jobTitle} at ${selectedProspect.company}`}</div>
                  </div>
                </div>
              ) : (
                <span>Selecione um prospect</span>
              )}
              <ChevronDown size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 bg-minimal-white border-minimal-gray-300 text-minimal-gray-800 shadow-md max-w-sm">
            <div className="p-2 border-b border-minimal-gray-200">
              <Input placeholder="Buscar prospects..." className="text-sm" />
            </div>
            <ScrollArea className="h-72">
              <div className="p-1">
                {prospects.map((prospect) => (
                  <Button 
                    key={prospect.id} 
                    variant="ghost" 
                    className={`w-full justify-start mb-1 ${selectedProspect?.id === prospect.id ? 'bg-minimal-gray-100' : ''}`}
                    onClick={() => handleSelectProspect(prospect)}
                  >
                    <Avatar className="h-8 w-8 mr-2 bg-purple-100 text-purple-800">
                      <span>{getInitials(prospect.firstName, prospect.lastName)}</span>
                    </Avatar>
                    <div className="text-left">
                      <div className="font-medium">{`${prospect.firstName} ${prospect.lastName}`}</div>
                      <div className="text-xs text-minimal-gray-500">{`${prospect.jobTitle} at ${prospect.company}`}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>

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

        {/* Botão Sua Empresa */}
        <Popover open={isCompanyPopoverOpen} onOpenChange={setIsCompanyPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 px-4 py-2 justify-start text-sm bg-minimal-white border-minimal-gray-300 text-minimal-gray-800 hover:bg-minimal-gray-100 hover:text-minimal-gray-900 shadow-sm">
              <Building2 size={16} className="mr-2 text-purple-500" />
              Sua Empresa
              {companyWebsite && <span className="ml-2 text-xs text-minimal-gray-500 max-w-24 truncate">({formatDisplayUrl(companyWebsite)})</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3 bg-minimal-white border-minimal-gray-300 text-minimal-gray-800 shadow-md" align="end">
            <form onSubmit={handleCompanyWebsiteSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="company-website" className="block text-sm font-medium text-minimal-gray-700 mb-1">
                    Site da empresa
                  </label>
                  <div className="flex relative">
                    <div className="flex items-center px-3 bg-minimal-gray-100 border border-r-0 border-minimal-gray-300 rounded-l-md">
                      <Link2 size={16} className={`${urlIsValid === true ? 'text-green-500' : urlIsValid === false ? 'text-red-500' : 'text-minimal-gray-500'}`} />
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

      {/* Visual Result Text */}
      <div className="copy-formation-text text-center mt-2">
        
      </div>
    </div>
  );
};

export default CopyPreviewHeader;
