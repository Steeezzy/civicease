import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function recreateOfficial() {
    const email = 'officer@revenue.gov';
    const password = 'revenue123';

    console.log(`Re-creating official: ${email}`);

    // 1. Find User
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const existingUser = users.find(u => u.email === email);

    // 2. Delete if exists
    if (existingUser) {
        console.log(`Deleting existing user ${existingUser.id}...`);
        const { error: delError } = await supabase.auth.admin.deleteUser(existingUser.id);
        if (delError) {
            console.error('Delete failed:', delError.message);
            return;
        }
        console.log('User deleted.');
    }

    // 3. Create fresh
    console.log('Creating new user...');
    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: 'Chief Revenue Officer' }
    });

    if (error) {
        console.error('Create failed:', error.message);
        return;
    }

    console.log('User created:', data.user.id);

    // 4. Update Profile
    const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: 'Chief Revenue Officer',
        role: 'revenue_officer'
    });

    if (profileError) console.error('Profile update failed:', profileError.message);
    else console.log('Profile updated.');
}

recreateOfficial();
