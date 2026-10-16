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
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type ServiceType = 'cleaning' | 'remodeling' | 'construction' | 'estate' | null

type CleaningData = {
  houseType: 'apartment' | 'townhome' | 'single'
  bedrooms: number
  bathrooms: number
  squareFeet: number
  floors: number
  location: string
  condition: 'standard' | 'moderate' | 'heavy'
  packageType: 'standard' | 'deep' | 'move_in_out'
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
  trade: 'plumbing' | 'electrical' | 'painting' | 'flooring' | 'tv mounting' | 'lighting' | 'home theater' | 'handyman'
  scope: 'diagnostic' | 'minor' | 'major'
}

// Local mapping for icons since we can't store JSX in the database
const ICONS_MAP: Record<string, React.ReactNode> = {
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

// Standard fallback pricing matrix in case network or pricing_config is slow
const DEFAULT_REMODEL = {
  scope: { cosmetic: 5000, partial: 10000, full: 20000 },
  size: { small: -2000, medium: 0, large: 5000, master: 10000 }
}

const DEFAULT_CONST = {
  grade: { luxury: 250, ultra: 400, monumental: 700 }
}

// Master Trade & Scope Pricing Matrix for Home Services / Estate
const ESTATE_PRICING: Record<string, { label: string; diagnostic: [number, number]; minor: [number, number]; major: [number, number] }> = {
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
  painting: {
    label: 'Artisan Painting & Finishes',
    diagnostic: [150, 250],
    minor: [650, 1800],
    major: [3200, 12000],
  },
  flooring: {
    label: 'Custom Flooring & Hardwoods',
    diagnostic: [150, 250],
    minor: [800, 2200],
    major: [4500, 15000],
  },
  'tv mounting': {
    label: 'Precision TV & Audio Mounting',
    diagnostic: [150, 220],
    minor: [280, 580],
    major: [1200, 2800],
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
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function EstimateCalculator({ defaultService = null }: { defaultService?: ServiceType }) {
  const searchParams = useSearchParams()
  
  // URL params can override defaults
  const urlService = searchParams?.get('service') as ServiceType | null
  const urlTrade = searchParams?.get('trade') as any
  const urlScope = searchParams?.get('scope') as any
  
  const [selectedService, setSelectedService] = useState<ServiceType>(urlService || defaultService)
  const [pricingConfig, setPricingConfig] = useState<any>(null)
  const [isPricingLoading, setIsPricingLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchPricing() {
      const { data, error } = await supabase
        .from('pricing_config')
        .select('key, value')
        .in('key', ['cleaning_pricing', 'remodeling_pricing', 'construction_pricing'])
      
      if (error) {
        console.error('Error fetching pricing config:', error.message)
      }

      if (data && data.length > 0) {
        const pricing = {
          cleaning: data.find(d => d.key === 'cleaning_pricing')?.value,
          remodeling: data.find(d => d.key === 'remodeling_pricing')?.value,
          construction: data.find(d => d.key === 'construction_pricing')?.value,
        }
        setPricingConfig(pricing)
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
    defaultValues: { 
      houseType: 'single', 
      bedrooms: 1, 
      bathrooms: 1, 
      squareFeet: 1200,
      floors: 1,
      location: 'Atlanta Metro',
      condition: 'standard',
      packageType: 'standard',
      isMondayTuesday: false, 
      extras: [], 
      dynamicExtras: [] 
    }
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

  const { control: controlEstate, handleSubmit: handleEstateSubmit, watch: watchEstate, setValue: setEstateValue } = useForm<EstateData>({
    defaultValues: { trade: urlTrade || 'handyman', scope: urlScope || 'diagnostic' }
  })
  const estateValues = watchEstate()

  // Sync URL parameters after hydration (Next.js App Router behavior)
  useEffect(() => {
    if (urlService) {
      setSelectedService(urlService)
    }
    if (urlTrade) {
      setEstateValue('trade', urlTrade)
    }
    if (urlScope) {
      setEstateValue('scope', urlScope)
    }
  }, [urlService, urlTrade, urlScope, setEstateValue])

  // Handlers
  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service)
    setCleaningResult(null)
    setRangeResult(null)
    setLeadSubmitted(false)
    gsap.fromTo('.form-anim', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out' })
  }

  const onCleanSubmit = (data: CleaningData) => {
    if (!pricingConfig || !pricingConfig.cleaning) return;
    const config = pricingConfig.cleaning;

    // 1. Base Price with square footage calibration
    let basePrice = config.base[data.houseType] || 189

    if (data.houseType === 'single') {
      if (data.squareFeet <= 1000 && data.bedrooms === 1 && data.bathrooms === 1) {
        // Calibrate 1-bed, 1-bath cottage/ADU starting rate reasonably (~$175-185)
        basePrice = Math.round(basePrice * 0.72)
      } else if (data.squareFeet > 2000) {
        const extraThousands = Math.floor((data.squareFeet - 2000) / 500)
        basePrice += extraThousands * 25
      }
    } else if (data.houseType === 'apartment') {
      if (data.squareFeet > 1200) {
        const extraThousands = Math.floor((data.squareFeet - 1200) / 400)
        basePrice += extraThousands * 20
      }
    } else if (data.houseType === 'townhome') {
      if (data.squareFeet > 1800) {
        const extraThousands = Math.floor((data.squareFeet - 1800) / 500)
        basePrice += extraThousands * 25
      }
    }

    let total = basePrice

    // 2. Room Additions (subtracting 1 because base covers 1bd/1ba)
    if (data.bedrooms > 1) {
      total += (data.bedrooms - 1) * (config.additions?.bedroom || 30)
    }
    if (data.bathrooms > 1) {
      total += (data.bathrooms - 1) * (config.additions?.bathroom || 35)
    }

    // 3. Multi-floor adjustment
    if (data.floors === 2) {
      total += 15
    } else if (data.floors >= 3) {
      total += 30
    }

    // 4. Condition Multiplier
    if (data.condition === 'moderate') {
      total = Math.round(total * 1.15)
    } else if (data.condition === 'heavy') {
      total = Math.round(total * 1.30)
    }

    // 5. Package Multiplier
    if (data.packageType === 'deep') {
      total = Math.round(total * 1.35)
    } else if (data.packageType === 'move_in_out') {
      total = Math.round(total * 1.45)
    }

    // 6. Fixed Extras
    data.extras.forEach(extra => {
      const fixed = config.fixedExtras?.[extra]
      if (fixed) total += fixed.price
    })

    // 7. Dynamic Extras
    data.dynamicExtras.forEach(extra => {
      const dyn = config.dynamicExtras?.[extra]
      if (dyn && dyn.prices?.[data.houseType] > 0) {
        total += dyn.prices[data.houseType]
      }
    })

    // 8. Discount
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
    const config = pricingConfig?.remodeling || DEFAULT_REMODEL
    const base = (config.scope[data.scope] || DEFAULT_REMODEL.scope[data.scope]) + 
                 (config.size[data.size] || DEFAULT_REMODEL.size[data.size])
    setRangeResult({ min: Math.round(base * 0.9), max: Math.round(base * 1.15), type: 'Bathroom Remodeling' })
    animateResult()
  }

  const onConstSubmit = (data: ConstructionData) => {
    const config = pricingConfig?.construction || DEFAULT_CONST
    const rate = config.grade[data.grade] || DEFAULT_CONST.grade[data.grade] || 250
    const base = data.squareFeet * rate
    setRangeResult({ min: Math.round(base * 0.9), max: Math.round(base * 1.2), type: 'New Construction' })
    animateResult()
  }

  const onEstateSubmit = (data: EstateData) => {
    const tradeKey = data.trade || 'handyman'
    const tradeConfig = ESTATE_PRICING[tradeKey] || ESTATE_PRICING.handyman
    const scopeKey = data.scope || 'diagnostic'
    const [min, max] = tradeConfig[scopeKey] || [160, 260]
    const scopeName = scopeKey === 'diagnostic' ? 'Diagnostic Evaluation' : scopeKey === 'minor' ? 'Minor Project' : 'Major Renovation'
    setRangeResult({ 
      min, 
      max, 
      type: `${tradeConfig.label} • ${scopeName}` 
    })
    animateResult()
  }

  const animateResult = () => {
    gsap.fromTo('.result-anim', { scale: 0.95, y: 20, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' })
  }

  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '' })

  const saveLeadToDatabase = async (service: string, amount: number, details: any) => {
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          serviceType: service,
          totalPrice: amount,
          details: details,
        }),
      });
    } catch (e) {
      console.error("Failed to save lead", e);
    }
  }

  const handleCleanLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleaningResult) return

    await saveLeadToDatabase('House Cleaning', cleaningResult.total, {
      ...cleanValues,
      estimatedPrice: cleaningResult.total,
      subtotal: cleaningResult.subtotal,
      discount: cleaningResult.discount,
      isEstimatedQuote: true
    });
    setLeadSubmitted(true)
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleaningResult) return

    let createdLeadId = ''
    try {
      const { data: leadData } = await supabase.from('leads').insert({
        customer_name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        service_type: 'House Cleaning',
        total_price: cleaningResult.total,
        details: cleanValues,
        status: 'pending'
      }).select('id').single()
      if (leadData?.id) createdLeadId = leadData.id
    } catch (e) {
      console.error("Failed to save lead", e);
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: cleaningResult.total, 
          serviceName: `Luxury House Cleaning (${cleanValues.houseType || 'Standard'})`,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          details: cleanValues,
          leadId: createdLeadId,
        }),
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.id) {
        const stripe: any = await stripePromise
        await stripe?.redirectToCheckout({ sessionId: data.id })
      } else {
        throw new Error(data.error || 'Failed to initiate checkout.')
      }
    } catch (err: any) {
      alert(err.message || 'Failed to initiate checkout.')
    }
  }

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const serviceName = selectedService === 'estate'
      ? `Home Services (${rangeResult?.type || estateValues.trade})`
      : selectedService === 'remodeling'
      ? `Bathroom Remodeling (${rangeResult?.type || 'Remodel'})`
      : selectedService === 'construction'
      ? `New Construction (${rangeResult?.type || 'Custom'})`
      : 'Estimate Consultation'

    const amount = rangeResult?.min || 0
    const details = {
      ...(selectedService === 'construction' ? constValues : selectedService === 'remodeling' ? remodelValues : estateValues),
      estimatedPriceRange: rangeResult && rangeResult.min > 0 ? `$${rangeResult.min.toLocaleString()} – $${rangeResult.max.toLocaleString()}` : undefined,
      estimatedBaseline: amount,
    }
    
    await saveLeadToDatabase(serviceName, amount, details)
    setLeadSubmitted(true)
  }

  return (
    <div className={styles.calculator}>
      <div className={styles.header}>
        <h2 className="font-serif">Choose Your <span className="font-italic" style={{color: 'var(--color-primary)'}}>Service</span></h2>
        <p>Select a discipline to receive a transparent quote or schedule a master consultation.</p>
      </div>

      <div className={styles.serviceSelection}>

        <button className={`${styles.serviceBtn} ${selectedService === 'cleaning' ? styles.activeService : ''}`} onClick={() => handleServiceSelect('cleaning')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          <span>House Cleaning</span>
        </button>
        <button className={`${styles.serviceBtn} ${selectedService === 'remodeling' ? styles.activeService : ''}`} onClick={() => handleServiceSelect('remodeling')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>Remodeling</span>
        </button>
        <button className={`${styles.serviceBtn} ${selectedService === 'estate' && estateValues.trade === 'painting' ? styles.activeService : ''}`} onClick={() => { handleServiceSelect('estate'); setEstateValue('trade', 'painting') }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
          <span>Painting</span>
        </button>
        <button className={`${styles.serviceBtn} ${selectedService === 'estate' && estateValues.trade === 'tv mounting' ? styles.activeService : ''}`} onClick={() => { handleServiceSelect('estate'); setEstateValue('trade', 'tv mounting') }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>
          <span>TV Mounting</span>
        </button>
        <button className={`${styles.serviceBtn} ${selectedService === 'estate' && estateValues.trade === 'flooring' ? styles.activeService : ''}`} onClick={() => { handleServiceSelect('estate'); setEstateValue('trade', 'flooring') }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
          <span>Flooring</span>
        </button>
        <button className={`${styles.serviceBtn} ${selectedService === 'estate' && !['painting', 'tv mounting', 'flooring'].includes(estateValues.trade) ? styles.activeService : ''}`} onClick={() => { handleServiceSelect('estate'); setEstateValue('trade', 'handyman') }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          <span>Home Services</span>
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
                  {['plumbing', 'electrical', 'painting', 'flooring', 'tv mounting', 'lighting', 'home theater', 'handyman'].map((trade) => (
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
              <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>Calculate Estimated Price</button>
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
              {/* Step 1: Residence Architecture */}
              <div className={styles.stepGroup}>
                <h3>1. Select Residence Architecture</h3>
                <div className={styles.houseTypeGrid}>
                  <label className={cleanValues.houseType === 'apartment' ? styles.activeHouseCard : styles.houseCard}>
                    <input type="radio" value="apartment" {...controlClean.register('houseType')} className={styles.hiddenRadio} />
                    <div className={styles.imageIconWrapper}>
                      <Image src="/images/house_icons/apartment.jpg" alt="Apartment" width={100} height={100} className={styles.houseImage} />
                    </div>
                    <span>Apartment / Condo</span>
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
                    <span>Single Family Home</span>
                  </label>
                </div>
              </div>

              {/* Step 2: Service Package */}
              <div className={styles.stepGroup}>
                <h3>2. Service Package</h3>
                <div className={styles.radioGrid}>
                  {[
                    { val: 'standard', title: 'Standard Maintenance', desc: 'Recurring upkeep of surfaces, bathrooms, kitchens, and floors' },
                    { val: 'deep', title: 'Detailed Deep Clean', desc: 'Hand-scrubbed baseboards, door trims, and heavy grout cleaning' },
                    { val: 'move_in_out', title: 'Move-In / Move-Out', desc: 'Vacant turnaround with empty cabinet & closet wipe-downs' }
                  ].map((pkg) => (
                    <label key={pkg.val} className={cleanValues.packageType === pkg.val ? styles.activeCard : styles.radioCard}>
                      <input type="radio" value={pkg.val} {...controlClean.register('packageType')} className={styles.hiddenRadio} />
                      <div className={styles.cardContent}>
                        <h4>{pkg.title}</h4>
                        <p>{pkg.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Step 3: Property Specifications */}
              <div className={styles.stepGroup}>
                <h3>3. Property Specifications</h3>
                
                {/* Bedrooms & Bathrooms */}
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

                {/* Square Footage & Floors */}
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label>Approx. Square Footage</label>
                    <Controller 
                      name="squareFeet" 
                      control={controlClean} 
                      render={({ field }) => <input type="number" {...field} min="300" max="25000" step="100" placeholder="e.g. 1500" className={styles.input} />} 
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Number of Floors / Levels</label>
                    <select {...controlClean.register('floors', { valueAsNumber: true })} className={styles.input}>
                      <option value={1}>1 Floor (Single Level)</option>
                      <option value={2}>2 Floors</option>
                      <option value={3}>3+ Floors</option>
                    </select>
                  </div>
                </div>

                {/* Location & Condition */}
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label>Operating Location</label>
                    <select {...controlClean.register('location')} className={styles.input}>
                      <option value="Atlanta Metro">Atlanta Metro (Buckhead, Midtown, Sandy Springs, Vinings, etc.)</option>
                      <option value="Washington, DC">Washington, DC (Georgetown, Dupont, NW DC, Capitol Hill)</option>
                      <option value="Maryland">Maryland (Bethesda, Potomac, Rockville, Annapolis, Beltsville)</option>
                      <option value="Northern Virginia">Northern Virginia (Arlington, Alexandria, McLean, Fairfax)</option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Current Home Condition</label>
                    <select {...controlClean.register('condition')} className={styles.input}>
                      <option value="standard">Regularly Maintained (Cleaned within past 2–3 weeks)</option>
                      <option value="moderate">Moderate Buildup (Lived-in, needs extra attention)</option>
                      <option value="heavy">Heavy Scrub Needed (Long overdue, first-time deep clean)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 4: Specialty Add-Ons */}
              <div className={styles.stepGroup}>
                <h3>4. Specialty Add-Ons (Optional)</h3>
                <div className={styles.checkboxGrid}>
                  {Object.entries(pricingConfig.cleaning.fixedExtras).map(([key, extra]: [string, any]) => (
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
                  {Object.entries(pricingConfig.cleaning.dynamicExtras).map(([key, extra]: [string, any]) => {
                    const price = extra.prices[cleanValues.houseType];
                    if (price <= 0) return null;
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

              {/* Step 5: Promotional Schedule */}
              <div className={styles.stepGroup}>
                <h3>5. Promotional Schedule</h3>
                <label className={cleanValues.isMondayTuesday ? styles.activeCheckboxCard : styles.checkboxCard} style={{cursor: 'pointer'}}>
                  <input type="checkbox" {...controlClean.register('isMondayTuesday')} className={styles.hiddenRadio} />
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                    <span style={{fontWeight: 600}}>Initial Cleaning on a Monday or Tuesday</span>
                    <span style={{color: 'var(--color-primary)', fontWeight: 600}}>10% OFF Estimated Total</span>
                  </div>
                </label>
              </div>

              <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>Calculate Estimated Price</button>
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
                <h3 className="font-serif">Estimated Price Summary</h3>
                <p style={{textTransform: 'capitalize'}}>
                  {cleanValues.packageType === 'deep' ? 'Deep Cleaning' : cleanValues.packageType === 'move_in_out' ? 'Move-In / Move-Out' : 'Standard Cleaning'} • {cleanValues.houseType}
                </p>
              </div>
              <div className={styles.receiptBody}>
                <div className={styles.receiptLine}>
                  <span>Base Scope ({cleanValues.bedrooms} Bed, {cleanValues.bathrooms} Bath)</span>
                  <span>${cleaningResult.subtotal}</span>
                </div>
                <div className={styles.receiptLine} style={{ fontSize: '0.84rem', color: '#64748b' }}>
                  <span>Specs: {cleanValues.squareFeet} sq ft • {cleanValues.floors} {cleanValues.floors === 1 ? 'Floor' : 'Floors'} • {cleanValues.location}</span>
                </div>
                {cleaningResult.discount > 0 && (
                  <div className={styles.receiptLine} style={{color: 'var(--color-primary)'}}>
                    <span>Mon/Tue Promotional Discount (10%)</span>
                    <span>-${cleaningResult.discount}</span>
                  </div>
                )}
                <div className={styles.receiptDivider}></div>
                <div className={styles.receiptTotal}>
                  <span>Estimated Price</span>
                  <span>${cleaningResult.total}</span>
                </div>
              </div>

              {/* Explicit Estimated Price Notice */}
              <div style={{
                background: 'rgba(217, 119, 6, 0.08)',
                border: '1px solid rgba(217, 119, 6, 0.25)',
                borderRadius: '8px',
                padding: '12px 14px',
                margin: '14px 0 10px 0',
                fontSize: '0.84rem',
                color: '#92400e',
                lineHeight: 1.5,
                textAlign: 'left'
              }}>
                <strong>*Estimated Price Notice:</strong> All quotes are estimated prices. Final firm price is confirmed based on square footage, home layout, and walkthrough confirmation before service begins.
              </div>

              {!leadSubmitted ? (
                <form onSubmit={handleCleanLeadSubmit} className={styles.leadForm} style={{ marginTop: '1rem' }}>
                  <input type="text" placeholder="Full Name" required className={styles.input} value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} />
                  <input type="email" placeholder="Email Address" required className={styles.input} value={customerInfo.email} onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})} />
                  <input type="tel" placeholder="Phone Number" required className={styles.input} value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} />
                  <button type="submit" className={`btn btn-secondary ${styles.fullWidthBtn}`}>
                    Request Estimated Quote & Scheduling
                  </button>
                </form>
              ) : (
                <div className={styles.successMessage} style={{ marginTop: '1rem' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <h4 className="font-serif">Estimated Quote Saved</h4>
                  <p>Our concierge team will reach out within 2 hours to confirm your specifications and finalize scheduling.</p>
                </div>
              )}
            </div>
          )}

          {/* Construction/Remodeling/Estate Result Box - "Lead" Style */}
          {(selectedService === 'remodeling' || selectedService === 'construction' || selectedService === 'estate') && rangeResult && (
            <div className={`result-anim ${styles.receiptBox}`}>
              <div className={styles.receiptHeader}>
                <h3 className="font-serif">
                  {selectedService === 'estate' ? 'Service Estimate Brief' : 'Architectural Brief'}
                </h3>
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
              
              <p className={styles.disclaimer} style={{marginTop: '1rem'}}>
                {selectedService === 'estate'
                  ? '*Exact quote is confirmed on-site based on hardware and scope before work begins.'
                  : '*An on-site evaluation by a lead architect is required for an exact proposal.'}
              </p>
              
              {!leadSubmitted ? (
                <form onSubmit={handleLeadSubmit} className={styles.leadForm} style={{ marginTop: '1.5rem' }}>
                  <input type="text" placeholder="Full Name" required className={styles.input} value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} />
                  <input type="email" placeholder="Email Address" required className={styles.input} value={customerInfo.email} onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})} />
                  <input type="tel" placeholder="Phone Number" required className={styles.input} value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} />
                  <button type="submit" className={`btn btn-secondary ${styles.fullWidthBtn}`}>
                    {selectedService === 'estate' ? 'Request Consultation & Schedule Call' : 'Request Consultation'}
                  </button>
                </form>
              ) : (
                <div className={styles.successMessage}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <h4 className="font-serif">Brief Received</h4>
                  <p>Our concierge team will contact you within 24 hours to review your specifications.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
