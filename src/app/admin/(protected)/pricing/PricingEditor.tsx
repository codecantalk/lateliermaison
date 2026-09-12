'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Refrigerator, Microwave, UtensilsCrossed, Shirt, 
  Sparkles, Archive, LayoutGrid, Hammer, CarFront, Tent 
} from 'lucide-react'
import styles from './pricing.module.css';

const ICONS_MAP: Record<string, JSX.Element> = {
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
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const supabase = createClient();

  const handleBaseChange = (type: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      base: { ...prev.base, [type]: Number(value) }
    }));
  };

  const handleAdditionChange = (type: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      additions: { ...prev.additions, [type]: Number(value) }
    }));
  };

  const handleFixedExtraChange = (key: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      fixedExtras: {
        ...prev.fixedExtras,
        [key]: { ...prev.fixedExtras[key], price: Number(value) }
      }
    }));
  };

  const handleDynamicExtraChange = (key: string, type: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      dynamicExtras: {
        ...prev.dynamicExtras,
        [key]: {
          ...prev.dynamicExtras[key],
          prices: { ...prev.dynamicExtras[key].prices, [type]: Number(value) }
        }
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('pricing_config')
        .update({ value: data })
        .eq('key', 'cleaning_pricing');

      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Pricing successfully updated!' });
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

      {/* Base Rates */}
      <section className={styles.section}>
        <h3>Base Rates by Property Type</h3>
        <div className={styles.grid}>
          {Object.entries(data.base).map(([type, price]) => (
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
          {Object.entries(data.additions).map(([type, price]) => (
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
          {Object.entries(data.fixedExtras).map(([key, item]: [string, any]) => (
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
          {Object.entries(data.dynamicExtras).map(([key, item]: [string, any]) => (
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
