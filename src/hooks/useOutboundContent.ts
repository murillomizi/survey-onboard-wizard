
import { ContentType } from "@/types/outbound";
import { toast } from "@/components/ui/use-toast";

export const useOutboundContent = (
  contentType: ContentType,
  setContentType: React.Dispatch<React.SetStateAction<ContentType>>,
  generatedContent: { email: string; linkedin: string },
  setGeneratedContent: React.Dispatch<React.SetStateAction<{ email: string; linkedin: string }>>
) => {
  
  const handleContentTypeChange = (value: string) => {
    setContentType(value as ContentType);
  };

  const handleContentUpdate = (type: ContentType, newContent: string) => {
    setGeneratedContent(prev => ({
      ...prev,
      [type]: newContent
    }));
    
    toast({
      title: "Copy updated",
      description: `The ${type === "email" ? "email" : "LinkedIn"} content has been successfully updated.`
    });
  };

  return {
    handleContentTypeChange,
    handleContentUpdate,
  };
};
