const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'frontend/.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase
    .from('prompts')
    .select(`
      id,
      name,
      created_at,
      prompt_versions (
        id, content, version_num, analysis_score, analysis_metrics
      )
    `)
    .limit(1);
    
  console.log("Error:", error?.message);
  console.log("Data:", data);
}

check();
