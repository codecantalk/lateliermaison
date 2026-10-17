'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useForm, Controller } from 'react-hook-form'
import { gsap } from 'gsap'
import { loadStripe } from '@stripe/stripe-js'
import { 
  Refrigerator, Microwave, UtensilsCrossed, Shirt, 
  Sparkles, Archive, LayoutGrid, Hammer, CarFront, Tent,
  CreditCard, ShieldCheck, CheckCircle2, Lock, ArrowRight, Loader2
} from 'lucide-react'
import styles from './EstimateCalculator.module.css'
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

// Compact Icons mapping (20px icons for app-screen aesthetic)
const ICONS_MAP: Record<string, React.ReactNode> = {
  fridge: <Refrigerator size={20} strokeWidth={1.5} />,
  oven: <Microwave size={20} strokeWidth={1.5} />,
  dishwashing: <UtensilsCrossed size={20} strokeWidth={1.5} />,
  laundry: <Shirt size={20} strokeWidth={1.5} />,
  deep: <Sparkles size={20} strokeWidth={1.5} />,
  cabinets: <Archive size={20} strokeWidth={1.5} />,
  windows: <LayoutGrid size={20} strokeWidth={1.5} />,
  post_construction: <Hammer size={20} strokeWidth={1.5} />,
  garage: <CarFront size={20} strokeWidth={1.5} />,
  porch: <Tent size={20} strokeWidth={1.5} />
}

