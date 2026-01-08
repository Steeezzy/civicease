
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('marriages')
        .select(`
      *,
      spouse1:persons!marriages_spouse1_id_fkey(first_name, last_name),
      spouse2:persons!marriages_spouse2_id_fkey(first_name, last_name)
    `);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map fields
    const marriages = data?.map((m: any) => ({
        ...m,
        spouse1: m.spouse1 ? { full_name: `${m.spouse1.first_name} ${m.spouse1.last_name}` } : null,
        spouse2: m.spouse2 ? { full_name: `${m.spouse2.first_name} ${m.spouse2.last_name}` } : null
    }));

    return NextResponse.json(marriages);
}

export async function POST(request: Request) {
    const supabase = createClient();
    const body = await request.json();

    const { data, error } = await supabase
        .from('marriages')
        .insert(body)
        .select()
        .single();

    if (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
}
