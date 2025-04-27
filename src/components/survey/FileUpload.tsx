
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import Papa from "papaparse";

interface FileUploadProps {
  fileName: string;
  onFileSelect: (file: File, data: any[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ fileName, onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type !== "text/csv") {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo CSV.",
        variant: "destructive"
      });
      return;
    }
    
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data as any[];
          onFileSelect(file, data);
          console.log("CSV parsed:", data.length, "rows");
          
          toast({
            title: "Arquivo processado",
            description: `${file.name} (${data.length} registros) carregado com sucesso.`
          });
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          toast({
            title: "Erro ao processar arquivo",
            description: "Não foi possível ler o arquivo CSV corretamente.",
            variant: "destructive"
          });
        }
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="csvUpload" className="text-survey-text font-medium flex items-center gap-2">
        <Upload size={18} className="text-survey-muted" />
        Base de prospecção
      </Label>
      <div className="flex items-center gap-2">
        <input
          type="file"
          id="csvUpload"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <Input
          readOnly
          value={fileName}
          placeholder="Nenhum arquivo selecionado"
          className="bg-survey-card text-survey-text border-gray-700 flex-1"
        />
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-survey-purple hover:bg-survey-purple/90 text-white"
        >
          Buscar
        </Button>
      </div>
      <p className="text-survey-muted text-sm italic">Importe sua base de prospecção em formato CSV</p>
    </div>
  );
};

export default FileUpload;
