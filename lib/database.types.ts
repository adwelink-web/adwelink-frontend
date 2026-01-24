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
      activity_log: {
        Row: {
          action: string
          actor_email: string | null
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
        }
        Relationships: []
      }
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
          conversation_id: string | null
          created_at: string | null
          id: string
          input_tokens: number | null
          institute_id: string | null
          is_from_user: boolean | null
          lead_phone: string | null
          message_text: string | null
          model_used: string | null
          output_tokens: number | null
          raw_response: Json | null
          sentiment: string | null
          intent: string | null
          lead_score: number | null
          admission_chances: number | null
          is_flagged: boolean | null
          ai_notes: string | null
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          input_tokens?: number | null
          institute_id?: string | null
          is_from_user?: boolean | null
          lead_phone?: string | null
          message_text?: string | null
          model_used?: string | null
          output_tokens?: number | null
          raw_response?: Json | null
        }
        Update: {
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          input_tokens?: number | null
          institute_id?: string | null
          is_from_user?: boolean | null
          lead_phone?: string | null
          message_text?: string | null
          model_used?: string | null
          output_tokens?: number | null
          raw_response?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_history_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institute_full_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_chat_history_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          created_at: string | null
          id: string
          institute_id: string | null
          is_read: boolean | null
          is_resolved: boolean | null
          message: string | null
          severity: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          institute_id?: string | null
          is_read?: boolean | null
          is_resolved?: boolean | null
          message?: string | null
          severity?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          institute_id?: string | null
          is_read?: boolean | null
          is_resolved?: boolean | null
          message?: string | null
          severity?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institute_full_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      batches: {
        Row: {
          course_id: string | null
          created_at: string | null
          end_time: string | null
          id: string
          institute_id: string | null
          name: string
          start_time: string | null
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          end_time?: string | null
          id?: string
          institute_id?: string | null
          name: string
          start_time?: string | null
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          end_time?: string | null
          id?: string
          institute_id?: string | null
          name?: string
          start_time?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "batches_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batches_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institute_full_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batches_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_states: {
        Row: {
          created_at: string | null
          id: string
          institute_id: string | null
          is_ai_paused: boolean | null
          phone_number: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          institute_id?: string | null
          is_ai_paused?: boolean | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          institute_id?: string | null
          is_ai_paused?: boolean | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_states_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institute_full_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_states_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
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
            isOneToOne: false
            referencedRelation: "institute_full_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          message: string | null
          name: string | null
          rating: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          message?: string | null
          name?: string | null
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          message?: string | null
          name?: string | null
          rating?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      institute_agent_overrides: {
        Row: {
          agent_id: string
          behavior_rules: Json | null
          conversation_flow: string | null
          created_at: string | null
          expert_playbook: string | null
          identity_prompt: string | null
          institute_id: string
          psychology_rules: string | null
          safety_protocols: string | null
          tools_config: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          behavior_rules?: Json | null
          conversation_flow?: string | null
          created_at?: string | null
          expert_playbook?: string | null
          identity_prompt?: string | null
          institute_id: string
          psychology_rules?: string | null
          safety_protocols?: string | null
          tools_config?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          behavior_rules?: Json | null
          conversation_flow?: string | null
          created_at?: string | null
          expert_playbook?: string | null
          identity_prompt?: string | null
          institute_id?: string
          psychology_rules?: string | null
          safety_protocols?: string | null
          tools_config?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "institute_agent_overrides_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "institute_agent_overrides_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institute_full_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "institute_agent_overrides_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
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
          current_plan: Database["public"]["Enums"]["plan_type"] | null
          google_map_link: string | null
          helpline_number: string | null
          id: string
          message_limit: number | null
          messages_used: number | null
          name: string
          owner_id: string | null
          phone_id: string | null
          subscription_status: string | null
          updated_at: string | null
        }
        Insert: {
          access_token?: string | null
          address?: string | null
          city?: string | null
          created_at?: string | null
          current_plan?: Database["public"]["Enums"]["plan_type"] | null
          google_map_link?: string | null
          helpline_number?: string | null
          id?: string
          message_limit?: number | null
          messages_used?: number | null
          name: string
          owner_id?: string | null
          phone_id?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Update: {
          access_token?: string | null
          address?: string | null
          city?: string | null
          created_at?: string | null
          current_plan?: Database["public"]["Enums"]["plan_type"] | null
          google_map_link?: string | null
          helpline_number?: string | null
          id?: string
          message_limit?: number | null
          messages_used?: number | null
          name?: string
          owner_id?: string | null
          phone_id?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          ai_notes: string | null
          budget_range: string | null
          city: string | null
          created_at: string | null
          current_class: string | null
          id: string
          institute_id: string
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
          institute_id: string
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
          institute_id?: string
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
            isOneToOne: false
            referencedRelation: "institute_full_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          institute_id: string | null
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          institute_id?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          institute_id?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institute_full_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          batch_id: string | null
          course_id: string | null
          created_at: string | null
          email: string | null
          enrollment_date: string | null
          id: string
          institute_id: string | null
          name: string
          phone: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          batch_id?: string | null
          course_id?: string | null
          created_at?: string | null
          email?: string | null
          enrollment_date?: string | null
          id?: string
          institute_id?: string | null
          name: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          batch_id?: string | null
          course_id?: string | null
          created_at?: string | null
          email?: string | null
          enrollment_date?: string | null
          id?: string
          institute_id?: string | null
          name?: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institute_full_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          institute_id: string | null
          priority: string | null
          resolved_at: string | null
          status: string | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          institute_id?: string | null
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          institute_id?: string | null
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institute_full_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          contact: string
          created_at: string
          full_name: string
          id: string
          source: string | null
        }
        Insert: {
          contact: string
          created_at?: string
          full_name: string
          id?: string
          source?: string | null
        }
        Update: {
          contact?: string
          created_at?: string
          full_name?: string
          id?: string
          source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      institute_full_profile: {
        Row: {
          access_token: string | null
          address: string | null
          city: string | null
          created_at: string | null
          current_plan: Database["public"]["Enums"]["plan_type"] | null
          google_map_link: string | null
          helpline_number: string | null
          id: string | null
          message_limit: number | null
          messages_used: number | null
          name: string | null
          owner_email: string | null
          owner_id: string | null
          phone_id: string | null
          subscription_status: string | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      plan_type: "trial" | "starter" | "growth" | "domination"
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
    Enums: {
      plan_type: ["trial", "starter", "growth", "domination"],
    },
  },
} as const
