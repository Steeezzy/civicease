import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const supabase = createClient();
    const { id } = params;

    const { data, error } = await supabase
        .from('persons')
        .select(`
      *,
      families (
        *
      )
    `)
        .eq('person_id', id) // Assuming ID passed in URL matches person_id (which is bigint, effectively number)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }

    // Map fields
    const citizen = {
        id: data.person_id,
        full_name: `${data.first_name} ${data.last_name}`,
        dob: data.birth_date,
        gender: data.gender,
        phone: data.phone,
        aadhar_number: data.aadhar_number,
        family_id: data.family_id,
        income: data.annual_income,
        created_at: data.created_at,
        families: data.families
    };

    return NextResponse.json(citizen);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const supabase = createClient();
    const { id } = params;
    const body = await request.json();

    // Map body fields to DB fields
    const updates: any = {};
    if (body.full_name) {
        const parts = body.full_name.split(' ');
        updates.first_name = parts[0];
        updates.last_name = parts.slice(1).join(' ');
    }
    if (body.dob) updates.birth_date = body.dob;
    if (body.gender) updates.gender = body.gender;
    if (body.phone) updates.phone = body.phone;
    if (body.aadhar_number) updates.aadhar_number = body.aadhar_number;
    if (body.income !== undefined) updates.annual_income = body.income;
    if (body.family_id) updates.family_id = body.family_id;

    const { data, error } = await supabase
        .from('persons')
        .update(updates)
        .eq('person_id', id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Map back to frontend format
    const citizen = {
        id: data.person_id,
        full_name: `${data.first_name} ${data.last_name}`,
        dob: data.birth_date,
        gender: data.gender,
        phone: data.phone,
        aadhar_number: data.aadhar_number,
        family_id: data.family_id,
        income: data.annual_income,
        created_at: data.created_at
    };

    return NextResponse.json(citizen);
}
