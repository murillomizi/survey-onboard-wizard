import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Upload, Send, Globe } from "lucide-react";
import SurveySlider from "./SurveySlider";
import SurveySelect from "./SurveySelect";
import LoadingOverlay from "./LoadingOverlay";
import { supabase } from "@/integrations/supabase/client";
import Papa from "papaparse";

const SurveyForm = () => {
  const [surveyData, setSurveyData] = useState({
    canal: "linkedin",
    csvFile: null as File | null,
    csvFileName: "",
    websiteUrl: "",
    tamanho: 350,
    touchpoints: "3",
    tomVoz: "neutro",
    template: "proposta",
    gatilhos: "sem-gatilho"
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [parsedCsvData, setParsedCsvData] = useState<any[]>([]);
  const pollingRef = useRef<number | null>(null);
  
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
    
    setSurveyData({
      ...surveyData,
      csvFile: file,
      csvFileName: file ? file.name : ""
    });
    
    // Parse CSV data when file is selected
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data as any[];
          setParsedCsvData(data);
          setTotalCount(data.length);
          console.log("CSV parsed:", data.length, "rows");
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

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSurveyData({
      ...surveyData,
      websiteUrl: e.target.value
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    // Clean up polling on unmount
    return () => {
      if (pollingRef.current) {
        window.clearInterval(pollingRef.current);
      }
    };
  }, []);

  // Function to check processing progress
  const checkProgress = async (surveyId: string) => {
    try {
      console.log(`Checking progress for survey ID: ${surveyId}, Timestamp: ${new Date().toISOString()}`);
      
      const startTime = performance.now();
      
      // Use exact SQL query to fetch count
      const { data: countData, error: countError } = await supabase
        .from("mizi_ai_personalized_return")
        .select("count", { count: "exact", head: false })
        .eq("mizi_ai_id", surveyId);
      
      const endTime = performance.now();
      
      console.log(`Progress check query execution time: ${endTime - startTime}ms`);
      console.log(`Progress check raw response:`, countData);
      
      if (countError) {
        console.error("Error checking progress:", countError);
        return;
      }

      // Get all rows for the survey ID to see detailed data
      const { data: detailData, error: detailError } = await supabase
        .from("mizi_ai_personalized_return")
        .select("*")
        .eq("mizi_ai_id", surveyId);
      
      console.log(`Current rows for survey ID ${surveyId}:`, detailData?.length || 0);
      
      if (detailError) {
        console.error("Error fetching detail data:", detailError);
      } else if (detailData) {
        // Update processed count based on actual rows returned
        const count = detailData.length;
        setProcessedCount(count);
        console.log(`Processed ${count}/${totalCount} records`);
        
        // Check if processing is complete
        if (count >= totalCount && count > 0) {
          console.log("Processing complete!");
          setIsComplete(true);
          if (pollingRef.current) {
            window.clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
        }
      }
    } catch (error) {
      console.error("Error in checkProgress:", error);
    }
  };

  const handleDownload = async () => {
    if (!processingId) return;
    
    try {
      console.log("Fetching processed data for download...");
      // Fetch the processed data
      const { data, error } = await supabase
        .from("mizi_ai_personalized_return")
        .select("*")
        .eq("mizi_ai_id", processingId);
      
      if (error) {
        console.error("Error fetching processed data:", error);
        toast({
          title: "Erro ao baixar dados",
          description: "Não foi possível baixar os dados processados.",
          variant: "destructive"
        });
        return;
      }
      
      if (!data || data.length === 0) {
        toast({
          title: "Sem dados",
          description: "Não há dados processados para download.",
          variant: "destructive"
        });
        return;
      }
      
      console.log("Generating CSV with", data.length, "rows");
      // Convert to CSV
      const csv = Papa.unparse(data);
      
      // Create and download file
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `campanha-personalizada-${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download iniciado",
        description: "O download da sua campanha personalizada foi iniciado."
      });
    } catch (error) {
      console.error("Error in handleDownload:", error);
      toast({
        title: "Erro no download",
        description: "Ocorreu um erro ao preparar o download.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!surveyData.csvFile || parsedCsvData.length === 0) {
      toast({
        title: "Arquivo necessário",
        description: "Por favor, selecione um arquivo CSV válido.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Starting processing, showing loading overlay...");
    setIsProcessing(true);
    setProcessedCount(0);
    setIsComplete(false);
    
    try {
      // Submit survey data to database
      console.log("Saving survey data to database...");
      const { data, error } = await supabase
        .from('mizi_ai_surveys')
        .insert([
          {
            canal: surveyData.canal,
            touchpoints: surveyData.touchpoints,
            website_url: surveyData.websiteUrl,
            message_length: surveyData.tamanho,
            tone_of_voice: surveyData.tomVoz,
            template: surveyData.template,
            persuasion_trigger: surveyData.gatilhos,
            csv_data: parsedCsvData,
            csv_file_name: surveyData.csvFileName
          }
        ])
        .select();

      if (error) {
        console.error("Error submitting survey:", error);
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar suas configurações.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }

      if (data && data.length > 0) {
        const surveyId = data[0].id;
        console.log("Survey saved with ID:", surveyId);
        setProcessingId(surveyId);
        
        // First check immediately
        await checkProgress(surveyId);
        
        // Start polling for updates
        console.log("Starting polling for updates...");
        if (pollingRef.current) {
          window.clearInterval(pollingRef.current);
        }
        
        pollingRef.current = window.setInterval(() => {
          checkProgress(surveyId);
        }, 2000);
        
        toast({
          title: "Processamento iniciado",
          description: "Suas configurações foram salvas e o processamento foi iniciado."
        });
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6 w-full max-w-md">
        {/* CSV upload field */}
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
              value={surveyData.csvFileName || ""}
              placeholder="Nenhum arquivo selecionado"
              className="bg-survey-card text-survey-text border-gray-700 flex-1"
            />
            <Button
              type="button"
              onClick={triggerFileInput}
              className="bg-survey-purple hover:bg-survey-purple/90 text-white"
            >
              Buscar
            </Button>
          </div>
          <p className="text-survey-muted text-sm italic">Importe sua base de prospecção em formato CSV</p>
        </div>

        {/* Website URL input */}
        <div className="space-y-2">
          <Label htmlFor="websiteUrl" className="text-survey-text font-medium flex items-center gap-2">
            <Globe size={18} className="text-survey-muted" />
            Site da empresa
          </Label>
          <Input
            id="websiteUrl"
            type="url"
            placeholder="https://exemplo.com.br"
            value={surveyData.websiteUrl}
            onChange={handleWebsiteChange}
            className="bg-survey-card text-survey-text border-gray-700"
          />
          <p className="text-survey-muted text-sm italic">Insira o site da empresa para personalização das mensagens</p>
        </div>

        <SurveySelect
          title="Canal"
          description="Escolha o canal de comunicação"
          icon="channel"
          options={[
            { value: "linkedin", label: "LinkedIn" },
            { value: "cold-email", label: "Cold E-mail" }
          ]}
          defaultValue={surveyData.canal}
          onChange={(value) => setSurveyData({ ...surveyData, canal: value })}
        />

        <SurveySlider
          title="Tamanho"
          recommendedText="Recomendado: 350-500 caracteres para maior impacto na comunicação"
          initialValue={surveyData.tamanho}
          max={1000}
          onChange={(value) => setSurveyData({ ...surveyData, tamanho: value })}
        />

        <SurveySelect
          title="Touchpoints"
          description="Número de interações planejadas para esta sequência"
          icon="touchpoints"
          options={[
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
            { value: "5", label: "5" }
          ]}
          defaultValue={surveyData.touchpoints}
          onChange={(value) => setSurveyData({ ...surveyData, touchpoints: value })}
        />

        <SurveySelect
          title="Tom de voz"
          description="Tom balanceado e objetivo"
          icon="voice"
          options={[
            { value: "amigavel", label: "Amigável" },
            { value: "neutro", label: "Neutro" },
            { value: "formal", label: "Formal" },
            { value: "autoritario", label: "Autoritário" }
          ]}
          defaultValue={surveyData.tomVoz}
          onChange={(value) => setSurveyData({ ...surveyData, tomVoz: value })}
        />

        <SurveySelect
          title="Template"
          description="Destaca o valor principal oferecido ao cliente"
          icon="template"
          options={[
            { value: "proposta", label: "Proposta de Valor" },
            { value: "solucao", label: "Solução de Problema" },
            { value: "case", label: "Case de Sucesso" },
            { value: "desconto", label: "Oferta com Desconto" }
          ]}
          defaultValue={surveyData.template}
          onChange={(value) => setSurveyData({ ...surveyData, template: value })}
        />

        <SurveySelect
          title="Gatilhos"
          description="Mensagem sem gatilhos de persuasão"
          icon="triggers"
          options={[
            { value: "sem-gatilho", label: "Sem gatilho" },
            { value: "escassez", label: "Escassez" },
            { value: "urgencia", label: "Urgência" },
            { value: "social", label: "Prova Social" }
          ]}
          defaultValue={surveyData.gatilhos}
          onChange={(value) => setSurveyData({ ...surveyData, gatilhos: value })}
        />

        <Button 
          type="submit" 
          className="mt-6 bg-survey-purple hover:bg-survey-purple/90 text-white"
          disabled={isProcessing}
        >
          {isProcessing ? "Processando..." : "Continuar"}
        </Button>
      </form>

      {isProcessing && (
        <LoadingOverlay 
          processedCount={processedCount}
          totalCount={totalCount}
          isComplete={isComplete}
          onDownload={handleDownload}
          surveyId={processingId}
        />
      )}
    </>
  );
};

export default SurveyForm;
