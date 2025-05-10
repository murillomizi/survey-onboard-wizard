
import React from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface CopyPreviewFooterProps {
  onEditClick: () => void;
}

const CopyPreviewFooter: React.FC<CopyPreviewFooterProps> = ({ onEditClick }) => {
  return (
    <div className="p-4 bg-gradient-to-r from-minimal-white to-minimal-gray-100 border-t border-minimal-gray-300 flex justify-between">
      <div className="flex items-center gap-2 px-4 py-2 border border-minimal-gray-300 rounded-md text-minimal-gray-600 bg-minimal-white">
        Personalizar
      </div>
      
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
  );
};

export default CopyPreviewFooter;
