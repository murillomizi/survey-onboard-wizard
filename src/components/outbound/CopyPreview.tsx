
import React, { useState } from "react";
import { Copy, Mail, Send, Linkedin, LightbulbOff, Lightbulb, Download, Users, Database, Sparkles, Check, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type ContentType = "email" | "linkedin";

interface CopyPreviewProps {
  contentType: ContentType;
  generatedContent: {
    email: string;
    linkedin: string;
  };
  onContentTypeChange: (value: string) => void;
}

const CopyPreview: React.FC<CopyPreviewProps> = ({
  contentType,
  generatedContent,
  onContentTypeChange,
}) => {
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [isPersonaPopoverOpen, setIsPersonaPopoverOpen] = useState(false);
  const [selectedPersonaSource, setSelectedPersonaSource] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState({
    email: generatedContent.email,
    linkedin: generatedContent.linkedin
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado com sucesso!",
      description: "Seu copy foi copiado para a área de transferência."
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log("File selected:", e.target.files[0].name);
      setSelectedPersonaSource(`Dataset: ${e.target.files[0].name}`);
      setIsPersonaPopoverOpen(false);
      // Here you would handle the file upload
    }
  };

  const handlePersonaSelection = (source: string) => {
    setSelectedPersonaSource(source);
    setIsPersonaPopoverOpen(false);
  };

  // Download content as a text file
  const downloadContent = (text: string, fileName: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download concluído",
      description: `O arquivo ${fileName} foi baixado com sucesso.`
    });
  };

  // Extract subject line from email content
  const getEmailSubject = (emailContent: string) => {
    const subjectMatch = emailContent.match(/Assunto: (.*?)(\n|$)/);
    return subjectMatch ? subjectMatch[1] : "Sem assunto";
  };

  // Get email content without the subject line
  const getEmailBody = (emailContent: string) => {
    return emailContent.replace(/Assunto: (.*?)(\n|$)/, '').trim();
  };

  // Handle content edit
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (contentType === "email") {
      setEditedContent({...editedContent, email: e.target.value});
    } else {
      setEditedContent({...editedContent, linkedin: e.target.value});
    }
  };

  const saveEdits = () => {
    setIsEditing(false);
    toast({
      title: "Alterações salvas!",
      description: "Seu copy personalizado foi atualizado."
    });
  };

  // AI Recommendations based on content type
  const getRecommendations = () => {
    if (contentType === "email") {
      return [
        "Use o nome da pessoa no assunto para aumentar as taxas de abertura",
        "Inclua números específicos para dar credibilidade à sua mensagem",
        "Mantenha o primeiro parágrafo curto e direto para prender a atenção",
        "Termine com uma pergunta clara e específica para facilitar a resposta"
      ];
    } else {
      return [
        "Inicie com uma pergunta ou observação sobre a empresa para criar conexão",
        "Mantenha a mensagem sob 1900 caracteres para LinkedIn",
        "Evite linguagem muito comercial ou agressiva",
        "Mencione um resultado específico que você entregou para uma empresa similar"
      ];
    }
  };

  return (
    <div className="flex-1 bg-white p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto max-w-3xl"
      >
        <div className="flex items-center justify-between mb-6">
          <Popover open={isPersonaPopoverOpen} onOpenChange={setIsPersonaPopoverOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="h-9 px-4 py-2 justify-start text-sm bg-white border-[#e6e6e6] text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-full shadow-sm"
              >
                <Users size={16} className="mr-2 text-[#0071e3]" />
                {selectedPersonaSource || "Selecionar personas para campanha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-80 p-4 bg-white border-[#e6e6e6] text-[#1d1d1f] shadow-lg rounded-2xl"
              align="start"
            >
              <h4 className="text-sm font-medium mb-3">Dados para personalização</h4>
              <Tabs defaultValue="dataset" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-[#f5f5f7] rounded-full mb-4">
                  <TabsTrigger value="dataset" className="text-xs rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">Base de contatos</TabsTrigger>
                  <TabsTrigger value="enrichment" className="text-xs rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">Enrichment</TabsTrigger>
                </TabsList>
                <TabsContent value="dataset" className="mt-2 space-y-3">
                  <p className="text-xs text-[#6e6e73] mb-2">Importe seus contatos para personalização em massa</p>
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
                      className="w-full text-xs flex items-center gap-2 bg-[#f5f5f7] border-none hover:bg-[#e6e6e6] rounded-full"
                      asChild
                    >
                      <span>
                        <Database size={12} />
                        Importar CSV/JSON
                      </span>
                    </Button>
                  </label>
                </TabsContent>
                <TabsContent value="enrichment" className="mt-2 space-y-3">
                  <p className="text-xs text-[#6e6e73] mb-2">Conecte com uma plataforma de dados</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs flex items-center gap-2 bg-[#f5f5f7] border-none hover:bg-[#e6e6e6] rounded-full justify-between"
                    onClick={() => handlePersonaSelection("Apollo.io")}
                  >
                    <span>Apollo.io</span>
                    <span className="text-[#0071e3]">Conectar</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs flex items-center gap-2 bg-[#f5f5f7] border-none hover:bg-[#e6e6e6] rounded-full justify-between"
                    onClick={() => handlePersonaSelection("ZoomInfo")}
                  >
                    <span>ZoomInfo</span>
                    <span className="text-[#0071e3]">Conectar</span>
                  </Button>
                </TabsContent>
              </Tabs>
            </PopoverContent>
          </Popover>
          
          {isEditing ? (
            <Button 
              className="bg-[#0071e3] hover:bg-[#0077ED] text-white rounded-full shadow-sm px-4"
              onClick={saveEdits}
            >
              <Check size={16} className="mr-1" />
              Salvar alterações
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="bg-white border-[#e6e6e6] hover:bg-[#f5f5f7] text-[#1d1d1f] rounded-full shadow-sm px-4"
              onClick={() => setIsEditing(true)}
            >
              <Edit size={16} className="mr-1" />
              Editar copy
            </Button>
          )}
        </div>
        
        <Card className="border-none shadow-lg rounded-3xl overflow-hidden">
          <div className="p-4 bg-white border-b border-[#e6e6e6]">
            <Tabs defaultValue="email" value={contentType} onValueChange={onContentTypeChange} className="w-full">
              <TabsList className="grid grid-cols-2 rounded-full bg-[#f5f5f7] p-1">
                <TabsTrigger value="email" className="rounded-full flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200">
                  <Mail size={16} />
                  Email
                </TabsTrigger>
                <TabsTrigger value="linkedin" className="rounded-full flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200">
                  <Linkedin size={16} />
                  LinkedIn
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <CardContent className="p-0">
            {contentType === "email" ? (
              <div className="border border-[#e6e6e6] rounded-2xl shadow-inner overflow-y-auto max-h-[500px] bg-white m-6">
                {/* Email Header */}
                <div className="bg-[#f5f5f7] p-4 border-b border-[#e6e6e6]">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-[#0071e3] text-white p-1 rounded-full">
                        <Mail size={16} />
                      </div>
                      <span className="font-medium text-[#1d1d1f]">Email de prospecção</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white hover:bg-[#f5f5f7] text-xs border-[#e6e6e6] rounded-full"
                        onClick={() => downloadContent(editedContent.email, "email_outbound.txt")}
                      >
                        <Download size={14} className="mr-1" />
                        Baixar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white hover:bg-[#f5f5f7] text-xs border-[#e6e6e6] rounded-full"
                        onClick={() => copyToClipboard(editedContent.email)}
                      >
                        <Copy size={14} className="mr-1" />
                        Copiar
                      </Button>
                    </div>
                  </div>
                  
                  {/* Email Subject Line */}
                  <div className="bg-white rounded-full border border-[#e6e6e6] p-2 mb-2 flex items-center">
                    <span className="text-[#6e6e73] mr-2 text-sm font-medium w-16">Assunto:</span>
                    <span className="text-sm font-medium">{getEmailSubject(editedContent.email)}</span>
                  </div>
                </div>
                
                {/* Email Body */}
                {isEditing ? (
                  <div className="bg-white p-5">
                    <textarea
                      className="w-full h-64 p-2 border border-[#e6e6e6] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0071e3] focus:border-[#0071e3]"
                      value={editedContent.email}
                      onChange={handleContentChange}
                    />
                  </div>
                ) : (
                  <div className="bg-white p-5 font-sans text-sm">
                    <div className="whitespace-pre-wrap leading-relaxed text-left text-[#1d1d1f]">
                      {getEmailBody(editedContent.email)}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-[#e6e6e6] rounded-2xl p-6 overflow-y-auto max-h-[500px] relative m-6 shadow-inner">
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <div className="bg-[#0071e3] text-white p-1 rounded-full">
                    <Linkedin size={16} />
                  </div>
                  <span className="text-sm font-medium text-[#1d1d1f]">Conexão LinkedIn</span>
                </div>
                
                {isEditing ? (
                  <div className="pt-10">
                    <textarea
                      className="w-full h-64 p-2 border border-[#e6e6e6] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0071e3] focus:border-[#0071e3]"
                      value={editedContent.linkedin}
                      onChange={handleContentChange}
                    />
                  </div>
                ) : (
                  <div className="pt-10 text-left whitespace-pre-wrap text-[#1d1d1f]">
                    {editedContent.linkedin}
                  </div>
                )}
                
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white hover:bg-[#f5f5f7] text-xs border-[#e6e6e6] rounded-full"
                    onClick={() => downloadContent(editedContent.linkedin, "linkedin_outbound.txt")}
                  >
                    <Download size={14} className="mr-1" />
                    Baixar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white hover:bg-[#f5f5f7] text-xs border-[#e6e6e6] rounded-full"
                    onClick={() => copyToClipboard(editedContent.linkedin)}
                  >
                    <Copy size={14} className="mr-1" />
                    Copiar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>

          {/* AI Recommendations Section */}
          <div className="mx-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#1d1d1f] font-medium">
                <Sparkles size={18} className="text-[#0071e3]" />
                <span>Recomendações de IA</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowRecommendations(!showRecommendations)}
                className="text-xs flex items-center gap-1 text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-full"
              >
                {showRecommendations ? (
                  <>
                    <LightbulbOff size={14} />
                    Ocultar
                  </>
                ) : (
                  <>
                    <Lightbulb size={14} />
                    Mostrar
                  </>
                )}
              </Button>
            </div>
            
            {showRecommendations && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2"
              >
                <Alert className="bg-[#f5f5f7] border-none rounded-xl">
                  <AlertTitle className="text-[#1d1d1f] flex items-center gap-2 text-sm font-medium">
                    Sugestões para melhorar seu {contentType === "email" ? "email" : "LinkedIn"}
                  </AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-[#6e6e73] text-xs">
                      {getRecommendations().map((recommendation, index) => (
                        <li key={index}>{recommendation}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </div>
          
          <div className="p-4 bg-[#f5f5f7] flex justify-between">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] border-[#e6e6e6] rounded-full"
              onClick={() => {
                toast({
                  title: "Personalização iniciada",
                  description: "Converse com o assistente para personalizar mais o conteúdo."
                });
              }}
            >
              Personalizar
            </Button>
            
            <Button 
              className="bg-[#0071e3] hover:bg-[#0077ED] text-white flex items-center gap-2 shadow-sm rounded-full transition-all duration-200"
              onClick={() => {
                toast({
                  title: "Copy salvo com sucesso!",
                  description: "O conteúdo foi salvo em sua biblioteca."
                });
              }}
            >
              <Send size={16} />
              Salvar
            </Button>
          </div>
        </Card>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6 p-4 bg-white border border-[#e6e6e6] rounded-2xl shadow-sm text-sm text-[#6e6e73]"
        >
          <div className="flex items-center gap-2 mb-2 text-[#1d1d1f] font-medium">
            <Sparkles size={16} className="text-[#0071e3]" />
            <span>Dicas para mensagens de alto impacto</span>
          </div>
          <ul className="grid grid-cols-2 gap-3 mt-4">
            <li className="flex items-start gap-2">
              <div className="mt-1 rounded-full bg-[#f5f5f7] p-1">
                <Check size={12} className="text-[#0071e3]" />
              </div>
              <span>Personalize com o nome do destinatário</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 rounded-full bg-[#f5f5f7] p-1">
                <Check size={12} className="text-[#0071e3]" />
              </div>
              <span>Use números específicos nos benefícios</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 rounded-full bg-[#f5f5f7] p-1">
                <Check size={12} className="text-[#0071e3]" />
              </div>
              <span>Termine com um pedido de ação claro</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 rounded-full bg-[#f5f5f7] p-1">
                <Check size={12} className="text-[#0071e3]" />
              </div>
              <span>Foque em resultados, não características</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CopyPreview;
