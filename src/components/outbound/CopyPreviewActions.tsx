
import React from "react";
import { Send, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { ContentType } from "@/types/outbound";

interface CopyPreviewActionsProps {
  contentType: ContentType;
  followUpsCount: number;
  activeFollowUpIndex: number | null;
  onDispatch: () => void;
  onShare: () => void;
}

const CopyPreviewActions: React.FC<CopyPreviewActionsProps> = ({
  contentType,
  followUpsCount,
  activeFollowUpIndex,
  onDispatch,
  onShare
}) => {
  return (
    <div className="p-4 bg-gradient-to-r from-minimal-white to-minimal-gray-100 border-t border-minimal-gray-300 flex justify-between items-center">
      <div className="flex items-center">
        {followUpsCount > 0 && (
          <Badge variant="outline" className="bg-minimal-white text-xs">
            {followUpsCount} follow-ups na sequência
          </Badge>
        )}
      </div>
      
      <div className="flex gap-4">
        <Button 
          className="bg-minimal-black hover:bg-minimal-gray-800 text-minimal-white flex items-center gap-2 shadow-lg hover:shadow-xl transition-all px-6"
          onClick={onDispatch}
        >
          <Send size={16} className="text-white" />
          Disparar{activeFollowUpIndex !== null ? ` #${activeFollowUpIndex + 1}` : ""}
        </Button>
        
        <Button 
          variant="outline"
          className="border-minimal-gray-300 bg-minimal-white hover:bg-minimal-gray-100 flex items-center gap-2 shadow-md hover:shadow-lg transition-all px-6"
          onClick={onShare}
        >
          <Share2 size={16} className="text-black" />
          Compartilhar
        </Button>
      </div>
    </div>
  );
};

export default CopyPreviewActions;
