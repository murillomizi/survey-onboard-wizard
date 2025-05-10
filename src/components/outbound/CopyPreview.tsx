
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, AlertTriangle, Save, BoldIcon, ItalicIcon, ListIcon, UnderlineIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ContentType } from "@/types/outbound";
import CopyPreviewHeader from "./CopyPreviewHeader";
import AIRecommendations from "./AIRecommendations";
import CopyPreviewFooter from "./CopyPreviewFooter";
import OutboundTips from "./OutboundTips";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [isPersonaPopoverOpen, setIsPersonaPopoverOpen] = useState(false);
  const [selectedPersonaSource, setSelectedPersonaSource] = useState<string | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [linkedinContent, setLinkedinContent] = useState("");

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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log("File selected:", e.target.files[0].name);
      setSelectedPersonaSource(`Dataset: ${e.target.files[0].name}`);
      // Here you would handle the file upload
    }
  };

  const handlePersonaSelection = (source: string) => {
    setSelectedPersonaSource(source);
    setIsPersonaPopoverOpen(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Conteúdo copiado!",
      description: "O texto foi copiado para a área de transferência."
    });
  };

  const downloadContent = (text: string, fileName: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Conteúdo baixado!",
      description: `O arquivo ${fileName} foi baixado com sucesso.`
    });
  };

  const handleSaveChanges = () => {
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
  };

  const applyFormattingToSelection = (formatting: string) => {
    const textarea = contentType === "email" 
      ? document.getElementById("email-body") as HTMLTextAreaElement
      : document.getElementById("linkedin-content") as HTMLTextAreaElement;
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      if (start === end) {
        toast({
          title: "Nenhum texto selecionado",
          description: "Selecione um texto para aplicar a formatação.",
          variant: "destructive"
        });
        return;
      }

      const text = textarea.value;
      const selectedText = text.substring(start, end);
      let formattedText = "";
      
      switch(formatting) {
        case "bold":
          formattedText = `**${selectedText}**`;
          break;
        case "italic":
          formattedText = `_${selectedText}_`;
          break;
        case "underline":
          formattedText = `__${selectedText}__`;
          break;
        case "list":
          formattedText = `\n• ${selectedText}`;
          break;
        default:
          formattedText = selectedText;
      }
      
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      
      if (contentType === "email") {
        setEmailBody(before + formattedText + after);
      } else {
        setLinkedinContent(before + formattedText + after);
      }
      
      // Set cursor position after formatted text
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = start + formattedText.length;
        textarea.selectionEnd = start + formattedText.length;
      }, 10);
    }
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
          
          {/* Toolbar de formatação */}
          <div className="border-b border-minimal-gray-200 bg-minimal-gray-50 p-2 flex items-center gap-1 flex-wrap">
            <div className="flex items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => applyFormattingToSelection("bold")}
                      className="h-8 w-8 p-0"
                    >
                      <BoldIcon size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Negrito</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => applyFormattingToSelection("italic")}
                      className="h-8 w-8 p-0"
                    >
                      <ItalicIcon size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Itálico</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => applyFormattingToSelection("underline")}
                      className="h-8 w-8 p-0"
                    >
                      <UnderlineIcon size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sublinhado</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => applyFormattingToSelection("list")}
                      className="h-8 w-8 p-0"
                    >
                      <ListIcon size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Adicionar item de lista</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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

          {/* AI Recommendations Section */}
          <AIRecommendations contentType={contentType} />
          
          <div className="p-4 bg-gradient-to-r from-minimal-white to-minimal-gray-100 border-t border-minimal-gray-300 flex justify-between">
            <div className="flex items-center">
              <AlertTriangle size={16} className="text-amber-500 mr-2" />
              <span className="text-xs text-minimal-gray-600">
                Exemplo usado: Maria Silva da TechSolutions
              </span>
            </div>
            
            <Button 
              className="bg-minimal-black hover:bg-minimal-gray-800 text-minimal-white flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
              onClick={handleSaveChanges}
            >
              <Save size={16} />
              Salvar Copy
            </Button>
          </div>
        </Card>

        <OutboundTips />
      </motion.div>
    </div>
  );
};

export default CopyPreview;
