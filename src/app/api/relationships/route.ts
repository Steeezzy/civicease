
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const person_id = searchParams.get('person_id');

    let query = supabase.from('relationships').select(`
      *,
      person:persons!relationships_person_id_fkey(first_name, last_name),
      related_person:persons!relationships_related_person_id_fkey(first_name, last_name)
    `);

    if (person_id) {
        query = query.or(`person_id.eq.${person_id},related_person_id.eq.${person_id}`);
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const relationships = data?.map((r: any) => ({
        ...r,
        person_name: `${r.person?.first_name} ${r.person?.last_name}`,
        related_person_name: `${r.related_person?.first_name} ${r.related_person?.last_name}`
    }));

    return NextResponse.json(relationships);
}

export async function POST(request: Request) {
    const supabase = createClient();
    const body = await request.json();

    const { data, error } = await supabase
        .from('relationships')
        .insert(body)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
}
