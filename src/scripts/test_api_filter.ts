import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SERVER_URL = 'http://localhost:4000';
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testApiFilter() {
    console.log('--- Testing API Filter ---');

    // Login
    const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: 'officer@revenue.gov',
        password: 'revenue123'
    });

    if (error) {
        console.error('Login Failed:', error.message);
        return;
    }
    const token = authData.session.access_token;

    console.log('Calling GET /api/citizens?family_id=null ...');
    const res = await fetch(`${SERVER_URL}/api/citizens?family_id=null`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
        const data = await res.json();
        console.log(`Success! Found ${data.length} citizens.`);
        if (data.length > 0) {
            console.log('Sample:', data[0].full_name);
        } else {
            console.log('Response is empty array []');
        }
    } else {
        console.log('Failed:', res.status, await res.text());
    }
}

testApiFilter();
