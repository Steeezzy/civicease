import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function verifyLogin() {
    const email = 'officer@revenue.gov';
    const password = 'revenue123';

    console.log(`Attempting login for ${email}...`);
    console.log(`Using URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.error('LOGIN FAILED:', error.message);
    } else {
        console.log('LOGIN SUCCESSFUL!');
        console.log('User ID:', data.user.id);
        console.log('Access Token (first 20 chars):', data.session.access_token.substring(0, 20) + '...');
    }
}

verifyLogin();
