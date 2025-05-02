
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";

interface CSVFileUploadProps {
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CSVFileUpload = ({ onFileSelect }: CSVFileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="mb-4 border border-blue-100 bg-blue-50 p-4 rounded-xl text-gray-700">
        <p className="font-semibold mb-2">🚀 Maximize a Personalização da IA</p>
        <p className="text-sm mb-2">
          Quanto mais dados você incluir no seu CSV, mais precisa e personalizada será a estratégia de comunicação.
        </p>
        <p className="text-xs text-gray-500 italic">
          Exemplos de dados úteis: nome completo, cargo, empresa, e-mail, histórico de interações, principais desafios, interesses profissionais, etc.
        </p>
      </div>
      <Button
        type="button"
        onClick={triggerFileUpload}
        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200"
      >
        <Paperclip size={18} />
        Upload CSV
      </Button>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={onFileSelect}
        className="hidden"
      />
    </>
  );
};

export default CSVFileUpload;
