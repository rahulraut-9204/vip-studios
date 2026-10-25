import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envText = fs.readFileSync('.env', 'utf8');
const env = {};
for (const line of envText.split('\n')) {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
}

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function check() {
  console.log('Testing Supabase project tables...');
  
  const { data: projects, error: pErr } = await supabase.from('projects').select('id, title').limit(5);
  if (pErr) {
    console.log('❌ projects table:', pErr.message);
  } else {
    console.log('✅ projects table is ready! (Existing records:', projects.length, ')');
  }

  const { data: enquiries, error: eErr } = await supabase.from('enquiries').select('id').limit(5);
  if (eErr) {
    console.log('❌ enquiries table:', eErr.message);
  } else {
    console.log('✅ enquiries table is ready!');
  }

  const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
  if (bErr) {
    console.log('❌ storage buckets:', bErr.message);
  } else {
    const names = buckets ? buckets.map(b => b.name) : [];
    if (names.includes('vip-studios-projects')) {
      console.log('✅ vip-studios-projects storage bucket is ready!');
    } else {
      console.log('⚠️ Storage buckets found:', names.join(', ') || 'none');
    }
  }
}

check().catch(console.error);
