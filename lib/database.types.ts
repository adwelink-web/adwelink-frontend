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
      conversation_states: {
        Row: {
          id: string
          phone_number: string | null
          is_ai_paused: boolean | null
          created_at: string | null
          updated_at: string | null
          institute_id: string | null
        }
        Insert: {
          id?: string
          phone_number?: string | null
          is_ai_paused?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          institute_id?: string | null
        }
        Update: {
          id?: string
          phone_number?: string | null
          is_ai_paused?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          institute_id?: string | null
        }
        Relationships: []
      },
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
          intent_detected: string | null
          lead_id: string | null
          lead_score_delta: number | null
          metadata: Json | null
          phone_number: string
          platform: string | null
          processing_time_ms: number | null
          session_id: string | null
          tokens_used: number | null
          updated_at: string | null
          user_message: string | null
          wa_message_id: string | null
        }
        Insert: {
          agent_slug?: string | null
          ai_response?: string | null
          created_at?: string | null
          id?: string
          institute_id?: string | null
          intent_detected?: string | null
          lead_id?: string | null
          lead_score_delta?: number | null
          metadata?: Json | null
          phone_number: string
          platform?: string | null
          processing_time_ms?: number | null
          session_id?: string | null
          tokens_used?: number | null
          updated_at?: string | null
          user_message?: string | null
          wa_message_id?: string | null
        }
        Update: {
          agent_slug?: string | null
          ai_response?: string | null
          created_at?: string | null
          id?: string
          institute_id?: string | null
          intent_detected?: string | null
          lead_id?: string | null
          lead_score_delta?: number | null
          metadata?: Json | null
          phone_number?: string
          platform?: string | null
          processing_time_ms?: number | null
          session_id?: string | null
          tokens_used?: number | null
          updated_at?: string | null
          user_message?: string | null
          wa_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_history_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_chat_history_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          id: string
          created_at: string | null
          full_name: string | null
          contact: string | null
          source: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          full_name?: string | null
          contact?: string | null
          source?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          full_name?: string | null
          contact?: string | null
          source?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          id: string
          created_at: string | null
          updated_at: string | null
          name: string
          total_fee: number | null
          duration_months: number | null
          mode: string | null
          registration_fee: number | null
          target_class: string | null
          institute_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          name: string
          total_fee?: number | null
          duration_months?: number | null
          mode?: string | null
          registration_fee?: number | null
          target_class?: string | null
          institute_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          name?: string
          total_fee?: number | null
          duration_months?: number | null
          mode?: string | null
          registration_fee?: number | null
          target_class?: string | null
          institute_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          }
        ]
      }
      students: {
        Row: {
          id: string
          created_at: string | null
          updated_at: string | null
          name: string | null
          phone: string | null
          email: string | null
          lead_status: string | null
          institute_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          name?: string | null
          phone?: string | null
          email?: string | null
          lead_status?: string | null
          institute_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          name?: string | null
          phone?: string | null
          email?: string | null
          lead_status?: string | null
          institute_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          }
        ]
      }
      feedback: {
        Row: {
          id: string
          created_at: string | null
          rating: number | null
          name: string | null
          email: string | null
          message: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          rating?: number | null
          name?: string | null
          email?: string | null
          message?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          rating?: number | null
          name?: string | null
          email?: string | null
          message?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      batches: {
        Row: {
          batch_name: string
          created_at: string | null
          id: string
          institute_id: string | null
          updated_at: string | null
        }
        Insert: {
          batch_name: string
          created_at?: string | null
          id?: string
          institute_id?: string | null
          updated_at?: string | null
        }
        Update: {
          batch_name?: string
          created_at?: string | null
          id?: string
          institute_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "batches_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      institute_full_profile: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          founded_year: string | null
          id: string
          institute_id: string | null
          location_address: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          founded_year?: string | null
          id?: string
          institute_id?: string | null
          location_address?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          founded_year?: string | null
          id?: string
          institute_id?: string | null
          location_address?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "institute_full_profile_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: true
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
          assigned_agent: string | null
          course_interest: string | null
          created_at: string | null
          email: string | null
          id: string
          institute_id: string | null
          last_contacted_at: string | null
          lead_score: number | null
          lead_source: string | null
          metadata: Json | null
          name: string
          next_followup_date: string | null
          notes: string | null
          phone: string
          status: string | null
          city: string | null
          current_class: string | null
          budget_range: string | null
          target_year: string | null
          parent_name: string | null
          parent_phone: string | null
          visit_date: string | null
          visit_type: string | null
          ai_notes: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_agent?: string | null
          course_interest?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          institute_id?: string | null
          last_contacted_at?: string | null
          lead_score?: number | null
          lead_source?: string | null
          metadata?: Json | null
          name: string
          next_followup_date?: string | null
          notes?: string | null
          phone: string
          status?: string | null
          city?: string | null
          current_class?: string | null
          budget_range?: string | null
          target_year?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          visit_date?: string | null
          visit_type?: string | null
          ai_notes?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_agent?: string | null
          course_interest?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          institute_id?: string | null
          last_contacted_at?: string | null
          lead_score?: number | null
          lead_source?: string | null
          metadata?: Json | null
          name?: string
          next_followup_date?: string | null
          notes?: string | null
          phone?: string
          status?: string | null
          city?: string | null
          current_class?: string | null
          budget_range?: string | null
          target_year?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          visit_date?: string | null
          visit_type?: string | null
          ai_notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          }
        ]
      }
      // Truncated other tables for brevity as they are not immediately relevant to current task
      // but keeping structure valid
    }
    Views: {
      [_ in never]: never
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

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
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
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
    Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
    Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof Database["public"]["Tables"]
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
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof Database["public"]["Tables"]
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
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof Database["public"]["Enums"]
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
