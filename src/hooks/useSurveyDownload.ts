
import { useState } from "react";
import { SurveyController } from "@/controllers/SurveyController";

/**
 * @deprecated Use o hook useSurveyManager em vez disso
 */
export const useSurveyDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (processingId: string) => {
    if (!processingId) return;
    
    setIsDownloading(true);
    try {
      await SurveyController.downloadProcessedData(processingId);
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    isDownloading,
    handleDownload
  };
};
