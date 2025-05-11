
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ContentType, FilterOptions, FollowUps } from "@/types/outbound";
import CopyPreviewHeader from "./CopyPreviewHeader";
import ProspectFilters from "./ProspectFilters";
import ProspectCard from "./ProspectCard";
import FollowUpSelector from "./FollowUpSelector";
import ContentEditor from "./ContentEditor";
import CopyPreviewActions from "./CopyPreviewActions";
import { mockProspects } from "@/data/prospects";

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
  const [followUps, setFollowUps] = useState<FollowUps>({
    email: [],
    linkedin: []
  });
  const [activeFollowUpIndex, setActiveFollowUpIndex] = useState<number | null>(null);
  const [currentProspectIndex, setCurrentProspectIndex] = useState<number>(0);
  const [filters, setFilters] = useState<FilterOptions>({
    industry: "",
    companySize: "",
    seniority: "",
    location: "",
  });
  const [filteredProspects, setFilteredProspects] = useState(mockProspects);
  
  // Current prospect
  const currentProspect = filteredProspects.length > 0 
    ? filteredProspects[currentProspectIndex < filteredProspects.length ? currentProspectIndex : 0] 
    : mockProspects[0];
  
  // Extrair assunto e corpo do email ao carregar ou alterar o conteúdo
  useEffect(() => {
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
  };

  const handleNextProspect = () => {
    setCurrentProspectIndex(prev => (prev < filteredProspects.length - 1 ? prev + 1 : 0));
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
  };

  const handleEmailSubjectChange = (value: string) => {
    setEmailSubject(value);
  };

  const handleEmailBodyChange = (value: string) => {
    setEmailBody(value);
  };

  const handleLinkedinContentChange = (value: string) => {
    setLinkedinContent(value);
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
          
          {/* Filtros de Prospects */}
          <ProspectFilters 
            filters={filters}
            setFilters={setFilters}
            filteredProspectsCount={filteredProspects.length}
            totalProspectsCount={mockProspects.length}
            resetFilters={resetFilters}
          />
          
          {/* Cartão de Prospect */}
          <ProspectCard 
            currentProspect={currentProspect}
            currentProspectIndex={currentProspectIndex}
            totalProspects={filteredProspects.length}
            onPreviousProspect={handlePreviousProspect}
            onNextProspect={handleNextProspect}
          />
          
          {/* Seletor de Follow-ups */}
          <FollowUpSelector 
            contentType={contentType}
            followUps={followUps}
            activeFollowUpIndex={activeFollowUpIndex}
            onSelectFollowUp={handleSelectFollowUp}
            onDeleteFollowUp={handleDeleteFollowUp}
            onAddFollowUp={addFollowUp}
          />
          
          <CardContent className="p-0">
            {/* Editor de Conteúdo */}
            <ContentEditor 
              contentType={contentType}
              emailSubject={emailSubject}
              emailBody={emailBody}
              linkedinContent={linkedinContent}
              onEmailSubjectChange={handleEmailSubjectChange}
              onEmailBodyChange={handleEmailBodyChange}
              onLinkedinContentChange={handleLinkedinContentChange}
            />
          </CardContent>

          {/* Ações do Preview */}
          <CopyPreviewActions 
            contentType={contentType}
            followUpsCount={contentType === "email" ? followUps.email.length : followUps.linkedin.length}
            activeFollowUpIndex={activeFollowUpIndex}
            onDispatch={handleDispatch}
            onShare={handleShare}
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default CopyPreview;
