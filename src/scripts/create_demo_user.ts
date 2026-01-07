import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function createDemoUser() {
    const email = 'demo@civicease.com';
    const password = 'password123';

    console.log(`Attempting to create user: ${email}`);

    // 1. Create Auth User
    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: 'Demo Officer' }
    });

    if (error) {
        console.error('Error creating auth user:', error.message);
        // If user exists, just return success message
        if (error.message.includes('already has been registered')) {
            console.log('User already exists. You can log in.');
            // Optional: update password if needed, but risky.
        }
    } else {
        console.log('Auth user created:', data.user.id);

        // 2. Create Profile (if not triggered)
        const { error: profileError } = await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: 'Demo Officer',
            role: 'revenue_officer'
        });

        if (profileError) console.error('Profile error:', profileError.message);
        else console.log('Profile created/updated.');
    }
}

createDemoUser().catch(e => console.error(e));