// Standard fallback pricing matrix in case network or pricing_config is slow
const DEFAULT_CLEANING = {
  base: { apartment: 169, townhome: 199, single: 229 },
  additions: { bedroom: 30, bathroom: 35 },
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
}

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
  
  const [selectedService, setSelectedService] = useState<ServiceType>(urlService || defaultService || 'cleaning')
  const [pricingConfig, setPricingConfig] = useState<any>(null)
  const [isPricingLoading, setIsPricingLoading] = useState(true)
  const supabase = createClient()

  // Contact info & checkout state
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '', address: '' })
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false)
  const [leadSubmitted, setLeadSubmitted] = useState(false)

  // Results State
  const [cleaningResult, setCleaningResult] = useState<{total: number, subtotal: number, discount: number} | null>(null)
  const [rangeResult, setRangeResult] = useState<{min: number, max: number, type: string} | null>(null)

  // Forms
  const { control: controlClean, handleSubmit: handleCleanSubmit, watch: watchClean, setValue: setCleanValue } = useForm<CleaningData>({
    defaultValues: { 
      houseType: 'apartment', 
      bedrooms: 2, 
      bathrooms: 2, 
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

  // Fetch dynamic pricing
  useEffect(() => {
    async function fetchPricing() {
      try {
        const { data, error } = await supabase
          .from('pricing_config')
          .select('key, value')
          .in('key', ['cleaning_pricing', 'remodeling_pricing', 'construction_pricing'])
        
        if (data && data.length > 0) {
          const pricing = {
            cleaning: data.find(d => d.key === 'cleaning_pricing')?.value || DEFAULT_CLEANING,
            remodeling: data.find(d => d.key === 'remodeling_pricing')?.value || DEFAULT_REMODEL,
            construction: data.find(d => d.key === 'construction_pricing')?.value || DEFAULT_CONST,
          }
          setPricingConfig(pricing)
        } else {
          setPricingConfig({
            cleaning: DEFAULT_CLEANING,
            remodeling: DEFAULT_REMODEL,
            construction: DEFAULT_CONST,
          })
        }
      } catch {
        setPricingConfig({
          cleaning: DEFAULT_CLEANING,
          remodeling: DEFAULT_REMODEL,
          construction: DEFAULT_CONST,
        })
      } finally {
        setIsPricingLoading(false)
      }
    }
    fetchPricing()
  }, [supabase])

  // Sync URL parameters after hydration
  useEffect(() => {
    if (urlService) setSelectedService(urlService)
    if (urlTrade) setEstateValue('trade', urlTrade)
    if (urlScope) setEstateValue('scope', urlScope)
  }, [urlService, urlTrade, urlScope, setEstateValue])

  // Pure Calculation function for House Cleaning
  const computeCleaning = useCallback((data: CleaningData, config: any) => {
    const cfg = config?.cleaning || DEFAULT_CLEANING
    let basePrice = cfg.base?.[data.houseType] || 169

    if (data.houseType === 'single') {
      if (data.squareFeet <= 1000 && data.bedrooms === 1 && data.bathrooms === 1) {
        basePrice = Math.round(basePrice * 0.75)
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

    if (data.bedrooms > 1) {
      total += (data.bedrooms - 1) * (cfg.additions?.bedroom || 30)
    }
    if (data.bathrooms > 1) {
      total += (data.bathrooms - 1) * (cfg.additions?.bathroom || 35)
    }

    if (data.floors === 2) {
      total += 15
    } else if (data.floors >= 3) {
      total += 30
    }

    if (data.condition === 'moderate') {
      total = Math.round(total * 1.15)
    } else if (data.condition === 'heavy') {
      total = Math.round(total * 1.30)
    }

    if (data.packageType === 'deep') {
      total = Math.round(total * 1.35)
    } else if (data.packageType === 'move_in_out') {
      total = Math.round(total * 1.45)
    }

    data.extras?.forEach(extra => {
      const fixed = cfg.fixedExtras?.[extra]
      if (fixed) total += fixed.price
    })

    data.dynamicExtras?.forEach(extra => {
      const dyn = cfg.dynamicExtras?.[extra]
      if (dyn && dyn.prices?.[data.houseType] > 0) {
        total += dyn.prices[data.houseType]
      }
    })

    const subtotal = total
    let discount = 0
    if (data.isMondayTuesday) {
      discount = Math.round(total * 0.10)
      total -= discount
    }

    return { total: Math.round(total), subtotal: Math.round(subtotal), discount }
  }, [])

  // Auto-recalculate cleaning reactively for modern instant-feedback app feel
  useEffect(() => {
    if (selectedService === 'cleaning') {
      const res = computeCleaning(cleanValues, pricingConfig)
      setCleaningResult(res)
    }
  }, [cleanValues, pricingConfig, selectedService, computeCleaning])

  // Auto-calculate Estate / Home Services baseline reactively
  useEffect(() => {
    if (selectedService === 'estate') {
      const tradeKey = estateValues.trade || 'handyman'
      const tradeConfig = ESTATE_PRICING[tradeKey] || ESTATE_PRICING.handyman
      const scopeKey = estateValues.scope || 'diagnostic'
      const [min, max] = tradeConfig[scopeKey] || [160, 260]
      const scopeName = scopeKey === 'diagnostic' ? 'Diagnostic Evaluation' : scopeKey === 'minor' ? 'Minor Project' : 'Major Renovation'
      setRangeResult({ min, max, type: `${tradeConfig.label} • ${scopeName}` })
    }
  }, [estateValues, selectedService])

  // Handlers
  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service)
    setLeadSubmitted(false)
    gsap.fromTo('.form-anim', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' })
  }

  const onRemodelSubmit = (data: RemodelingData) => {
    const config = pricingConfig?.remodeling || DEFAULT_REMODEL
    const base = (config.scope[data.scope] || DEFAULT_REMODEL.scope[data.scope]) + 
                 (config.size[data.size] || DEFAULT_REMODEL.size[data.size])
    setRangeResult({ min: Math.round(base * 0.9), max: Math.round(base * 1.15), type: 'Bathroom Remodeling' })
  }

  const onConstSubmit = (data: ConstructionData) => {
    const config = pricingConfig?.construction || DEFAULT_CONST
    const rate = config.grade[data.grade] || DEFAULT_CONST.grade[data.grade] || 250
    const base = data.squareFeet * rate
    setRangeResult({ min: Math.round(base * 0.9), max: Math.round(base * 1.2), type: 'New Construction' })
  }

  const onEstateSubmit = (data: EstateData) => {
    const tradeKey = data.trade || 'handyman'
    const tradeConfig = ESTATE_PRICING[tradeKey] || ESTATE_PRICING.handyman
    const scopeKey = data.scope || 'diagnostic'
    const [min, max] = tradeConfig[scopeKey] || [160, 260]
    const scopeName = scopeKey === 'diagnostic' ? 'Diagnostic Evaluation' : scopeKey === 'minor' ? 'Minor Project' : 'Major Renovation'
    setRangeResult({ min, max, type: `${tradeConfig.label} • ${scopeName}` })
  }

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
          details: { ...details, address: customerInfo.address || details.location || '' },
        }),
      })
    } catch (e) {
      console.error("Failed to save lead", e)
    }
  }

  // 1. Direct Stripe Checkout Flow (When user clicks Pay & Book Now)
  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('Please fill in your name, email, and phone number to proceed with booking.')
      return
    }

    setIsCheckingOut(true)

    const totalAmount = selectedService === 'cleaning'
      ? (cleaningResult?.total || 0)
      : (rangeResult?.min || 0)

    if (totalAmount <= 0) {
      alert('A valid service price is required for checkout.')
      setIsCheckingOut(false)
      return
    }

    const serviceLabel = selectedService === 'cleaning'
      ? `House Cleaning (${cleanValues.packageType === 'deep' ? 'Deep Clean' : cleanValues.packageType === 'move_in_out' ? 'Move-Out Turnover' : 'Standard Maintenance'})`
      : selectedService === 'estate'
      ? `Home Services (${rangeResult?.type || estateValues.trade})`
      : `${selectedService ? selectedService.toUpperCase() : 'Home Service'} Reservation`

    const detailsPayload = selectedService === 'cleaning'
      ? { ...cleanValues, ...customerInfo, estimatedPrice: cleaningResult?.total, isStripeCheckout: true }
      : { ...(selectedService === 'construction' ? constValues : selectedService === 'remodeling' ? remodelValues : estateValues), ...customerInfo, estimatedPrice: totalAmount, isStripeCheckout: true }

    let createdLeadId = ''
    try {
      const { data: leadData } = await supabase.from('leads').insert({
        customer_name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        service_type: serviceLabel,
        total_price: totalAmount,
        details: detailsPayload,
        status: 'pending'
      }).select('id').maybeSingle()
      if (leadData?.id) createdLeadId = leadData.id
    } catch (e) {
      console.warn("Preliminary lead recording:", e)
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: totalAmount, 
          serviceName: serviceLabel,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          details: detailsPayload,
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
        throw new Error(data.error || 'Failed to initiate checkout session.')
      }
    } catch (err: any) {
      alert(err.message || 'Payment initiation error. Please try again.')
      setIsCheckingOut(false)
    }
  }

  // 2. Free Quote / Consultation Callback Flow (When user clicks Request Consultation)
  const handleFreeQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('Please enter your name, email, and phone number to receive your quote.')
      return
    }

    setIsSubmittingQuote(true)

    const serviceName = selectedService === 'cleaning'
      ? 'House Cleaning'
      : selectedService === 'estate'
      ? `Home Services (${rangeResult?.type || estateValues.trade})`
      : selectedService === 'remodeling'
      ? `Bathroom Remodeling (${rangeResult?.type || 'Remodel'})`
      : 'New Construction'

    const amount = selectedService === 'cleaning'
      ? (cleaningResult?.total || 0)
      : (rangeResult?.min || 0)

    const details = selectedService === 'cleaning'
      ? {
          ...cleanValues,
          estimatedPrice: cleaningResult?.total,
          subtotal: cleaningResult?.subtotal,
          discount: cleaningResult?.discount,
          isEstimatedQuote: true,
        }
      : {
          ...(selectedService === 'construction' ? constValues : selectedService === 'remodeling' ? remodelValues : estateValues),
          estimatedPriceRange: rangeResult && rangeResult.min > 0 ? `$${rangeResult.min.toLocaleString()} – $${rangeResult.max.toLocaleString()}` : undefined,
          estimatedBaseline: amount,
        }

    await saveLeadToDatabase(serviceName, amount, details)
    setIsSubmittingQuote(false)
    setLeadSubmitted(true)
  }

  const currentCleaningCfg = pricingConfig?.cleaning || DEFAULT_CLEANING

  return (
    <div className={styles.calculator}>
      <div className={styles.header}>
        <h2 className="font-serif">Instant <span className="font-italic" style={{color: 'var(--color-primary)'}}>Estimation</span> & Booking</h2>
        <p>Configure your property specifications for transparent pricing or immediate reservation.</p>
      </div>

      {/* Modern App Segmented Ribbon */}
      <div className={styles.serviceSelection}>
        <button 
          className={`${styles.serviceBtn} ${selectedService === 'cleaning' ? styles.activeService : ''}`} 
          onClick={() => handleServiceSelect('cleaning')}
        >
          <Sparkles size={16} />
          <span>House Cleaning</span>
        </button>

        <button 
          className={`${styles.serviceBtn} ${selectedService === 'remodeling' ? styles.activeService : ''}`} 
          onClick={() => handleServiceSelect('remodeling')}
        >
          <Hammer size={16} />
          <span>Remodeling</span>
        </button>

        <button 
          className={`${styles.serviceBtn} ${selectedService === 'construction' ? styles.activeService : ''}`} 
          onClick={() => handleServiceSelect('construction')}
        >
          <LayoutGrid size={16} />
          <span>New Construction</span>
        </button>

        <button 
          className={`${styles.serviceBtn} ${selectedService === 'estate' ? styles.activeService : ''}`} 
          onClick={() => handleServiceSelect('estate')}
        >
          <Archive size={16} />
          <span>Home Services & Trades</span>
        </button>
      </div>

      <div className={styles.container}>
        {/* Left Column: Interactive App Screen Inputs */}
        <div className={styles.formSection}>
          
          {/* --- HOUSE CLEANING FLOW --- */}
          {selectedService === 'cleaning' && (
            <div className={`form-anim ${styles.form}`}>
              {/* Step 1: Residence Architecture */}
              <div className={styles.stepGroup}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepBadge}>01</span>
                  <h3 className={styles.stepTitle}>Select Residence Architecture</h3>
                </div>
                <div className={styles.houseTypeGrid}>
                  <label className={cleanValues.houseType === 'apartment' ? styles.activeHouseCard : styles.houseCard}>
                    <input type="radio" value="apartment" {...controlClean.register('houseType')} className={styles.hiddenRadio} />
                    <div className={styles.imageIconWrapper}>
                      <Image src="/images/house_icons/apartment.jpg" alt="Apartment" width={48} height={48} className={styles.houseImage} />
                    </div>
                    <span className={styles.houseCardTitle}>Apartment / Condo</span>
                    <span className={styles.houseCardSubtitle}>Single Level Living</span>
                  </label>

                  <label className={cleanValues.houseType === 'townhome' ? styles.activeHouseCard : styles.houseCard}>
                    <input type="radio" value="townhome" {...controlClean.register('houseType')} className={styles.hiddenRadio} />
                    <div className={styles.imageIconWrapper}>
                      <Image src="/images/house_icons/townhome.jpg" alt="Townhome" width={48} height={48} className={styles.houseImage} />
                    </div>
                    <span className={styles.houseCardTitle}>Townhome</span>
                    <span className={styles.houseCardSubtitle}>Multi-Level Attached</span>
                  </label>

                  <label className={cleanValues.houseType === 'single' ? styles.activeHouseCard : styles.houseCard}>
                    <input type="radio" value="single" {...controlClean.register('houseType')} className={styles.hiddenRadio} />
                    <div className={styles.imageIconWrapper}>
                      <Image src="/images/house_icons/single_family.jpg" alt="Single Family" width={48} height={48} className={styles.houseImage} />
                    </div>
                    <span className={styles.houseCardTitle}>Single Family</span>
                    <span className={styles.houseCardSubtitle}>Detached Residence</span>
                  </label>
                </div>
              </div>

              {/* Step 2: Service Package */}
              <div className={styles.stepGroup}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepBadge}>02</span>
                  <h3 className={styles.stepTitle}>Service Package</h3>
                </div>
                <div className={styles.radioGrid}>
                  {[
                    { val: 'standard', title: 'Standard Maintenance', desc: 'Recurring upkeep of all living surfaces, kitchen, baths, and floors' },
                    { val: 'deep', title: 'Detailed Deep Clean', desc: 'Hand-scrubbed baseboards, doors, trims, vent grilles, and grout' },
                    { val: 'move_in_out', title: 'Move-In / Move-Out', desc: 'Vacant turnaround with empty cabinets, closets, and appliances' },
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

              {/* Step 3: Property Specs */}
              <div className={styles.stepGroup}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepBadge}>03</span>
                  <h3 className={styles.stepTitle}>Property Specifications</h3>
                </div>
                
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label>Bedrooms</label>
                    <select {...controlClean.register('bedrooms', { valueAsNumber: true })} className={styles.input}>
                      {[1, 2, 3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Bedroom' : 'Bedrooms'}</option>)}
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Bathrooms</label>
                    <select {...controlClean.register('bathrooms', { valueAsNumber: true })} className={styles.input}>
                      {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Bathroom' : 'Bathrooms'}</option>)}
                    </select>
                  </div>
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label>Approx. Square Footage</label>
                    <select {...controlClean.register('squareFeet', { valueAsNumber: true })} className={styles.input}>
                      <option value={800}>Under 1,000 sq ft</option>
                      <option value={1200}>1,000 – 1,500 sq ft</option>
                      <option value={1800}>1,500 – 2,200 sq ft</option>
                      <option value={2500}>2,200 – 3,000 sq ft</option>
                      <option value={3500}>3,000 – 4,000 sq ft</option>
                      <option value={4500}>4,000 – 5,500 sq ft</option>
                      <option value={6000}>5,500+ sq ft (Estate)</option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Floors / Levels</label>
                    <select {...controlClean.register('floors', { valueAsNumber: true })} className={styles.input}>
                      <option value={1}>1 Floor (Single Level)</option>
                      <option value={2}>2 Floors</option>
                      <option value={3}>3+ Floors</option>
                    </select>
                  </div>
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label>Operating Metro Region</label>
                    <select {...controlClean.register('location')} className={styles.input}>
                      <option value="Atlanta Metro">Atlanta Metro (Buckhead, Midtown, Sandy Springs, Vinings)</option>
                      <option value="Washington, DC">Washington, DC (Georgetown, Dupont, NW DC, Capitol Hill)</option>
                      <option value="Maryland">Maryland (Bethesda, Potomac, Rockville, Annapolis)</option>
                      <option value="Northern Virginia">Northern Virginia (Arlington, Alexandria, McLean, Fairfax)</option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Current Home Condition</label>
                    <select {...controlClean.register('condition')} className={styles.input}>
                      <option value="standard">Regularly Maintained (Cleaned within past 2–3 weeks)</option>
                      <option value="moderate">Moderate Buildup (Lived-in, extra attention needed)</option>
                      <option value="heavy">Heavy Scrub Needed (Overdue / First-time deep clean)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 4: Specialty Add-Ons */}
              <div className={styles.stepGroup}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepBadge}>04</span>
                  <h3 className={styles.stepTitle}>Specialty Add-Ons (Optional)</h3>
                </div>
                <div className={styles.checkboxGrid}>
                  {Object.entries(currentCleaningCfg.fixedExtras || {}).map(([key, extra]: [string, any]) => (
                    <label key={key} className={cleanValues.extras.includes(key) ? styles.activeCheckboxCard : styles.checkboxCard}>
                      <input type="checkbox" value={key} {...controlClean.register('extras')} className={styles.hiddenRadio} />
                      <div style={{ color: cleanValues.extras.includes(key) ? '#0B132B' : '#64748b' }}>
                        {ICONS_MAP[key] || <Sparkles size={20} />}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0B132B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{extra.label}</span>
                        <span style={{ fontSize: '0.78rem', color: '#c5a059', fontWeight: 700 }}>+${extra.price}</span>
                      </div>
                    </label>
                  ))}
                  {Object.entries(currentCleaningCfg.dynamicExtras || {}).map(([key, extra]: [string, any]) => {
                    const price = extra.prices?.[cleanValues.houseType] || 0
                    if (price <= 0) return null
                    return (
                      <label key={key} className={cleanValues.dynamicExtras.includes(key) ? styles.activeCheckboxCard : styles.checkboxCard}>
                        <input type="checkbox" value={key} {...controlClean.register('dynamicExtras')} className={styles.hiddenRadio} />
                        <div style={{ color: cleanValues.dynamicExtras.includes(key) ? '#0B132B' : '#64748b' }}>
                          {ICONS_MAP[key] || <LayoutGrid size={20} />}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0B132B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{extra.label}</span>
                          <span style={{ fontSize: '0.78rem', color: '#c5a059', fontWeight: 700 }}>+${price}</span>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Step 5: Promotional Schedule */}
              <div className={styles.stepGroup}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepBadge}>05</span>
                  <h3 className={styles.stepTitle}>Promotional Schedule</h3>
                </div>
                <label className={cleanValues.isMondayTuesday ? styles.activeCheckboxCard : styles.checkboxCard} style={{cursor: 'pointer', padding: '12px 16px'}}>
                  <input type="checkbox" {...controlClean.register('isMondayTuesday')} className={styles.hiddenRadio} />
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                    <span style={{fontSize: '0.88rem', fontWeight: 600, color: '#0B132B'}}>Initial Clean on a Monday or Tuesday</span>
                    <span style={{color: '#10b981', fontWeight: 700, fontSize: '0.85rem', background: 'rgba(16, 185, 129, 0.1)', padding: '3px 8px', borderRadius: '4px'}}>
                      10% OFF Applied
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* --- REMODELING FLOW --- */}
          {selectedService === 'remodeling' && (
            <form onSubmit={handleRemodelSubmit(onRemodelSubmit)} className={`form-anim ${styles.form}`}>
              <div className={styles.stepGroup}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepBadge}>01</span>
                  <h3 className={styles.stepTitle}>Scope of Work</h3>
                </div>
                <div className={styles.radioGrid}>
                  {[
                    { val: 'cosmetic', title: 'Cosmetic Refresh', desc: 'Fixtures, paint, vanity refresh, minor tile' },
                    { val: 'partial', title: 'Partial Remodel', desc: 'New custom vanity, shower/tub rebuild' },
                    { val: 'full', title: 'Full Gut & Custom', desc: 'Architectural re-layout, luxury stone & tile' }
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
                <div className={styles.stepHeader}>
                  <span className={styles.stepBadge}>02</span>
                  <h3 className={styles.stepTitle}>Bathroom Size</h3>
                </div>
                <div className={styles.radioGridRow}>
                  {['small', 'medium', 'large', 'master'].map((size) => (
                    <label key={size} className={remodelValues.size === size ? styles.activeChip : styles.chip}>
                      <input type="radio" value={size} {...controlRemodel.register('size')} className={styles.hiddenRadio} />
                      <span style={{textTransform: 'capitalize'}}>{size} Bathroom</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className={styles.stripePayBtn}>
                Update Estimated Investment
              </button>
            </form>
          )}

          {/* --- NEW CONSTRUCTION FLOW --- */}
          {selectedService === 'construction' && (
            <form onSubmit={handleConstSubmit(onConstSubmit)} className={`form-anim ${styles.form}`}>
              <div className={styles.stepGroup}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepBadge}>01</span>
                  <h3 className={styles.stepTitle}>Estate Size</h3>
                </div>
                <div className={styles.inputGroup}>
                  <label>Approximate Square Footage</label>
                  <Controller name="squareFeet" control={controlConst} render={({ field }) => (
                    <input type="number" {...field} step="500" min="1000" className={styles.input} />
                  )} />
                </div>
              </div>

              <div className={styles.stepGroup}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepBadge}>02</span>
                  <h3 className={styles.stepTitle}>Build Grade</h3>
                </div>
                <div className={styles.radioGrid}>
                  {[
                    { val: 'luxury', title: 'Luxury', desc: 'Premium custom finishes & architectural framing' },
                    { val: 'ultra', title: 'Ultra-Luxury', desc: 'Fully custom architecture & imported materials' },
                    { val: 'monumental', title: 'Monumental', desc: 'No-compromise landmark estate building' }
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

              <button type="submit" className={styles.stripePayBtn}>
                Update Construction Baseline
              </button>
            </form>
          )}

          {/* --- ESTATE MANAGEMENT & HOME SERVICES FLOW --- */}
          {selectedService === 'estate' && (
            <form onSubmit={handleEstateSubmit(onEstateSubmit)} className={`form-anim ${styles.form}`}>
              <div className={styles.stepGroup}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepBadge}>01</span>
                  <h3 className={styles.stepTitle}>Required Discipline & Trade</h3>
                </div>
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
                <div className={styles.stepHeader}>
                  <span className={styles.stepBadge}>02</span>
                  <h3 className={styles.stepTitle}>Scope of Service</h3>
                </div>
                <div className={styles.radioGrid}>
                  {[
                    { val: 'diagnostic', title: 'Diagnostic Call', desc: 'Immediate evaluation, triage & same-day troubleshooting' },
                    { val: 'minor', title: 'Minor Project', desc: 'Fixture replacements, targeted repairs, hardware install' },
                    { val: 'major', title: 'Major Renovation', desc: 'Extensive modifications, multi-room work, overhauls' }
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

              <button type="submit" className={styles.stripePayBtn}>
                Calculate Estimated Baseline
              </button>
            </form>
          )}

        </div>

        {/* Right Column: Sticky App Screen Summary & Stripe Checkout Drawer */}
        <div className={styles.resultSection}>
          
          {/* House Cleaning Summary & Stripe Checkout */}
          {selectedService === 'cleaning' && cleaningResult && (
            <div className={`result-anim ${styles.receiptBox}`}>
              <div className={styles.receiptHeader}>
                <div className={styles.liveBadge}>
                  <span className={styles.pulseDot} />
                  Live Calculation
                </div>
                <h3>Estimated Price Summary</h3>
                <p>
                  {cleanValues.packageType === 'deep' ? 'Deep Cleaning' : cleanValues.packageType === 'move_in_out' ? 'Move-Out Turnover' : 'Standard Maintenance'} • {cleanValues.houseType}
                </p>
              </div>

              <div className={styles.receiptBody}>
                <div className={styles.receiptLine}>
                  <span className={styles.receiptLineTitle}>Base Scope ({cleanValues.bedrooms} Bed, {cleanValues.bathrooms} Bath)</span>
                  <span className={styles.receiptLinePrice}>${cleaningResult.subtotal.toFixed(2)}</span>
                </div>
                <div className={styles.receiptSubSpecs}>
                  Specs: {cleanValues.squareFeet.toLocaleString()} sq ft • {cleanValues.floors} {cleanValues.floors === 1 ? 'Floor' : 'Floors'} • {cleanValues.location}
                </div>

                {cleanValues.extras.length > 0 && (
                  <div className={styles.receiptLine} style={{ marginTop: '4px' }}>
                    <span className={styles.receiptLineTitle}>Selected Inclusions ({cleanValues.extras.length})</span>
                    <span className={styles.receiptLinePrice} style={{ color: '#0B132B' }}>Included in total</span>
                  </div>
                )}

                {cleaningResult.discount > 0 && (
                  <div className={styles.receiptLine} style={{ color: '#10b981' }}>
                    <span className={styles.receiptLineTitle}>Monday/Tuesday Promotional Discount</span>
                    <span className={styles.receiptLinePrice} style={{ color: '#10b981' }}>-${cleaningResult.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className={styles.receiptDivider} />
                
                <div className={styles.receiptTotal}>
                  <span>Estimated Total</span>
                  <span style={{ color: '#0B132B' }}>${cleaningResult.total.toFixed(2)}</span>
                </div>
              </div>

              <div className={styles.estimateNotice}>
                <strong>*Walkthrough Confirmation:</strong> All quotes are estimated prices. Final firm price is confirmed during home walkthrough before service begins.
              </div>

              {/* Stripe Payment & Consultation Booking Form */}
              {!leadSubmitted ? (
                <div className={styles.checkoutForm}>
                  <div className={styles.checkoutFormTitle}>Client Reservation Details</div>
                  
                  <input 
                    type="text" 
                    placeholder="Full Legal Name" 
                    required 
                    className={styles.input} 
                    value={customerInfo.name} 
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} 
                  />
                  <input 
                    type="email" 
                    placeholder="Email Address (for receipt & updates)" 
                    required 
                    className={styles.input} 
                    value={customerInfo.email} 
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})} 
                  />
                  <input 
                    type="tel" 
                    placeholder="Mobile Phone Number" 
                    required 
                    className={styles.input} 
                    value={customerInfo.phone} 
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} 
                  />
                  <input 
                    type="text" 
                    placeholder="Service Street Address (City, State, Zip)" 
                    className={styles.input} 
                    value={customerInfo.address} 
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} 
                  />

                  {/* 1. Primary Action: Instant Stripe Checkout */}
                  <button 
                    type="button" 
                    onClick={handleStripeCheckout} 
                    disabled={isCheckingOut}
                    className={styles.stripePayBtn}
                    style={{ marginTop: '6px' }}
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Connecting to Stripe...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        <span>Pay & Book with Stripe &bull; ${cleaningResult.total.toFixed(2)}</span>
                      </>
                    )}
                  </button>

                  <div className={styles.stripeSecurityNote}>
                    <Lock size={12} color="#10b981" />
                    <span>256-bit encrypted checkout via Stripe &bull; Card, Apple Pay, Google Pay</span>
                  </div>

                  <div className={styles.quoteDivider}>
                    <span>or pay later</span>
                  </div>

                  {/* 2. Secondary Action: Quote Consultation (Pay Later) */}
                  <button 
                    type="button" 
                    onClick={handleFreeQuoteSubmit} 
                    disabled={isSubmittingQuote}
                    className={styles.quoteOnlyBtn}
                  >
                    {isSubmittingQuote ? 'Sending Brief...' : 'Request Free Quote & Callback (No Charge Today)'}
                  </button>
                </div>
              ) : (
                <div className={styles.successMessage}>
                  <CheckCircle2 size={42} />
                  <h4 className="font-serif">Reservation Received</h4>
                  <p>Our executive concierge team will contact you within 2 hours to confirm your specifications and finalize appointment time.</p>
                </div>
              )}
            </div>
          )}

          {/* Construction / Remodeling / Home Services Summary & Action */}
          {(selectedService === 'remodeling' || selectedService === 'construction' || selectedService === 'estate') && rangeResult && (
            <div className={`result-anim ${styles.receiptBox}`}>
              <div className={styles.receiptHeader}>
                <div className={styles.liveBadge}>
                  <span className={styles.pulseDot} />
                  Calculated Estimate
                </div>
                <h3>{selectedService === 'estate' ? 'Service Estimate Brief' : 'Architectural Brief'}</h3>
                <p>{rangeResult.type}</p>
              </div>

              {rangeResult.min > 0 && (
                <div className={styles.receiptBody}>
                  <div className={styles.receiptLine}>
                    <span className={styles.receiptLineTitle}>Estimated Baseline Investment</span>
                  </div>
                  <div className={styles.receiptTotalRange}>
                    <span>${rangeResult.min.toLocaleString()}</span>
                    <span style={{ fontSize: '1.2rem', color: '#94a3b8' }}>–</span>
                    <span>${rangeResult.max.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className={styles.estimateNotice}>
                {selectedService === 'estate'
                  ? '*Exact quote is confirmed on-site based on hardware, materials, and scope before work commences.'
                  : '*An on-site architectural evaluation by a master builder is required for an exact binding proposal.'}
              </div>

              {!leadSubmitted ? (
                <div className={styles.checkoutForm}>
                  <div className={styles.checkoutFormTitle}>Contact & Location Specifications</div>
                  
                  <input 
                    type="text" 
                    placeholder="Full Legal Name" 
                    required 
                    className={styles.input} 
                    value={customerInfo.name} 
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} 
                  />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    required 
                    className={styles.input} 
                    value={customerInfo.email} 
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})} 
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    required 
                    className={styles.input} 
                    value={customerInfo.phone} 
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} 
                  />
                  <input 
                    type="text" 
                    placeholder="Project / Residence Address" 
                    className={styles.input} 
                    value={customerInfo.address} 
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} 
                  />

                  {/* If Estate / Diagnostic service, offer immediate Stripe booking */}
                  {selectedService === 'estate' && rangeResult.min > 0 ? (
                    <>
                      <button 
                        type="button" 
                        onClick={handleStripeCheckout} 
                        disabled={isCheckingOut}
                        className={styles.stripePayBtn}
                        style={{ marginTop: '6px' }}
                      >
                        {isCheckingOut ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Connecting to Stripe...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard size={18} />
                            <span>Book Diagnostic Visit &bull; ${rangeResult.min.toFixed(2)}</span>
                          </>
                        )}
                      </button>

                      <div className={styles.stripeSecurityNote}>
                        <Lock size={12} color="#10b981" />
                        <span>Secure Stripe reservation &bull; Credit/Debit, Apple Pay</span>
                      </div>

                      <div className={styles.quoteDivider}>
                        <span>or pay later</span>
                      </div>
                    </>
                  ) : null}

                  <button 
                    type="button" 
                    onClick={handleFreeQuoteSubmit} 
                    disabled={isSubmittingQuote}
                    className={selectedService === 'estate' && rangeResult.min > 0 ? styles.quoteOnlyBtn : styles.stripePayBtn}
                  >
                    {isSubmittingQuote ? 'Sending Brief...' : (
                      <>
                        <span>Request Consultation & Schedule Call</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className={styles.successMessage}>
                  <CheckCircle2 size={42} />
                  <h4 className="font-serif">Consultation Brief Received</h4>
                  <p>Our senior project manager will contact you within 24 hours to review your requirements and schedule an on-site walkthrough.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
