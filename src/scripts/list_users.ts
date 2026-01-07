import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Fix dotenv path
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.log('Missing Credentials in .env.local');
    console.log('URL:', supabaseUrl);
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function listUsers() {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.error('Error:', error);
        return;
    }

    if (!users || users.length === 0) {
        console.log('No users found.');
    } else {
        console.log('Registered Users:');
        users.forEach(u => console.log(`- Email: ${u.email} | ID: ${u.id} | Confirmed: ${u.email_confirmed_at ? 'Yes' : 'No'}`));
    }
}

listUsers();
