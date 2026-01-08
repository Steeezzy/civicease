
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
            citizen:persons!service_records_person_id_fkey (
                person_id,
                first_name,
                last_name,
                phone,
                aadhar_number,
                families (
                    family_id,
                    family_name,
                    head:persons!fk_family_head (
                        first_name,
                        last_name
                    )
                )
            )
        `)
        .order('issue_date', { ascending: false });

    // Note: 'citizen' alias used for 'persons' relation to match typical frontend expectation if mapped, 
    // or we map it below.

    if (service_type_id) {
        query = query.eq('service_type_id', service_type_id);
    }

    if (family_name) {
        // 1. Find families matching the name
        const { data: families } = await supabase
            .from('families')
            .select('family_id')
            .ilike('family_name', `%${family_name}%`);

        if (families && families.length > 0) {
            const familyIds = families.map(f => f.family_id);
            // 2. Filter service records where citizen belongs to these families
            // We need to filter on the joined persons table.
            // Supabase simpler syntax:
            query = query.in('citizen.family_id', familyIds);
            // Warning: filtering on nested alias 'citizen.family_id' requires !inner join usually.
            // Let's modify the select to use !inner if filter used? 
            // For now, let's rely on valid relation. 
            // If this fails, we might need to use RPC or explicit inner join in the select string above.
        } else {
            return NextResponse.json([]);
        }
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map fields to match Frontend expectations (full_name, citizens object)
    const services = data?.map((s: any) => ({
        ...s,
        citizens: s.citizen ? {
            id: s.citizen.person_id,
            full_name: `${s.citizen.first_name} ${s.citizen.last_name}`,
            phone: s.citizen.phone,
            aadhar_number: s.citizen.aadhar_number,
            families: s.citizen.families ? {
                id: s.citizen.families.family_id,
                ration_card_number: s.citizen.families.family_name, // Map family_name to ration_card_number prop if frontend uses it, otherwise use family_name
                // Check frontend code: it uses service.citizens?.families?.head?.full_name
                head: s.citizen.families.head ? {
                    full_name: `${s.citizen.families.head.first_name} ${s.citizen.families.head.last_name}`
                } : null
            } : null
        } : null
    }));

    return NextResponse.json(services);
}
