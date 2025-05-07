
import React from "react";
import { Copy, Mail, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

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
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Conteúdo copiado!",
      description: "O texto foi copiado para a área de transferência."
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

  return (
    <div className="flex-1 bg-minimal-white p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-center mb-6">Gerador de Copy para Outbound</h1>
        
        <Card className="border-minimal-gray-300 shadow-lg">
          <div className="p-4 bg-minimal-gray-100 border-b border-minimal-gray-300">
            <Tabs defaultValue="email" value={contentType} onValueChange={onContentTypeChange}>
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail size={16} />
                  Email
                </TabsTrigger>
                <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <CardContent className="flex-1 p-6">
            {contentType === "email" ? (
              <div className="border border-minimal-gray-200 rounded-lg shadow-md overflow-hidden min-h-[400px]">
                {/* Email Header */}
                <div className="bg-minimal-gray-100 p-4 border-b border-minimal-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Mail size={18} className="text-minimal-gray-600" />
                      <span className="font-medium">Nova mensagem</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-minimal-white hover:bg-minimal-gray-100"
                      onClick={() => copyToClipboard(generatedContent.email)}
                    >
                      <Copy size={14} className="mr-1" />
                      Copiar tudo
                    </Button>
                  </div>
                  
                  {/* Email Subject Line */}
                  <div className="bg-white rounded border border-minimal-gray-300 p-2 mb-2 flex items-center">
                    <span className="text-minimal-gray-500 mr-2 text-sm font-medium w-16">Assunto:</span>
                    <span className="text-sm">{getEmailSubject(generatedContent.email)}</span>
                  </div>
                </div>
                
                {/* Email Body */}
                <div className="bg-white p-5 font-sans text-sm">
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {getEmailBody(generatedContent.email)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-minimal-white border border-minimal-gray-200 rounded-lg p-6 min-h-[400px] relative">
                <pre className="font-sans text-left whitespace-pre-wrap">
                  {generatedContent.linkedin}
                </pre>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-minimal-white hover:bg-minimal-gray-100"
                  onClick={() => copyToClipboard(generatedContent.linkedin)}
                >
                  <Copy size={16} className="mr-1" />
                  Copiar
                </Button>
              </div>
            )}
          </CardContent>
          
          <div className="p-4 border-t border-minimal-gray-300 flex justify-between">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
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
              className="bg-minimal-black hover:bg-minimal-gray-800 text-minimal-white flex items-center gap-2"
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
      </motion.div>
    </div>
  );
};

export default CopyPreview;
