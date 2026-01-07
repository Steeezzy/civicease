import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabase = createClient();

    // Only higher officials should see this ideally, but RLS handles it.
    const { data, error } = await supabase
        .from('official_postings')
        .select(`
      *,
      official:profiles(full_name)
    `);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const supabase = createClient();
    const body = await request.json();

    const { data, error } = await supabase
        .from('official_postings')
        .insert(body)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
}
