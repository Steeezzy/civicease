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
                    family_id: number
                    family_name: string | null
                    address: string | null
                    total_income: number | null
                    created_at: string
                }
                Insert: {
                    family_id?: number
                    family_name?: string | null
                    address?: string | null
                    total_income?: number | null
                    created_at?: string
                }
                Update: {
                    family_id?: number
                    family_name?: string | null
                    address?: string | null
                    total_income?: number | null
                    created_at?: string
                }
            }
            persons: {
                Row: {
                    person_id: number
                    family_id: number | null
                    first_name: string
                    last_name: string
                    gender: string | null
                    birth_date: string | null
                    phone: string | null
                    aadhar_number: string | null
                    annual_income: number | null
                    created_at: string
                }
                Insert: {
                    person_id?: number
                    family_id?: number | null
                    first_name: string
                    last_name: string
                    gender?: string | null
                    birth_date?: string | null
                    phone?: string | null
                    aadhar_number?: string | null
                    annual_income?: number | null
                    created_at?: string
                }
                Update: {
                    person_id?: number
                    family_id?: number | null
                    first_name?: string
                    last_name?: string
                    gender?: string | null
                    birth_date?: string | null
                    phone?: string | null
                    aadhar_number?: string | null
                    annual_income?: number | null
                    created_at?: string
                }
            }
            marriages: {
                Row: {
                    marriage_id: number
                    spouse1_id: number
                    spouse2_id: number
                    marriage_date: string | null
                    divorce_date: string | null
                    created_at: string
                }
                Insert: {
                    marriage_id?: number
                    spouse1_id: number
                    spouse2_id: number
                    marriage_date?: string | null
                    divorce_date?: string | null
                    created_at?: string
                }
                Update: {
                    marriage_id?: number
                    spouse1_id?: number
                    spouse2_id?: number
                    marriage_date?: string | null
                    divorce_date?: string | null
                    created_at?: string
                }
            }
            relationships: {
                Row: {
                    relationship_id: number
                    person_id: number
                    related_person_id: number
                    relation_type: string
                    created_at: string
                }
                Insert: {
                    relationship_id?: number
                    person_id: number
                    related_person_id: number
                    relation_type: string
                    created_at?: string
                }
                Update: {
                    relationship_id?: number
                    person_id?: number
                    related_person_id?: number
                    relation_type?: string
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
