import { createClient } from '@/lib/supabase/server';
import SettingsEditor from './SettingsEditor';

export const revalidate = 0; // Don't cache admin pages

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'contact_info')
    .single();

  if (error || !data) {
    return (
      <div>
        <h2>Site Settings</h2>
        <p>No settings data found in the database. Please ensure you ran the SQL seed script.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Global Settings</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
        Manage contact information, footer text, and other site-wide settings.
      </p>
      
      <SettingsEditor initialData={data.value} />
    </div>
  );
}
