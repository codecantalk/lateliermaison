'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useForm, Controller } from 'react-hook-form'
import { gsap } from 'gsap'
import { loadStripe } from '@stripe/stripe-js'
import { 
  Refrigerator, Microwave, UtensilsCrossed, Shirt, 
  Sparkles, Archive, LayoutGrid, Hammer, CarFront, Tent 
} from 'lucide-react'
import styles from './EstimateCalculator.module.css'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type ServiceType = 'cleaning' | 'remodeling' | 'construction' | 'estate' | null

type CleaningData = {
  houseType: 'apartment' | 'townhome' | 'single'
  bedrooms: number
  bathrooms: number
  isMondayTuesday: boolean
  extras: string[]
  dynamicExtras: string[]
}

type RemodelingData = {
  scope: 'cosmetic' | 'partial' | 'full'
  size: 'small' | 'medium' | 'large' | 'master'
}

type ConstructionData = {
  squareFeet: number
  grade: 'luxury' | 'ultra' | 'monumental'
}

type EstateData = {
  trade: 'plumbing' | 'electrical' | 'painting' | 'handyman'
  scope: 'diagnostic' | 'minor' | 'major'
}

// Local mapping for icons since we can't store JSX in the database
const ICONS_MAP: Record<string, JSX.Element> = {
  fridge: <Refrigerator size={32} strokeWidth={1.2} />,
  oven: <Microwave size={32} strokeWidth={1.2} />,
  dishwashing: <UtensilsCrossed size={32} strokeWidth={1.2} />,
  laundry: <Shirt size={32} strokeWidth={1.2} />,
  deep: <Sparkles size={32} strokeWidth={1.2} />,
  cabinets: <Archive size={32} strokeWidth={1.2} />,
  windows: <LayoutGrid size={32} strokeWidth={1.2} />,
  post_construction: <Hammer size={32} strokeWidth={1.2} />,
  garage: <CarFront size={32} strokeWidth={1.2} />,
  porch: <Tent size={32} strokeWidth={1.2} />
}

const REMODELING_PRICING = {
  scope: { cosmetic: 5000, partial: 10000, full: 20000 },
  size: { small: -2000, medium: 0, large: 5000, master: 10000 }
}

