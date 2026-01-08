
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkColumns() {
    console.log("Checking Persons columns...");
    const { data: persons, error: pError } = await supabase.from('persons').select('*').limit(1);
    if (pError) console.error('Persons Error:', pError);
    else console.log('Persons Keys:', Object.keys(persons[0] || {}));

    console.log("Checking Families columns (by insertion attempt)...");
    // Try to insert with family_name. The return should have keys.
    const { data: family, error: fError } = await supabase
        .from('families')
        .insert({ family_name: "Test Family Probe" })
        .select()
        .single();

    if (fError) {
        console.error('Families Insert Error:', fError);
    } else {
        console.log('Families Keys (from insert):', Object.keys(family));
        // Cleanup
        await supabase.from('families').delete().eq(Object.keys(family)[0], family[Object.keys(family)[0]]);
    }
}

checkColumns();
