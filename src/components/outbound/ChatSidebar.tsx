import React, { useState, useRef } from "react";
import { Send, Paperclip, History, FileText, Users, Building2, ChevronDown, Database, Copy, Edit, LogOut, UserRound, Link2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat-input";
import { ChatBubble, ChatBubbleMessage, ChatBubbleAvatar } from "@/components/ui/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import Logo from "@/components/ui/logo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditOptionsModal from "./EditOptionsModal";
import TemplateConfigMenu from "./TemplateConfigMenu";
import { toast } from "@/components/ui/use-toast";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type Message = {
  content: string;
  role: "user" | "assistant";
  isLoading?: boolean;
};

interface ChatSidebarProps {
  messages: Message[];
  input: string;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  messages,
  input,
  isLoading,
  onInputChange,
  onSendMessage,
  onKeyDown,
  chatEndRef,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFileInputOpen, setIsFileInputOpen] = useState(false);
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Persona state
  const [selectedPersonaSource, setSelectedPersonaSource] = useState<string | null>(null);
  const [isPersonaPopoverOpen, setIsPersonaPopoverOpen] = useState(false);
  
  // Company state
  const [companyWebsite, setCompanyWebsite] = useState<string>('');
  const [isCompanyPopoverOpen, setIsCompanyPopoverOpen] = useState(false);
  const [urlIsValid, setUrlIsValid] = useState<boolean | null>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log("File selected:", e.target.files[0].name);
      // Here you would handle the file upload
    }
  };
  
  const handleApplyTemplate = (templateConfig: any) => {
    console.log("Template config applied:", templateConfig);
    toast({
      title: "Template aplicado!",
      description: "As configurações do template foram aplicadas com sucesso."
    });
  };
  
  const handlePersonaSelection = (source: string) => {
    setSelectedPersonaSource(source);
    setIsPersonaPopoverOpen(false);
    toast({
      title: "Persona source selected",
      description: `${source} has been selected as your persona source.`
    });
  };
  
  const validateUrl = (url: string): boolean => {
    if (!url) return false;

    // Add http:// if the URL doesn't have a protocol
    let urlToTest = url;
    if (!/^https?:\/\//i.test(urlToTest)) {
      urlToTest = 'http://' + urlToTest;
    }
    try {
      new URL(urlToTest);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCompanyWebsite(value);
    if (value) {
      setUrlIsValid(validateUrl(value));
    } else {
      setUrlIsValid(null);
    }
  };
  
  const formatDisplayUrl = (url: string): string => {
    // Remove protocol for display
    return url.replace(/^https?:\/\//i, '');
  };
  
  const handleCompanyWebsiteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyWebsite || !validateUrl(companyWebsite)) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida para o site da empresa.",
        variant: "destructive"
      });
      return;
    }
    setIsCompanyPopoverOpen(false);
    toast({
      title: "Site da empresa salvo",
      description: "As informações da empresa foram atualizadas com sucesso."
    });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
      toast({
        title: "Logout realizado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro ao fazer logout",
        variant: "destructive"
      });
    }
  };

  const handleNavigateToDashboard = () => {
    navigate("/simple");
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 w-80 bg-minimal-black text-minimal-white flex flex-col h-screen border-r border-minimal-gray-700 flex-shrink-0 z-10">
      {/* Header with project name and History button */}
      <div className="p-3 border-b border-minimal-gray-700 flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none" asChild>
            <div className="flex items-center cursor-pointer">
              <span className="text-sm font-medium text-minimal-white">mizi-project-1</span>
              <ChevronDown size={12} className="ml-1 text-minimal-gray-400" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72 p-0 bg-minimal-gray-800 border-minimal-gray-700">
            {/* User Profile Section */}
            {user && (
              <>
                <div className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 rounded-full p-2">
                      <UserRound size={16} className="text-minimal-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-minimal-white">
                        {user.email}
                      </span>
                      <span className="text-xs text-minimal-gray-400">
                        Último acesso: {new Date(user.last_sign_in_at || "").toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-minimal-gray-700" />
              </>
            )}
            
            {/* Dashboard Button */}
            <div className="p-2">
              <DropdownMenuItem 
                className="px-3 py-2.5 rounded-md hover:bg-minimal-gray-700 text-minimal-white"
                onClick={handleNavigateToDashboard}
              >
                <div className="flex items-center gap-2">
                  <Database size={16} className="text-minimal-white" />
                  <span>Dashboard</span>
                </div>
              </DropdownMenuItem>
            </div>
            
            <DropdownMenuSeparator className="bg-minimal-gray-700" />
            
            {/* Usage Limits */}
            <div className="p-3 border-minimal-gray-700 text-minimal-gray-300">
              <h4 className="text-xs font-medium mb-2 text-minimal-gray-300">Usage Limits</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span>Prospects used:</span>
                  <span className="font-medium">48 / 100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '48%' }}></div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>API Requests:</span>
                  <span className="font-medium">324 / 1000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '32.4%' }}></div>
                </div>
              </div>
            </div>
            
            <DropdownMenuSeparator className="bg-minimal-gray-700" />
            
            {/* Project Actions */}
            <div className="p-2 space-y-1">
              <DropdownMenuItem className="px-3 py-2 rounded-md text-sm hover:bg-minimal-gray-700">
                <div className="flex items-center gap-2">
                  <Edit size={16} className="text-minimal-gray-400" />
                  <span className="text-minimal-gray-300">Rename Project</span>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="px-3 py-2 rounded-md text-sm hover:bg-minimal-gray-700">
                <div className="flex items-center gap-2">
                  <Copy size={16} className="text-minimal-gray-400" />
                  <span className="text-minimal-gray-300">Duplicate Project</span>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="px-3 py-2 rounded-md text-sm hover:bg-minimal-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-minimal-gray-300">Create New Project</span>
                </div>
              </DropdownMenuItem>
              
              {/* Logout Button */}
              {user && (
                <DropdownMenuItem 
                  className="px-3 py-2 rounded-md text-sm hover:bg-minimal-gray-700 text-red-500"
                  onClick={handleLogout}
                >
                  <div className="flex items-center gap-2">
                    <LogOut size={16} className="text-red-500" />
                    <span>Sair</span>
                  </div>
                </DropdownMenuItem>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0 text-minimal-gray-400 hover:text-minimal-white hover:bg-minimal-gray-800"
          onClick={() => console.log("History clicked")}
        >
          <History size={16} />
        </Button>
      </div>
      
      {/* Persona and Company buttons section */}
      <div className="flex border-b border-minimal-gray-700 bg-minimal-gray-900">
        <Popover open={isPersonaPopoverOpen} onOpenChange={setIsPersonaPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="flex-1 h-10 justify-center text-xs rounded-none border-r border-minimal-gray-800 text-minimal-gray-300 hover:bg-minimal-gray-800 hover:text-minimal-white">
              <Users size={14} className="mr-1.5" />
              Persona
              {selectedPersonaSource && <span className="ml-1 text-xs opacity-60 max-w-20 truncate">({selectedPersonaSource})</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3 bg-minimal-gray-900 border-minimal-gray-700 text-minimal-white shadow-md" align="start">
            <Tabs defaultValue="dataset" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-minimal-gray-800 mb-3">
                <TabsTrigger value="dataset" className="text-xs data-[state=active]:bg-minimal-gray-700">Dataset</TabsTrigger>
                <TabsTrigger value="enrichment" className="text-xs data-[state=active]:bg-minimal-gray-700">Enrichment</TabsTrigger>
              </TabsList>
              <TabsContent value="dataset" className="mt-2 space-y-2">
                <p className="text-xs text-minimal-gray-400 mb-2">Upload um arquivo CSV ou JSON com seus dados de contato</p>
                <input type="file" id="preview-dataset-upload" className="hidden" accept=".csv,.json" onChange={handleFileInputChange} />
                <label htmlFor="preview-dataset-upload">
                  <Button variant="outline" size="sm" className="w-full text-xs flex items-center gap-2 bg-minimal-gray-800 border-minimal-gray-700 text-minimal-gray-300 hover:bg-minimal-gray-700" asChild>
                    <span>
                      <Users size={12} className="text-minimal-gray-400" />
                      Fazer upload de dataset
                    </span>
                  </Button>
                </label>
              </TabsContent>
              <TabsContent value="enrichment" className="mt-2 space-y-2">
                <p className="text-xs text-minimal-gray-400 mb-2">Conecte com uma ferramenta de sales enrichment</p>
                <Button variant="outline" size="sm" className="w-full text-xs flex items-center gap-2 bg-minimal-gray-800 border-minimal-gray-700 text-minimal-gray-300 hover:bg-minimal-gray-700" onClick={() => handlePersonaSelection("Apollo.io")}>
                  Apollo.io
                </Button>
                <Button variant="outline" size="sm" className="w-full text-xs flex items-center gap-2 bg-minimal-gray-800 border-minimal-gray-700 text-minimal-gray-300 hover:bg-minimal-gray-700" onClick={() => handlePersonaSelection("ZoomInfo")}>
                  ZoomInfo
                </Button>
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>
        
        <Popover open={isCompanyPopoverOpen} onOpenChange={setIsCompanyPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="flex-1 h-10 justify-center text-xs rounded-none text-minimal-gray-300 hover:bg-minimal-gray-800 hover:text-minimal-white">
              <Building2 size={14} className="mr-1.5" />
              Sua Empresa
              {companyWebsite && <span className="ml-1 text-xs opacity-60 max-w-20 truncate">({formatDisplayUrl(companyWebsite)})</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3 bg-minimal-gray-900 border-minimal-gray-700 text-minimal-white shadow-md" align="end">
            <form onSubmit={handleCompanyWebsiteSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="company-website" className="block text-sm font-medium text-minimal-gray-300 mb-1">
                    Site da empresa
                  </label>
                  <div className="flex relative">
                    <div className="flex items-center px-2 bg-minimal-gray-800 border border-r-0 border-minimal-gray-700 rounded-l-md">
                      <Link2 size={12} className={`${urlIsValid === true ? 'text-green-500' : urlIsValid === false ? 'text-red-500' : 'text-minimal-gray-400'}`} />
                    </div>
                    <Input id="company-website" type="text" value={companyWebsite} onChange={handleUrlChange} placeholder="www.suaempresa.com" className={`rounded-l-none bg-minimal-gray-800 border-minimal-gray-700 text-minimal-white text-xs h-8 ${urlIsValid === true ? 'border-green-500 focus-visible:ring-green-500' : urlIsValid === false ? 'border-red-500 focus-visible:ring-red-500' : ''}`} />
                    {urlIsValid === true && <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <Check size={12} className="text-green-500" />
                      </div>}
                  </div>
                  {urlIsValid === false && <p className="mt-1 text-xs text-red-500">
                      Por favor, insira uma URL válida (ex: empresa.com)
                    </p>}
                  <p className="mt-1 text-xs text-minimal-gray-500">
                    Adicione o site da sua empresa para personalizar seu outbound
                  </p>
                </div>
                
                <Button type="submit" className="w-full bg-minimal-gray-700 text-minimal-white hover:bg-minimal-gray-600 text-xs h-8" disabled={urlIsValid === false || urlIsValid === null}>
                  Salvar informações
                </Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Use ChatMessageList for better scroll handling */}
        <ChatMessageList className="flex-1 pb-1 pt-2">
          {messages.map((message, index) => (
            <ChatBubble 
              key={index}
              variant={message.role === "user" ? "sent" : "received"}
              className="animate-fade-in"
            >
              {message.role === "assistant" && (
                <ChatBubbleAvatar fallback="M" className="bg-gradient-to-br from-purple-600 to-orange-500" />
              )}
              <ChatBubbleMessage 
                variant={message.role === "user" ? "sent" : "received"}
                isLoading={message.isLoading}
                className={message.role === "user" ? 
                  "bg-minimal-gray-800 text-minimal-white rounded-xl" : 
                  "bg-minimal-gray-700 text-minimal-white rounded-xl"}
              >
                {message.content}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}
          <div ref={chatEndRef} />
        </ChatMessageList>
        
        <div className="p-3 border-t border-minimal-gray-700 bg-minimal-gray-900/50">
          <div className="relative">
            <ChatInput 
              value={input}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              placeholder="Ask Mizi..."
              disabled={isLoading}
              className="pr-10 bg-minimal-gray-800 text-minimal-white border-minimal-gray-700 rounded-xl"
            />
            <Button 
              size="icon" 
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent hover:bg-minimal-gray-700 text-minimal-white transition-colors"
              onClick={onSendMessage} 
              disabled={isLoading || !input.trim()}
            >
              <Send size={18} />
            </Button>
          </div>

          {/* Controls row with attachment and template buttons - more compact */}
          <div className="flex items-center justify-between mt-2 px-1">
            {/* Template Button */}
            <Popover open={isTemplateMenuOpen} onOpenChange={setIsTemplateMenuOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 py-0 text-minimal-gray-400 hover:text-minimal-white hover:bg-minimal-gray-800 flex items-center gap-1"
                >
                  <FileText size={14} />
                  <span className="text-xs">Template</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top" align="start" sideOffset={5} className="p-0 w-72 bg-minimal-gray-900 border-minimal-gray-700 text-minimal-white">
                <TemplateConfigMenu 
                  onApplyTemplate={handleApplyTemplate}
                  onClose={() => setIsTemplateMenuOpen(false)}
                />
              </PopoverContent>
            </Popover>
            
            {/* Attachment Button */}
            <div>
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                onChange={handleFileInputChange} 
              />
              <label htmlFor="file-upload">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 py-0 text-minimal-gray-400 hover:text-minimal-white hover:bg-minimal-gray-800 flex items-center gap-1"
                  asChild
                >
                  <span>
                    <Paperclip size={14} />
                    <span className="text-xs">Attach</span>
                  </span>
                </Button>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditOptionsModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};

export default ChatSidebar;
