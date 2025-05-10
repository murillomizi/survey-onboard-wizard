import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Send, Share2, Plus, ChevronRight, X } from "lucide-react";
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
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

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
    
    toast({
      title: "Follow-up criado",
      description: `Um novo follow-up foi adicionado à cadência de ${contentType === "email" ? "email" : "LinkedIn"}.`
    });
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
