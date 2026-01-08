
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Missing Supabase environment variables');
    process.exit(1);
}

console.log(`Testing connection to: ${SUPABASE_URL}`);

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: false
    }
});

async function testConnection() {
    const start = Date.now();
    try {
        console.log('Attempting client connection (signUp)...');

        const randomEmail = `test_${Date.now()}@example.com`;
        console.log(`Trying to sign up with: ${randomEmail}`);

        const { data, error } = await supabase.auth.signUp({
            email: randomEmail,
            password: 'password123',
            options: {
                data: {
                    full_name: 'Test Connectivity User'
                }
            }
        });

        if (error) {
            console.log('❌ Signup Error:');
            console.log(`Message: ${error.message}`);
            console.log(`Status: ${error.status}`);
        } else {
            console.log('✅ Signup Successful');
            console.log('User ID:', data.user?.id);
        }

    } catch (error: any) {
        console.error('❌ Connection Failed:', error.message);
        if (error.cause) {
            console.error('Cause:', error.cause);
        }
    }
    console.log(`Duration: ${Date.now() - start}ms`);
}

testConnection();
