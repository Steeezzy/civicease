import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const supabase = createClient();
    const body = await request.json();
    const { citizen_id, service_type_id, comments } = body;

    if (!citizen_id || !service_type_id) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Get Service Type details (validity)
    const { data: serviceType, error: typeError } = await supabase
        .from('service_types')
        .select('validity_days')
        .eq('id', service_type_id)
        .single();

    if (typeError || !serviceType) {
        return NextResponse.json({ error: 'Invalid service type' }, { status: 400 });
    }

    // 2. Check for duplicate active service
    // We look for any record for this citizen & service type
    // where (issue_date + validity) > now, OR validity is null (permanent?)
    // For simplicity, let's assume we just check if they have one recently.

    const { data: existingService } = await supabase
        .from('service_records')
        .select('issue_date, service_types(validity_days)')
        .eq('citizen_id', citizen_id)
        .eq('service_type_id', service_type_id)
        .order('issue_date', { ascending: false })
        .limit(1)
        .single();

    if (existingService) {
        const issueDate = new Date(existingService.issue_date as string);
        const validityDays = serviceType.validity_days || 0;
        const expiryDate = new Date(issueDate.getTime() + validityDays * 24 * 60 * 60 * 1000);

        if (new Date() < expiryDate) {
            return NextResponse.json({
                error: `Service already issued and valid until ${expiryDate.toLocaleDateString()}`
            }, { status: 409 });
        }
    }

    // 3. Issue Service
    const { data, error } = await supabase
        .from('service_records')
        .insert({
            citizen_id,
            service_type_id,
            issued_by: (await supabase.auth.getUser()).data.user?.id, // Official ID
            comments
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
