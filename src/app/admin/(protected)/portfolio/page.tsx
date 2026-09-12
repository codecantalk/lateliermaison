import { createClient } from '@/lib/supabase/server';
import PortfolioEditor from './PortfolioEditor';

export const revalidate = 0;

export default async function PortfolioPage() {
  const supabase = await createClient();

  const { data: items, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    return <div>Error loading portfolio: {error.message}</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Portfolio Gallery</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
        Manage the images that appear on the Portfolio page. Use standard image paths (e.g. <code>/luxury-hero.jpg</code>) or full URLs.
      </p>
      
      <PortfolioEditor initialItems={items || []} />
    </div>
  );
}
