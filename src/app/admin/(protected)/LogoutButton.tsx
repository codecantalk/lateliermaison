'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <button onClick={handleLogout} className="btn btn-outline" style={{ cursor: 'pointer', padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '4px', background: 'transparent' }}>
      Logout
    </button>
  );
}
