
import React from "react";
import { Copy } from "lucide-react";
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
            <Tabs defaultValue="email" onValueChange={onContentTypeChange}>
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <CardContent className="flex-1 p-6">
            <div className="bg-minimal-white border border-minimal-gray-200 rounded-lg p-6 min-h-[400px] relative">
              <pre className="font-sans text-left whitespace-pre-wrap">
                {contentType === "email" ? generatedContent.email : generatedContent.linkedin}
              </pre>
              
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 bg-minimal-white hover:bg-minimal-gray-100"
                onClick={() => copyToClipboard(contentType === "email" ? generatedContent.email : generatedContent.linkedin)}
              >
                <Copy size={16} className="mr-1" />
                Copiar
              </Button>
            </div>
          </CardContent>
          
          <div className="p-4 border-t border-minimal-gray-300 flex justify-end">
            <button 
              className="bg-minimal-black hover:bg-minimal-gray-800 text-minimal-white px-6 py-2 rounded-md transition-all duration-200"
              onClick={() => {
                toast({
                  title: "Copy exportado!",
                  description: "O conteúdo foi salvo em seus rascunhos."
                });
              }}
            >
              Salvar Copy
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default CopyPreview;
