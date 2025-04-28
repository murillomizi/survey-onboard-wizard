
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface SurveyData {
  id?: string;
  created_at?: string;
  canal: string;
  funnel_stage?: string;
  touchpoints?: string;
  website_url?: string;
  message_length?: number;
  tone_of_voice?: string;
  persuasion_trigger?: string;
  template?: string;
  csv_data?: any[];
  csv_file_name?: string;
  gatilhos?: string; // Adicionando a propriedade gatilhos que faltava
}

export interface ProcessingStatus {
  totalCount: number;
  processedCount: number;
  isComplete: boolean;
  data?: any[];
}

/**
 * Modelo para operações relacionadas a enquetes e processamento de dados
 */
export class SurveyModel {
  /**
   * Obtém o histórico de chats/enquetes
   * @returns Lista de enquetes com timestamp
   */
  static async getChatHistory() {
    try {
      const { data, error } = await supabase
        .from('mizi_ai_surveys')
        .select('id, created_at, canal, funnel_stage, website_url, csv_file_name, csv_data')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error("Error fetching chat history:", error);
      toast({
        title: "Erro ao carregar histórico",
        description: "Não foi possível carregar o histórico de chats.",
        variant: "destructive"
      });
      return [];
    }
  }

  /**
   * Verifica se todo o processamento foi concluído
   * @param surveyId ID da enquete
   * @returns Booleano indicando se o processamento está concluído
   */
  static async isProcessingComplete(surveyId: string): Promise<boolean> {
    try {
      // Obter total de linhas no CSV original
      const { data: surveyData, error: surveyError } = await supabase
        .from('mizi_ai_surveys')
        .select('csv_data')
        .eq('id', surveyId)
        .single();
      
      if (surveyError) throw surveyError;
      
      // Calcular número total de linhas no CSV
      const totalRows = Array.isArray(surveyData?.csv_data) ? surveyData.csv_data.length : 0;
      
      if (totalRows === 0) return true; // Se não há linhas, está completo por definição
      
      // Contar linhas processadas
      const { count, error: countError } = await supabase
        .from('mizi_ai_personalized_return')
        .select('id', { count: 'exact', head: true })
        .eq('mizi_ai_id', surveyId);
      
      if (countError) throw countError;
      
      // Verificar se todas as linhas foram processadas
      return count === totalRows;
    } catch (error) {
      console.error("Error checking processing completion:", error);
      return false;
    }
  }

  /**
   * Obtém o status de processamento
   * @param surveyId ID da enquete
   * @param fetchData Se deve retornar também os dados processados
   * @returns Status do processamento
   */
  static async getProcessingStatus(surveyId: string, fetchData: boolean = false): Promise<ProcessingStatus> {
    try {
      // Obter total de linhas do CSV
      const { data: surveyData, error: surveyError } = await supabase
        .from('mizi_ai_surveys')
        .select('csv_data')
        .eq('id', surveyId)
        .single();
      
      if (surveyError) throw surveyError;
      
      const totalCount = Array.isArray(surveyData?.csv_data) ? surveyData.csv_data.length : 0;
      
      // Obter contagem de itens processados
      const { count: processedCount, error: countError } = await supabase
        .from('mizi_ai_personalized_return')
        .select('id', { count: 'exact', head: true })
        .eq('mizi_ai_id', surveyId);
      
      if (countError) throw countError;
      
      // Verificar se está completo
      const isComplete = totalCount > 0 && processedCount >= totalCount;
      
      // Se precisa retornar os dados processados
      let data = undefined;
      if (fetchData && isComplete) {
        const { data: processedData, error: dataError } = await supabase
          .from('mizi_ai_personalized_return')
          .select('*')
          .eq('mizi_ai_id', surveyId);
        
        if (dataError) throw dataError;
        data = processedData;
      }
      
      return {
        totalCount,
        processedCount: processedCount || 0,
        isComplete,
        data
      };
    } catch (error) {
      console.error("Error getting processing status:", error);
      return {
        totalCount: 0,
        processedCount: 0,
        isComplete: false
      };
    }
  }

  /**
   * Cria uma nova enquete/chat
   * @param surveyData Dados da enquete
   * @returns Dados da enquete salva ou null se ocorrer erro
   */
  static async createSurvey(surveyData: SurveyData) {
    try {
      const { data, error } = await supabase
        .from('mizi_ai_surveys')
        .insert([{
          canal: surveyData.canal,
          funnel_stage: surveyData.touchpoints || surveyData.funnel_stage,
          website_url: surveyData.website_url,
          message_length: surveyData.message_length,
          tone_of_voice: surveyData.tone_of_voice,
          persuasion_trigger: surveyData.persuasion_trigger || surveyData.gatilhos,
          template: surveyData.template,
          csv_data: surveyData.csv_data,
          csv_file_name: surveyData.csv_file_name
        }])
        .select();

      if (error) throw error;
      
      return data?.[0] || null;
    } catch (error) {
      console.error("Error creating survey:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os dados da enquete.",
        variant: "destructive"
      });
      return null;
    }
  }

  /**
   * Obtém uma enquete pelo ID
   * @param surveyId ID da enquete
   * @returns Dados da enquete ou null se não encontrada
   */
  static async getSurveyById(surveyId: string) {
    try {
      const { data, error } = await supabase
        .from('mizi_ai_surveys')
        .select('*')
        .eq('id', surveyId)
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error("Error fetching survey:", error);
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar os dados da enquete.",
        variant: "destructive"
      });
      return null;
    }
  }

  /**
   * Obtém dados processados para download
   * @param surveyId ID da enquete
   * @returns Dados processados para gerar CSV ou null se ocorrer erro
   */
  static async getProcessedDataForDownload(surveyId: string) {
    try {
      const { data, error } = await supabase
        .from('mizi_ai_personalized_return')
        .select('*')
        .eq('mizi_ai_id', surveyId);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error("Error fetching processed data:", error);
      toast({
        title: "Erro ao baixar dados",
        description: "Não foi possível obter os dados processados para download.",
        variant: "destructive"
      });
      return [];
    }
  }
}
