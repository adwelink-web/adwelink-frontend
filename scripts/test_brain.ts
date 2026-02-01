
import { createClient } from '@supabase/supabase-js';
import { Database } from '../lib/database.types';

// Load env from .env.local if present, otherwise rely on process env
// In a real run, we might need to manually set these or ensure .env.local is loaded
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eafkcvwshcedsilumphy.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
    console.error("Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set.");
    process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

async function testBrain() {
    console.log("🧠 Testing Aditi's Brain Connection...");

    // 1. Fetch a known Institute (or just pick the first one)
    const { data: institutes, error: instError } = await supabase
        .from('institutes')
        .select('id, name')
        .limit(1);

    if (instError || !institutes || institutes.length === 0) {
        console.error("❌ Failed to fetch institute:", instError);
        return;
    }

    const institute = institutes[0];
    console.log(`✅ Found Institute: ${institute.name} (${institute.id})`);

    // 2. Query the Brain View for 'sales' (Aditi Counselor)
    console.log("\n🔍 Querying agent_runtime_brain for 'sales' agent...");

    const { data: brainData, error: brainError } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('agent_runtime_brain' as any)
        .select('*')
        .eq('institute_id', institute.id)
        .eq('agent_slug', 'sales') // 'sales' is the slug for Counselor
        .single();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const brain = brainData as any;

    if (brainError) {
        console.error("❌ Failed to fetch Brain:", brainError);
        // It might be legal to have no config if defaults aren't set up, 
        // but 'agent_runtime_brain' should usually return the global template at least if properly joined.
        // However, if the view requires an entry in institute_agent_config, it might fail if that's missing.
        return;
    }

    if (!brain) {
        console.log("⚠️ No Brain found for this institute (Brain Dead?).");
        return;
    }

    console.log("✅ Brain Loaded Successfully!");
    console.log("---------------------------------------------------");
    console.log(`🤖 Identity: ${brain.identity_prompt ? brain.identity_prompt.substring(0, 50) + "..." : "NULL"}`);
    console.log(`📜 Rules: ${brain.psychology_rules ? "Present" : "Missing"}`);
    console.log(`🛠 Tools: ${brain.tools_config ? "Present" : "Missing"}`);
    console.log("---------------------------------------------------");
    console.log("\nVerdict: Local Code is successfully talking to the Live Brain. 🧠⚡");
}

testBrain();
