
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false }
});

async function createRevenueUser() {
    const email = 'admin@revenue.gov';
    const password = 'password123';

    console.log(`Attempting to create user: ${email}`);

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
            full_name: 'Admin User'
        }
    });

    if (error) {
        console.error('❌ Error creating user:', error.message);
    } else {
        console.log('✅ User created successfully!');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log(`User ID: ${data.user.id}`);
    }
}

createRevenueUser();
