import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('families')
        .select(`
      *,
      members:persons(first_name, last_name)
    `);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map fields
    const families = data?.map((family: any) => ({
        ...family,
        id: family.family_id,
        // Since schema has no explicit head, use the first member as contact/head
        head: family.members?.[0] ? { full_name: `${family.members[0].first_name} ${family.members[0].last_name}` } : null
    }));

    return NextResponse.json(families);
}

export async function POST(request: Request) {
    const supabase = createClient();
    const body = await request.json();
    const { family_name, address, head_id } = body;

    // 1. Create Family
    const { data: family, error: familyError } = await supabase
        .from('families')
        .insert({
            family_name,
            address
        })
        .select()
        .single();

    if (familyError) {
        return NextResponse.json({ error: familyError.message }, { status: 400 });
    }

    // 2. Assign Head to Family (Update Person)
    if (head_id && family) {
        const { error: personError } = await supabase
            .from('persons')
            .update({ family_id: family.family_id })
            .eq('person_id', head_id);

        if (personError) {
            console.error("Failed to assign head to family:", personError);
            // Optionally rollback family creation or just warn
        }
    }

    return NextResponse.json(family);
}
