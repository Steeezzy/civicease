import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SERVER_URL = 'http://localhost:4000';
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testServer() {
    console.log('--- Testing Express Server ---');

    // 1. Health Check
    try {
        const res = await fetch(`${SERVER_URL}/api/health`);
        const data = await res.json();
        console.log('1. Health Check:', data);
    } catch (e) {
        console.error('Server might not be running on port 4000');
        return;
    }

    // 2. Login to get Token
    const email = 'demo@civicease.com';
    const password = 'password123';

    console.log(`\nLogging in as ${email}...`);
    const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error || !authData.session) {
        console.error('Login Failed:', error?.message);
        return;
    }

    const token = authData.session.access_token;
    console.log('Got JWT Token.');

    // 3. Test Protected Route (/api/me)
    console.log('\n2. Testing /api/me (Protected)...');
    const meRes = await fetch(`${SERVER_URL}/api/me`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (meRes.ok) {
        console.log('Success:', await meRes.json());
    } else {
        console.log('Failed:', meRes.status, await meRes.text());
    }

    // 4. Test Role Route (/api/citizens) - Revenue Officer
    console.log('\n3. Testing /api/citizens (Role: revenue_officer)...');
    const roleRes = await fetch(`${SERVER_URL}/api/citizens`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: 'Test Citizen' })
    });

    if (roleRes.ok) {
        console.log('Success:', await roleRes.json());
    } else {
        console.log('Failed:', roleRes.status, await roleRes.text());
    }

    // 5. Test Unauthorized Role Route (/api/admin/stats) - Higher Official Only
    console.log('\n4. Testing /api/admin/stats (Role: higher_official) - Should Fail for Demo User...');
    const adminRes = await fetch(`${SERVER_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (adminRes.status === 403) {
        console.log('Success: Access Denied as expected (403).');
    } else {
        console.log('Unexpected result:', adminRes.status, await adminRes.text());
    }
}

testServer();
