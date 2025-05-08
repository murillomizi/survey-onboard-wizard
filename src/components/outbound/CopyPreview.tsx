
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ContentType } from "@/types/outbound";
import CopyPreviewHeader from "./CopyPreviewHeader";
import EmailPreview from "./EmailPreview";
import LinkedInPreview from "./LinkedInPreview";
import AIRecommendations from "./AIRecommendations";
import CopyPreviewFooter from "./CopyPreviewFooter";
import OutboundTips from "./OutboundTips";

interface CopyPreviewProps {
  contentType: ContentType;
  generatedContent: {
    email: string;
    linkedin: string;
  };
  onContentTypeChange: (value: string) => void;
  onEditClick: () => void;
}

const CopyPreview: React.FC<CopyPreviewProps> = ({
  contentType,
  generatedContent,
  onContentTypeChange,
  onEditClick,
}) => {
  const [isPersonaPopoverOpen, setIsPersonaPopoverOpen] = useState(false);
  const [selectedPersonaSource, setSelectedPersonaSource] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Conteúdo copiado!",
      description: "O texto foi copiado para a área de transferência."
    });
  };

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

  return (
    <div className="flex-1 bg-gradient-to-br from-minimal-white to-minimal-gray-100 p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl"
      >
        <CopyPreviewHeader 
          onEditClick={onEditClick}
          selectedPersonaSource={selectedPersonaSource}
          isPersonaPopoverOpen={isPersonaPopoverOpen}
          setIsPersonaPopoverOpen={setIsPersonaPopoverOpen}
          handlePersonaSelection={handlePersonaSelection}
          handleFileInputChange={handleFileInputChange}
        />
        
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
          
          <CardContent className="p-0">
            {contentType === "email" ? (
              <EmailPreview 
                emailContent={generatedContent.email}
                copyToClipboard={copyToClipboard}
                downloadContent={downloadContent}
              />
            ) : (
              <LinkedInPreview 
                linkedinContent={generatedContent.linkedin}
                copyToClipboard={copyToClipboard}
                downloadContent={downloadContent}
              />
            )}
          </CardContent>

          {/* AI Recommendations Section */}
          <AIRecommendations contentType={contentType} />
          
          <CopyPreviewFooter onEditClick={onEditClick} />
        </Card>

        <OutboundTips />
      </motion.div>
    </div>
  );
};

export default CopyPreview;
