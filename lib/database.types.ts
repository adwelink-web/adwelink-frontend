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
                    admission_chances: number | null
                    agent_slug: string | null
                    ai_response: string | null
                    created_at: string | null
                    id: string
                    institute_id: string | null
                    intent: string | null
                    is_flagged: boolean | null
                    message_meta: Json | null
                    phone_number: string | null
                    role: string | null
                    sentiment: string | null
                    session_id: string | null
                    status: string | null
                    user_message: string | null
                    whatsapp_message_id: string | null
                }
                Insert: {
                    admission_chances?: number | null
                    agent_slug?: string | null
                    ai_response?: string | null
                    created_at?: string | null
                    id?: string
                    institute_id?: string | null
                    intent?: string | null
                    is_flagged?: boolean | null
                    message_meta?: Json | null
                    phone_number?: string | null
                    role?: string | null
                    sentiment?: string | null
                    session_id?: string | null
                    status?: string | null
                    user_message?: string | null
                    whatsapp_message_id?: string | null
                }
                Update: {
                    admission_chances?: number | null
                    agent_slug?: string | null
                    ai_response?: string | null
                    created_at?: string | null
                    id?: string
                    institute_id?: string | null
                    intent?: string | null
                    is_flagged?: boolean | null
                    message_meta?: Json | null
                    phone_number?: string | null
                    role?: string | null
                    sentiment?: string | null
                    session_id?: string | null
                    status?: string | null
                    user_message?: string | null
                    whatsapp_message_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "ai_chat_history_institute_id_fkey"
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
                    current_plan: string | null
                    director_name: string | null
                    email: string | null
                    google_map_link: string | null
                    helpline_number: string | null
                    id: string
                    lead_limit: number | null
                    leads_used: number | null
                    logo: string | null
                    message_limit: number | null
                    messages_used: number | null
                    name: string
                    owner_id: string | null
                    phone_id: string | null
                    subscription_status: string | null
                    updated_at: string | null
                    website: string | null
                }
                Insert: {
                    access_token?: string | null
                    address?: string | null
                    city?: string | null
                    created_at?: string | null
                    current_plan?: string | null
                    director_name?: string | null
                    email?: string | null
                    google_map_link?: string | null
                    helpline_number?: string | null
                    id?: string
                    lead_limit?: number | null
                    leads_used?: number | null
                    logo?: string | null
                    message_limit?: number | null
                    messages_used?: number | null
                    name: string
                    owner_id?: string | null
                    phone_id?: string | null
                    subscription_status?: string | null
                    updated_at?: string | null
                    website?: string | null
                }
                Update: {
                    access_token?: string | null
                    address?: string | null
                    city?: string | null
                    created_at?: string | null
                    current_plan?: string | null
                    director_name?: string | null
                    email?: string | null
                    google_map_link?: string | null
                    helpline_number?: string | null
                    id?: string
                    lead_limit?: number | null
                    leads_used?: number | null
                    logo?: string | null
                    message_limit?: number | null
                    messages_used?: number | null
                    name?: string
                    owner_id?: string | null
                    phone_id?: string | null
                    subscription_status?: string | null
                    updated_at?: string | null
                    website?: string | null
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
                    institute_id: string | null
                    interested_course: string | null
                    name: string | null
                    next_followup: string | null
                    parent_name: string | null
                    parent_phone: string | null
                    phone: string | null
                    preferred_mode: string | null
                    source: string | null
                    status: string | null
                    tags: string[] | null
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
                    name?: string | null
                    next_followup?: string | null
                    parent_name?: string | null
                    parent_phone?: string | null
                    phone?: string | null
                    preferred_mode?: string | null
                    source?: string | null
                    status?: string | null
                    tags?: string[] | null
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
                    name?: string | null
                    next_followup?: string | null
                    parent_name?: string | null
                    parent_phone?: string | null
                    phone?: string | null
                    preferred_mode?: string | null
                    source?: string | null
                    status?: string | null
                    tags?: string[] | null
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
                        referencedRelation: "institutes"
                        referencedColumns: ["id"]
                    },
                ]
            }
            payments: {
                Row: {
                    amount: number | null
                    created_at: string | null
                    id: string
                    institute_id: string | null
                    payment_date: string | null
                    payment_method: string | null
                    status: string | null
                    transaction_id: string | null
                }
                Insert: {
                    amount?: number | null
                    created_at?: string | null
                    id?: string
                    institute_id?: string | null
                    payment_date?: string | null
                    payment_method?: string | null
                    status?: string | null
                    transaction_id?: string | null
                }
                Update: {
                    amount?: number | null
                    created_at?: string | null
                    id?: string
                    institute_id?: string | null
                    payment_date?: string | null
                    payment_method?: string | null
                    status?: string | null
                    transaction_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "payments_institute_id_fkey"
                        columns: ["institute_id"]
                        isOneToOne: false
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
                    name: string | null
                    role: string | null
                    user_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    email?: string | null
                    id: string
                    institute_id?: string | null
                    name?: string | null
                    role?: string | null
                    user_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    email?: string | null
                    id?: string
                    institute_id?: string | null
                    name?: string | null
                    role?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "staff_members_institute_id_fkey"
                        columns: ["institute_id"]
                        isOneToOne: false
                        referencedRelation: "institutes"
                        referencedColumns: ["id"]
                    },
                ]
            }
            students: {
                Row: {
                    address: string | null
                    admission_year: string | null
                    batch_id: string | null
                    created_at: string | null
                    dob: string | null
                    email: string | null
                    father_name: string | null
                    gender: string | null
                    id: string
                    institute_id: string | null
                    mother_name: string | null
                    name: string
                    parent_phone: string | null
                    phone: string | null
                    photo_url: string | null
                    roll_number: string | null
                    section: string | null
                    standard: string | null
                    status: string | null
                    updated_at: string | null
                }
                Insert: {
                    address?: string | null
                    admission_year?: string | null
                    batch_id?: string | null
                    created_at?: string | null
                    dob?: string | null
                    email?: string | null
                    father_name?: string | null
                    gender?: string | null
                    id?: string
                    institute_id?: string | null
                    mother_name?: string | null
                    name: string
                    parent_phone?: string | null
                    phone?: string | null
                    photo_url?: string | null
                    roll_number?: string | null
                    section?: string | null
                    standard?: string | null
                    status?: string | null
                    updated_at?: string | null
                }
                Update: {
                    address?: string | null
                    admission_year?: string | null
                    batch_id?: string | null
                    created_at?: string | null
                    dob?: string | null
                    email?: string | null
                    father_name?: string | null
                    gender?: string | null
                    id?: string
                    institute_id?: string | null
                    mother_name?: string | null
                    name?: string
                    parent_phone?: string | null
                    phone?: string | null
                    photo_url?: string | null
                    roll_number?: string | null
                    section?: string | null
                    standard?: string | null
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
                        foreignKeyName: "students_institute_id_fkey"
                        columns: ["institute_id"]
                        isOneToOne: false
                        referencedRelation: "institutes"
                        referencedColumns: ["id"]
                    },
                ]
            }
            batches: {
                Row: {
                    created_at: string | null
                    end_date: string | null
                    id: string
                    institute_id: string | null
                    name: string
                    start_date: string | null
                    status: string | null
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    end_date?: string | null
                    id?: string
                    institute_id?: string | null
                    name: string
                    start_date?: string | null
                    status?: string | null
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    end_date?: string | null
                    id?: string
                    institute_id?: string | null
                    name?: string
                    start_date?: string | null
                    status?: string | null
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
            conversation_states: {
                Row: {
                    created_at: string | null
                    id: string
                    institute_id: string | null
                    is_ai_paused: boolean | null
                    phone_number: string | null
                    session_id: string | null
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    institute_id?: string | null
                    is_ai_paused?: boolean | null
                    phone_number?: string | null
                    session_id?: string | null
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    institute_id?: string | null
                    is_ai_paused?: boolean | null
                    phone_number?: string | null
                    session_id?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            courses: {
                Row: {
                    created_at: string | null
                    duration_months: number | null
                    id: string
                    institute_id: string
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
                    institute_id: string
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
                    institute_id?: string
                    mode?: string | null
                    name?: string
                    registration_fee?: number | null
                    target_class?: string | null
                    total_fee?: number | null
                    updated_at?: string | null
                }
                Relationships: []
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
            support_tickets: {
                Row: {
                    created_at: string
                    description: string
                    id: string
                    institute_id: string
                    priority: string
                    resolved_at: string | null
                    status: string
                    subject: string
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string
                    description: string
                    id?: string
                    institute_id: string
                    priority?: string
                    resolved_at?: string | null
                    status?: string
                    subject: string
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string
                    description?: string
                    id?: string
                    institute_id?: string
                    priority?: string
                    resolved_at?: string | null
                    status?: string
                    subject?: string
                    updated_at?: string | null
                }
                Relationships: [
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
                    id: string
                    created_at: string
                    full_name: string
                    contact: string
                    source: string | null
                    institute_name: string | null
                    annual_admissions_scale: string | null
                    current_counseling_team_size: string | null
                    primary_admission_challenge: string | null
                    institute_full_address: string | null
                    preferred_visit_time: string | null
                    referral_source: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    full_name: string
                    contact: string
                    source?: string | null
                    institute_name?: string | null
                    annual_admissions_scale?: string | null
                    current_counseling_team_size?: string | null
                    primary_admission_challenge?: string | null
                    institute_full_address?: string | null
                    preferred_visit_time?: string | null
                    referral_source?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    full_name?: string
                    contact?: string
                    source?: string | null
                    institute_name?: string | null
                    annual_admissions_scale?: string | null
                    current_counseling_team_size?: string | null
                    primary_admission_challenge?: string | null
                    institute_full_address?: string | null
                    preferred_visit_time?: string | null
                    referral_source?: string | null
                }
                Relationships: []
            }
        }
        Views: {
            agent_runtime_brain: {
                Row: {
                    behavior_rules: Json | null
                    conversation_flow: string | null
                    expert_playbook: string | null
                    id: string | null
                    identity_prompt: string | null
                    institute_id: string | null
                    institute_name: string | null
                    name: string | null
                    psychology_rules: string | null
                    safety_protocols: string | null
                    slug: string | null
                    tools_config: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "institute_agent_overrides_institute_id_fkey"
                        columns: ["institute_id"]
                        isOneToOne: false
                        referencedRelation: "institutes"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            plan_type: ["trial", "starter", "growth", "domination"]
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
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]] extends { Tables: any }
        ? Database[PublicTableNameOrOptions["schema"]]["Tables"] & Database[PublicTableNameOrOptions["schema"]]["Views"]
        : never)
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]] extends { Tables: any }
        ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
            Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName]
        : never) extends {
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
    ? keyof (Database[PublicTableNameOrOptions["schema"]] extends { Tables: any }
        ? Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never)
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]] extends { Tables: any }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
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
    ? keyof (Database[PublicTableNameOrOptions["schema"]] extends { Tables: any }
        ? Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never)
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]] extends { Tables: any }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
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
    ? keyof (Database[PublicEnumNameOrOptions["schema"]] extends { Enums: any }
        ? Database[PublicEnumNameOrOptions["schema"]]["Enums"]
        : never)
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]] extends { Enums: any }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : never
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
    ? keyof (Database[PublicCompositeTypeNameOrOptions["schema"]] extends { CompositeTypes: any }
        ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never)
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]] extends { CompositeTypes: any }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : never
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
