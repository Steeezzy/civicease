import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load env vars from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function confirmAllUsers() {
    console.log('Fetching users...');
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.error('Error fetching users:', error);
        return;
    }

    const unconfirmed = users.filter(u => !u.email_confirmed_at);
    console.log(`Found ${unconfirmed.length} unconfirmed users.`);

    for (const user of unconfirmed) {
        console.log(`Confirming user: ${user.email} (${user.id})`);
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            user.id,
            { email_confirm: true }
        );

        if (updateError) {
            console.error(`Failed to confirm ${user.email}:`, updateError.message);
        } else {
            console.log(`Successfully confirmed ${user.email}`);
        }
    }
}

confirmAllUsers();
