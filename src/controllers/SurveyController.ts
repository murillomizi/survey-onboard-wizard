import { toast } from "@/components/ui/use-toast";
import { SurveyModel, SurveyData, ProcessingStatus } from "@/models/SurveyModel";
import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";

export interface SurveyFormState {
  canal: string;
  csvFile: File | null;
  csvFileName: string;
  websiteUrl: string;
  tamanho: number;
  touchpoints: string;
  tomVoz: string;
  template: string;
  gatilhos: string;
  funnelStage: string;
}

/**
 * Controlador para gerenciamento de enquetes e conversão de dados
 */
export class SurveyController {
  // Cache de verificações de status
  private static statusCache: Record<string, {timestamp: number, data: ProcessingStatus}> = {};
  
  /**
   * Obtém o histórico de chats/enquetes
   * @returns Lista de enquetes formatada
   */
  static async getChatHistory() {
    try {
      const surveys = await SurveyModel.getChatHistory();
      
      // Garantir que todas as entradas tenham a propriedade isComplete
      return surveys.map(survey => ({
        id: survey.id,
        created_at: survey.created_at,
        title: `${survey.canal || 'Chat'} - ${new Date(survey.created_at).toLocaleDateString()}`,
        description: survey.csv_file_name || 'Sem arquivo',
        canal: survey.canal,
        websiteUrl: survey.website_url,
        csvRowCount: Array.isArray(survey.csv_data) ? survey.csv_data.length : 0,
        isComplete: false // Adicionando a propriedade isComplete com valor padrão
      }));
    } catch (error) {
      console.error("Error in getChatHistory:", error);
      return [];
    }
  }

  /**
   * Verifica o progresso do processamento
   * @param surveyId ID da enquete
   * @param fetchData Se deve trazer os dados processados
   * @param bypassCache Se deve ignorar o cache de status
   * @returns Status do processamento
   */
  static async checkProgress(
    surveyId: string, 
    fetchData: boolean = false,
    bypassCache: boolean = false
  ): Promise<ProcessingStatus> {
    try {
      console.log(`Checking progress for ID: ${surveyId}, fetchData: ${fetchData}, bypassCache: ${bypassCache}`);
      
      // Verificar cache (válido por 10 segundos)
      const now = Date.now();
      const cachedResult = this.statusCache[surveyId];
      const isCacheValid = cachedResult && (now - cachedResult.timestamp < 10000) && !bypassCache && !fetchData;
      
      if (isCacheValid) {
        console.log("Using cached status result");
        return cachedResult.data;
      }
      
      // Chama a edge function para verificar o progresso
      const { data, error } = await supabase.functions.invoke('checkProgress', {
        body: {
          surveyId: surveyId,
          fetchData: fetchData
        }
      });
      
      if (error) {
        console.error("Error calling checkProgress:", error);
        throw error;
      }
      
      console.log("checkProgress response:", data);
      
      // Criar objeto de resposta
      const result: ProcessingStatus = {
        totalCount: data.total || 0,
        processedCount: data.count || 0,
        isComplete: data.isComplete || false,
        data: data.processedData
      };
      
      // Atualizar cache
      this.statusCache[surveyId] = {
        timestamp: now,
        data: result
      };
      
      return result;
    } catch (error) {
      console.error("Error in checkProgress:", error);
      
      // Resposta de fallback em caso de erro
      return {
        totalCount: 0,
        processedCount: 0,
        isComplete: false
      };
    }
  }

