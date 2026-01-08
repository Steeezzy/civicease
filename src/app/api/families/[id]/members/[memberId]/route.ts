
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { id: string, memberId: string } }) {
    const supabase = createClient();
    const { id, memberId } = params;

    // We verify the person belongs to the family before removing (security check, mostly for clarity)
    const { error } = await supabase
        .from('persons')
        .update({ family_id: null })
        .eq('person_id', memberId)
        .eq('family_id', id); // Ensure we are removing only if they fall under this family

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
}
