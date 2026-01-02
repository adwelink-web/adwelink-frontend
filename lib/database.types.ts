export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  public: {
    Tables: {
      agents: {
        Row: {
          behavior_rules: Json | null
          conversation_flow: string | null
          created_at: string | null
          expert_playbook: string | null
          id: string
          identity_prompt: string | null
          is_active: boolean | null
          psychology_rules: string | null
          safety_protocols: string | null
          slug: string
          tools_config: string | null
          updated_at: string | null
        }
        Insert: {
          behavior_rules?: Json | null
          conversation_flow?: string | null
          created_at?: string | null
          expert_playbook?: string | null
          id?: string
          identity_prompt?: string | null
          is_active?: boolean | null
          psychology_rules?: string | null
          safety_protocols?: string | null
          slug: string
          tools_config?: string | null
          updated_at?: string | null
        }
        Update: {
          behavior_rules?: Json | null
          conversation_flow?: string | null
          created_at?: string | null
          expert_playbook?: string | null
          id?: string
          identity_prompt?: string | null
          is_active?: boolean | null
          psychology_rules?: string | null
          safety_protocols?: string | null
          slug?: string
          tools_config?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_chat_history: {
        Row: {
          agent_slug: string | null
          ai_response: string | null
          created_at: string | null
          id: string
          lead_phone: string
          metadata: Json | null
          session_id: string | null
          user_message: string | null
        }
        Insert: {
          agent_slug?: string | null
          ai_response?: string | null
          created_at?: string | null
          id?: string
          lead_phone: string
          metadata?: Json | null
          session_id?: string | null
          user_message?: string | null
        }
        Update: {
          agent_slug?: string | null
          ai_response?: string | null
          created_at?: string | null
          id?: string
          lead_phone?: string
          metadata?: Json | null
          session_id?: string | null
          user_message?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          assigned_agent_slug: string | null
          conversion_probability: number | null
          created_at: string | null
          email: string | null
          id: string
          interest_area: string | null
          last_contact_at: string | null
          metadata: Json | null
          name: string | null
          next_follow_up: string | null
          phone: string
          sentiment_score: number | null
          status: string | null
          tags: string[] | null
        }
        Insert: {
          assigned_agent_slug?: string | null
          conversion_probability?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          interest_area?: string | null
          last_contact_at?: string | null
          metadata?: Json | null
          name?: string | null
          next_follow_up?: string | null
          phone: string
          sentiment_score?: number | null
          status?: string | null
          tags?: string[] | null
        }
        Update: {
          assigned_agent_slug?: string | null
          conversion_probability?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          interest_area?: string | null
          last_contact_at?: string | null
          metadata?: Json | null
          name?: string | null
          next_follow_up?: string | null
          phone?: string
          sentiment_score?: number | null
          status?: string | null
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_agent_slug_fkey"
            columns: ["assigned_agent_slug"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["slug"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_documents: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: string
          content: string
          metadata: Json
          similarity: number
        }[]
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

type PublicSchema = Database[Extract<Exclude<keyof Database, '__InternalSupabase'>, "public">]

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
    PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
    PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof PublicSchema["Enums"]
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof PublicSchema["CompositeTypes"]
  | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never
