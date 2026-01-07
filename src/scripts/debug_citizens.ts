import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkCitizens() {
    console.log('Checking citizens in database...');

    // Get all citizens
    const { data: citizens, error } = await supabase
        .from('citizens')
        .select('id, full_name, family_id');

    if (error) {
        console.error('Error fetching citizens:', error);
        return;
    }

    console.log(`Total Citizens: ${citizens.length}`);

    const unlinked = citizens.filter(c => !c.family_id);
    console.log(`Unlinked Citizens (Eligible for Head): ${unlinked.length}`);

    if (unlinked.length === 0) {
        console.log('WARNING: No unlinked citizens found using direct DB check.');
    } else {
        console.log('Sample Unlinked Citizens:');
        unlinked.slice(0, 5).forEach(c => console.log(`- ${c.full_name} (${c.id})`));
    }

    // Also test the API query logic simulation
    const { data: apiSim } = await supabase
        .from('citizens')
        .select('*')
        .is('family_id', null);

    console.log(`\nQuery .is('family_id', null) found: ${apiSim?.length}`);
}

checkCitizens();
