
import React from "react";
import { Download, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface EmailPreviewProps {
  emailContent: string;
  copyToClipboard: (text: string) => void;
  downloadContent: (text: string, fileName: string) => void;
}

const EmailPreview: React.FC<EmailPreviewProps> = ({
  emailContent,
  copyToClipboard,
  downloadContent,
}) => {
  // Extract subject line from email content
  const getEmailSubject = (content: string) => {
    const subjectMatch = content.match(/Assunto: (.*?)(\n|$)/);
    return subjectMatch ? subjectMatch[1] : "Sem assunto";
  };

  // Get email content without the subject line
  const getEmailBody = (content: string) => {
    return content.replace(/Assunto: (.*?)(\n|$)/, '').trim();
  };

  return (
    <div className="border border-minimal-gray-200 rounded-lg shadow-inner overflow-y-auto max-h-[500px] bg-white m-6">
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
              onClick={() => downloadContent(emailContent, "email_outbound.txt")}
            >
              <Download size={14} className="mr-1" />
              Baixar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-minimal-white hover:bg-minimal-gray-100 text-xs"
              onClick={() => copyToClipboard(emailContent)}
            >
              <Send size={14} className="mr-1" />
              Disparar
            </Button>
          </div>
        </div>
        
        {/* Email Subject Line */}
        <div className="bg-white rounded border border-minimal-gray-300 p-2 mb-2 flex items-center">
          <span className="text-minimal-gray-500 mr-2 text-sm font-medium w-16">Assunto:</span>
          <span className="text-sm font-medium">{getEmailSubject(emailContent)}</span>
        </div>
      </div>
      
      {/* Email Body */}
      <div className="bg-white p-5 font-sans text-sm">
        <div className="whitespace-pre-wrap leading-relaxed text-left text-minimal-gray-800 font-semibold">
          {getEmailBody(emailContent)}
        </div>
      </div>
    </div>
  );
};

export default EmailPreview;
