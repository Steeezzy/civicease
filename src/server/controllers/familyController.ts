import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// --- Helpers ---
const recalculateIncome = async (familyId: string) => {
    // 1. Get all members
    const { data: members, error } = await supabase
        .from('citizens')
        .select('income')
        .eq('family_id', familyId);

    if (error) {
        console.error('Error fetching members for income calc:', error);
        return;
    }

    // 2. Sum income
    const total = members?.reduce((sum, m) => sum + (m.income || 0), 0) || 0;

    // 3. Update Family
    await supabase
        .from('families')
        .update({ total_annual_income: total })
        .eq('id', familyId);

    return total;
};

// --- Controllers ---

export const createFamily = async (req: Request, res: Response) => {
    try {
        const { address, ration_card_number, head_id } = req.body;

        // Validation
        if (!ration_card_number) {
            return res.status(400).json({ error: 'Ration card number is required.' });
        }

        // Insert
        const { data, error } = await supabase
            .from('families')
            .insert({
                address,
                ration_card_number,
                family_head_id: head_id || null, // Can be set later
            })
            .select()
            .single();

        if (error) throw error;

        // If head_id provided, link them now
        if (head_id) {
            await supabase.from('citizens').update({ family_id: data.id }).eq('id', head_id);
            await recalculateIncome(data.id);
        }

        return res.status(201).json(data);
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
};

export const getFamily = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Get Family + Members
        const { data: family, error } = await supabase
            .from('families')
            .select(`
                *,
                members:citizens(*)
            `)
            .eq('id', id)
            .single();

        if (error) return res.status(404).json({ error: 'Family not found' });

        return res.json(family);
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
};

export const listFamilies = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('families')
            .select('*, head:citizens!fk_family_head(full_name)'); // Optional join for display

        if (error) throw error;
        return res.json(data);
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
};

export const addMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Family ID
        const { citizen_id } = req.body;

        if (!citizen_id) return res.status(400).json({ error: 'Citizen ID required' });

        // 1. Update Citizen
        const { error } = await supabase
            .from('citizens')
            .update({ family_id: id })
            .eq('id', citizen_id);

        if (error) throw error;

        // 2. Recalculate Income
        const newTotal = await recalculateIncome(id);

        return res.json({ msg: 'Member added', total_income: newTotal });
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
};

export const removeMember = async (req: Request, res: Response) => {
    try {
        const { id, citizenId } = req.params; // Family ID, Citizen ID

        // 1. Unlink Citizen
        const { error } = await supabase
            .from('citizens')
            .update({ family_id: null })
            .eq('id', citizenId)
            .eq('family_id', id); // Safety check

        if (error) throw error;

        // 2. Recalculate Income
        const newTotal = await recalculateIncome(id);

        return res.json({ msg: 'Member removed', total_income: newTotal });
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
};
