import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Send, Share2, Plus, ChevronRight, X, ArrowLeft, ArrowRight, Briefcase, User, Building2, Filter } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ContentType } from "@/types/outbound";
import CopyPreviewHeader from "./CopyPreviewHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Tipo para os prospects
interface Prospect {
  id: number;
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  industry: string;
  companySize: string;
  seniority: string;
  location: string;
}

// Dados de prospects simulados com campos adicionais para filtro
const mockProspects: Prospect[] = [
  { id: 1, firstName: "Maria", lastName: "Silva", jobTitle: "Diretora de Marketing", company: "TechSolutions", industry: "Tecnologia", companySize: "51-200", seniority: "Diretor", location: "São Paulo" },
  { id: 2, firstName: "João", lastName: "Santos", jobTitle: "CEO", company: "Inovação Digital", industry: "Software", companySize: "11-50", seniority: "C-Level", location: "Rio de Janeiro" },
  { id: 3, firstName: "Ana", lastName: "Oliveira", jobTitle: "Gerente de Vendas", company: "MegaVendas", industry: "Varejo", companySize: "201-500", seniority: "Gerente", location: "Curitiba" },
  { id: 4, firstName: "Carlos", lastName: "Ferreira", jobTitle: "CTO", company: "DataPro", industry: "Tecnologia", companySize: "51-200", seniority: "C-Level", location: "São Paulo" },
  { id: 5, firstName: "Juliana", lastName: "Almeida", jobTitle: "COO", company: "StartupNow", industry: "Serviços", companySize: "11-50", seniority: "C-Level", location: "Belo Horizonte" },
  { id: 6, firstName: "Roberto", lastName: "Souza", jobTitle: "Diretor Comercial", company: "VendaMais", industry: "Varejo", companySize: "201-500", seniority: "Diretor", location: "São Paulo" },
  { id: 7, firstName: "Paula", lastName: "Costa", jobTitle: "VP de Operações", company: "LogTech", industry: "Logística", companySize: "501-1000", seniority: "VP", location: "Campinas" },
];

// Opções para filtros
const industryOptions = ["Tecnologia", "Software", "Varejo", "Serviços", "Logística"];
const companySizeOptions = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];
const seniorityOptions = ["Analista", "Coordenador", "Gerente", "Diretor", "VP", "C-Level"];
const locationOptions = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Campinas"];

interface CopyPreviewProps {
  contentType: ContentType;
  generatedContent: {
    email: string;
    linkedin: string;
  };
  onContentTypeChange: (value: string) => void;
  onContentUpdate: (type: ContentType, content: string) => void;
}

