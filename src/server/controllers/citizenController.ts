import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Initialize Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// --- Interfaces ---
interface CitizenInput {
    name: string;
    dob: string;
    gender?: string;
    address?: string;
    annual_income: number;
    family_id?: string;
}

// --- Controller Methods ---

export const createCitizen = async (req: Request, res: Response) => {
    try {
        const { name, dob, gender, address, annual_income, family_id } = req.body as CitizenInput;

        // 1. Validation
        if (!name || !dob) {
            return res.status(400).json({ error: 'Name and DOB are mandatory.' });
        }
        if (annual_income < 0) {
            return res.status(400).json({ error: 'Annual income must be >= 0.' });
        }

        // 2. Insert
        // Note: Mapping 'name' to 'full_name' in DB, 'annual_income' to 'income'
        const { data, error } = await supabase
            .from('citizens')
            .insert({
                full_name: name,
                dob,
                gender,
                address, // Ensure DB has this column
                income: annual_income,
                family_id: family_id || null
            })
            .select()
            .single();

        if (error) throw error;

        return res.status(201).json(data);
    } catch (err: any) {
        console.error('Create Citizen Error:', err);
        return res.status(500).json({ error: err.message });
    }
};

export const listCitizens = async (req: Request, res: Response) => {
    try {
        const { search, family_id } = req.query;

        let query = supabase.from('citizens').select('*');

        if (search) {
            query = query.ilike('full_name', `%${search}%`);
        }
        if (family_id) {
            console.log(`[CitizenController] Filtering by family_id: ${family_id}`);
            if (family_id === 'null') {
                query = query.is('family_id', null);
            } else {
                query = query.eq('family_id', family_id);
            }
        }

        const { data, error } = await query;
        if (error) throw error;

        return res.json(data);
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
};

export const getCitizen = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('citizens')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return res.status(404).json({ error: 'Citizen not found' });

        return res.json(data);
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
};

export const updateCitizen = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Validation if updating specific fields
        if (updates.annual_income !== undefined && updates.annual_income < 0) {
            return res.status(400).json({ error: 'Annual income must be >= 0.' });
        }

        // Map fields if necessary (frontend might send 'name' but DB needs 'full_name')
        const dbUpdates: any = {};
        if (updates.name) dbUpdates.full_name = updates.name;
        if (updates.annual_income !== undefined) dbUpdates.income = updates.annual_income;
        if (updates.dob) dbUpdates.dob = updates.dob;
        if (updates.gender) dbUpdates.gender = updates.gender;
        if (updates.address) dbUpdates.address = updates.address;
        if (updates.family_id) dbUpdates.family_id = updates.family_id;

        const { data, error } = await supabase
            .from('citizens')
            .update(dbUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return res.json(data);
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
};
