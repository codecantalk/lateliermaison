import { createClient } from '@/lib/supabase/server';
import PricingEditor from './PricingEditor';

export const revalidate = 0; // Don't cache admin pages

export default async function PricingPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pricing_config')
    .select('value')
    .eq('key', 'cleaning_pricing')
    .single();

  if (error || !data) {
    return (
      <div>
        <h2>Pricing Engine Configuration</h2>
        <p>No pricing data found in the database. Please ensure you ran the SQL seed script.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Pricing Engine Configuration</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
        Update your base rates, add-ons, and dynamic pricing rules. Changes will reflect immediately on the live calculator.
      </p>
      
      <PricingEditor initialData={data.value} />
    </div>
  );
}
