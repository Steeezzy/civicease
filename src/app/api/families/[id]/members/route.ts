
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const supabase = createClient();
    const { id } = params; // family_id
    const body = await request.json();
    const { citizen_id } = body;

    if (!citizen_id) {
        return NextResponse.json({ error: "citizen_id is required" }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('persons')
        .update({ family_id: id })
        .eq('person_id', citizen_id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
}
