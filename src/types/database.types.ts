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
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    role: 'revenue_officer' | 'higher_official' | null
                    created_at: string
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    role?: 'revenue_officer' | 'higher_official' | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    role?: 'revenue_officer' | 'higher_official' | null
                    created_at?: string
                }
            }
            families: {
                Row: {
                    id: string
                    family_head_id: string | null
                    address: string | null
                    ration_card_number: string | null
                    total_annual_income: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    family_head_id?: string | null
                    address?: string | null
                    ration_card_number?: string | null
                    total_annual_income?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    family_head_id?: string | null
                    address?: string | null
                    ration_card_number?: string | null
                    total_annual_income?: number | null
                    created_at?: string
                }
            }
            citizens: {
                Row: {
                    id: string
                    full_name: string
                    dob: string | null
                    gender: string | null
                    phone: string | null
                    aadhar_number: string | null
                    family_id: string | null
                    income: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    full_name: string
                    dob?: string | null
                    gender?: string | null
                    phone?: string | null
                    aadhar_number?: string | null
                    family_id?: string | null
                    income?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string
                    dob?: string | null
                    gender?: string | null
                    phone?: string | null
                    aadhar_number?: string | null
                    family_id?: string | null
                    income?: number | null
                    created_at?: string
                }
            }
            service_types: {
                Row: {
                    id: string
                    name: string
                    validity_days: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    validity_days?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    validity_days?: number | null
                    created_at?: string
                }
            }
            service_records: {
                Row: {
                    id: string
                    citizen_id: string
                    service_type_id: string
                    issued_by: string | null
                    issue_date: string | null
                    status: string | null
                    comments: string | null
                }
                Insert: {
                    id?: string
                    citizen_id: string
                    service_type_id: string
                    issued_by?: string | null
                    issue_date?: string | null
                    status?: string | null
                    comments?: string | null
                }
                Update: {
                    id?: string
                    citizen_id?: string
                    service_type_id?: string
                    issued_by?: string | null
                    issue_date?: string | null
                    status?: string | null
                    comments?: string | null
                }
            }
            official_postings: {
                Row: {
                    id: string
                    official_id: string | null
                    designation: string | null
                    location: string | null
                    start_date: string | null
                    end_date: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    official_id?: string | null
                    designation?: string | null
                    location?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    official_id?: string | null
                    designation?: string | null
                    location?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    created_at?: string
                }
            }
        }
    }
}
