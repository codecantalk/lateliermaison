'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import styles from '../pricing/pricing.module.css';

export default function SettingsEditor({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const supabase = createClient();

  const handleChange = (key: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ value: data })
        .eq('key', 'contact_info');

      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Settings successfully updated!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update settings.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  return (
    <div className={styles.editor}>
      {message.text && (
        <div className={`${styles.alert} ${message.type === 'success' ? styles.alertSuccess : styles.alertError}`}>
          {message.text}
        </div>
      )}

      <section className={styles.section} style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <h3>Contact Information</h3>
        <div className={styles.grid}>
          
          <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
            <label>Email Address</label>
            <div className={styles.inputWrapper}>
              <input 
                type="email" 
                value={data.email || ''} 
                onChange={(e) => handleChange('email', e.target.value)}
                style={{ paddingLeft: '1rem' }}
              />
            </div>
          </div>

          <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
            <label>Phone Number</label>
            <div className={styles.inputWrapper}>
              <input 
                type="text" 
                value={data.phone || ''} 
                onChange={(e) => handleChange('phone', e.target.value)}
                style={{ paddingLeft: '1rem' }}
              />
            </div>
          </div>

          <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
            <label>Physical Address</label>
            <div className={styles.inputWrapper}>
              <input 
                type="text" 
                value={data.address || ''} 
                onChange={(e) => handleChange('address', e.target.value)}
                style={{ paddingLeft: '1rem' }}
              />
            </div>
          </div>

          <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
            <label>Availability / Service Area</label>
            <div className={styles.inputWrapper}>
              <input 
                type="text" 
                value={data.availability || ''} 
                onChange={(e) => handleChange('availability', e.target.value)}
                style={{ paddingLeft: '1rem' }}
              />
            </div>
          </div>
          
        </div>
      </section>

      <div className={styles.actions}>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className={styles.saveBtn}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
