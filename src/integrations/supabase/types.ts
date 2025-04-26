export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      "Data set final": {
        Row: {
          cargo: string | null
          created_at: string
          email: string | null
          empresa: string | null
          "linkedin pessoal": string | null
          "nº de funcionários": string | null
          "primeiro nome": string | null
          setor: string | null
          website: string | null
        }
        Insert: {
          cargo?: string | null
          created_at?: string
          email?: string | null
          empresa?: string | null
          "linkedin pessoal"?: string | null
          "nº de funcionários"?: string | null
          "primeiro nome"?: string | null
          setor?: string | null
          website?: string | null
        }
        Update: {
          cargo?: string | null
          created_at?: string
          email?: string | null
          empresa?: string | null
          "linkedin pessoal"?: string | null
          "nº de funcionários"?: string | null
          "primeiro nome"?: string | null
          setor?: string | null
          website?: string | null
        }
        Relationships: []
      }
      "Data set teste": {
        Row: {
          created_at: string
          dataset: Json | null
          id: number
          "site da empresa": string | null
          "volume de prospects": number | null
        }
        Insert: {
          created_at?: string
          dataset?: Json | null
          id?: number
          "site da empresa"?: string | null
          "volume de prospects"?: number | null
        }
        Update: {
          created_at?: string
          dataset?: Json | null
          id?: number
          "site da empresa"?: string | null
          "volume de prospects"?: number | null
        }
        Relationships: []
      }
      mizi_ai_surveys: {
        Row: {
          canal: string | null
          created_at: string | null
          csv_data: Json | null
          csv_file_name: string | null
          funnel_stage: string | null
          id: string
          message_length: number | null
          persuasion_trigger: string | null
          template: string | null
          tone_of_voice: string | null
          touchpoints: string | null
          website_url: string | null
        }
        Insert: {
          canal?: string | null
          created_at?: string | null
          csv_data?: Json | null
          csv_file_name?: string | null
          funnel_stage?: string | null
          id?: string
          message_length?: number | null
          persuasion_trigger?: string | null
          template?: string | null
          tone_of_voice?: string | null
          touchpoints?: string | null
          website_url?: string | null
        }
        Update: {
          canal?: string | null
          created_at?: string | null
          csv_data?: Json | null
          csv_file_name?: string | null
          funnel_stage?: string | null
          id?: string
          message_length?: number | null
          persuasion_trigger?: string | null
          template?: string | null
          tone_of_voice?: string | null
          touchpoints?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          plan_type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          plan_type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          plan_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          id: string
          value: Json
        }
        Insert: {
          id: string
          value: Json
        }
        Update: {
          id?: string
          value?: Json
        }
        Relationships: []
      }
      Usuarios: {
        Row: {
          Cargo: number | null
          created_at: string
          Email: string | null
          Empresa: string | null
          id: number
          LGPD: boolean | null
          Nome: string | null
          Senha: string | null
          Telefone: number | null
        }
        Insert: {
          Cargo?: number | null
          created_at?: string
          Email?: string | null
          Empresa?: string | null
          id?: number
          LGPD?: boolean | null
          Nome?: string | null
          Senha?: string | null
          Telefone?: number | null
        }
        Update: {
          Cargo?: number | null
          created_at?: string
          Email?: string | null
          Empresa?: string | null
          id?: number
          LGPD?: boolean | null
          Nome?: string | null
          Senha?: string | null
          Telefone?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_webhook_enabled: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
