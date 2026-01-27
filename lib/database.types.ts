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
                }
                Insert: {
                    id?: string
                    created_at?: string
                    name: string
                    address?: string | null
                    phone?: string | null
                    email?: string | null
                    website?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    name?: string
                    address?: string | null
                    phone?: string | null
                    email?: string | null
                    website?: string | null
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
