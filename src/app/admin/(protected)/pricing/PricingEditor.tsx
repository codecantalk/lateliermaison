'use client';

import { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Refrigerator, Microwave, UtensilsCrossed, Shirt, 
  Sparkles, Archive, LayoutGrid, Hammer, CarFront, Tent,
  Tv, Paintbrush, Layers, Wrench, Info, Calculator,
  Sliders, ShieldCheck, CheckCircle2, AlertCircle
} from 'lucide-react'
import styles from './pricing.module.css';

const ICONS_MAP: Record<string, React.ReactNode> = {
  fridge: <Refrigerator size={22} strokeWidth={1.5} />,
  oven: <Microwave size={22} strokeWidth={1.5} />,
  dishwashing: <UtensilsCrossed size={22} strokeWidth={1.5} />,
  laundry: <Shirt size={22} strokeWidth={1.5} />,
  deep: <Sparkles size={22} strokeWidth={1.5} />,
  cabinets: <Archive size={22} strokeWidth={1.5} />,
  windows: <LayoutGrid size={22} strokeWidth={1.5} />,
  post_construction: <Hammer size={22} strokeWidth={1.5} />,
  garage: <CarFront size={22} strokeWidth={1.5} />,
  porch: <Tent size={22} strokeWidth={1.5} />
}

export const DEFAULT_CLEANING = {
  base: { apartment: 169, townhome: 199, single: 229 },
  additions: { bedroom: 30, bathroom: 35 },
  multipliers: {
    deepClean: 1.35,
    moveInOut: 1.45,
    moderateCondition: 1.15,
    heavyCondition: 1.30,
    twoFloors: 15,
    threePlusFloors: 30,
    monTueDiscountPercent: 10
  },
  fixedExtras: {
    fridge: { label: 'Inside Refrigerator', price: 40 },
    oven: { label: 'Inside Oven', price: 40 },
    dishwashing: { label: 'Dishes Detail', price: 25 },
    laundry: { label: 'Laundry Wash & Fold', price: 35 },
    deep: { label: 'Deep Baseboard Scrub', price: 50 },
    cabinets: { label: 'Inside Cabinets', price: 45 },
  },
  dynamicExtras: {
    windows: { label: 'Interior Windows', prices: { apartment: 35, townhome: 55, single: 75 } },
    garage: { label: 'Garage Sweep', prices: { apartment: 0, townhome: 40, single: 55 } },
  }
};

export const DEFAULT_TV = {
  screenSize: { small: 149, medium: 179, large: 229 },
  bracketType: { tilt: 0, motion: 60, client_provided: -20 },
  wallSurface: { drywall: 0, brick: 75 },
  wireConcealment: { none: 0, in_wall: 95 }
};

export const DEFAULT_REMODEL = {
  scope: { cosmetic: 5000, partial: 10000, full: 20000 },
  size: { small: -2000, medium: 0, large: 5000, master: 10000 }
};

export const DEFAULT_CONST = {
  grade: { luxury: 250, ultra: 400, monumental: 700 }
};

export const DEFAULT_PAINT = {
  touchup: { min: 195, max: 350, label: 'Accent Wall & Touch-Up' },
  single_room: { min: 550, max: 950, label: 'Single Room (Walls & Trim)' },
  multi_room: { min: 1800, max: 4500, label: 'Multiple Rooms / Interior' },
  exterior: { min: 3500, max: 9500, label: 'Exterior Facade & Siding' }
};

export const DEFAULT_FLOOR = {
  repair: { min: 195, max: 350, label: 'Scratch Repair & Transition' },
  single_room: { min: 900, max: 2200, label: 'Single Room Installation' },
  multi_room: { min: 3500, max: 8500, label: 'Multi-Room Hardwood / Tile' },
  whole_estate: { min: 8000, max: 22000, label: 'Full Estate Installation' }
};

export const DEFAULT_ESTATE = {
  plumbing: {
    label: 'Master Plumbing',
    diagnostic: [195, 320],
    minor: [450, 1200],
    major: [2500, 8500],
  },
  electrical: {
    label: 'Licensed Electrical',
    diagnostic: [195, 350],
    minor: [480, 1400],
    major: [2800, 9500],
  },
  lighting: {
    label: 'Architectural & Smart Lighting',
    diagnostic: [175, 300],
    minor: [450, 1250],
    major: [2200, 7000],
  },
  'home theater': {
    label: 'Bespoke Home Theater & AV',
    diagnostic: [250, 450],
    minor: [850, 2400],
    major: [5000, 18000],
  },
  handyman: {
    label: 'Master Handyman Services',
    diagnostic: [160, 260],
    minor: [380, 950],
    major: [1800, 5500],
  },
};

type ActiveTab = 'cleaning' | 'tv' | 'remodeling' | 'construction' | 'painting' | 'flooring' | 'estate';

