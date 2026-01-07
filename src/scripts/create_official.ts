import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function createOfficial() {
    const email = 'officer@revenue.gov';
    const password = 'SecurePassword2025!';

    console.log(`Creating secure official: ${email}`);

    // 1. Create Auth User
    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: 'Chief Revenue Officer' }
    });

    if (error) {
        if (error.message.includes('already has been registered')) {
            console.log('User already exists. Updating password...');
            await supabase.auth.admin.updateUserById(
                (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === email)!.id,
                { password }
            );
            console.log('Password updated.');
        } else {
            console.error('Error:', error.message);
        }
    } else {
        console.log('Auth user created:', data.user.id);
        // 2. Profile
        await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: 'Chief Revenue Officer',
            role: 'revenue_officer'
        });
        console.log('Profile configured.');
    }
}

createOfficial().catch(console.error);
