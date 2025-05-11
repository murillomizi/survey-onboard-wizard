
import React from "react";
import { Download, Linkedin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LinkedInPreviewProps {
  linkedinContent: string;
  copyToClipboard: (text: string) => void;
  downloadContent: (text: string, fileName: string) => void;
}

const LinkedInPreview: React.FC<LinkedInPreviewProps> = ({
  linkedinContent,
  copyToClipboard,
  downloadContent,
}) => {
  return (
    <div className="bg-white border border-minimal-gray-200 rounded-lg p-6 overflow-y-auto max-h-[500px] relative m-6 shadow-inner">
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <div className="bg-minimal-black text-white p-1 rounded-full">
          <Linkedin size={16} />
        </div>
        <span className="text-sm font-medium text-minimal-gray-700">Mensagem do LinkedIn</span>
      </div>
      <div className="pt-10 text-left whitespace-pre-wrap text-minimal-gray-800 font-semibold">
        {linkedinContent}
      </div>
      
      <div className="absolute top-2 right-2 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="bg-minimal-white hover:bg-minimal-gray-100 text-xs"
          onClick={() => downloadContent(linkedinContent, "linkedin_outbound.txt")}
        >
          <Download size={14} className="mr-1" />
          Baixar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-minimal-white hover:bg-minimal-gray-100 text-xs"
          onClick={() => copyToClipboard(linkedinContent)}
        >
          <Send size={14} className="mr-1" />
          Disparar
        </Button>
      </div>
    </div>
  );
};

export default LinkedInPreview;
