export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            courses: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    name: string
                    institute_id: string
                    mode: string | null
                    target_class: string | null
                    total_fee: number | null
                    registration_fee: number | null
                    duration_months: number | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    name: string
                    institute_id?: string
                    mode?: string | null
                    target_class?: string | null
                    total_fee?: number | null
                    registration_fee?: number | null
                    duration_months?: number | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    name?: string
                    institute_id?: string
                    mode?: string | null
                    target_class?: string | null
                    total_fee?: number | null
                    registration_fee?: number | null
                    duration_months?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "courses_institute_id_fkey"
                        columns: ["institute_id"]
                        referencedRelation: "institutes"
                        referencedColumns: ["id"]
                    }
                ]
            }
            institutes: {
                Row: {
                    id: string
                    created_at: string
                    name: string
                    address: string | null
                    phone: string | null
                    email: string | null
                    website: string | null
                    city: string | null
                    helpline_number: string | null
                    current_plan: string | null
                    subscription_status: string | null
                    message_limit: number | null
                    messages_used: number | null
                    phone_id: string | null
                    access_token: string | null
                    google_map_link: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    name: string
                    address?: string | null
                    phone?: string | null
                    email?: string | null
                    website?: string | null
                    city?: string | null
                    helpline_number?: string | null
                    current_plan?: string | null
                    subscription_status?: string | null
                    message_limit?: number | null
                    messages_used?: number | null
                    phone_id?: string | null
                    access_token?: string | null
                    google_map_link?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    name?: string
                    address?: string | null
                    phone?: string | null
                    email?: string | null
                    website?: string | null
                    city?: string | null
                    helpline_number?: string | null
                    current_plan?: string | null
                    subscription_status?: string | null
                    message_limit?: number | null
                    messages_used?: number | null
                    phone_id?: string | null
                    access_token?: string | null
                    google_map_link?: string | null
                }
                Relationships: []
            }
            leads: {
                Row: {
                    id: string
                    created_at: string
                    institute_id: string
                    name: string | null
                    phone: string | null
                    email: string | null
                    status: string | null
                    interested_course: string | null
                    source: string | null
                    next_followup: string | null
                    current_class: string | null
                    city: string | null
                    lead_score: number | null
                    visit_date: string | null
                    visit_type: string | null
                    ai_notes: string | null
                    parent_name: string | null
                    parent_phone: string | null
                    budget_range: string | null
                    preferred_mode: string | null
                    target_year: string | null
                    admission_chances: number | null
                    tags: string[] | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    institute_id?: string
                    name?: string | null
                    phone?: string | null
                    email?: string | null
                    status?: string | null
                    interested_course?: string | null
                    source?: string | null
                    next_followup?: string | null
                    current_class?: string | null
                    city?: string | null
                    lead_score?: number | null
                    visit_date?: string | null
                    visit_type?: string | null
                    ai_notes?: string | null
                    parent_name?: string | null
                    parent_phone?: string | null
                    budget_range?: string | null
                    preferred_mode?: string | null
                    target_year?: string | null
                    admission_chances?: number | null
                    tags?: string[] | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    institute_id?: string
                    name?: string | null
                    phone?: string | null
                    email?: string | null
                    status?: string | null
                    interested_course?: string | null
                    source?: string | null
                    next_followup?: string | null
                    current_class?: string | null
                    city?: string | null
                    lead_score?: number | null
                    visit_date?: string | null
                    visit_type?: string | null
                    ai_notes?: string | null
                    parent_name?: string | null
                    parent_phone?: string | null
                    budget_range?: string | null
                    preferred_mode?: string | null
                    target_year?: string | null
                    admission_chances?: number | null
                    tags?: string[] | null
                }
                Relationships: [
                    {
                        foreignKeyName: "leads_institute_id_fkey"
                        columns: ["institute_id"]
                        referencedRelation: "institutes"
                        referencedColumns: ["id"]
                    }
                ]
            }
            ai_chat_history: {
                Row: {
                    id: string
                    created_at: string
                    institute_id: string
                    phone_number: string | null
                    session_id: string | null
                    user_message: string
                    ai_response: string | null
                    role: string | null
                    intent: string | null
                    sentiment: string | null
                    status: string | null
                    whatsapp_message_id: string | null
                    message_meta: any | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    institute_id?: string
                    phone_number?: string | null
                    session_id?: string | null
                    user_message: string
                    ai_response?: string | null
                    role?: string | null
                    intent?: string | null
                    sentiment?: string | null
                    status?: string | null
                    whatsapp_message_id?: string | null
                    message_meta?: any | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    institute_id?: string
                    phone_number?: string | null
                    session_id?: string | null
                    user_message?: string
                    ai_response?: string | null
                    role?: string | null
                    intent?: string | null
                    sentiment?: string | null
                    status?: string | null
                    whatsapp_message_id?: string | null
                    message_meta?: any | null
                }
                Relationships: [
                    {
                        foreignKeyName: "ai_chat_history_institute_id_fkey"
                        columns: ["institute_id"]
                        referencedRelation: "institutes"
                        referencedColumns: ["id"]
                    }
                ]
            }
            payments: {
                Row: {
                    id: string
                    created_at: string
                    institute_id: string
                    amount: number | null
                    payment_date: string | null
                    status: string | null
                    plan_name: string | null
                    transaction_id: string | null
                    payment_method: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    institute_id?: string
                    amount?: number | null
                    payment_date?: string | null
                    status?: string | null
                    plan_name?: string | null
                    transaction_id?: string | null
                    payment_method?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    institute_id?: string
                    amount?: number | null
                    payment_date?: string | null
                    status?: string | null
                    plan_name?: string | null
                    transaction_id?: string | null
                    payment_method?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "payments_institute_id_fkey"
                        columns: ["institute_id"]
                        referencedRelation: "institutes"
                        referencedColumns: ["id"]
                    }
                ]
            }
            waitlist: {
                Row: {
                    id: string
                    created_at: string
                    full_name: string | null
                    contact: string | null
                    source: string | null
                    status: string | null
                    email: string | null
                    institute_name: string | null
                    annual_admissions_scale: string | null
                    referral_source: string | null
                    primary_admission_challenge: string | null
                    preferred_visit_time: string | null
                    institute_full_address: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    full_name?: string | null
                    contact?: string | null
                    source?: string | null
                    status?: string | null
                    email?: string | null
                    institute_name?: string | null
                    annual_admissions_scale?: string | null
                    referral_source?: string | null
                    primary_admission_challenge?: string | null
                    preferred_visit_time?: string | null
                    institute_full_address?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    full_name?: string | null
                    contact?: string | null
                    source?: string | null
                    status?: string | null
                    email?: string | null
                    institute_name?: string | null
                    annual_admissions_scale?: string | null
                    referral_source?: string | null
                    primary_admission_challenge?: string | null
                    preferred_visit_time?: string | null
                    institute_full_address?: string | null
                }
                Relationships: []
            }
            feedback: {
                Row: {
                    id: string
                    created_at: string
                    rating: number
                    name: string
                    email: string
                    message: string
                }
                Insert: {
                    id?: string
                    created_at?: string
                    rating: number
                    name: string
                    email: string
                    message: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    rating?: number
                    name?: string
                    email?: string
                    message?: string
                }
                Relationships: []
            }
            agents: {
                Row: {
                    id: string
                    created_at: string
                    slug: string
                    is_active: boolean
                }
                Insert: {
                    id?: string
                    created_at?: string
                    slug: string
                    is_active?: boolean
                }
                Update: {
                    id?: string
                    created_at?: string
                    slug?: string
                    is_active?: boolean
                }
                Relationships: []
            }
            support_tickets: {
                Row: {
                    id: string
                    created_at: string
                    subject: string
                    description: string | null
                    status: string | null
                    priority: string | null
                    updated_at: string | null
                    resolved_at: string | null
                    institute_id: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    subject: string
                    description?: string | null
                    status?: string | null
                    priority?: string | null
                    updated_at?: string | null
                    resolved_at?: string | null
                    institute_id?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    subject?: string
                    description?: string | null
                    status?: string | null
                    priority?: string | null
                    updated_at?: string | null
                    resolved_at?: string | null
                    institute_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "support_tickets_institute_id_fkey"
                        columns: ["institute_id"]
                        referencedRelation: "institutes"
                        referencedColumns: ["id"]
                    }
                ]
            }
            conversation_states: {
                Row: {
                    phone_number: string
                    institute_id: string | null
                    is_ai_paused: boolean
                    paused_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    phone_number: string
                    institute_id?: string | null
                    is_ai_paused?: boolean
                    paused_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    phone_number?: string
                    institute_id?: string | null
                    is_ai_paused?: boolean
                    paused_at?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            staff_members: {
                Row: {
                    id: string
                    institute_id: string
                }
                Insert: {
                    id: string
                    institute_id: string
                }
                Update: {
                    id?: string
                    institute_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "staff_members_institute_id_fkey"
                        columns: ["institute_id"]
                        referencedRelation: "institutes"
                        referencedColumns: ["id"]
                    }
                ]
            }
            students: {
                Row: {
                    id: string
                    created_at: string
                    name: string
                    institute_id: string
                    batch_id: string | null
                    phone: string | null
                    status: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    name: string
                    institute_id: string
                    batch_id?: string | null
                    phone?: string | null
                    status?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    name?: string
                    institute_id?: string
                    batch_id?: string | null
                    phone?: string | null
                    status?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "students_batch_id_fkey"
                        columns: ["batch_id"]
                        referencedRelation: "batches"
                        referencedColumns: ["id"]
                    }
                ]
            }
            batches: {
                Row: {
                    id: string
                    created_at: string
                    name: string
                    institute_id: string
                }
                Insert: {
                    id?: string
                    created_at?: string
                    name: string
                    institute_id: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    name?: string
                    institute_id?: string
                }
                Relationships: []
            }
            invite_codes: {
                Row: {
                    id: string
                    created_at: string
                    code: string
                    max_uses: number
                    is_active: boolean
                }
                Insert: {
                    id?: string
                    created_at?: string
                    code: string
                    max_uses: number
                    is_active?: boolean
                }
                Update: {
                    id?: string
                    created_at?: string
                    code?: string
                    max_uses?: number
                    is_active?: boolean
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
