'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Refrigerator, Microwave, UtensilsCrossed, Shirt, 
  Sparkles, Archive, LayoutGrid, Hammer, CarFront, Tent 
} from 'lucide-react'
import styles from './pricing.module.css';

const ICONS_MAP: Record<string, React.ReactNode> = {
  fridge: <Refrigerator size={24} strokeWidth={1.5} />,
  oven: <Microwave size={24} strokeWidth={1.5} />,
  dishwashing: <UtensilsCrossed size={24} strokeWidth={1.5} />,
  laundry: <Shirt size={24} strokeWidth={1.5} />,
  deep: <Sparkles size={24} strokeWidth={1.5} />,
  cabinets: <Archive size={24} strokeWidth={1.5} />,
  windows: <LayoutGrid size={24} strokeWidth={1.5} />,
  post_construction: <Hammer size={24} strokeWidth={1.5} />,
  garage: <CarFront size={24} strokeWidth={1.5} />,
  porch: <Tent size={24} strokeWidth={1.5} />
}

export default function PricingEditor({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState<'cleaning' | 'remodeling' | 'construction'>('cleaning');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const supabase = createClient();

  // --- Cleaning Handlers ---
  const handleBaseChange = (type: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      cleaning: {
        ...prev.cleaning,
        base: { ...prev.cleaning.base, [type]: Number(value) }
      }
    }));
  };

  const handleAdditionChange = (type: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      cleaning: {
        ...prev.cleaning,
        additions: { ...prev.cleaning.additions, [type]: Number(value) }
      }
    }));
  };

  const handleFixedExtraChange = (key: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      cleaning: {
        ...prev.cleaning,
        fixedExtras: {
          ...prev.cleaning.fixedExtras,
          [key]: { ...prev.cleaning.fixedExtras[key], price: Number(value) }
        }
      }
    }));
  };

  const handleDynamicExtraChange = (key: string, type: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      cleaning: {
        ...prev.cleaning,
        dynamicExtras: {
          ...prev.cleaning.dynamicExtras,
          [key]: {
            ...prev.cleaning.dynamicExtras[key],
            prices: { ...prev.cleaning.dynamicExtras[key].prices, [type]: Number(value) }
          }
        }
      }
    }));
  };

  // --- Remodeling Handlers ---
  const handleRemodelingChange = (category: 'scope' | 'size', key: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      remodeling: {
        ...prev.remodeling,
        [category]: { ...prev.remodeling[category], [key]: Number(value) }
      }
    }));
  };

  // --- Construction Handlers ---
  const handleConstructionChange = (key: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      construction: {
        ...prev.construction,
        grade: { ...prev.construction.grade, [key]: Number(value) }
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const updates = [
        { key: 'cleaning_pricing', value: data.cleaning },
        { key: 'remodeling_pricing', value: data.remodeling },
        { key: 'construction_pricing', value: data.construction },
      ];

      for (const update of updates) {
        if (update.value) {
          const { error } = await supabase
            .from('pricing_config')
            .update({ value: update.value })
            .eq('key', update.key);

          if (error) throw error;
        }
      }
      
      setMessage({ type: 'success', text: 'All Pricing successfully updated!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update pricing.' });
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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        {['cleaning', 'remodeling', 'construction'].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab as any)}
            style={{ 
              padding: '0.75rem 1.5rem', 
              borderRadius: '8px', 
              border: activeTab === tab ? '2px solid var(--color-primary)' : '1px solid #cbd5e1', 
              background: activeTab === tab ? 'rgba(65, 105, 225, 0.05)' : '#fff',
              color: activeTab === tab ? 'var(--color-primary)' : '#475569',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tab} Pricing
          </button>
        ))}
      </div>

      {activeTab === 'cleaning' && data.cleaning && (
        <div>
          {/* Base Rates */}
          <section className={styles.section}>
            <h3>Base Rates by Property Type</h3>
            <div className={styles.grid}>
              {Object.entries(data.cleaning.base).map(([type, price]) => (
                <div key={type} className={styles.cardInput}>
                  <div className={styles.cardIconHeader}>
                    <label>{type.replace(/([A-Z])/g, ' $1').toUpperCase()}</label>
                  </div>
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input 
                      type="number" 
                      value={price as number} 
                      onChange={(e) => handleBaseChange(type, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Standard Additions */}
          <section className={styles.section}>
            <h3>Room Additions</h3>
            <div className={styles.grid}>
              {Object.entries(data.cleaning.additions).map(([type, price]) => (
                <div key={type} className={styles.cardInput}>
                  <div className={styles.cardIconHeader}>
                    <label>Per Extra {type.toUpperCase()}</label>
                  </div>
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input 
                      type="number" 
                      value={price as number} 
                      onChange={(e) => handleAdditionChange(type, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Fixed Extras */}
          <section className={styles.section}>
            <h3>Fixed Price Add-ons</h3>
            <div className={styles.grid}>
              {Object.entries(data.cleaning.fixedExtras).map(([key, item]: [string, any]) => (
                <div key={key} className={styles.cardInput}>
                  <div className={styles.cardIconHeader}>
                    <div className={styles.iconWrapper}>{ICONS_MAP[key]}</div>
                    <label>{item.label}</label>
                  </div>
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input 
                      type="number" 
                      value={item.price} 
                      onChange={(e) => handleFixedExtraChange(key, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Dynamic Extras */}
          <section className={styles.section}>
            <h3>Dynamic Price Add-ons (Varies by Property)</h3>
            <div className={styles.dynamicGrid}>
              {Object.entries(data.cleaning.dynamicExtras).map(([key, item]: [string, any]) => (
                <div key={key} className={styles.cardInput}>
                  <div className={styles.cardIconHeader}>
                    <div className={styles.iconWrapper}>{ICONS_MAP[key]}</div>
                    <h4>{item.label}</h4>
                  </div>
                  <div className={styles.miniGrid}>
                    {Object.entries(item.prices).map(([type, price]) => (
                      <div key={type} className={styles.inputGroupSmall}>
                        <label>{type}</label>
                        <div className={styles.inputWrapper}>
                          <span className={styles.currencySymbol}>$</span>
                          <input 
                            type="number" 
                            value={price as number} 
                            onChange={(e) => handleDynamicExtraChange(key, type, e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'remodeling' && data.remodeling && (
        <div>
          <section className={styles.section}>
            <h3>Remodeling Scope Pricing</h3>
            <div className={styles.grid}>
              {Object.entries(data.remodeling.scope).map(([key, price]) => (
                <div key={key} className={styles.cardInput}>
                  <div className={styles.cardIconHeader}>
                    <label>{key.toUpperCase()} SCOPE</label>
                  </div>
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input 
                      type="number" 
                      value={price as number} 
                      onChange={(e) => handleRemodelingChange('scope', key, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className={styles.section}>
            <h3>Remodeling Size Multipliers/Additions</h3>
            <div className={styles.grid}>
              {Object.entries(data.remodeling.size).map(([key, price]) => (
                <div key={key} className={styles.cardInput}>
                  <div className={styles.cardIconHeader}>
                    <label>{key.toUpperCase()} SIZE</label>
                  </div>
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input 
                      type="number" 
                      value={price as number} 
                      onChange={(e) => handleRemodelingChange('size', key, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'construction' && data.construction && (
        <div>
          <section className={styles.section}>
            <h3>Construction Base Rates (per sqft)</h3>
            <div className={styles.grid}>
              {Object.entries(data.construction.grade).map(([key, price]) => (
                <div key={key} className={styles.cardInput}>
                  <div className={styles.cardIconHeader}>
                    <label>{key.toUpperCase()} GRADE</label>
                  </div>
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input 
                      type="number" 
                      value={price as number} 
                      onChange={(e) => handleConstructionChange(key, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      <div className={styles.actions}>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className={styles.saveBtn}
        >
          {isSaving ? 'Saving Changes...' : 'Save Pricing Engine Rules'}
        </button>
      </div>
    </div>
  );
}
