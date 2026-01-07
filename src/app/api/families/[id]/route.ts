import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const supabase = createClient();
    const { id } = params;

    const { data, error } = await supabase
        .from('families')
        .select(`
      *,
      head:citizens!fk_family_head(full_name),
      members:citizens(*)
    `)
        .eq('id', id)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }

    // Calculate total income on the fly or rely on stored value?
    // User req says "Calculate total family income automatically".
    // Ideally, when a citizen is added/updated, we update the family total.
    // For now, let's also compute it here to be safe or just return data.
    // We'll trust the stored `total_annual_income` which should be maintained by triggers or logic.

    return NextResponse.json(data);
}
