
import React, { useState } from "react";
import { Copy, Mail, Send, Linkedin, LightbulbOff, Lightbulb, Download } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Conteúdo copiado!",
      description: "O texto foi copiado para a área de transferência."
    });
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
      title: "Conteúdo baixado!",
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

  // AI Recommendations based on content type
  const getRecommendations = () => {
    if (contentType === "email") {
      return [
        "Adicione o nome da empresa do destinatário no assunto para personalização",
        "Inclua números específicos ou estatísticas para aumentar a credibilidade",
        "Reduza o comprimento do primeiro parágrafo para capturar atenção mais rapidamente",
        "Substitua termos genéricos como 'solução' por nomes específicos do seu produto"
      ];
    } else {
      return [
        "Adicione uma pergunta logo no início para aumentar o engajamento",
        "Mencione uma conexão em comum se possível",
        "Evite parágrafos longos, mantenha cada um com 2-3 linhas no máximo",
        "Termine com uma pergunta específica em vez de um pedido genérico"
      ];
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-minimal-black">Copy de Outbound</h1>
          <div className="hidden sm:flex items-center gap-1 text-xs text-minimal-gray-500">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1"></span>
            Personalizado para sua marca
          </div>
        </div>
        
        <Card className="border-minimal-gray-300 shadow-xl rounded-xl overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-minimal-gray-100 to-minimal-white border-b border-minimal-gray-300">
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
          
          <CardContent className="flex-1 p-0">
            {contentType === "email" ? (
              <div className="border border-minimal-gray-200 rounded-lg shadow-inner overflow-hidden min-h-[400px] bg-white m-6">
                {/* Email Header */}
                <div className="bg-minimal-gray-100 p-4 border-b border-minimal-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-minimal-black text-white p-1 rounded-full">
                        <Mail size={16} />
                      </div>
                      <span className="font-medium text-minimal-gray-700">Nova mensagem</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-minimal-white hover:bg-minimal-gray-100 text-xs"
                        onClick={() => downloadContent(generatedContent.email, "email_outbound.txt")}
                      >
                        <Download size={14} className="mr-1" />
                        Baixar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-minimal-white hover:bg-minimal-gray-100 text-xs"
                        onClick={() => copyToClipboard(generatedContent.email)}
                      >
                        <Copy size={14} className="mr-1" />
                        Copiar tudo
                      </Button>
                    </div>
                  </div>
                  
                  {/* Email Subject Line */}
                  <div className="bg-white rounded border border-minimal-gray-300 p-2 mb-2 flex items-center">
                    <span className="text-minimal-gray-500 mr-2 text-sm font-medium w-16">Assunto:</span>
                    <span className="text-sm font-medium">{getEmailSubject(generatedContent.email)}</span>
                  </div>
                </div>
                
                {/* Email Body */}
                <div className="bg-white p-5 font-sans text-sm">
                  <div className="whitespace-pre-wrap leading-relaxed text-left text-minimal-gray-800">
                    {getEmailBody(generatedContent.email)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-minimal-gray-200 rounded-lg p-6 min-h-[400px] relative m-6 shadow-inner">
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <div className="bg-minimal-black text-white p-1 rounded-full">
                    <Linkedin size={16} />
                  </div>
                  <span className="text-sm font-medium text-minimal-gray-700">Mensagem do LinkedIn</span>
                </div>
                <div className="pt-10 text-left whitespace-pre-wrap text-minimal-gray-800">
                  {generatedContent.linkedin}
                </div>
                
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-minimal-white hover:bg-minimal-gray-100 text-xs"
                    onClick={() => downloadContent(generatedContent.linkedin, "linkedin_outbound.txt")}
                  >
                    <Download size={14} className="mr-1" />
                    Baixar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-minimal-white hover:bg-minimal-gray-100 text-xs"
                    onClick={() => copyToClipboard(generatedContent.linkedin)}
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
              <div className="flex items-center gap-2 text-minimal-gray-700 font-medium">
                <Lightbulb size={18} className="text-amber-500" />
                <span>Recomendações de IA</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowRecommendations(!showRecommendations)}
                className="text-xs flex items-center gap-1"
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
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertTitle className="text-amber-800 flex items-center gap-2 text-sm">
                    Sugestões para melhorar sua copy de {contentType === "email" ? "email" : "LinkedIn"}
                  </AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-amber-700 text-xs">
                      {getRecommendations().map((recommendation, index) => (
                        <li key={index}>{recommendation}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </div>
          
          <div className="p-4 bg-gradient-to-r from-minimal-white to-minimal-gray-100 border-t border-minimal-gray-300 flex justify-between">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 hover:bg-minimal-gray-200 transition-all border-minimal-gray-300"
              onClick={() => {
                toast({
                  title: "Copy personalizado!",
                  description: "Converse com o assistente para personalizar mais o conteúdo."
                });
              }}
            >
              Personalizar
            </Button>
            
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
        </Card>

        <div className="mt-6 p-4 bg-minimal-gray-100 border border-minimal-gray-300 rounded-lg text-sm text-minimal-gray-600">
          <div className="flex items-center gap-2 mb-2 text-minimal-gray-700 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            Dicas para mensagens de outbound
          </div>
          <ul className="list-disc pl-5 space-y-1 text-minimal-gray-600">
            <li>Personalize sempre com o nome do destinatário</li>
            <li>Mantenha o assunto direto e com valor agregado</li>
            <li>Foque em benefícios, não em características</li>
            <li>Termine com um pedido de ação claro (CTA)</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default CopyPreview;
