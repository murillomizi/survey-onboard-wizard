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
  gatilhos?: string;
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
      // Usamos a edge function para verificação consistente
      const { data, error } = await supabase.functions.invoke('checkProgress', {
        body: {
          surveyId: surveyId,
          fetchData: false
        }
      });
      
      if (error) {
        console.error('Error checking processing completion:', error);
        return false;
      }
      
      return data.isComplete || false;
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
      // Esta função foi substituída pela chamada direta à edge function
      // Mantida para compatibilidade com código existente
      const { data, error } = await supabase.functions.invoke('checkProgress', {
        body: {
          surveyId: surveyId,
          fetchData: fetchData
        }
      });
      
      if (error) throw error;
      
      return {
        totalCount: data.total || 0,
        processedCount: data.count || 0,
        isComplete: data.isComplete || false,
        data: data.processedData
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
