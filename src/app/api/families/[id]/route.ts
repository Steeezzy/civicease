import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const supabase = createClient();
    const { id } = params;

    const { data, error } = await supabase
        .from('families')
        .select(`
      *,
      head:persons!fk_family_head(first_name, last_name),
      members:persons(*)
    `)
        .eq('family_id', id)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }

    // Map fields
    const family = {
        ...data,
        head: data.head ? { full_name: `${data.head.first_name} ${data.head.last_name}` } : null,
        members: data.members?.map((m: any) => ({
            id: m.person_id,
            full_name: `${m.first_name} ${m.last_name}`,
            dob: m.birth_date,
            gender: m.gender,
            phone: m.phone,
            aadhar_number: m.aadhar_number,
            family_id: m.family_id,
            income: m.annual_income,
            created_at: m.created_at
        }))
    };

    return NextResponse.json(family);
}
