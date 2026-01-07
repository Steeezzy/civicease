import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const service_type_id = searchParams.get('service_type_id');
    const family_name = searchParams.get('family_name');

    let query = supabase
        .from('service_records')
        .select(`
            *,
            service_types (
                id,
                name
            ),
            citizens!inner (
                id,
                full_name,
                phone,
                aadhar_number,
                families (
                    id,
                    ration_card_number,
                    head:citizens!head_id (
                        full_name
                    )
                )
            )
        `)
        .order('issue_date', { ascending: false });

    if (service_type_id) {
        query = query.eq('service_type_id', service_type_id);
    }

    // Filter by Family Name (Head of Family's name)
    // Note: Since Supabase filtering on grandkids/deep relations can be complex with !inner,
    // we might need to fetch and filter, or use a specific filter syntax if the relation is set up correctly.
    // Here we assume the citizens!inner join allows us to filter, but filtering on families.head.full_name 
    // directly in the top query isn't always supported in simple syntax.
    // Instead, we'll try a text search on the returned data if the dataset is small, 
    // or better, find the eligible citizen IDs first.
    //
    // However, a scalable way is to search for families first.

    if (family_name) {
        // 1. Find families matching the name (Head's name)
        const { data: families } = await supabase
            .from('families')
            .select('id, head:citizens!head_id!inner(full_name)')
            .ilike('head.full_name', `%${family_name}%`);

        if (families && families.length > 0) {
            const familyIds = families.map(f => f.id);
            // 2. Filter service records where citizen belongs to these families
            query = query.in('citizens.family_id', familyIds);
        } else {
            // If search provided but no families found, return empty
            return NextResponse.json([]);
        }
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