  /**
   * Obtém detalhes completos de uma enquete
   * @param surveyId ID da enquete
   * @returns Dados da enquete formatados para o frontend
   */
  static async getSurveyDetails(surveyId: string) {
    try {
      const survey = await SurveyModel.getSurveyById(surveyId);
      if (!survey) return null;
      
      console.log("Got survey details:", survey);
      
      // Convertendo para o formato usado no frontend
      const formattedSurvey: SurveyFormState = {
        canal: survey.canal || 'linkedin',
        csvFile: null,
        csvFileName: survey.csv_file_name || '',
        websiteUrl: survey.website_url || '',
        tamanho: survey.message_length || 350,
        touchpoints: survey.funnel_stage || '3',
        tomVoz: survey.tone_of_voice || 'neutro',
        template: survey.template || 'proposta',
        gatilhos: survey.persuasion_trigger || 'sem-gatilho',
        funnelStage: survey.funnel_stage || 'topo'
      };
      
      // Obter status de processamento via edge function com bypass de cache para dados mais recentes
      const status = await this.checkProgress(surveyId, false, true);
      console.log("Survey processing status:", status);
      
      return {
        surveyData: formattedSurvey,
        processingStatus: status,
        originalData: survey,
        id: surveyId,
        parsedCsvData: Array.isArray(survey.csv_data) ? survey.csv_data : []
      };
    } catch (error) {
      console.error("Error in getSurveyDetails:", error);
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar os dados da enquete.",
        variant: "destructive"
      });
      return null;
    }
  }

  /**
   * Cria uma nova enquete
   * @param surveyData Dados do formulário
   * @param parsedCsvData Dados CSV processados
   * @returns ID da enquete criada ou null em caso de erro
   */
  static async createSurvey(formData: SurveyFormState, parsedCsvData: any[]): Promise<string | null> {
    try {
      // Converter dados do formulário para o formato do modelo
      const surveyData: SurveyData = {
        canal: formData.canal,
        touchpoints: formData.touchpoints,
        funnel_stage: formData.funnelStage,
        website_url: formData.websiteUrl,
        message_length: formData.tamanho,
        tone_of_voice: formData.tomVoz,
        persuasion_trigger: formData.gatilhos,
        template: formData.template,
        csv_data: parsedCsvData,
        csv_file_name: formData.csvFileName
      };
      
      const result = await SurveyModel.createSurvey(surveyData);
      
      if (result) {
        toast({
          title: "Processamento iniciado",
          description: "Suas configurações foram salvas e o processamento foi iniciado."
        });
        return result.id;
      }
      
      return null;
    } catch (error) {
      console.error('Error in createSurvey:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas configurações.",
        variant: "destructive"
      });
      return null;
    }
  }

  /**
   * Gera arquivo CSV para download
   * @param surveyId ID da enquete
   * @returns Boolean indicando sucesso da operação
   */
  static async downloadProcessedData(surveyId: string): Promise<boolean> {
    try {
      console.log(`Iniciando download para ID: ${surveyId}`);
      
      // Verificar se o processamento está completo usando a edge function com bypass de cache
      const status = await this.checkProgress(surveyId, true, true);
      console.log("Download check status:", status);
      
      if (!status.isComplete) {
        toast({
          title: "Processamento incompleto",
          description: "Aguarde o processamento ser concluído antes de baixar os dados.",
          variant: "destructive"
        });
        return false;
      }
      
      // Obter os dados processados
      const processedData = status.data || await SurveyModel.getProcessedDataForDownload(surveyId);
      console.log(`Dados para download obtidos: ${processedData?.length} registros`);
      
      if (!processedData || processedData.length === 0) {
        toast({
          title: "Sem dados",
          description: "Não há dados processados para download.",
          variant: "destructive"
        });
        return false;
      }
      
      // Converter para CSV
      const csv = Papa.unparse(processedData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      
      // Criar link de download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `campanha_personalizada_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download iniciado",
        description: "Sua campanha personalizada está sendo baixada."
      });
      
      return true;
    } catch (error) {
      console.error("Error in downloadProcessedData:", error);
      toast({
        title: "Erro ao baixar",
        description: "Ocorreu um erro ao tentar baixar o arquivo.",
        variant: "destructive"
      });
      return false;
    }
  }

  /**
   * Processa um arquivo CSV
   * @param file Arquivo CSV
   * @returns Promise com os dados processados e total de linhas
   */
  static processCSVFile(file: File): Promise<{ data: any[], totalCount: number }> {
    return new Promise((resolve, reject) => {
      if (file.type !== "text/csv") {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione um arquivo CSV.",
          variant: "destructive"
        });
        reject(new Error("Formato de arquivo inválido"));
        return;
      }
      
      Papa.parse(file, {
        complete: (results) => {
          if (results.data && Array.isArray(results.data)) {
            const filteredData = results.data.filter(row => 
              row && typeof row === 'object' && Object.keys(row).length > 0
            );
            
            if (filteredData.length > 0) {
              resolve({
                data: filteredData,
                totalCount: filteredData.length
              });
            } else {
              toast({
                title: "Arquivo vazio",
                description: "O arquivo CSV não contém dados válidos.",
                variant: "destructive"
              });
              reject(new Error("Arquivo sem dados válidos"));
            }
          } else {
            reject(new Error("Formato de arquivo inválido"));
          }
        },
        header: true,
        skipEmptyLines: true,
        error: (error) => {
          console.error('Error parsing CSV:', error);
          toast({
            title: "Erro ao processar arquivo",
            description: "Não foi possível ler o arquivo CSV. Verifique se o formato está correto.",
            variant: "destructive"
          });
          reject(error);
        }
      });
    });
  }
}
