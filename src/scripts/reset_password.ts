import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function resetPassword() {
    console.log('Fetching user officer@revenue.gov...');
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const user = users.find(u => u.email === 'officer@revenue.gov');

    if (!user) {
        console.error('User officer@revenue.gov NOT FOUND. Creating it...');
        // Fallback create
        const { error } = await supabase.auth.admin.createUser({
            email: 'officer@revenue.gov',
            password: 'revenue123',
            email_confirm: true,
            user_metadata: { full_name: 'Chief Officer' }
        });
        if (error) console.error('Create failed:', error.message);
        else console.log('Created user with password: revenue123');
        return;
    }

    console.log('User found. Updating password to: revenue123');
    const { error } = await supabase.auth.admin.updateUserById(
        user.id,
        { password: 'revenue123' }
    );

    if (error) {
        console.error('Update failed:', error.message);
    } else {
        console.log('Password successfully updated.');
    }
}

resetPassword();
