import { createClient } from '@/lib/supabase/server';
import PricingEditor from './PricingEditor';

export const revalidate = 0; // Don't cache admin pages

export default async function PricingPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pricing_config')
    .select('key, value')
    .in('key', ['cleaning_pricing', 'remodeling_pricing', 'construction_pricing']);

  if (error || !data || data.length === 0) {
    return (
      <div>
        <h2>Pricing Engine Configuration</h2>
        <p>No pricing data found in the database. Please ensure you ran the SQL seed script.</p>
      </div>
    );
  }

  const pricingData = {
    cleaning: data.find(d => d.key === 'cleaning_pricing')?.value,
    remodeling: data.find(d => d.key === 'remodeling_pricing')?.value,
    construction: data.find(d => d.key === 'construction_pricing')?.value,
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Pricing Engine Configuration</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
        Update your base rates, add-ons, and dynamic pricing rules across all service lines. Changes will reflect immediately on the live calculator.
      </p>
      
      <PricingEditor initialData={pricingData} />
    </div>
  );
}
