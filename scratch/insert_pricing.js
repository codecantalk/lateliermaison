const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envPath = '.env.local';
const envFile = fs.readFileSync(envPath, 'utf8');
const lines = envFile.split('\n');

let url = '';
let key = '';

lines.forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    url = line.split('=')[1].trim();
  }
  if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
    key = line.split('=')[1].trim();
  }
});

const supabase = createClient(url, key);

async function run() {
  const remodelingPricing = {
    scope: { cosmetic: 5000, partial: 10000, full: 20000 },
    size: { small: -2000, medium: 0, large: 5000, master: 10000 }
  };

  const constructionPricing = {
    grade: { luxury: 250, ultra: 400, monumental: 700 }
  };

  const res1 = await supabase.from('pricing_config').upsert([
    { key: 'remodeling_pricing', value: remodelingPricing }
  ]);
  console.log('Remodeling:', res1.error ? res1.error : 'Success');

  const res2 = await supabase.from('pricing_config').upsert([
    { key: 'construction_pricing', value: constructionPricing }
  ]);
  console.log('Construction:', res2.error ? res2.error : 'Success');
}

run();