const CopyPreview: React.FC<CopyPreviewProps> = ({
  contentType,
  generatedContent,
  onContentTypeChange,
  onContentUpdate,
}) => {
  const [selectedPersonaSource, setSelectedPersonaSource] = useState<string | null>(null);
  const [isPersonaPopoverOpen, setIsPersonaPopoverOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [linkedinContent, setLinkedinContent] = useState("");
  const [followUps, setFollowUps] = useState<{
    email: { subject: string; body: string }[];
    linkedin: string[];
  }>({
    email: [],
    linkedin: []
  });
  const [activeFollowUpIndex, setActiveFollowUpIndex] = useState<number | null>(null);
  const [currentProspectIndex, setCurrentProspectIndex] = useState<number>(0);
  const [filters, setFilters] = useState({
    industry: "",
    companySize: "",
    seniority: "",
    location: "",
  });
  const [filteredProspects, setFilteredProspects] = useState<Prospect[]>(mockProspects);
  
  // Current prospect
  const currentProspect = filteredProspects.length > 0 ? filteredProspects[currentProspectIndex < filteredProspects.length ? currentProspectIndex : 0] : mockProspects[0];
  
  // Extrair assunto e corpo do email ao carregar ou alterar o conteúdo
  React.useEffect(() => {
    // Para email
    const subjectMatch = generatedContent.email.match(/Assunto: (.*?)(\n|$)/);
    const subject = subjectMatch ? subjectMatch[1] : "";
    const body = generatedContent.email.replace(/Assunto: (.*?)(\n|$)/, '').trim();
    
    setEmailSubject(subject);
    setEmailBody(body);
    setLinkedinContent(generatedContent.linkedin);
  }, [generatedContent]);

  const handlePersonaSelection = (source: string) => {
    setSelectedPersonaSource(source);
    setIsPersonaPopoverOpen(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log("File selected:", e.target.files[0].name);
      setSelectedPersonaSource(`Dataset: ${e.target.files[0].name}`);
      // Here you would handle the file upload
    }
  };

  // Aplicar filtros
  useEffect(() => {
    let result = mockProspects;
    
    if (filters.industry) {
      result = result.filter(p => p.industry === filters.industry);
    }
    
    if (filters.companySize) {
      result = result.filter(p => p.companySize === filters.companySize);
    }
    
    if (filters.seniority) {
      result = result.filter(p => p.seniority === filters.seniority);
    }
    
    if (filters.location) {
      result = result.filter(p => p.location === filters.location);
    }
    
    setFilteredProspects(result);
    
    // Reset currentProspectIndex if necessary
    if (currentProspectIndex >= result.length && result.length > 0) {
      setCurrentProspectIndex(0);
    }
  }, [filters, currentProspectIndex]);

  const handlePreviousProspect = () => {
    setCurrentProspectIndex(prev => (prev > 0 ? prev - 1 : filteredProspects.length - 1));
    // Removido o toast de navegação
  };

  const handleNextProspect = () => {
    setCurrentProspectIndex(prev => (prev < filteredProspects.length - 1 ? prev + 1 : 0));
    // Removido o toast de navegação
  };

  // Resetar filtros
  const resetFilters = () => {
    setFilters({
      industry: "",
      companySize: "",
      seniority: "",
      location: ""
    });
    setFilteredProspects(mockProspects);
    setCurrentProspectIndex(0);
    toast({
      title: "Filtros resetados",
      description: "Todos os prospects estão sendo exibidos"
    });
  };

  const handleSaveChanges = () => {
    // Se estamos editando um follow-up
    if (activeFollowUpIndex !== null) {
      const newFollowUps = {...followUps};
      
      if (contentType === "email") {
        newFollowUps.email[activeFollowUpIndex] = {
          subject: emailSubject,
          body: emailBody
        };
      } else {
        newFollowUps.linkedin[activeFollowUpIndex] = linkedinContent;
      }
      
      setFollowUps(newFollowUps);
      toast({
        title: "Follow-up atualizado",
        description: `O follow-up #${activeFollowUpIndex + 1} foi atualizado com sucesso.`
      });
    } else {
      // Se estamos editando o conteúdo principal
      if (contentType === "email") {
        const updatedEmailContent = `Assunto: ${emailSubject}\n\n${emailBody}`;
        onContentUpdate("email", updatedEmailContent);
      } else {
        onContentUpdate("linkedin", linkedinContent);
      }
      
      toast({
        title: "Copy atualizado",
        description: `O conteúdo do ${contentType === "email" ? "email" : "LinkedIn"} foi atualizado com sucesso.`
      });
    }
  };

  const handleDispatch = () => {
    let contentToDispatch = "";
    
    // Determinar qual conteúdo está sendo despachado
    if (activeFollowUpIndex !== null) {
      if (contentType === "email") {
        const followUp = followUps.email[activeFollowUpIndex];
        contentToDispatch = `Assunto: ${followUp.subject}\n\n${followUp.body}`;
      } else {
        contentToDispatch = followUps.linkedin[activeFollowUpIndex];
      }
    } else {
      contentToDispatch = contentType === "email" 
        ? `Assunto: ${emailSubject}\n\n${emailBody}`
        : linkedinContent;
    }
      
    // Copiar para a área de transferência
    navigator.clipboard.writeText(contentToDispatch);
    
    toast({
      title: "Conteúdo copiado!",
      description: activeFollowUpIndex !== null 
        ? `O follow-up #${activeFollowUpIndex + 1} foi copiado para a área de transferência.`
        : `O ${contentType === "email" ? "email" : "LinkedIn"} foi copiado para a área de transferência.`
    });
  };

  const handleShare = () => {
    toast({
      title: "Compartilhar",
      description: "Funcionalidade de compartilhamento será implementada em breve."
    });
  };

  const addFollowUp = () => {
    const newFollowUps = {...followUps};
    
    if (contentType === "email") {
      const newSubject = `RE: ${emailSubject}`;
      const newBody = "Olá,\n\nApenas um follow-up sobre meu email anterior.\n\nAguardo seu retorno.\n\nAtenciosamente,\nCarlos Santos";
      
      newFollowUps.email.push({
        subject: newSubject,
        body: newBody
      });
    } else {
      newFollowUps.linkedin.push("Olá,\n\nApenas um follow-up sobre minha mensagem anterior no LinkedIn. Seria ótimo conversar sobre como podemos colaborar.\n\nAguardo seu retorno.\n\nCarlos Santos");
    }
    
    setFollowUps(newFollowUps);
    
    // Selecionar automaticamente o novo follow-up
    const newIndex = contentType === "email" ? newFollowUps.email.length - 1 : newFollowUps.linkedin.length - 1;
    handleSelectFollowUp(newIndex);
    
    // Removido o toast de notificação de follow-up criado
  };

  const handleSelectFollowUp = (index: number | null) => {
    setActiveFollowUpIndex(index);
    
    if (index === null) {
      // Voltar ao conteúdo principal
      const subjectMatch = generatedContent.email.match(/Assunto: (.*?)(\n|$)/);
      const subject = subjectMatch ? subjectMatch[1] : "";
      const body = generatedContent.email.replace(/Assunto: (.*?)(\n|$)/, '').trim();
      
      setEmailSubject(subject);
      setEmailBody(body);
      setLinkedinContent(generatedContent.linkedin);
    } else {
      // Carregar o follow-up selecionado
      if (contentType === "email") {
        const { subject, body } = followUps.email[index];
        setEmailSubject(subject);
        setEmailBody(body);
      } else {
        setLinkedinContent(followUps.linkedin[index]);
      }
    }
  };

  const handleDeleteFollowUp = (index: number) => {
    const newFollowUps = {...followUps};
    
    if (contentType === "email") {
      newFollowUps.email.splice(index, 1);
    } else {
      newFollowUps.linkedin.splice(index, 1);
    }
    
    setFollowUps(newFollowUps);
    
    // If we're deleting the active follow-up, go back to the original message
    if (activeFollowUpIndex === index) {
      handleSelectFollowUp(null);
    } 
    // If we're deleting a follow-up with an index less than the active one, we need to adjust the active index
    else if (activeFollowUpIndex !== null && activeFollowUpIndex > index) {
      setActiveFollowUpIndex(activeFollowUpIndex - 1);
    }
    
    toast({
      title: "Follow-up removido",
      description: `O follow-up #${index + 1} foi removido com sucesso.`
    });
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-minimal-white to-minimal-gray-100 p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl"
      >
        <CopyPreviewHeader 
          selectedPersonaSource={selectedPersonaSource}
          isPersonaPopoverOpen={isPersonaPopoverOpen}
          setIsPersonaPopoverOpen={setIsPersonaPopoverOpen}
          handlePersonaSelection={handlePersonaSelection}
          handleFileInputChange={handleFileInputChange}
        />
        
        <Card className="border-minimal-gray-300 shadow-xl rounded-xl overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-minimal-gray-100 to-minimal-white border-b border-minimal-gray-300 flex justify-between items-center">
            <Tabs defaultValue="email" value={contentType} onValueChange={onContentTypeChange} className="w-full">
              <TabsList className="grid grid-cols-2 rounded-lg bg-minimal-gray-200/70 p-1">
                <TabsTrigger value="email" className="rounded-md flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md">
                  <Mail size={16} />
                  Email Profissional
                </TabsTrigger>
                <TabsTrigger value="linkedin" className="rounded-md flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md">
                  <Linkedin size={16} />
                  LinkedIn
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Filters and Prospect Counter */}
          <div className="p-4 bg-white border-b border-minimal-gray-200 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-sm font-medium text-minimal-gray-700">
                  Prospects: {filteredProspects.length} de {mockProspects.length}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 h-9 bg-minimal-white">
                      <Filter size={16} />
                      Filtrar Prospects
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-minimal-white" align="end">
                    <DropdownMenuLabel>Filtrar por ICP</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <div className="p-2">
                      <p className="text-xs text-minimal-gray-500 mb-1">Indústria</p>
                      <Select value={filters.industry} onValueChange={(value) => setFilters({...filters, industry: value})}>
                        <SelectTrigger className="w-full h-8 text-xs">
                          <SelectValue placeholder="Selecione a indústria" />
                        </SelectTrigger>
                        <SelectContent className="bg-minimal-white">
                          <SelectItem value="" className="text-xs">Todos</SelectItem>
                          {industryOptions.map((industry) => (
                            <SelectItem key={industry} value={industry} className="text-xs">{industry}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="p-2">
                      <p className="text-xs text-minimal-gray-500 mb-1">Tamanho da Empresa</p>
                      <Select value={filters.companySize} onValueChange={(value) => setFilters({...filters, companySize: value})}>
                        <SelectTrigger className="w-full h-8 text-xs">
                          <SelectValue placeholder="Selecione o tamanho" />
                        </SelectTrigger>
                        <SelectContent className="bg-minimal-white">
                          <SelectItem value="" className="text-xs">Todos</SelectItem>
                          {companySizeOptions.map((size) => (
                            <SelectItem key={size} value={size} className="text-xs">{size} funcionários</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="p-2">
                      <p className="text-xs text-minimal-gray-500 mb-1">Senioridade</p>
                      <Select value={filters.seniority} onValueChange={(value) => setFilters({...filters, seniority: value})}>
                        <SelectTrigger className="w-full h-8 text-xs">
                          <SelectValue placeholder="Selecione a senioridade" />
                        </SelectTrigger>
                        <SelectContent className="bg-minimal-white">
                          <SelectItem value="" className="text-xs">Todos</SelectItem>
                          {seniorityOptions.map((seniority) => (
                            <SelectItem key={seniority} value={seniority} className="text-xs">{seniority}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="p-2">
                      <p className="text-xs text-minimal-gray-500 mb-1">Localização</p>
                      <Select value={filters.location} onValueChange={(value) => setFilters({...filters, location: value})}>
                        <SelectTrigger className="w-full h-8 text-xs">
                          <SelectValue placeholder="Selecione a localização" />
                        </SelectTrigger>
                        <SelectContent className="bg-minimal-white">
                          <SelectItem value="" className="text-xs">Todos</SelectItem>
                          {locationOptions.map((location) => (
                            <SelectItem key={location} value={location} className="text-xs">{location}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <Button variant="outline" size="sm" onClick={resetFilters} className="w-full text-xs h-8">
                        Limpar filtros
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {Object.values(filters).some(value => value !== "") && (
                  <Button variant="ghost" size="sm" onClick={resetFilters} className="h-9 px-2">
                    <X size={16} className="text-minimal-gray-500" />
                  </Button>
                )}
              </div>
            </div>
            
            {/* Filter badges */}
            {Object.values(filters).some(value => value !== "") && (
              <div className="flex flex-wrap gap-2">
                {filters.industry && (
                  <Badge variant="outline" className="bg-minimal-white text-xs flex gap-1 items-center">
                    Indústria: {filters.industry}
                    <X size={12} className="cursor-pointer" onClick={() => setFilters({...filters, industry: ""})} />
                  </Badge>
                )}
                {filters.companySize && (
                  <Badge variant="outline" className="bg-minimal-white text-xs flex gap-1 items-center">
                    Tamanho: {filters.companySize}
                    <X size={12} className="cursor-pointer" onClick={() => setFilters({...filters, companySize: ""})} />
                  </Badge>
                )}
                {filters.seniority && (
                  <Badge variant="outline" className="bg-minimal-white text-xs flex gap-1 items-center">
                    Senioridade: {filters.seniority}
                    <X size={12} className="cursor-pointer" onClick={() => setFilters({...filters, seniority: ""})} />
                  </Badge>
                )}
                {filters.location && (
                  <Badge variant="outline" className="bg-minimal-white text-xs flex gap-1 items-center">
                    Localização: {filters.location}
                    <X size={12} className="cursor-pointer" onClick={() => setFilters({...filters, location: ""})} />
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          {/* Prospect Card */}
          <Card className="mx-4 mt-4 bg-white shadow-md border border-minimal-gray-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <User size={18} className="text-purple-500 mr-2" />
                    <h3 className="text-lg font-semibold">{currentProspect.firstName} {currentProspect.lastName}</h3>
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <Briefcase size={16} className="text-blue-500 mr-2" />
                    <p className="text-sm text-minimal-gray-600">{currentProspect.jobTitle}</p>
                  </div>
                  
                  <div className="flex items-center">
                    <Building2 size={16} className="text-green-500 mr-2" />
                    <p className="text-sm text-minimal-gray-600">{currentProspect.company}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handlePreviousProspect} 
                    variant="outline" 
                    size="sm" 
                    className="p-2 h-9 w-9"
                    disabled={filteredProspects.length <= 1}
                  >
                    <ArrowLeft size={16} />
                  </Button>
                  <span className="flex items-center px-2 text-sm text-minimal-gray-600">
                    {filteredProspects.length > 0 ? `${currentProspectIndex + 1} / ${filteredProspects.length}` : "0 / 0"}
                  </span>
                  <Button 
                    onClick={handleNextProspect} 
                    variant="outline" 
                    size="sm" 
                    className="p-2 h-9 w-9"
                    disabled={filteredProspects.length <= 1}
                  >
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Follow-up selector */}
          <div className="bg-minimal-gray-50 border-b border-minimal-gray-200 p-2 flex items-center justify-between">
            <div className="flex items-center gap-1 overflow-x-auto">
              <Button 
                variant={activeFollowUpIndex === null ? "default" : "ghost"}
                size="sm" 
                className={`text-xs ${activeFollowUpIndex === null ? "bg-minimal-black text-white" : ""}`}
                onClick={() => handleSelectFollowUp(null)}
              >
                Mensagem inicial
              </Button>
              
              {contentType === "email" && followUps.email.map((_, index) => (
                <div key={`email-followup-${index}`} className="flex items-center">
                  <Button
                    variant={activeFollowUpIndex === index ? "default" : "ghost"}
                    size="sm"
                    className={`text-xs ${activeFollowUpIndex === index ? "bg-minimal-black text-white" : ""}`}
                    onClick={() => handleSelectFollowUp(index)}
                  >
                    Follow-up #{index + 1}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-6 w-6 ml-1 hover:bg-red-100"
                    onClick={() => handleDeleteFollowUp(index)}
                  >
                    <X size={14} className="text-red-500" />
                  </Button>
                </div>
              ))}
              
              {contentType === "linkedin" && followUps.linkedin.map((_, index) => (
                <div key={`linkedin-followup-${index}`} className="flex items-center">
                  <Button
                    variant={activeFollowUpIndex === index ? "default" : "ghost"}
                    size="sm"
                    className={`text-xs ${activeFollowUpIndex === index ? "bg-minimal-black text-white" : ""}`}
                    onClick={() => handleSelectFollowUp(index)}
                  >
                    Follow-up #{index + 1}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-6 w-6 ml-1 hover:bg-red-100"
                    onClick={() => handleDeleteFollowUp(index)}
                  >
                    <X size={14} className="text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs flex items-center gap-1"
              onClick={addFollowUp}
            >
              <Plus size={14} />
              Follow-up
            </Button>
          </div>
          
          <CardContent className="p-0">
            {contentType === "email" ? (
              <div className="border-minimal-gray-200 overflow-y-auto max-h-[500px] bg-white p-4">
                <div className="mb-4">
                  <label htmlFor="email-subject" className="text-sm font-medium text-minimal-gray-700 block mb-1">
                    Assunto do Email
                  </label>
                  <Input
                    id="email-subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="border-minimal-gray-200 focus:ring-minimal-gray-300 focus:border-minimal-gray-400"
                    placeholder="Digite o assunto do email..."
                  />
                </div>
                
                <div>
                  <label htmlFor="email-body" className="text-sm font-medium text-minimal-gray-700 block mb-1">
                    Corpo do Email
                  </label>
                  <textarea
                    id="email-body"
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full h-[350px] border rounded-md p-3 text-minimal-gray-800 border-minimal-gray-200 focus:ring-minimal-gray-300 focus:border-minimal-gray-400 focus:outline-none resize-none font-mono"
                    placeholder="Digite o corpo do email..."
                  />
                </div>
              </div>
            ) : (
              <div className="border-minimal-gray-200 overflow-y-auto max-h-[500px] bg-white p-4">
                <div>
                  <label htmlFor="linkedin-content" className="text-sm font-medium text-minimal-gray-700 block mb-1">
                    Mensagem do LinkedIn
                  </label>
                  <textarea
                    id="linkedin-content"
                    value={linkedinContent}
                    onChange={(e) => setLinkedinContent(e.target.value)}
                    className="w-full h-[350px] border rounded-md p-3 text-minimal-gray-800 border-minimal-gray-200 focus:ring-minimal-gray-300 focus:border-minimal-gray-400 focus:outline-none resize-none font-mono"
                    placeholder="Digite a mensagem do LinkedIn..."
                  />
                </div>
              </div>
            )}
          </CardContent>

          <div className="p-4 bg-gradient-to-r from-minimal-white to-minimal-gray-100 border-t border-minimal-gray-300 flex justify-between items-center">
            <div className="flex items-center">
              {(contentType === "email" && followUps.email.length > 0) || 
               (contentType === "linkedin" && followUps.linkedin.length > 0) ? (
                <Badge variant="outline" className="bg-minimal-white text-xs">
                  {contentType === "email" ? followUps.email.length : followUps.linkedin.length} follow-ups na sequência
                </Badge>
              ) : null}
            </div>
            
            <div className="flex gap-4">
              <Button 
                className="bg-minimal-black hover:bg-minimal-gray-800 text-minimal-white flex items-center gap-2 shadow-lg hover:shadow-xl transition-all px-6"
                onClick={handleDispatch}
              >
                <Send size={16} />
                Disparar{activeFollowUpIndex !== null ? ` #${activeFollowUpIndex + 1}` : ""}
              </Button>
              
              <Button 
                variant="outline"
                className="border-minimal-gray-300 bg-minimal-white hover:bg-minimal-gray-100 flex items-center gap-2 shadow-md hover:shadow-lg transition-all px-6"
                onClick={handleShare}
              >
                <Share2 size={16} />
                Compartilhar
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default CopyPreview;
