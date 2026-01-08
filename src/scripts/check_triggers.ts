
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
// ERROR: using ANON key might not have permission to view triggers. 
// We generally need SERVICE_ROLE_KEY to inspect schema schemas if RLS is on.
// But we can try with ANON first if SERVICE is missing, though usually SERVICE is needed for admin tasks.

if (!SUPABASE_SERVICE_KEY || SUPABASE_SERVICE_KEY.includes('your-secret-key')) {
    console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY. Cannot inspect database triggers safely.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false }
});

async function checkTriggers() {
    console.log('🔍 Inspecting Database Triggers...');

    // We can't easily run raw SQL via supabase-js client unless we use rpc() to a known function
    // or if we have a table exposed.
    // However, we can try to inspect `public` tables logic if we can insert.
    // Actually, asking the DB for metadata via postgrest is hard if `information_schema` isn't exposed.

    // ALTERNATIVE: Attempt to insert a user via Admin API (Service Role) and see the EXACT error. 
    // The Admin API might give more detail than the Public Auth API.

    const randomEmail = `test_admin_${Date.now()}@revenue.gov`;
    console.log(`\nAttempting Admin createUser for: ${randomEmail}`);

    const { data, error } = await supabase.auth.admin.createUser({
        email: randomEmail,
        password: 'password123',
        email_confirm: true,
        user_metadata: { full_name: 'Admin Test User' }
    });

    if (error) {
        console.log('❌ Admin Create Failed:');
        console.log(`Status: ${error.status}`);
        console.log(`Message: ${error.message}`);
        // If it's a trigger, the message usually says "Error in ... trigger"
    } else {
        console.log('✅ Admin Create Successful!');
        console.log('User ID:', data.user.id);
        console.log('This means the block is likely in the PUBLIC Signup configuration (Captcha? Rate Limit? Domain Whitelist in UI?), not a DB Trigger.');

        // Cleanup
        await supabase.auth.admin.deleteUser(data.user.id);
    }
}

checkTriggers();
