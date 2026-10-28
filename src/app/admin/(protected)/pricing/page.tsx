import { createClient } from '@/lib/supabase/server';
import PricingEditor from './PricingEditor';

export const revalidate = 0; // Don't cache admin pages

export default async function PricingPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('pricing_config')
    .select('key, value')
    .in('key', [
      'cleaning_pricing', 
      'remodeling_pricing', 
      'construction_pricing',
      'tv_pricing',
      'painting_pricing',
      'flooring_pricing',
      'estate_pricing'
    ]);

  const pricingData = {
    cleaning: data?.find(d => d.key === 'cleaning_pricing')?.value,
    remodeling: data?.find(d => d.key === 'remodeling_pricing')?.value,
    construction: data?.find(d => d.key === 'construction_pricing')?.value,
    tv: data?.find(d => d.key === 'tv_pricing')?.value,
    painting: data?.find(d => d.key === 'painting_pricing')?.value,
    flooring: data?.find(d => d.key === 'flooring_pricing')?.value,
    estate: data?.find(d => d.key === 'estate_pricing')?.value,
  };

  return (
    <div>
      <h2 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Pricing Engine Configuration</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
        Calibrate live pricing algorithms, base rates, room additions, multipliers, and trade ranges across your entire platform. Changes immediately synchronize with the customer-facing booking calculator.
      </p>
      
      <PricingEditor initialData={pricingData} />
    </div>
  );
}

