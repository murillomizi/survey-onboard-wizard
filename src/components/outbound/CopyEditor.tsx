
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Save, X, Mail, Linkedin, BoldIcon, 
  ItalicIcon, ListIcon, UnderlineIcon, Type, 
  Variable, Send, Download, AlertTriangle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

type ContentType = "email" | "linkedin";

interface CopyEditorProps {
  contentType: ContentType;
  generatedContent: {
    email: string;
    linkedin: string;
  };
  onContentTypeChange: (value: string) => void;
  onContentUpdate: (type: ContentType, content: string) => void;
  onCloseEditor: () => void;
}

const variableOptions = [
  { label: "Name", value: "{nome}" },
  { label: "Company", value: "{empresa}" },
  { label: "Industry", value: "{setor}" },
  { label: "Competitor", value: "{empresa concorrente}" },
  { label: "Your Name", value: "{seu nome}" },
  { label: "Your Company", value: "{sua empresa}" },
  { label: "Your Contact", value: "{seu contato}" },
];

const CopyEditor: React.FC<CopyEditorProps> = ({
  contentType,
  generatedContent,
  onContentTypeChange,
  onContentUpdate,
  onCloseEditor,
}) => {
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [linkedinContent, setLinkedinContent] = useState("");

  useEffect(() => {
    // Parse email content into subject and body
    const subjectMatch = generatedContent.email.match(/Assunto: (.*?)(\n|$)/);
    const subject = subjectMatch ? subjectMatch[1] : "";
    const body = generatedContent.email.replace(/Assunto: (.*?)(\n|$)/, '').trim();
    
    setEmailSubject(subject);
    setEmailBody(body);
    setLinkedinContent(generatedContent.linkedin);
  }, [generatedContent]);

  const handleSaveChanges = () => {
    if (contentType === "email") {
      const updatedEmailContent = `Assunto: ${emailSubject}\n\n${emailBody}`;
      onContentUpdate("email", updatedEmailContent);
    } else {
      onContentUpdate("linkedin", linkedinContent);
    }
  };

  const insertVariable = (variable: string) => {
    if (contentType === "email") {
      const textarea = document.getElementById("email-body") as HTMLTextAreaElement;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const after = text.substring(end, text.length);
        setEmailBody(before + variable + after);
        // Set cursor position after variable
        setTimeout(() => {
          textarea.focus();
          textarea.selectionStart = start + variable.length;
          textarea.selectionEnd = start + variable.length;
        }, 10);
      }
    } else {
      const textarea = document.getElementById("linkedin-content") as HTMLTextAreaElement;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const after = text.substring(end, text.length);
        setLinkedinContent(before + variable + after);
        // Set cursor position after variable
        setTimeout(() => {
          textarea.focus();
          textarea.selectionStart = start + variable.length;
          textarea.selectionEnd = start + variable.length;
        }, 10);
      }
    }
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Type size={20} className="text-minimal-gray-700" />
            Copy Editor
          </h2>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveChanges}
              className="flex items-center gap-1 bg-minimal-white border-minimal-gray-300"
            >
              <Save size={14} />
              Save changes
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onCloseEditor}
              className="flex items-center gap-1"
            >
              <X size={14} />
              Cancel
            </Button>
          </div>
        </div>
        
        <Card className="border-minimal-gray-300 shadow-xl rounded-xl overflow-hidden mb-4">
          <div className="p-4 bg-gradient-to-r from-minimal-gray-100 to-minimal-white border-b border-minimal-gray-300 flex justify-between items-center">
            <Tabs defaultValue="email" value={contentType} onValueChange={onContentTypeChange} className="w-full">
              <TabsList className="grid grid-cols-2 rounded-lg bg-minimal-gray-200/70 p-1">
                <TabsTrigger value="email" className="rounded-md flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md">
                  <Mail size={16} />
                  Professional Email
                </TabsTrigger>
                <TabsTrigger value="linkedin" className="rounded-md flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md">
                  <Linkedin size={16} />
                  LinkedIn
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Toolbar */}
          <div className="border-b border-minimal-gray-200 bg-minimal-gray-50 p-2 flex items-center gap-1 flex-wrap">
            <div className="flex items-center mr-2">
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
                    <p>Bold</p>
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
                    <p>Italic</p>
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
                    <p>Underline</p>
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
                    <p>Add list item</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="h-6 w-px bg-minimal-gray-300 mx-2" />
            
            <div className="flex-1 flex items-center gap-1 overflow-x-auto pb-1 flex-wrap">
              <span className="text-xs text-minimal-gray-600 mr-1 flex items-center">
                <Variable size={12} className="mr-1" /> Variables:
              </span>
              {variableOptions.map((variable) => (
                <Badge 
                  key={variable.value} 
                  variant="outline"
                  className="bg-minimal-white cursor-pointer hover:bg-minimal-gray-100"
                  onClick={() => insertVariable(variable.value)}
                >
                  {variable.label}
                </Badge>
              ))}
            </div>
          </div>
          
          <CardContent className="p-0">
            {contentType === "email" ? (
              <div className="border-minimal-gray-200 overflow-y-auto max-h-[500px] bg-white p-4">
                <div className="mb-4">
                  <label htmlFor="email-subject" className="text-sm font-medium text-minimal-gray-700 block mb-1">
                    Email Subject
                  </label>
                  <Input
                    id="email-subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="border-minimal-gray-200 focus:ring-minimal-gray-300 focus:border-minimal-gray-400"
                    placeholder="Type your email subject..."
                  />
                </div>
                
                <div>
                  <label htmlFor="email-body" className="text-sm font-medium text-minimal-gray-700 block mb-1">
                    Email Body
                  </label>
                  <textarea
                    id="email-body"
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full h-[350px] border rounded-md p-3 text-minimal-gray-800 border-minimal-gray-200 focus:ring-minimal-gray-300 focus:border-minimal-gray-400 focus:outline-none resize-none font-mono"
                    placeholder="Type your email body..."
                  />
                </div>
              </div>
            ) : (
              <div className="border-minimal-gray-200 overflow-y-auto max-h-[500px] bg-white p-4">
                <div>
                  <label htmlFor="linkedin-content" className="text-sm font-medium text-minimal-gray-700 block mb-1">
                    LinkedIn Message
                  </label>
                  <textarea
                    id="linkedin-content"
                    value={linkedinContent}
                    onChange={(e) => setLinkedinContent(e.target.value)}
                    className="w-full h-[350px] border rounded-md p-3 text-minimal-gray-800 border-minimal-gray-200 focus:ring-minimal-gray-300 focus:border-minimal-gray-400 focus:outline-none resize-none font-mono"
                    placeholder="Type your LinkedIn message..."
                  />
                </div>
              </div>
            )}
          </CardContent>
          
          <div className="p-4 bg-minimal-gray-50 border-t border-minimal-gray-300 flex justify-between items-center">
            <div className="flex items-center">
              <AlertTriangle size={16} className="text-amber-500 mr-2" />
              <span className="text-xs text-minimal-gray-600">
                Variables will be replaced with contact data during sending
              </span>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const content = contentType === "email" 
                    ? `Assunto: ${emailSubject}\n\n${emailBody}`
                    : linkedinContent;
                    
                  const fileName = contentType === "email"
                    ? "email_outbound.txt"
                    : "linkedin_outbound.txt";
                    
                  const element = document.createElement("a");
                  const file = new Blob([content], {type: 'text/plain'});
                  element.href = URL.createObjectURL(file);
                  element.download = fileName;
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                  
                  toast({
                    title: "Content downloaded!",
                    description: `The file ${fileName} has been successfully downloaded.`
                  });
                }}
                className="bg-minimal-white hover:bg-minimal-gray-100 text-xs flex items-center gap-1"
              >
                <Download size={14} />
                Download
              </Button>
              
              <Button
                onClick={handleSaveChanges}
                className="bg-minimal-black hover:bg-minimal-gray-900 text-minimal-white flex items-center gap-1"
              >
                <Save size={14} />
                Save changes
              </Button>
            </div>
          </div>
        </Card>
        
        <div className="mt-4 p-3 bg-minimal-gray-50 border border-minimal-gray-200 rounded-lg text-xs text-minimal-gray-600">
          <div className="font-medium text-minimal-gray-700 mb-1">Formatting Tips:</div>
          <ul className="list-disc pl-4 space-y-0.5">
            <li><strong>**text**</strong> - for bold text</li>
            <li><em>_text_</em> - for italic text</li>
            <li><span className="underline">__text__</span> - for underlined text</li>
            <li><span>• item</span> - to create bulleted lists</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default CopyEditor;
