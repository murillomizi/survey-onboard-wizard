
import React from "react";
import { Pencil, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface CopyPreviewFooterProps {
  onEditClick: () => void;
}

const CopyPreviewFooter: React.FC<CopyPreviewFooterProps> = ({ onEditClick }) => {
  return (
    <div className="p-4 bg-gradient-to-r from-minimal-white to-minimal-gray-100 border-t border-minimal-gray-300 flex justify-between">
      <Button 
        variant="outline" 
        className="flex items-center gap-2 hover:bg-minimal-gray-200 transition-all border-minimal-gray-300"
        onClick={onEditClick}
      >
        <Pencil size={16} />
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
  );
};

export default CopyPreviewFooter;