export default function PricingEditor({ initialData }: { initialData: any }) {
  const [data, setData] = useState({
    cleaning: {
      ...DEFAULT_CLEANING,
      ...(initialData?.cleaning || {}),
      base: { ...DEFAULT_CLEANING.base, ...(initialData?.cleaning?.base || {}) },
      additions: { ...DEFAULT_CLEANING.additions, ...(initialData?.cleaning?.additions || {}) },
      multipliers: { ...DEFAULT_CLEANING.multipliers, ...(initialData?.cleaning?.multipliers || {}) },
      fixedExtras: { ...DEFAULT_CLEANING.fixedExtras, ...(initialData?.cleaning?.fixedExtras || {}) },
      dynamicExtras: { ...DEFAULT_CLEANING.dynamicExtras, ...(initialData?.cleaning?.dynamicExtras || {}) },
    },
    tv: {
      ...DEFAULT_TV,
      ...(initialData?.tv || {}),
      screenSize: { ...DEFAULT_TV.screenSize, ...(initialData?.tv?.screenSize || {}) },
      bracketType: { ...DEFAULT_TV.bracketType, ...(initialData?.tv?.bracketType || {}) },
      wallSurface: { ...DEFAULT_TV.wallSurface, ...(initialData?.tv?.wallSurface || {}) },
      wireConcealment: { ...DEFAULT_TV.wireConcealment, ...(initialData?.tv?.wireConcealment || {}) },
    },
    remodeling: {
      ...DEFAULT_REMODEL,
      ...(initialData?.remodeling || {}),
      scope: { ...DEFAULT_REMODEL.scope, ...(initialData?.remodeling?.scope || {}) },
      size: { ...DEFAULT_REMODEL.size, ...(initialData?.remodeling?.size || {}) },
    },
    construction: {
      ...DEFAULT_CONST,
      ...(initialData?.construction || {}),
      grade: { ...DEFAULT_CONST.grade, ...(initialData?.construction?.grade || {}) },
    },
    painting: {
      ...DEFAULT_PAINT,
      ...(initialData?.painting || {}),
    },
    flooring: {
      ...DEFAULT_FLOOR,
      ...(initialData?.flooring || {}),
    },
    estate: {
      ...DEFAULT_ESTATE,
      ...(initialData?.estate || {}),
    },
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('cleaning');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const supabase = createClient();

  // --- Live Interactive Simulator State (For Cleaning) ---
  const [simHouseType, setSimHouseType] = useState<'apartment' | 'townhome' | 'single'>('single');
  const [simBedrooms, setSimBedrooms] = useState(3);
  const [simBathrooms, setSimBathrooms] = useState(2);
  const [simFloors, setSimFloors] = useState(1);
  const [simPackage, setSimPackage] = useState<'standard' | 'deep' | 'move_in_out'>('standard');
  const [simCondition, setSimCondition] = useState<'standard' | 'moderate' | 'heavy'>('standard');
  const [simMondayDiscount, setSimMondayDiscount] = useState(false);
  const [simExtraOven, setSimExtraOven] = useState(false);
  const [simExtraFridge, setSimExtraFridge] = useState(false);

  // Simulated Price calculation based on current state numbers
  const simulatedPrice = useMemo(() => {
    const cl = data.cleaning;
    let base = cl.base[simHouseType] || 229;
    let total = base;

    if (simBedrooms > 1) {
      total += (simBedrooms - 1) * (cl.additions.bedroom || 30);
    }
    if (simBathrooms > 1) {
      total += (simBathrooms - 1) * (cl.additions.bathroom || 35);
    }

    if (simFloors === 2) total += (cl.multipliers.twoFloors || 15);
    else if (simFloors >= 3) total += (cl.multipliers.threePlusFloors || 30);

    if (simCondition === 'moderate') total = Math.round(total * (cl.multipliers.moderateCondition || 1.15));
    else if (simCondition === 'heavy') total = Math.round(total * (cl.multipliers.heavyCondition || 1.30));

    if (simPackage === 'deep') total = Math.round(total * (cl.multipliers.deepClean || 1.35));
    else if (simPackage === 'move_in_out') total = Math.round(total * (cl.multipliers.moveInOut || 1.45));

    if (simExtraOven) total += (cl.fixedExtras.oven?.price || 40);
    if (simExtraFridge) total += (cl.fixedExtras.fridge?.price || 40);

    if (simMondayDiscount) {
      const discount = Math.round(total * ((cl.multipliers.monTueDiscountPercent || 10) / 100));
      total -= discount;
    }

    return Math.round(total);
  }, [data.cleaning, simHouseType, simBedrooms, simBathrooms, simFloors, simPackage, simCondition, simMondayDiscount, simExtraOven, simExtraFridge]);

  // --- Handlers ---
  const handleCleaningBase = (type: string, val: string) => {
    setData((p: any) => ({
      ...p,
      cleaning: { ...p.cleaning, base: { ...p.cleaning.base, [type]: Number(val) } }
    }));
  };

  const handleCleaningAddition = (type: string, val: string) => {
    setData((p: any) => ({
      ...p,
      cleaning: { ...p.cleaning, additions: { ...p.cleaning.additions, [type]: Number(val) } }
    }));
  };

  const handleCleaningMultiplier = (key: string, val: string) => {
    setData((p: any) => ({
      ...p,
      cleaning: { ...p.cleaning, multipliers: { ...p.cleaning.multipliers, [key]: Number(val) } }
    }));
  };

  const handleCleaningFixedExtra = (key: string, val: string) => {
    setData((p: any) => ({
      ...p,
      cleaning: {
        ...p.cleaning,
        fixedExtras: {
          ...p.cleaning.fixedExtras,
          [key]: { ...p.cleaning.fixedExtras[key], price: Number(val) }
        }
      }
    }));
  };

  const handleCleaningDynamicExtra = (key: string, type: string, val: string) => {
    setData((p: any) => ({
      ...p,
      cleaning: {
        ...p.cleaning,
        dynamicExtras: {
          ...p.cleaning.dynamicExtras,
          [key]: {
            ...p.cleaning.dynamicExtras[key],
            prices: { ...p.cleaning.dynamicExtras[key].prices, [type]: Number(val) }
          }
        }
      }
    }));
  };

  // TV Handlers
  const handleTvChange = (category: 'screenSize' | 'bracketType' | 'wallSurface' | 'wireConcealment', key: string, val: string) => {
    setData((p: any) => ({
      ...p,
      tv: {
        ...p.tv,
        [category]: { ...p.tv[category], [key]: Number(val) }
      }
    }));
  };

  // Remodeling Handlers
  const handleRemodelingChange = (category: 'scope' | 'size', key: string, val: string) => {
    setData((p: any) => ({
      ...p,
      remodeling: { ...p.remodeling, [category]: { ...p.remodeling[category], [key]: Number(val) } }
    }));
  };

  // Construction Handlers
  const handleConstructionChange = (key: string, val: string) => {
    setData((p: any) => ({
      ...p,
      construction: { ...p.construction, grade: { ...p.construction.grade, [key]: Number(val) } }
    }));
  };

  // Painting Handlers
  const handlePaintRange = (key: string, bound: 'min' | 'max', val: string) => {
    setData((p: any) => ({
      ...p,
      painting: {
        ...p.painting,
        [key]: { ...p.painting[key], [bound]: Number(val) }
      }
    }));
  };

  // Flooring Handlers
  const handleFloorRange = (key: string, bound: 'min' | 'max', val: string) => {
    setData((p: any) => ({
      ...p,
      flooring: {
        ...p.flooring,
        [key]: { ...p.flooring[key], [bound]: Number(val) }
      }
    }));
  };

  // Estate Handlers
  const handleEstateRange = (tradeKey: string, tier: 'diagnostic' | 'minor' | 'major', boundIndex: 0 | 1, val: string) => {
    setData((p: any) => {
      const curTier = [...p.estate[tradeKey][tier]];
      curTier[boundIndex] = Number(val);
      return {
        ...p,
        estate: {
          ...p.estate,
          [tradeKey]: {
            ...p.estate[tradeKey],
            [tier]: curTier
          }
        }
      };
    });
  };

  // Save to Supabase
  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const updates = [
        { key: 'cleaning_pricing', value: data.cleaning },
        { key: 'tv_pricing', value: data.tv },
        { key: 'remodeling_pricing', value: data.remodeling },
        { key: 'construction_pricing', value: data.construction },
        { key: 'painting_pricing', value: data.painting },
        { key: 'flooring_pricing', value: data.flooring },
        { key: 'estate_pricing', value: data.estate },
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('pricing_config')
          .upsert({ key: update.key, value: update.value }, { onConflict: 'key' });

        if (error) throw error;
      }

      setMessage({ type: 'success', text: 'All pricing rules and mathematical formulas successfully updated and published to the live calculator!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update pricing.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 6000);
    }
  };

  return (
    <div className={styles.editor}>
      {message.text && (
        <div className={`${styles.alert} ${message.type === 'success' ? styles.alertSuccess : styles.alertError}`}>
          {message.text}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className={styles.tabsNav}>
        {[
          { id: 'cleaning', label: 'House Cleaning', icon: <Sparkles size={16} /> },
          { id: 'tv', label: 'TV Mounting', icon: <Tv size={16} /> },
          { id: 'remodeling', label: 'Remodeling', icon: <Hammer size={16} /> },
          { id: 'construction', label: 'New Construction', icon: <Layers size={16} /> },
          { id: 'painting', label: 'Painting', icon: <Paintbrush size={16} /> },
          { id: 'flooring', label: 'Flooring', icon: <LayoutGrid size={16} /> },
          { id: 'estate', label: 'Master Trades & Handyman', icon: <Wrench size={16} /> },
        ].map((tab) => (
          <button 
            key={tab.id} 
            type="button"
            onClick={() => setActiveTab(tab.id as ActiveTab)}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ''}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 1. HOUSE CLEANING PRICING TAB                                             */}
      {/* ========================================================================= */}
      {activeTab === 'cleaning' && (
        <div>
          {/* Instructions & Mathematical Breakdown */}
          <div className={styles.instructionBox}>
            <div className={styles.instructionHeader}>
              <Info size={20} color="#1d4ed8" />
              <span>How House Cleaning Pricing is Calculated Mathematically</span>
            </div>
            <p className={styles.instructionText}>
              The customer calculator uses a transparent tiered calculation to quote exact flat rates. When you adjust base rates or multipliers below, the customer’s quote recalculates live:
            </p>
            <div className={styles.formulaBadge}>
              Final Price = [(Base Rate + Extra Bedrooms + Extra Bathrooms + Floor Fee) × Package Multiplier × Condition Multiplier] + Selected Add-ons - Mon/Tue Discount
            </div>
            <ul className={styles.instructionPoints}>
              <li className={styles.instructionPointItem}>
                <span className={styles.instructionBullet}>•</span>
                <span><strong>Base Rates:</strong> The foundational rate for a 1-bed / 1-bath home by residence type (Single Family, Townhome, Apartment).</span>
              </li>
              <li className={styles.instructionPointItem}>
                <span className={styles.instructionBullet}>•</span>
                <span><strong>Room Additions:</strong> Added for every additional bedroom (bed &gt; 1) and bathroom (bath &gt; 1).</span>
              </li>
              <li className={styles.instructionPointItem}>
                <span className={styles.instructionBullet}>•</span>
                <span><strong>Package Multiplier:</strong> Deep Clean (standard is 1.35x = +35%) and Move In/Out (standard is 1.45x = +45%) scale the labor time accordingly.</span>
              </li>
              <li className={styles.instructionPointItem}>
                <span className={styles.instructionBullet}>•</span>
                <span><strong>Condition Multiplier:</strong> Moderate buildup (+15%) or Heavy buildup (+30%) scales the labor rate.</span>
              </li>
              <li className={styles.instructionPointItem}>
                <span className={styles.instructionBullet}>•</span>
                <span><strong>Add-ons:</strong> Fixed or dynamic services (oven, fridge, windows) added after base labor calculation.</span>
              </li>
            </ul>
          </div>

          {/* Interactive Live Preview Simulator */}
          <div className={styles.simulatorBox}>
            <div className={styles.simulatorHeader}>
              <div className={styles.simulatorTitle}>
                <Calculator size={20} color="#d97706" />
                <span>Live Pricing Simulator (Test Your Rates Instantly)</span>
              </div>
              <div className={styles.simulatorPreviewBadge}>
                Live Computed Quote: ${simulatedPrice}
              </div>
            </div>
            <div className={styles.simulatorControls}>
              <div className={styles.simulatorSelectGroup}>
                <label>Property Type</label>
                <select value={simHouseType} onChange={(e) => setSimHouseType(e.target.value as any)}>
                  <option value="apartment">Apartment</option>
                  <option value="townhome">Townhome</option>
                  <option value="single">Single Family Home</option>
                </select>
              </div>

              <div className={styles.simulatorSelectGroup}>
                <label>Bedrooms</label>
                <select value={simBedrooms} onChange={(e) => setSimBedrooms(Number(e.target.value))}>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4 Bedrooms</option>
                  <option value="5">5 Bedrooms</option>
                </select>
              </div>

              <div className={styles.simulatorSelectGroup}>
                <label>Bathrooms</label>
                <select value={simBathrooms} onChange={(e) => setSimBathrooms(Number(e.target.value))}>
                  <option value="1">1 Bath</option>
                  <option value="2">2 Baths</option>
                  <option value="3">3 Baths</option>
                  <option value="4">4 Baths</option>
                </select>
              </div>

              <div className={styles.simulatorSelectGroup}>
                <label>Package Type</label>
                <select value={simPackage} onChange={(e) => setSimPackage(e.target.value as any)}>
                  <option value="standard">Standard Clean</option>
                  <option value="deep">Deep Clean (Multiplier)</option>
                  <option value="move_in_out">Move In/Out (Multiplier)</option>
                </select>
              </div>

              <div className={styles.simulatorSelectGroup}>
                <label>Condition</label>
                <select value={simCondition} onChange={(e) => setSimCondition(e.target.value as any)}>
                  <option value="standard">Standard Condition (1.0x)</option>
                  <option value="moderate">Moderate (+15%)</option>
                  <option value="heavy">Heavy (+30%)</option>
                </select>
              </div>

              <div className={styles.simulatorSelectGroup}>
                <label>Sample Add-ons</label>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.35rem', fontSize: '0.85rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={simExtraOven} onChange={(e) => setSimExtraOven(e.target.checked)} />
                    Oven
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={simExtraFridge} onChange={(e) => setSimExtraFridge(e.target.checked)} />
                    Fridge
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={simMondayDiscount} onChange={(e) => setSimMondayDiscount(e.target.checked)} />
                    Mon/Tue -10%
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Base Rates */}
          <section className={styles.section}>
            <h3>1. Base Rates by Property Type (1 Bed / 1 Bath Baseline)</h3>
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
                      onChange={(e) => handleCleaningBase(type, e.target.value)}
                    />
                  </div>
                  <div className={styles.fieldNote}>Baseline starting labor cost</div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Room Additions */}
          <section className={styles.section}>
            <h3>2. Room Additions (Per Extra Room Above 1)</h3>
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
                      onChange={(e) => handleCleaningAddition(type, e.target.value)}
                    />
                  </div>
                  <div className={styles.fieldNote}>Added for each bed/bath above 1</div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Multipliers & Scaling Rules */}
          <section className={styles.section}>
            <h3>3. Package & Condition Multipliers (Scale Factors)</h3>
            <div className={styles.grid}>
              <div className={styles.cardInput}>
                <label>Deep Clean Multiplier</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type="number" 
                    step="0.05"
                    value={data.cleaning.multipliers.deepClean} 
                    onChange={(e) => handleCleaningMultiplier('deepClean', e.target.value)}
                  />
                </div>
                <div className={styles.fieldNote}>Default 1.35 = 35% surcharge for deep scrubbing</div>
              </div>

              <div className={styles.cardInput}>
                <label>Move In / Out Multiplier</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type="number" 
                    step="0.05"
                    value={data.cleaning.multipliers.moveInOut} 
                    onChange={(e) => handleCleaningMultiplier('moveInOut', e.target.value)}
                  />
                </div>
                <div className={styles.fieldNote}>Default 1.45 = 45% surcharge for handover readiness</div>
              </div>

              <div className={styles.cardInput}>
                <label>Moderate Condition</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type="number" 
                    step="0.05"
                    value={data.cleaning.multipliers.moderateCondition} 
                    onChange={(e) => handleCleaningMultiplier('moderateCondition', e.target.value)}
                  />
                </div>
                <div className={styles.fieldNote}>Default 1.15 = 15% increase for moderate build-up</div>
              </div>

              <div className={styles.cardInput}>
                <label>Heavy Condition</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type="number" 
                    step="0.05"
                    value={data.cleaning.multipliers.heavyCondition} 
                    onChange={(e) => handleCleaningMultiplier('heavyCondition', e.target.value)}
                  />
                </div>
                <div className={styles.fieldNote}>Default 1.30 = 30% increase for intensive grime</div>
              </div>

              <div className={styles.cardInput}>
                <label>2-Story Home Surcharge</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.currencySymbol}>$</span>
                  <input 
                    type="number" 
                    value={data.cleaning.multipliers.twoFloors} 
                    onChange={(e) => handleCleaningMultiplier('twoFloors', e.target.value)}
                  />
                </div>
                <div className={styles.fieldNote}>Added for carrying equipment between 2 levels</div>
              </div>

              <div className={styles.cardInput}>
                <label>3+ Story Home Surcharge</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.currencySymbol}>$</span>
                  <input 
                    type="number" 
                    value={data.cleaning.multipliers.threePlusFloors} 
                    onChange={(e) => handleCleaningMultiplier('threePlusFloors', e.target.value)}
                  />
                </div>
                <div className={styles.fieldNote}>Added for 3+ level residences</div>
              </div>

              <div className={styles.cardInput}>
                <label>Mon/Tue Discount (%)</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type="number" 
                    value={data.cleaning.multipliers.monTueDiscountPercent} 
                    onChange={(e) => handleCleaningMultiplier('monTueDiscountPercent', e.target.value)}
                  />
                  <span style={{ position: 'absolute', right: '1rem', color: '#64748b' }}>%</span>
                </div>
                <div className={styles.fieldNote}>Mid-week incentive discount (default 10%)</div>
              </div>
            </div>
          </section>

          {/* Section: Fixed Extras */}
          <section className={styles.section}>
            <h3>4. Fixed Price Add-ons (Flat Rate per Item)</h3>
            <div className={styles.grid}>
              {Object.entries(data.cleaning.fixedExtras).map(([key, item]: [string, any]) => (
                <div key={key} className={styles.cardInput}>
                  <div className={styles.cardIconHeader}>
                    <div className={styles.iconWrapper}>{ICONS_MAP[key] || <Sparkles size={20} />}</div>
                    <label>{item.label}</label>
                  </div>
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input 
                      type="number" 
                      value={item.price} 
                      onChange={(e) => handleCleaningFixedExtra(key, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Dynamic Extras */}
          <section className={styles.section}>
            <h3>5. Dynamic Extras (Varies by Residence Size)</h3>
            <div className={styles.dynamicGrid}>
              {Object.entries(data.cleaning.dynamicExtras).map(([key, item]: [string, any]) => (
                <div key={key} className={styles.cardInput}>
                  <div className={styles.cardIconHeader}>
                    <div className={styles.iconWrapper}>{ICONS_MAP[key] || <Sparkles size={20} />}</div>
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
                            onChange={(e) => handleCleaningDynamicExtra(key, type, e.target.value)}
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

      {/* ========================================================================= */}
      {/* 2. TV MOUNTING PRICING TAB                                                */}
      {/* ========================================================================= */}
      {activeTab === 'tv' && (
        <div>
          <div className={styles.instructionBox}>
            <div className={styles.instructionHeader}>
              <Tv size={20} color="#1d4ed8" />
              <span>How TV Mounting Pricing is Calculated</span>
            </div>
            <p className={styles.instructionText}>
              TV Mounting offers immediate online checkout with Stripe. The customer selects display size, bracket hardware, wall substrate, and wire concealment:
            </p>
            <div className={styles.formulaBadge}>
              TV Total = Screen Size Base + Bracket Hardware Option + Wall Anchor Fee + In-Wall Wire Kit
            </div>
          </div>

          <section className={styles.section}>
            <h3>Screen Size Base Rates</h3>
            <div className={styles.grid}>
              <div className={styles.cardInput}>
                <label>Under 55" Display</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.currencySymbol}>$</span>
                  <input 
                    type="number" 
                    value={data.tv.screenSize.small} 
                    onChange={(e) => handleTvChange('screenSize', 'small', e.target.value)}
                  />
                </div>
                <div className={styles.fieldNote}>Base installation price</div>
              </div>

              <div className={styles.cardInput}>
                <label>55" – 75" Display</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.currencySymbol}>$</span>
                  <input 
                    type="number" 
                    value={data.tv.screenSize.medium} 
                    onChange={(e) => handleTvChange('screenSize', 'medium', e.target.value)}
                  />
                </div>
                <div className={styles.fieldNote}>Most popular living room size</div>
              </div>

              <div className={styles.cardInput}>
                <label>75"+ Cinema Display</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.currencySymbol}>$</span>
                  <input 
                    type="number" 
                    value={data.tv.screenSize.large} 
                    onChange={(e) => handleTvChange('screenSize', 'large', e.target.value)}
                  />
                </div>
                <div className={styles.fieldNote}>Requires two-technician heavy lift</div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3>Bracket Hardware & Options</h3>
            <div className={styles.grid}>
              <div className={styles.cardInput}>
                <label>Tilt Mount Bracket</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.currencySymbol}>$</span>
                  <input 
                    type="number" 
                    value={data.tv.bracketType.tilt} 
                    onChange={(e) => handleTvChange('bracketType', 'tilt', e.target.value)}
                  />
                </div>
                <div className={styles.fieldNote}>Standard included mount ($0)</div>
              </div>

              <div className={styles.cardInput}>
                <label>Full-Motion Swivel Bracket</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.currencySymbol}>$</span>
                  <input 
                    type="number" 
                    value={data.tv.bracketType.motion} 
                    onChange={(e) => handleTvChange('bracketType', 'motion', e.target.value)}
                  />
                </div>
                <div className={styles.fieldNote}>Articulating arm hardware upgrade</div>
              </div>

              <div className={styles.cardInput}>
                <label>Client Provided Mount (Discount)</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.currencySymbol}>$</span>
                  <input 
                    type="number" 
                    value={data.tv.bracketType.client_provided} 
                    onChange={(e) => handleTvChange('bracketType', 'client_provided', e.target.value)}
                  />
                </div>
                <div className={styles.fieldNote}>Discount when customer provides bracket (-$20)</div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3>Wall Substrate & Wire Concealment</h3>
            <div className={styles.grid}>
              <div className={styles.cardInput}>
                <label>Brick / Masonry / Fireplace</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.currencySymbol}>$</span>
                  <input 
                    type="number" 
                    value={data.tv.wallSurface.brick} 
                    onChange={(e) => handleTvChange('wallSurface', 'brick', e.target.value)}
                  />
                </div>
                <div className={styles.fieldNote}>Rotary hammer drilling & concrete anchors</div>
              </div>

              <div className={styles.cardInput}>
                <label>In-Wall Power Concealment Kit</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.currencySymbol}>$</span>
                  <input 
                    type="number" 
                    value={data.tv.wireConcealment.in_wall} 
                    onChange={(e) => handleTvChange('wireConcealment', 'in_wall', e.target.value)}
                  />
                </div>
                <div className={styles.fieldNote}>Code-compliant behind-wall electrical pass-thru</div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. REMODELING PRICING TAB                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'remodeling' && (
        <div>
          <div className={styles.instructionBox}>
            <div className={styles.instructionHeader}>
              <Hammer size={20} color="#1d4ed8" />
              <span>Remodeling Estimation Range Logic</span>
            </div>
            <p className={styles.instructionText}>
              Remodeling projects (Bathrooms & Kitchens) calculate a realistic budgetary range. Base pricing is determined by scope of work combined with bathroom/kitchen square footage.
            </p>
            <div className={styles.formulaBadge}>
              Base = Scope Cost + Size Adjustment • Estimated Range = Base × 0.90 (Min) to Base × 1.15 (Max)
            </div>
          </div>

          <section className={styles.section}>
            <h3>Scope of Renovation</h3>
            <div className={styles.grid}>
              {Object.entries(data.remodeling.scope).map(([key, price]) => (
                <div key={key} className={styles.cardInput}>
                  <label>{key.toUpperCase()} SCOPE</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input 
                      type="number" 
                      value={price as number} 
                      onChange={(e) => handleRemodelingChange('scope', key, e.target.value)}
                    />
                  </div>
                  <div className={styles.fieldNote}>{key === 'cosmetic' ? 'Fixtures & Paint' : key === 'partial' ? 'Vanity, Tile & Plumbing' : 'Full Gut & Layout Redesign'}</div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h3>Size Adjustments</h3>
            <div className={styles.grid}>
              {Object.entries(data.remodeling.size).map(([key, price]) => (
                <div key={key} className={styles.cardInput}>
                  <label>{key.toUpperCase()} SIZE</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input 
                      type="number" 
                      value={price as number} 
                      onChange={(e) => handleRemodelingChange('size', key, e.target.value)}
                    />
                  </div>
                  <div className={styles.fieldNote}>{key === 'small' ? 'Powder Room / Half Bath' : key === 'medium' ? 'Standard Full Bath' : key === 'large' ? 'Double Vanity Bath' : 'Master Spa Sanctuary'}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. NEW CONSTRUCTION PRICING TAB                                           */}
      {/* ========================================================================= */}
      {activeTab === 'construction' && (
        <div>
          <div className={styles.instructionBox}>
            <div className={styles.instructionHeader}>
              <Layers size={20} color="#1d4ed8" />
              <span>New Construction Architectural Formula</span>
            </div>
            <p className={styles.instructionText}>
              New ground-up construction quotes are calculated directly from conditioned square footage multiplied by the architectural finish grade:
            </p>
            <div className={styles.formulaBadge}>
              Base = Total Sq Ft × Grade Rate per Sq Ft • Range = Base × 0.90 to Base × 1.20
            </div>
          </div>

          <section className={styles.section}>
            <h3>Construction Grade Base Rates (per sq ft)</h3>
            <div className={styles.grid}>
              {Object.entries(data.construction.grade).map(([key, price]) => (
                <div key={key} className={styles.cardInput}>
                  <label>{key.toUpperCase()} FINISH GRADE</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input 
                      type="number" 
                      value={price as number} 
                      onChange={(e) => handleConstructionChange(key, e.target.value)}
                    />
                  </div>
                  <div className={styles.fieldNote}>{key === 'luxury' ? 'Premium custom finishes ($250/sqft)' : key === 'ultra' ? 'Imported stone & bespoke millwork ($400/sqft)' : 'Monumental estate architecture ($700/sqft)'}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. PAINTING PRICING TAB                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'painting' && (
        <div>
          <div className={styles.instructionBox}>
            <div className={styles.instructionHeader}>
              <Paintbrush size={20} color="#1d4ed8" />
              <span>Artisan Painting Estimate Ranges</span>
            </div>
            <p className={styles.instructionText}>
              Painting quotes display a min-to-max range based on surface preparation, ceiling heights, and coats required. Adjust the minimum and maximum boundaries for each scope:
            </p>
          </div>

          <section className={styles.section}>
            <h3>Interior & Exterior Painting Scopes</h3>
            <div className={styles.grid}>
              {Object.entries(data.painting).map(([key, item]: [string, any]) => (
                <div key={key} className={styles.cardInput}>
                  <label>{item.label}</label>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div className={styles.inputWrapper} style={{ flex: 1 }}>
                      <span className={styles.currencySymbol}>$</span>
                      <input 
                        type="number" 
                        value={item.min} 
                        onChange={(e) => handlePaintRange(key, 'min', e.target.value)}
                        placeholder="Min"
                      />
                    </div>
                    <span>to</span>
                    <div className={styles.inputWrapper} style={{ flex: 1 }}>
                      <span className={styles.currencySymbol}>$</span>
                      <input 
                        type="number" 
                        value={item.max} 
                        onChange={(e) => handlePaintRange(key, 'max', e.target.value)}
                        placeholder="Max"
                      />
                    </div>
                  </div>
                  <div className={styles.fieldNote}>Customer sees: ${item.min} – ${item.max}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. FLOORING PRICING TAB                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'flooring' && (
        <div>
          <div className={styles.instructionBox}>
            <div className={styles.instructionHeader}>
              <LayoutGrid size={20} color="#1d4ed8" />
              <span>Hardwood & Custom Flooring Ranges</span>
            </div>
            <p className={styles.instructionText}>
              Flooring pricing provides upfront estimates for subfloor prep, transitions, and material installation (hardwood, porcelain tile, luxury vinyl):
            </p>
          </div>

          <section className={styles.section}>
            <h3>Flooring Installation Scopes</h3>
            <div className={styles.grid}>
              {Object.entries(data.flooring).map(([key, item]: [string, any]) => (
                <div key={key} className={styles.cardInput}>
                  <label>{item.label}</label>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div className={styles.inputWrapper} style={{ flex: 1 }}>
                      <span className={styles.currencySymbol}>$</span>
                      <input 
                        type="number" 
                        value={item.min} 
                        onChange={(e) => handleFloorRange(key, 'min', e.target.value)}
                        placeholder="Min"
                      />
                    </div>
                    <span>to</span>
                    <div className={styles.inputWrapper} style={{ flex: 1 }}>
                      <span className={styles.currencySymbol}>$</span>
                      <input 
                        type="number" 
                        value={item.max} 
                        onChange={(e) => handleFloorRange(key, 'max', e.target.value)}
                        placeholder="Max"
                      />
                    </div>
                  </div>
                  <div className={styles.fieldNote}>Customer sees: ${item.min} – ${item.max}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MASTER TRADES & ESTATE SERVICES TAB                                    */}
      {/* ========================================================================= */}
      {activeTab === 'estate' && (
        <div>
          <div className={styles.instructionBox}>
            <div className={styles.instructionHeader}>
              <Wrench size={20} color="#1d4ed8" />
              <span>Estate Maintenance & Master Trades Pricing Matrix</span>
            </div>
            <p className={styles.instructionText}>
              Each licensed trade (Plumbing, Electrical, Lighting, Home Theater, Handyman) defines 3 tiers: <strong>Diagnostic & Evaluation</strong> (onsite inspection), <strong>Minor Service</strong>, and <strong>Major Overhaul</strong>.
            </p>
          </div>

          {Object.entries(data.estate).map(([tradeKey, trade]: [string, any]) => (
            <section key={tradeKey} className={styles.section}>
              <h3>{trade.label}</h3>
              <div className={styles.grid}>
                {/* Diagnostic */}
                <div className={styles.cardInput}>
                  <label>1. Diagnostic / Inspection</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input 
                        type="number" 
                        value={trade.diagnostic[0]} 
                        onChange={(e) => handleEstateRange(tradeKey, 'diagnostic', 0, e.target.value)}
                      />
                    </div>
                    <span>to</span>
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input 
                        type="number" 
                        value={trade.diagnostic[1]} 
                        onChange={(e) => handleEstateRange(tradeKey, 'diagnostic', 1, e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Minor */}
                <div className={styles.cardInput}>
                  <label>2. Minor Repair & Service</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input 
                        type="number" 
                        value={trade.minor[0]} 
                        onChange={(e) => handleEstateRange(tradeKey, 'minor', 0, e.target.value)}
                      />
                    </div>
                    <span>to</span>
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input 
                        type="number" 
                        value={trade.minor[1]} 
                        onChange={(e) => handleEstateRange(tradeKey, 'minor', 1, e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Major */}
                <div className={styles.cardInput}>
                  <label>3. Major Overhaul / Install</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input 
                        type="number" 
                        value={trade.major[0]} 
                        onChange={(e) => handleEstateRange(tradeKey, 'major', 0, e.target.value)}
                      />
                    </div>
                    <span>to</span>
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input 
                        type="number" 
                        value={trade.major[1]} 
                        onChange={(e) => handleEstateRange(tradeKey, 'major', 1, e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Save Action Bar */}
      <div className={styles.actions}>
        <button 
          type="button"
          onClick={handleSave} 
          disabled={isSaving}
          className={styles.saveBtn}
        >
          {isSaving ? 'Publishing Pricing Engine Rules...' : 'Save & Publish All Pricing Rules'}
        </button>
      </div>
    </div>
  );
}
