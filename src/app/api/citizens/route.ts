import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const familyIdFilter = searchParams.get('family_id');

    let query = supabase.from('persons').select(`
    *,
    families!persons_family_id_fkey (
      family_id,
      address
    )
  `);

    if (search) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,aadhar_number.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    if (familyIdFilter === 'null') {
        query = query.is('family_id', null);
    } else if (familyIdFilter) {
        query = query.eq('family_id', familyIdFilter);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching citizens:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map DB fields to frontend expected format
    const citizens = data?.map((p: any) => ({
        id: p.person_id,
        full_name: `${p.first_name} ${p.last_name}`,
        dob: p.birth_date,
        gender: p.gender,
        phone: p.phone,
        aadhar_number: p.aadhar_number,
        family_id: p.family_id,
        income: p.annual_income,
        created_at: p.created_at,
        families: p.families
    }));

    return NextResponse.json(citizens);
}

export async function POST(request: Request) {
    const supabase = createClient();
    const body = await request.json();

    // Split full name
    const nameParts = body.full_name?.split(' ') || ['Unknown'];
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    const personData = {
        first_name: firstName,
        last_name: lastName,
        birth_date: body.dob,
        gender: body.gender,
        phone: body.phone,
        aadhar_number: body.aadhar_number,
        annual_income: body.income,
        family_id: body.family_id
    };

    const { data, error } = await supabase
        .from('persons')
        .insert(personData)
        .select()
        .single();

    if (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
        id: data.person_id,
        full_name: `${data.first_name} ${data.last_name}`,
        ...data
    });
}
