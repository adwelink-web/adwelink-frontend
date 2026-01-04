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
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
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
          institute_id: string | null
          intent: string | null
          metadata: Json | null
          phone_number: string
          sentiment: string | null
          session_id: string | null
          user_message: string | null
        }
        Insert: {
          agent_slug?: string | null
          ai_response?: string | null
          created_at?: string | null
          id?: string
          institute_id?: string | null
          intent?: string | null
          metadata?: Json | null
          phone_number: string
          sentiment?: string | null
          session_id?: string | null
          user_message?: string | null
        }
        Update: {
          agent_slug?: string | null
          ai_response?: string | null
          created_at?: string | null
          id?: string
          institute_id?: string | null
          intent?: string | null
          metadata?: Json | null
          phone_number?: string
          sentiment?: string | null
          session_id?: string | null
          user_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_history_institute_id_fkey"
            columns: ["institute_id"]
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      batches: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          institute_id: string
          name: string
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          institute_id: string
          name: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          institute_id?: string
          name?: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "batches_institute_id_fkey"
            columns: ["institute_id"]
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_states: {
        Row: {
          active_agent: string | null
          created_at: string | null
          institute_id: string | null
          is_ai_paused: boolean
          paused_at: string | null
          phone_number: string
          resumed_at: string | null
          updated_at: string | null
        }
        Insert: {
          active_agent?: string | null
          created_at?: string | null
          institute_id?: string | null
          is_ai_paused?: boolean
          paused_at?: string | null
          phone_number: string
          resumed_at?: string | null
          updated_at?: string | null
        }
        Update: {
          active_agent?: string | null
          created_at?: string | null
          institute_id?: string | null
          is_ai_paused?: boolean
          paused_at?: string | null
          phone_number?: string
          resumed_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_states_institute_id_fkey"
            columns: ["institute_id"]
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string | null
          duration_months: number | null
          id: string
          institute_id: string | null
          mode: string | null
          name: string
          registration_fee: number | null
          target_class: string | null
          total_fee: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration_months?: number | null
          id?: string
          institute_id?: string | null
          mode?: string | null
          name: string
          registration_fee?: number | null
          target_class?: string | null
          total_fee?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration_months?: number | null
          id?: string
          institute_id?: string | null
          mode?: string | null
          name?: string
          registration_fee?: number | null
          target_class?: string | null
          total_fee?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_institute_id_fkey"
            columns: ["institute_id"]
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_results: {
        Row: {
          created_at: string
          exam_date: string
          exam_name: string
          id: string
          marks_obtained: number
          student_id: string
          subject: string
          total_marks: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          exam_date: string
          exam_name: string
          id?: string
          marks_obtained: number
          student_id: string
          subject: string
          total_marks: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          exam_date?: string
          exam_name?: string
          id?: string
          marks_obtained?: number
          student_id?: string
          subject?: string
          total_marks?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_results_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_adjustments: {
        Row: {
          adjustment_type: string
          amount: number
          created_at: string
          description: string | null
          id: string
          institute_id: string
          student_id: string
          updated_at: string
        }
        Insert: {
          adjustment_type: string
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          institute_id: string
          student_id: string
          updated_at?: string
        }
        Update: {
          adjustment_type?: string
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          institute_id?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_adjustments_institute_id_fkey"
            columns: ["institute_id"]
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_adjustments_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_invoices: {
        Row: {
          amount_due: number
          created_at: string
          description: string | null
          due_date: string
          id: string
          institute_id: string
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          amount_due: number
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          institute_id: string
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          amount_due?: number
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          institute_id?: string
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_invoices_institute_id_fkey"
            columns: ["institute_id"]
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_invoices_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_payments: {
        Row: {
          amount_paid: number
          created_at: string
          id: string
          institute_id: string
          invoice_id: string | null
          payment_date: string
          payment_method: string
          reference_number: string | null
          student_id: string
          updated_at: string
        }
        Insert: {
          amount_paid: number
          created_at?: string
          id?: string
          institute_id: string
          invoice_id?: string | null
          payment_date: string
          payment_method: string
          reference_number?: string | null
          student_id: string
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          created_at?: string
          id?: string
          institute_id?: string
          invoice_id?: string | null
          payment_date?: string
          payment_method?: string
          reference_number?: string | null
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_payments_institute_id_fkey"
            columns: ["institute_id"]
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            referencedRelation: "fee_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_payments_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      institute_agent_config: {
        Row: {
          agent_slug: string
          created_at: string | null
          id: string
          institute_id: string
          is_active: boolean
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          agent_slug: string
          created_at?: string | null
          id?: string
          institute_id: string
          is_active?: boolean
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          agent_slug?: string
          created_at?: string | null
          id?: string
          institute_id?: string
          is_active?: boolean
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "institute_agent_config_institute_id_fkey"
            columns: ["institute_id"]
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      institute_agent_overrides: {
        Row: {
          agent_slug: string
          behavior_rules: Json | null
          created_at: string | null
          id: string
          institute_id: string
          updated_at: string | null
        }
        Insert: {
          agent_slug: string
          behavior_rules?: Json | null
          created_at?: string | null
          id?: string
          institute_id: string
          updated_at?: string | null
        }
        Update: {
          agent_slug?: string
          behavior_rules?: Json | null
          created_at?: string | null
          id?: string
          institute_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "institute_agent_overrides_institute_id_fkey"
            columns: ["institute_id"]
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      institutes: {
        Row: {
          access_token: string | null
          address: string | null
          city: string | null
          created_at: string | null
          google_map_link: string | null
          helpline_number: string | null
          id: string
          name: string
          phone_id: string | null
          subscription_status: string | null
          updated_at: string | null
        }
        Insert: {
          access_token?: string | null
          address?: string | null
          city?: string | null
          created_at?: string | null
          google_map_link?: string | null
          helpline_number?: string | null
          id?: string
          name: string
          phone_id?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Update: {
          access_token?: string | null
          address?: string | null
          city?: string | null
          created_at?: string | null
          google_map_link?: string | null
          helpline_number?: string | null
          id?: string
          name?: string
          phone_id?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      knowledge_base: {
        Row: {
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          institute_id: string | null
          metadata: Json | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          institute_id?: string | null
          metadata?: Json | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          institute_id?: string | null
          metadata?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_base_institute_id_fkey"
            columns: ["institute_id"]
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          ai_notes: string | null
          budget_range: string | null
          city: string | null
          created_at: string | null
          current_class: string | null
          id: string
          institute_id: string | null
          interested_course: string | null
          lead_score: number | null
          name: string | null
          next_followup: string | null
          parent_name: string | null
          parent_phone: string | null
          phone: string
          preferred_mode: string | null
          source: string | null
          status: string | null
          target_year: string | null
          updated_at: string | null
          visit_date: string | null
          visit_type: string | null
        }
        Insert: {
          ai_notes?: string | null
          budget_range?: string | null
          city?: string | null
          created_at?: string | null
          current_class?: string | null
          id?: string
          institute_id?: string | null
          interested_course?: string | null
          lead_score?: number | null
          name?: string | null
          next_followup?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          phone: string
          preferred_mode?: string | null
          source?: string | null
          status?: string | null
          target_year?: string | null
          updated_at?: string | null
          visit_date?: string | null
          visit_type?: string | null
        }
        Update: {
          ai_notes?: string | null
          budget_range?: string | null
          city?: string | null
          created_at?: string | null
          current_class?: string | null
          id?: string
          institute_id?: string | null
          interested_course?: string | null
          lead_score?: number | null
          name?: string | null
          next_followup?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          phone?: string
          preferred_mode?: string | null
          source?: string | null
          status?: string | null
          target_year?: string | null
          updated_at?: string | null
          visit_date?: string | null
          visit_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_institute_id_fkey"
            columns: ["institute_id"]
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_directory: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          institute_id: string | null
          phone_number: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          institute_id?: string | null
          phone_number: string
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          institute_id?: string | null
          phone_number?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "phone_directory_institute_id_fkey"
            columns: ["institute_id"]
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_members: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          institute_id: string | null
          name: string
          permissions: Json | null
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          institute_id?: string | null
          name: string
          permissions?: Json | null
          phone?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          institute_id?: string | null
          name?: string
          permissions?: Json | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_members_institute_id_fkey"
            columns: ["institute_id"]
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          batch_id: string | null
          created_at: string
          id: string
          institute_id: string
          lead_status: string | null
          name: string
          phone: string | null
          profile_metadata: Json | null
          updated_at: string
        }
        Insert: {
          batch_id?: string | null
          created_at?: string
          id?: string
          institute_id: string
          lead_status?: string | null
          name: string
          phone?: string | null
          profile_metadata?: Json | null
          updated_at?: string
        }
        Update: {
          batch_id?: string | null
          created_at?: string
          id?: string
          institute_id?: string
          lead_status?: string | null
          name?: string
          phone?: string | null
          profile_metadata?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_batch_id_fkey"
            columns: ["batch_id"]
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_institute_id_fkey"
            columns: ["institute_id"]
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      agent_runtime_brain: {
        Row: {
          agent_slug: string | null
          behavior_rules: Json | null
          conversation_flow: string | null
          expert_playbook: string | null
          identity_prompt: string | null
          institute_id: string | null
          is_active: boolean | null
          psychology_rules: string | null
          safety_protocols: string | null
          tools_config: string | null
        }
        Relationships: [
          {
            foreignKeyName: "institute_agent_config_institute_id_fkey"
            columns: ["institute_id"]
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      institute_full_profile: {
        Row: {
          access_token: string | null
          active_agents: Json | null
          institute_id: string | null
          institute_name: string | null
          registered_phone: string | null
        }
        Relationships: []
      }
      student_full_profile: {
        Row: {
          batch_name: string | null
          course_name: string | null
          fee_due: number | null
          institute_id: string | null
          lead_status: string | null
          parent_name: string | null
          phone: string | null
          student_id: string | null
          student_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_institute_id_fkey"
            columns: ["institute_id"]
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      v_nurture_queue: {
        Row: {
          ai_notes: string | null
          city: string | null
          current_class: string | null
          institute_name: string | null
          interested_course: string | null
          is_24h_window_open: boolean | null
          lead_id: string | null
          name: string | null
          next_followup: string | null
          phone: string | null
          status: string | null
        }
        Relationships: []
      }
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
      process_incoming_message: {
        Args: {
          p_phone_number: string
          p_message_body: string
          p_institute_id: string
        }
        Returns: Json
      }
      update_lead_status: {
        Args: {
          p_lead_id: string
          p_status: string
          p_ai_notes: string
        }
        Returns: undefined
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
  | { schema: Exclude<keyof Database, "__InternalSupabase"> },
  TableName extends PublicTableNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = PublicTableNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
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
  | { schema: Exclude<keyof Database, "__InternalSupabase"> },
  TableName extends PublicTableNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
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
  | { schema: Exclude<keyof Database, "__InternalSupabase"> },
  TableName extends PublicTableNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
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
  | { schema: Exclude<keyof Database, "__InternalSupabase"> },
  EnumName extends PublicEnumNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
  ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = PublicEnumNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof PublicSchema["CompositeTypes"]
  | { schema: Exclude<keyof Database, "__InternalSupabase"> },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: Exclude<keyof Database, "__InternalSupabase">
  }
  ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