const CONSTRUCTION_PRICING = {
  grade: { luxury: 250, ultra: 400, monumental: 700 }
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function EstimateCalculator({ defaultService = null }: { defaultService?: ServiceType }) {
  const [selectedService, setSelectedService] = useState<ServiceType>(defaultService)
  const [pricingConfig, setPricingConfig] = useState<any>(null)
  const [isPricingLoading, setIsPricingLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchPricing() {
      const { data, error } = await supabase
        .from('pricing_config')
        .select('value')
        .eq('key', 'cleaning_pricing')
        .single()
      
      if (error) {
        console.error('Error fetching pricing config:', error.message)
      }

      if (data) {
        setPricingConfig(data.value)
      } else {
        console.error('No pricing config found.')
      }
      setIsPricingLoading(false)
    }
    fetchPricing()
  }, [])
  
  // Results State
  const [cleaningResult, setCleaningResult] = useState<{total: number, subtotal: number, discount: number} | null>(null)
  const [rangeResult, setRangeResult] = useState<{min: number, max: number, type: string} | null>(null)
  const [leadSubmitted, setLeadSubmitted] = useState(false)

  // Forms
  const { control: controlClean, handleSubmit: handleCleanSubmit, watch: watchClean, setValue: setCleanValue } = useForm<CleaningData>({
    defaultValues: { houseType: 'single', bedrooms: 1, bathrooms: 1, isMondayTuesday: false, extras: [], dynamicExtras: [] }
  })
  const cleanValues = watchClean()

  const { control: controlRemodel, handleSubmit: handleRemodelSubmit, watch: watchRemodel } = useForm<RemodelingData>({
    defaultValues: { scope: 'partial', size: 'medium' }
  })
  const remodelValues = watchRemodel()

  const { control: controlConst, handleSubmit: handleConstSubmit, watch: watchConst } = useForm<ConstructionData>({
    defaultValues: { squareFeet: 3500, grade: 'luxury' }
  })
  const constValues = watchConst()

  const { control: controlEstate, handleSubmit: handleEstateSubmit, watch: watchEstate } = useForm<EstateData>({
    defaultValues: { trade: 'handyman', scope: 'diagnostic' }
  })
  const estateValues = watchEstate()

  // Handlers
  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service)
    setCleaningResult(null)
    setRangeResult(null)
    setLeadSubmitted(false)
    gsap.fromTo('.form-anim', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out' })
  }

  const onCleanSubmit = (data: CleaningData) => {
    if (!pricingConfig) return;

    // 1. Base Price
    let total = pricingConfig.base[data.houseType]

    // 2. Room Additions (subtracting 1 because base includes 1bd/1ba)
    if (data.bedrooms > 1) {
      total += (data.bedrooms - 1) * pricingConfig.additions.bedroom
    }
    if (data.bathrooms > 1) {
      total += (data.bathrooms - 1) * pricingConfig.additions.bathroom
    }

    // 3. Fixed Extras
    data.extras.forEach(extra => {
      const fixed = pricingConfig.fixedExtras[extra]
      if (fixed) total += fixed.price
    })

    // 4. Dynamic Extras
    data.dynamicExtras.forEach(extra => {
      const dyn = pricingConfig.dynamicExtras[extra]
      if (dyn && dyn.prices[data.houseType] > 0) {
        total += dyn.prices[data.houseType]
      }
    })

    // 5. Discount
    const subtotal = total
    let discount = 0
    if (data.isMondayTuesday) {
      discount = Math.round(total * 0.10) // 10% discount
      total -= discount
    }

    setCleaningResult({ total: Math.round(total), subtotal: Math.round(subtotal), discount })
    animateResult()
  }

  const onRemodelSubmit = (data: RemodelingData) => {
    const base = REMODELING_PRICING.scope[data.scope] + REMODELING_PRICING.size[data.size]
    setRangeResult({ min: Math.round(base * 0.9), max: Math.round(base * 1.15), type: 'Bathroom Remodeling' })
    animateResult()
  }

  const onConstSubmit = (data: ConstructionData) => {
    const base = data.squareFeet * CONSTRUCTION_PRICING.grade[data.grade]
    setRangeResult({ min: Math.round(base * 0.9), max: Math.round(base * 1.2), type: 'New Construction' })
    animateResult()
  }

  const onEstateSubmit = (data: EstateData) => {
    setRangeResult({ min: 0, max: 0, type: 'Estate Management' })
    animateResult()
  }

  const animateResult = () => {
    gsap.fromTo('.result-anim', { scale: 0.95, y: 20, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' })
  }

  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '' })

  const saveLeadToDatabase = async (service: string, amount: number, details: any) => {
    try {
      await supabase.from('leads').insert({
        customer_name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        service_type: service,
        total_price: amount,
        details: details,
        status: 'pending'
      });
    } catch (e) {
      console.error("Failed to save lead", e);
    }
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleaningResult) return

    await saveLeadToDatabase('House Cleaning', cleaningResult.total, cleanValues);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cleaningResult.total, serviceName: `House Cleaning (${cleanValues.houseType})` }),
      })
      const { id } = await response.json()
      const stripe: any = await stripePromise
      await stripe?.redirectToCheckout({ sessionId: id })
    } catch (err) {
      alert('Failed to initiate checkout.')
    }
  }

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const serviceName = selectedService || 'unknown';
    const amount = rangeResult?.min || 0;
    const details = selectedService === 'construction' ? constValues : selectedService === 'remodeling' ? remodelValues : estateValues;
    
    await saveLeadToDatabase(serviceName, amount, details);
    setLeadSubmitted(true)
  }

  return (
    <div className={styles.calculator}>
      <div className={styles.header}>
        <h2 className="font-serif">Design Your <span className="font-italic" style={{color: 'var(--color-primary)'}}>Service</span></h2>
        <p>Select a discipline to receive a transparent quote or schedule a master consultation.</p>
      </div>

      <div className={styles.serviceSelection}>
        <button className={`${styles.serviceBtn} ${selectedService === 'construction' ? styles.activeService : ''}`} onClick={() => handleServiceSelect('construction')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18"/><path d="M19 21v-4"/><path d="M19 17a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v4"/><path d="M12 15V3l-3 3"/><path d="M15 6l-3-3"/></svg>
          <span>New Construction</span>
        </button>
        <button className={`${styles.serviceBtn} ${selectedService === 'remodeling' ? styles.activeService : ''}`} onClick={() => handleServiceSelect('remodeling')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>Remodeling</span>
        </button>
        <button className={`${styles.serviceBtn} ${selectedService === 'estate' ? styles.activeService : ''}`} onClick={() => handleServiceSelect('estate')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          <span>Estate Management</span>
        </button>
        <button className={`${styles.serviceBtn} ${selectedService === 'cleaning' ? styles.activeService : ''}`} onClick={() => handleServiceSelect('cleaning')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          <span>House Cleaning</span>
        </button>
      </div>

      <div className={styles.container}>
        <div className={styles.formSection}>
          
          {/* --- NEW CONSTRUCTION FLOW --- */}
          {selectedService === 'construction' && (
            <form onSubmit={handleConstSubmit(onConstSubmit)} className={`form-anim ${styles.form}`}>
              <div className={styles.stepGroup}>
                <h3>1. Estate Size</h3>
                <div className={styles.inputGroup}>
                  <label>Approximate Square Footage</label>
                  <Controller name="squareFeet" control={controlConst} render={({ field }) => <input type="number" {...field} step="500" min="1000" className={styles.input} />} />
                </div>
              </div>
              <div className={styles.stepGroup}>
                <h3>2. Build Grade</h3>
                <div className={styles.radioGrid}>
                  {[
                    { val: 'luxury', title: 'Luxury', desc: 'Premium finishes, semi-custom architecture' },
                    { val: 'ultra', title: 'Ultra-Luxury', desc: 'Fully custom architecture, imported materials' },
                    { val: 'monumental', title: 'Monumental', desc: 'No-compromise legacy estate building' }
                  ].map((grade) => (
                    <label key={grade.val} className={constValues.grade === grade.val ? styles.activeCard : styles.radioCard}>
                      <input type="radio" value={grade.val} {...controlConst.register('grade')} className={styles.hiddenRadio} />
                      <div className={styles.cardContent}>
                        <h4>{grade.title}</h4>
                        <p>{grade.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>Calculate Estimate</button>
            </form>
          )}

          {/* --- REMODELING FLOW --- */}
          {selectedService === 'remodeling' && (
            <form onSubmit={handleRemodelSubmit(onRemodelSubmit)} className={`form-anim ${styles.form}`}>
              <div className={styles.stepGroup}>
                <h3>1. Scope of Work</h3>
                <div className={styles.radioGrid}>
                  {[
                    { val: 'cosmetic', title: 'Cosmetic', desc: 'Fixtures, Paint, Minor Tile' },
                    { val: 'partial', title: 'Partial Remodel', desc: 'New Vanity, Shower/Tub Replace' },
                    { val: 'full', title: 'Full Gut', desc: 'Re-layout, Custom Shower, High-End' }
                  ].map((scope) => (
                    <label key={scope.val} className={remodelValues.scope === scope.val ? styles.activeCard : styles.radioCard}>
                      <input type="radio" value={scope.val} {...controlRemodel.register('scope')} className={styles.hiddenRadio} />
                      <div className={styles.cardContent}>
                        <h4>{scope.title}</h4>
                        <p>{scope.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className={styles.stepGroup}>
                <h3>2. Bathroom Size</h3>
                <div className={styles.radioGridRow}>
                  {['small', 'medium', 'large', 'master'].map((size) => (
                    <label key={size} className={remodelValues.size === size ? styles.activeChip : styles.chip}>
                      <input type="radio" value={size} {...controlRemodel.register('size')} className={styles.hiddenRadio} />
                      <span style={{textTransform: 'capitalize'}}>{size}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>Calculate Estimate</button>
            </form>
          )}

          {/* --- ESTATE MANAGEMENT FLOW --- */}
          {selectedService === 'estate' && (
            <form onSubmit={handleEstateSubmit(onEstateSubmit)} className={`form-anim ${styles.form}`}>
              <div className={styles.stepGroup}>
                <h3>1. Required Trade</h3>
                <div className={styles.radioGridRow}>
                  {['plumbing', 'electrical', 'painting', 'handyman'].map((trade) => (
                    <label key={trade} className={estateValues.trade === trade ? styles.activeChip : styles.chip}>
                      <input type="radio" value={trade} {...controlEstate.register('trade')} className={styles.hiddenRadio} />
                      <span style={{textTransform: 'capitalize'}}>{trade}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className={styles.stepGroup}>
                <h3>2. Scope of Need</h3>
                <div className={styles.radioGrid}>
                  {[
                    { val: 'diagnostic', title: 'Diagnostic Call', desc: 'Identify and resolve an immediate issue' },
                    { val: 'minor', title: 'Minor Project', desc: 'Fixture replacements, small painting jobs' },
                    { val: 'major', title: 'Major Renovation', desc: 'Extensive modifications or repairs' }
                  ].map((scope) => (
                    <label key={scope.val} className={estateValues.scope === scope.val ? styles.activeCard : styles.radioCard}>
                      <input type="radio" value={scope.val} {...controlEstate.register('scope')} className={styles.hiddenRadio} />
                      <div className={styles.cardContent}>
                        <h4>{scope.title}</h4>
                        <p>{scope.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>Request Master Artisan</button>
            </form>
          )}

          {/* --- NEW House Cleaning FLOW --- */}
          {selectedService === 'cleaning' && isPricingLoading && (
            <div className={styles.emptyState}>
              <p>Loading pricing engine...</p>
            </div>
          )}
          {selectedService === 'cleaning' && !isPricingLoading && !pricingConfig && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <p style={{ color: '#ef4444' }}>Pricing engine unavailable. Please try again later.</p>
            </div>
          )}
          {selectedService === 'cleaning' && !isPricingLoading && pricingConfig && (
            <form onSubmit={handleCleanSubmit(onCleanSubmit)} className={`form-anim ${styles.form}`}>
              <div className={styles.stepGroup}>
                <h3>1. Select House Type</h3>
                <div className={styles.houseTypeGrid}>
                  <label className={cleanValues.houseType === 'apartment' ? styles.activeHouseCard : styles.houseCard}>
                    <input type="radio" value="apartment" {...controlClean.register('houseType')} className={styles.hiddenRadio} />
                    <div className={styles.imageIconWrapper}>
                      <Image src="/images/house_icons/apartment.jpg" alt="Apartment" width={100} height={100} className={styles.houseImage} />
                    </div>
                    <span>Apartment</span>
                  </label>
                  <label className={cleanValues.houseType === 'townhome' ? styles.activeHouseCard : styles.houseCard}>
                    <input type="radio" value="townhome" {...controlClean.register('houseType')} className={styles.hiddenRadio} />
                    <div className={styles.imageIconWrapper}>
                      <Image src="/images/house_icons/townhome.jpg" alt="Townhome" width={100} height={100} className={styles.houseImage} />
                    </div>
                    <span>Townhome</span>
                  </label>
                  <label className={cleanValues.houseType === 'single' ? styles.activeHouseCard : styles.houseCard}>
                    <input type="radio" value="single" {...controlClean.register('houseType')} className={styles.hiddenRadio} />
                    <div className={styles.imageIconWrapper}>
                      <Image src="/images/house_icons/single_family.jpg" alt="Single Family" width={100} height={100} className={styles.houseImage} />
                    </div>
                    <span>Single Family</span>
                  </label>
                </div>
              </div>

              <div className={styles.stepGroup}>
                <h3>2. Home Details</h3>
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label>Bedrooms</label>
                    <Controller name="bedrooms" control={controlClean} render={({ field }) => <input type="number" {...field} min="1" max="15" className={styles.input} />} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Bathrooms</label>
                    <Controller name="bathrooms" control={controlClean} render={({ field }) => <input type="number" {...field} min="1" step="0.5" className={styles.input} />} />
                  </div>
                </div>
              </div>

              <div className={styles.stepGroup}>
                <h3>3. Select Add-Ons</h3>
                <div className={styles.checkboxGrid}>
                  {Object.entries(pricingConfig.fixedExtras).map(([key, extra]: [string, any]) => (
                    <label key={key} className={cleanValues.extras.includes(key) ? styles.activeCheckboxCard : styles.checkboxCard}>
                      <input type="checkbox" value={key} {...controlClean.register('extras')} className={styles.hiddenRadio} />
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '100%', textAlign: 'center' }}>
                        <div style={{
                          color: cleanValues.extras.includes(key) ? 'var(--color-primary)' : 'var(--color-text-muted)',
                          transition: 'color 0.3s ease',
                          marginBottom: '4px'
                        }}>
                          {ICONS_MAP[key]}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.95rem', lineHeight: '1.2' }}>{extra.label}</span>
                          <span style={{ color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.02em' }}>+${extra.price}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                  {Object.entries(pricingConfig.dynamicExtras).map(([key, extra]: [string, any]) => {
                    const price = extra.prices[cleanValues.houseType];
                    if (price <= 0) return null; // Don't show options that don't apply to this house type
                    return (
                      <label key={key} className={cleanValues.dynamicExtras.includes(key) ? styles.activeCheckboxCard : styles.checkboxCard}>
                        <input type="checkbox" value={key} {...controlClean.register('dynamicExtras')} className={styles.hiddenRadio} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '100%', textAlign: 'center' }}>
                          <div style={{
                            color: cleanValues.dynamicExtras.includes(key) ? 'var(--color-primary)' : 'var(--color-text-muted)',
                            transition: 'color 0.3s ease',
                            marginBottom: '4px'
                          }}>
                            {ICONS_MAP[key]}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.95rem', lineHeight: '1.2' }}>{extra.label}</span>
                            <span style={{ color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.02em' }}>+${price}</span>
                          </div>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className={styles.stepGroup}>
                <h3>4. Promotional Schedule</h3>
                <label className={cleanValues.isMondayTuesday ? styles.activeCheckboxCard : styles.checkboxCard} style={{cursor: 'pointer'}}>
                  <input type="checkbox" {...controlClean.register('isMondayTuesday')} className={styles.hiddenRadio} />
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                    <span style={{fontWeight: 600}}>Initial Cleaning on a Monday or Tuesday</span>
                    <span style={{color: 'var(--color-primary)', fontWeight: 600}}>10% OFF Total</span>
                  </div>
                </label>
              </div>

              <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>Calculate Estimate</button>
            </form>
          )}

          {!selectedService && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              </div>
              <p>Please select a discipline above to begin.</p>
            </div>
          )}

        </div>

        <div className={styles.resultSection}>
          {/* House Cleaning Result Box - "Receipt" Style */}
          {selectedService === 'cleaning' && cleaningResult && (
            <div className={`result-anim ${styles.receiptBox}`}>
              <div className={styles.receiptHeader}>
                <h3 className="font-serif">Official Proposal</h3>
                <p style={{textTransform: 'capitalize'}}>L'Atelier {cleanValues.houseType}</p>
              </div>
              <div className={styles.receiptBody}>
                <div className={styles.receiptLine}>
                  <span>Subtotal</span>
                  <span>${cleaningResult.subtotal}</span>
                </div>
                {cleaningResult.discount > 0 && (
                  <div className={styles.receiptLine} style={{color: 'var(--color-primary)'}}>
                    <span>Mon/Tue Discount (10%)</span>
                    <span>-${cleaningResult.discount}</span>
                  </div>
                )}
                <div className={styles.receiptDivider}></div>
                <div className={styles.receiptTotal}>
                  <span>Total Estimate</span>
                  <span>${cleaningResult.total}</span>
                </div>
              </div>
              <p className={styles.disclaimer}>*This is a finalized estimate for standard home conditions.</p>
              <form onSubmit={handleCheckout} className={styles.leadForm} style={{ marginTop: '1.5rem' }}>
                <input type="text" placeholder="Full Name" required className={styles.input} value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} />
                <input type="email" placeholder="Email Address" required className={styles.input} value={customerInfo.email} onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})} />
                <input type="tel" placeholder="Phone Number" required className={styles.input} value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} />
                <button type="submit" className={`btn btn-secondary ${styles.fullWidthBtn}`}>
                  Secure & Book Now
                </button>
              </form>
            </div>
          )}

          {/* Construction/Remodeling/Estate Result Box - "Lead" Style */}
          {(selectedService === 'remodeling' || selectedService === 'construction' || selectedService === 'estate') && rangeResult && (
            <div className={`result-anim ${styles.receiptBox}`}>
              <div className={styles.receiptHeader}>
                <h3 className="font-serif">Architectural Brief</h3>
                <p>{rangeResult.type}</p>
              </div>
              
              {rangeResult.min > 0 && (
                <div className={styles.receiptBody}>
                  <div className={styles.receiptLine}>
                    <span>Estimated Baseline Investment</span>
                  </div>
                  <div className={styles.receiptTotalRange}>
                    <span>${rangeResult.min.toLocaleString()}</span>
                    <span>-</span>
                    <span>${rangeResult.max.toLocaleString()}</span>
                  </div>
                </div>
              )}
              
              <p className={styles.disclaimer} style={{marginTop: '1rem'}}>*An on-site evaluation by a lead architect is required for an exact proposal.</p>
              
              {!leadSubmitted ? (
                <form onSubmit={handleLeadSubmit} className={styles.leadForm} style={{ marginTop: '1.5rem' }}>
                  <input type="text" placeholder="Full Name" required className={styles.input} value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} />
                  <input type="email" placeholder="Email Address" required className={styles.input} value={customerInfo.email} onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})} />
                  <input type="tel" placeholder="Phone Number" required className={styles.input} value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} />
                  <button type="submit" className={`btn btn-secondary ${styles.fullWidthBtn}`}>
                    Request Consultation
                  </button>
                </form>
              ) : (
                <div className={styles.successMessage}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <h4 className="font-serif">Brief Received</h4>
                  <p>A Lead Architect will contact you within 24 hours.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
