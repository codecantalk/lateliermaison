'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useForm, Controller } from 'react-hook-form'
import { gsap } from 'gsap'
import { loadStripe } from '@stripe/stripe-js'
import { 
  Refrigerator, Microwave, UtensilsCrossed, Shirt, 
  Sparkles, Archive, LayoutGrid, Hammer, CarFront, Tent,
  CreditCard, CheckCircle2, Lock, ArrowRight, Loader2,
  Tv, Paintbrush, Layers, Wrench
} from 'lucide-react'
import styles from './EstimateCalculator.module.css'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export type ServiceType = 'cleaning' | 'tv' | 'painting' | 'flooring' | 'remodeling' | 'estate' | 'construction' | null

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

type TvData = {
  screenSize: 'small' | 'medium' | 'large'
  bracketType: 'tilt' | 'motion' | 'client_provided'
  wallSurface: 'drywall' | 'brick'
  wireConcealment: 'none' | 'in_wall'
}

type PaintingData = {
  scope: 'touchup' | 'single_room' | 'multi_room' | 'exterior'
  condition: 'smooth' | 'prep_needed'
}

type FlooringData = {
  scope: 'repair' | 'single_room' | 'multi_room' | 'whole_estate'
  material: 'hardwood' | 'tile' | 'luxury_vinyl'
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
  trade: 'plumbing' | 'electrical' | 'lighting' | 'home theater' | 'handyman'
  scope: 'diagnostic' | 'minor' | 'major'
}

// Compact Icons mapping
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

// Default Fallbacks
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

// Master Trade & Scope Pricing Matrix for Home Services & Trades
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
  
  // URL params mapping
  const rawService = searchParams?.get('service')
  const rawTrade = searchParams?.get('trade')
  let initialService: ServiceType = defaultService || 'cleaning'
  if (rawService === 'tv-mounting' || rawService === 'tv' || rawTrade === 'tv mounting' || rawTrade === 'tv') initialService = 'tv'
  else if (rawService === 'painting' || rawTrade === 'painting') initialService = 'painting'
  else if (rawService === 'flooring' || rawTrade === 'flooring') initialService = 'flooring'
  else if (rawService === 'remodeling') initialService = 'remodeling'
  else if (rawService === 'construction') initialService = 'construction'
  else if (rawService === 'estate') initialService = 'estate'
  else if (rawService === 'cleaning' || rawService === 'housecleaning') initialService = 'cleaning'
  
  const [selectedService, setSelectedService] = useState<ServiceType>(initialService)
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
  const [tvResult, setTvResult] = useState<{total: number, breakdown: string[]} | null>(null)
  const [rangeResult, setRangeResult] = useState<{min: number, max: number, type: string} | null>(null)

  // 1. Cleaning Form
  const { control: controlClean, watch: watchClean } = useForm<CleaningData>({
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

  // 2. TV Mounting Form
  const { control: controlTv, watch: watchTv } = useForm<TvData>({
    defaultValues: {
      screenSize: 'medium',
      bracketType: 'tilt',
      wallSurface: 'drywall',
      wireConcealment: 'none'
    }
  })
  const tvValues = watchTv()

  // 3. Painting Form
  const { control: controlPaint, watch: watchPaint } = useForm<PaintingData>({
    defaultValues: { scope: 'single_room', condition: 'smooth' }
  })
  const paintValues = watchPaint()

  // 4. Flooring Form
  const { control: controlFloor, watch: watchFloor } = useForm<FlooringData>({
    defaultValues: { scope: 'single_room', material: 'hardwood' }
  })
  const floorValues = watchFloor()

  // 5. Remodeling Form
  const { control: controlRemodel, watch: watchRemodel } = useForm<RemodelingData>({
    defaultValues: { scope: 'partial', size: 'medium' }
  })
  const remodelValues = watchRemodel()

  // 6. Construction Form
  const { control: controlConst, watch: watchConst } = useForm<ConstructionData>({
    defaultValues: { squareFeet: 3500, grade: 'luxury' }
  })
  const constValues = watchConst()

  // 7. Estate & Trades Form
  const { control: controlEstate, watch: watchEstate, setValue: setEstateValue } = useForm<EstateData>({
    defaultValues: { 
      trade: (rawTrade && ['handyman', 'plumbing', 'electrical', 'lighting', 'home theater'].includes(rawTrade) ? rawTrade : 'handyman') as any, 
      scope: 'diagnostic' 
    }
  })
  const estateValues = watchEstate()

  // Load pricing configuration
  useEffect(() => {
    async function fetchPricing() {
      try {
        const { data } = await supabase
          .from('pricing_config')
          .select('key, value')
          .in('key', ['cleaning_pricing', 'remodeling_pricing', 'construction_pricing'])
        
        if (data && data.length > 0) {
          setPricingConfig({
            cleaning: data.find(d => d.key === 'cleaning_pricing')?.value || DEFAULT_CLEANING,
            remodeling: data.find(d => d.key === 'remodeling_pricing')?.value || DEFAULT_REMODEL,
            construction: data.find(d => d.key === 'construction_pricing')?.value || DEFAULT_CONST,
          })
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

  // Sync URL parameters
  useEffect(() => {
    if (rawService) {
      if (rawService === 'tv-mounting' || rawService === 'tv') setSelectedService('tv')
      else if (rawService === 'painting') setSelectedService('painting')
      else if (rawService === 'flooring') setSelectedService('flooring')
      else if (rawService === 'remodeling') setSelectedService('remodeling')
      else if (rawService === 'construction') setSelectedService('construction')
      else if (rawService === 'estate') setSelectedService('estate')
      else if (rawService === 'cleaning') setSelectedService('cleaning')
    }
  }, [rawService])

  // Reactive Cleaning Calculation
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

    if (data.floors === 2) total += 15
    else if (data.floors >= 3) total += 30

    if (data.condition === 'moderate') total = Math.round(total * 1.15)
    else if (data.condition === 'heavy') total = Math.round(total * 1.30)

    if (data.packageType === 'deep') total = Math.round(total * 1.35)
    else if (data.packageType === 'move_in_out') total = Math.round(total * 1.45)

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

  useEffect(() => {
    if (selectedService === 'cleaning') {
      setCleaningResult(computeCleaning(cleanValues, pricingConfig))
    }
  }, [cleanValues, pricingConfig, selectedService, computeCleaning])

  // Reactive TV Mounting Calculation
  useEffect(() => {
    if (selectedService === 'tv') {
      let total = 149
      const breakdown: string[] = []

      // Size
      if (tvValues.screenSize === 'medium') {
        total = 179
        breakdown.push('55" – 75" Display Base: $179')
      } else if (tvValues.screenSize === 'large') {
        total = 229
        breakdown.push('75"+ Cinema Display Base: $229')
      } else {
        total = 149
        breakdown.push('Under 55" Display Base: $149')
      }

      // Bracket
      if (tvValues.bracketType === 'motion') {
        total += 60
        breakdown.push('Full-Motion Swivel Bracket (+$60)')
      } else if (tvValues.bracketType === 'client_provided') {
        total -= 20
        breakdown.push('Client Provided Mount (-$20)')
      } else {
        breakdown.push('Tilt Mount Bracket Included')
      }

      // Wall
      if (tvValues.wallSurface === 'brick') {
        total += 75
        breakdown.push('Masonry / Fireplace Anchors (+$75)')
      }

      // Wire
      if (tvValues.wireConcealment === 'in_wall') {
        total += 95
        breakdown.push('In-Wall Power & Wire Kit (+$95)')
      }

      setTvResult({ total, breakdown })
    }
  }, [tvValues, selectedService])

  // Reactive Painting Calculation
  useEffect(() => {
    if (selectedService === 'painting') {
      const paintMap = {
        touchup: { min: 195, max: 350, label: 'Accent Wall & Touch-Up' },
        single_room: { min: 550, max: 950, label: 'Single Room (Walls & Trim)' },
        multi_room: { min: 1800, max: 4500, label: 'Multiple Rooms / Interior' },
        exterior: { min: 3500, max: 9500, label: 'Exterior Facade & Siding' },
      }
      const cfg = paintMap[paintValues.scope] || paintMap.single_room
      setRangeResult({ min: cfg.min, max: cfg.max, type: `Artisan Painting • ${cfg.label}` })
    }
  }, [paintValues, selectedService])

  // Reactive Flooring Calculation
  useEffect(() => {
    if (selectedService === 'flooring') {
      const floorMap = {
        repair: { min: 195, max: 350, label: 'Scratch Repair & Transition' },
        single_room: { min: 900, max: 2200, label: 'Single Room Installation' },
        multi_room: { min: 3500, max: 8500, label: 'Multi-Room Hardwood / Tile' },
        whole_estate: { min: 8000, max: 22000, label: 'Full Estate Installation' },
      }
      const cfg = floorMap[floorValues.scope] || floorMap.single_room
      setRangeResult({ min: cfg.min, max: cfg.max, type: `Custom Flooring • ${cfg.label}` })
    }
  }, [floorValues, selectedService])

  // Reactive Remodeling Calculation
  useEffect(() => {
    if (selectedService === 'remodeling') {
      const config = pricingConfig?.remodeling || DEFAULT_REMODEL
      const base = (config.scope[remodelValues.scope] || DEFAULT_REMODEL.scope[remodelValues.scope]) + 
                   (config.size[remodelValues.size] || DEFAULT_REMODEL.size[remodelValues.size])
      setRangeResult({ min: Math.round(base * 0.9), max: Math.round(base * 1.15), type: 'Bathroom Remodeling' })
    }
  }, [remodelValues, pricingConfig, selectedService])

  // Reactive Construction Calculation
  useEffect(() => {
    if (selectedService === 'construction') {
      const config = pricingConfig?.construction || DEFAULT_CONST
      const rate = config.grade[constValues.grade] || DEFAULT_CONST.grade[constValues.grade] || 250
      const base = constValues.squareFeet * rate
      setRangeResult({ min: Math.round(base * 0.9), max: Math.round(base * 1.2), type: 'New Construction' })
    }
  }, [constValues, pricingConfig, selectedService])

  // Reactive Estate & Trades Calculation
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

  // 1. Direct Checkout Flow (When user clicks Pay & Book)
  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('Please fill in your name, email, and phone number to proceed with booking.')
      return
    }

    setIsCheckingOut(true)

    let totalAmount = 0
    let serviceLabel = "L'Atelier Maison Home Service"
    let detailsPayload: any = {}

    if (selectedService === 'cleaning') {
      totalAmount = cleaningResult?.total || 0
      serviceLabel = `House Cleaning (${cleanValues.packageType === 'deep' ? 'Deep Clean' : cleanValues.packageType === 'move_in_out' ? 'Move-Out Turnover' : 'Standard Maintenance'})`
      detailsPayload = { ...cleanValues, ...customerInfo, estimatedPrice: totalAmount, isStripeCheckout: true }
    } else if (selectedService === 'tv') {
      totalAmount = tvResult?.total || 179
      serviceLabel = `Precision TV Mounting (${tvValues.screenSize === 'large' ? '75"+ Screen' : tvValues.screenSize === 'medium' ? '55"-75" Screen' : 'Under 55" Screen'})`
      detailsPayload = { ...tvValues, ...customerInfo, estimatedPrice: totalAmount, isStripeCheckout: true }
    } else {
      totalAmount = rangeResult?.min || 0
      serviceLabel = `${selectedService ? selectedService.toUpperCase() : 'Home Service'} Reservation`
      detailsPayload = { 
        ...(selectedService === 'painting' ? paintValues : selectedService === 'flooring' ? floorValues : selectedService === 'remodeling' ? remodelValues : selectedService === 'construction' ? constValues : estateValues),
        ...customerInfo, 
        estimatedPrice: totalAmount, 
        isStripeCheckout: true 
      }
    }

    if (totalAmount <= 0) {
      alert('A valid service price is required for checkout.')
      setIsCheckingOut(false)
      return
    }

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

    let serviceName = 'Estimate Consultation'
    let amount = 0
    let details: any = {}

    if (selectedService === 'cleaning') {
      serviceName = 'House Cleaning'
      amount = cleaningResult?.total || 0
      details = {
        ...cleanValues,
        estimatedPrice: amount,
        subtotal: cleaningResult?.subtotal,
        discount: cleaningResult?.discount,
        isEstimatedQuote: true,
      }
    } else if (selectedService === 'tv') {
      serviceName = 'TV Mounting'
      amount = tvResult?.total || 179
      details = {
        ...tvValues,
        estimatedPrice: amount,
        isEstimatedQuote: true,
      }
    } else {
      serviceName = selectedService === 'painting' ? 'Artisan Painting' : selectedService === 'flooring' ? 'Custom Flooring' : selectedService === 'remodeling' ? 'Bathroom Remodeling' : selectedService === 'construction' ? 'New Construction' : 'Home Services'
      amount = rangeResult?.min || 0
      details = {
        ...(selectedService === 'painting' ? paintValues : selectedService === 'flooring' ? floorValues : selectedService === 'remodeling' ? remodelValues : selectedService === 'construction' ? constValues : estateValues),
        estimatedPriceRange: rangeResult && rangeResult.min > 0 ? `$${rangeResult.min.toLocaleString()} – $${rangeResult.max.toLocaleString()}` : undefined,
        estimatedBaseline: amount,
      }
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

      {/* Modern App Segmented Ribbon with All Services */}
      <div className={styles.serviceSelection}>
        <button 
          className={`${styles.serviceBtn} ${selectedService === 'cleaning' ? styles.activeService : ''}`} 
          onClick={() => handleServiceSelect('cleaning')}
        >
          <Sparkles size={16} />
          <span>House Cleaning</span>
        </button>

        <button 
          className={`${styles.serviceBtn} ${selectedService === 'tv' ? styles.activeService : ''}`} 
          onClick={() => handleServiceSelect('tv')}
        >
          <Tv size={16} />
          <span>TV Mounting</span>
        </button>

        <button 
          className={`${styles.serviceBtn} ${selectedService === 'painting' ? styles.activeService : ''}`} 
          onClick={() => handleServiceSelect('painting')}
        >
          <Paintbrush size={16} />
          <span>Painting</span>
        </button>

        <button 
          className={`${styles.serviceBtn} ${selectedService === 'flooring' ? styles.activeService : ''}`} 
          onClick={() => handleServiceSelect('flooring')}
        >
          <Layers size={16} />
          <span>Flooring</span>
        </button>

        <button 
          className={`${styles.serviceBtn} ${selectedService === 'remodeling' ? styles.activeService : ''}`} 
          onClick={() => handleServiceSelect('remodeling')}
        >
          <Hammer size={16} />
          <span>Remodeling</span>
        </button>

        <button 
          className={`${styles.serviceBtn} ${selectedService === 'estate' ? styles.activeService : ''}`} 
          onClick={() => handleServiceSelect('estate')}
        >
          <Wrench size={16} />
          <span>Home Services</span>
        </button>

        <button 
          className={`${styles.serviceBtn} ${selectedService === 'construction' ? styles.activeService : ''}`} 
          onClick={() => handleServiceSelect('construction')}
        >
          <LayoutGrid size={16} />
          <span>New Construction</span>
        </button>
      </div>

      <div className={styles.container}>
        {/* Left Column: Interactive App Screen Inputs */}
        <div className={styles.formSection}>
          
          {/* --- 1. HOUSE CLEANING FLOW --- */}
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

          {/* --- 2. TV MOUNTING FLOW --- */}
          {selectedService === 'tv' && (
            <div className={`form-anim ${styles.form}`}>
              {/* Step 1: Screen Size */}
              <div className={styles.stepGroup}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepBadge}>01</span>
                  <h3 className={styles.stepTitle}>Display Screen Size</h3>
                </div>
                <div className={styles.radioGrid}>
                  {[
                    { val: 'small', title: 'Under 55" Screen', desc: 'Compact bedroom or office displays • Starting at $149' },
                    { val: 'medium', title: '55" – 75" Large Screen', desc: 'Standard living room & entertainment displays • Starting at $179' },
                    { val: 'large', title: '75" – 85"+ Cinema', desc: 'Heavy OLED, theater & oversized displays • Starting at $229' },
                  ].map((item) => (
                    <label key={item.val} className={tvValues.screenSize === item.val ? styles.activeCard : styles.radioCard}>
                      <input type="radio" value={item.val} {...controlTv.register('screenSize')} className={styles.hiddenRadio} />
                      <div className={styles.cardContent}>
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Step 2: Bracket Type */}
              <div className={styles.stepGroup}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepBadge}>02</span>
                  <h3 className={styles.stepTitle}>Mount Bracket Configuration</h3>
                </div>
                <div className={styles.radioGrid}>
                  {[
                    { val: 'tilt', title: 'Tilt Mount (Included)', desc: 'Up to 15° tilt down for glare reduction & eye-level alignment' },
                    { val: 'motion', title: 'Full-Motion Swivel Arm', desc: 'Dual-arm articulating mount (extending, swiveling, full range) (+$60)' },
                    { val: 'client_provided', title: 'I Have My Own Mount', desc: 'Our artisans will install your pre-purchased bracket (-$20)' },
                  ].map((item) => (
                    <label key={item.val} className={tvValues.bracketType === item.val ? styles.activeCard : styles.radioCard}>
                      <input type="radio" value={item.val} {...controlTv.register('bracketType')} className={styles.hiddenRadio} />
                      <div className={styles.cardContent}>
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Step 3: Wall Surface */}
              <div className={styles.stepGroup}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepBadge}>03</span>
                  <h3 className={styles.stepTitle}>Mounting Wall Surface</h3>
                </div>
                <div className={styles.radioGrid}>
                  {[
                    { val: 'drywall', title: 'Standard Drywall & Studs', desc: 'Standard residential drywall with wood or metal studs' },
                    { val: 'brick', title: 'Brick, Stone or Fireplace', desc: 'Masonry drilling, specialty anchors & thermal calibration (+$75)' },
                  ].map((item) => (
                    <label key={item.val} className={tvValues.wallSurface === item.val ? styles.activeCard : styles.radioCard}>
                      <input type="radio" value={item.val} {...controlTv.register('wallSurface')} className={styles.hiddenRadio} />
                      <div className={styles.cardContent}>
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Step 4: Wire Concealment */}
              <div className={styles.stepGroup}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepBadge}>04</span>
                  <h3 className={styles.stepTitle}>Cable & Wire Concealment</h3>
                </div>
                <div className={styles.radioGrid}>
                  {[
                    { val: 'none', title: 'Standard Wire Dress', desc: 'Clean external cable management bundled neatly' },
                    { val: 'in_wall', title: 'In-Wall Wire Concealment', desc: 'Invisible in-wall power bridge & HDMI cable routing (+$95)' },
                  ].map((item) => (
                    <label key={item.val} className={tvValues.wireConcealment === item.val ? styles.activeCard : styles.radioCard}>
                      <input type="radio" value={item.val} {...controlTv.register('wireConcealment')} className={styles.hiddenRadio} />
                      <div className={styles.cardContent}>
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --- 3. PAINTING FLOW --- */}
          {selectedService === 'painting' && (
            <div className={`form-anim ${styles.form}`}>
              <div className={styles.stepGroup}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepBadge}>01</span>
                  <h3 className={styles.stepTitle}>Painting Scope & Area</h3>
                </div>
                <div className={styles.radioGrid}>
                  {[
                    { val: 'touchup', title: 'Touch-Up / Accent Wall', desc: 'Spot repair, scuff restoration, single decorative wall ($195 – $350)' },
                    { val: 'single_room', title: 'Single Room (Walls & Trim)', desc: 'Full walls, baseboards, door casing & ceiling ($550 – $950)' },
                    { val: 'multi_room', title: 'Multiple Rooms / Full Interior', desc: 'Multi-room overhaul, color transitions & fine finishes ($1,800 – $4,500)' },
                    { val: 'exterior', title: 'Exterior Facade & Siding', desc: 'Power wash, scrape, primer & premium exterior coats ($3,500 – $9,500)' },
                  ].map((item) => (
                    <label key={item.val} className={paintValues.scope === item.val ? styles.activeCard : styles.radioCard}>
                      <input type="radio" value={item.val} {...controlPaint.register('scope')} className={styles.hiddenRadio} />
                      <div className={styles.cardContent}>
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --- 4. FLOORING FLOW --- */}
          {selectedService === 'flooring' && (
            <div className={`form-anim ${styles.form}`}>
              <div className={styles.stepGroup}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepBadge}>01</span>
                  <h3 className={styles.stepTitle}>Flooring Scope</h3>
                </div>
                <div className={styles.radioGrid}>
                  {[
                    { val: 'repair', title: 'Plank Repair & Transitions', desc: 'Fix damaged boards, subfloor squeaks, transition thresholds ($195 – $350)' },
                    { val: 'single_room', title: 'Single Room Installation', desc: 'Hardwood, luxury vinyl, or imported porcelain tile ($900 – $2,200)' },
                    { val: 'multi_room', title: 'Multi-Room Living Areas', desc: 'Seamless floor transitions across major living areas ($3,500 – $8,500)' },
                    { val: 'whole_estate', title: 'Full Estate Installation', desc: 'Complete residence hardwood sanding, staining, or new install ($8,000 – $22,000)' },
                  ].map((item) => (
                    <label key={item.val} className={floorValues.scope === item.val ? styles.activeCard : styles.radioCard}>
                      <input type="radio" value={item.val} {...controlFloor.register('scope')} className={styles.hiddenRadio} />
                      <div className={styles.cardContent}>
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --- 5. REMODELING FLOW --- */}
          {selectedService === 'remodeling' && (
            <div className={`form-anim ${styles.form}`}>
              <div className={styles.stepGroup}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepBadge}>01</span>
                  <h3 className={styles.stepTitle}>Scope of Work</h3>
                </div>
                <div className={styles.radioGrid}>
                  {[
                    { val: 'cosmetic', title: 'Cosmetic Refresh', desc: 'Fixtures, paint, vanity refresh, minor tile ($4,500 – $7,000)' },
                    { val: 'partial', title: 'Partial Remodel', desc: 'New custom vanity, shower/tub rebuild ($9,000 – $14,000)' },
                    { val: 'full', title: 'Full Gut & Custom', desc: 'Architectural re-layout, luxury stone & tile ($18,000 – $28,000)' }
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
            </div>
          )}

          {/* --- 6. HOME SERVICES & TRADES FLOW --- */}
          {selectedService === 'estate' && (
            <div className={`form-anim ${styles.form}`}>
              <div className={styles.stepGroup}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepBadge}>01</span>
                  <h3 className={styles.stepTitle}>Required Discipline & Trade</h3>
                </div>
                <div className={styles.radioGridRow}>
                  {['handyman', 'plumbing', 'electrical', 'lighting', 'home theater'].map((trade) => (
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
            </div>
          )}

          {/* --- 7. NEW CONSTRUCTION FLOW --- */}
          {selectedService === 'construction' && (
            <div className={`form-anim ${styles.form}`}>
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
                    { val: 'luxury', title: 'Luxury Build', desc: 'Premium custom finishes & architectural framing' },
                    { val: 'ultra', title: 'Ultra-Luxury Custom', desc: 'Fully custom architecture & imported materials' },
                    { val: 'monumental', title: 'Monumental Legacy', desc: 'No-compromise landmark estate building' }
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
            </div>
          )}

        </div>

        {/* Right Column: Sticky App Screen Summary & Pay & Book Drawer */}
        <div className={styles.resultSection}>
          
          {/* A. House Cleaning Summary */}
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

              {/* Client Reservation & Payment Form */}
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

                  {/* 1. Primary Action: Pay & Book */}
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
                        <span>Connecting to Checkout...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        <span>Pay & Book &bull; ${cleaningResult.total.toFixed(2)}</span>
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

          {/* B. TV Mounting Summary */}
          {selectedService === 'tv' && tvResult && (
            <div className={`result-anim ${styles.receiptBox}`}>
              <div className={styles.receiptHeader}>
                <div className={styles.liveBadge}>
                  <span className={styles.pulseDot} />
                  Live Calculation
                </div>
                <h3>Precision TV Mounting</h3>
                <p>
                  {tvValues.screenSize === 'large' ? '75"+ Cinema Screen' : tvValues.screenSize === 'medium' ? '55" – 75" Large Display' : 'Under 55" Display'}
                </p>
              </div>

              <div className={styles.receiptBody}>
                <div className={styles.receiptLine}>
                  <span className={styles.receiptLineTitle}>Display Mounting Installation</span>
                  <span className={styles.receiptLinePrice}>${tvResult.total.toFixed(2)}</span>
                </div>
                <div className={styles.receiptSubSpecs}>
                  {tvResult.breakdown.join(' • ')}
                </div>

                <div className={styles.receiptDivider} />
                
                <div className={styles.receiptTotal}>
                  <span>Estimated Total</span>
                  <span style={{ color: '#0B132B' }}>${tvResult.total.toFixed(2)}</span>
                </div>
              </div>

              <div className={styles.estimateNotice}>
                <strong>*Precision Level Guaranteed:</strong> Includes laser leveling, wall reinforcement checks, and full hardware assembly.
              </div>

              {!leadSubmitted ? (
                <div className={styles.checkoutForm}>
                  <div className={styles.checkoutFormTitle}>Reservation Details</div>
                  
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
                    placeholder="Mobile Phone Number" 
                    required 
                    className={styles.input} 
                    value={customerInfo.phone} 
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} 
                  />
                  <input 
                    type="text" 
                    placeholder="Service Street Address" 
                    className={styles.input} 
                    value={customerInfo.address} 
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} 
                  />

                  {/* Primary Pay & Book Button */}
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
                        <span>Connecting to Checkout...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        <span>Pay & Book &bull; ${tvResult.total.toFixed(2)}</span>
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
                  <p>Our mounting technician will contact you within 2 hours to confirm your specifications and schedule appointment.</p>
                </div>
              )}
            </div>
          )}

          {/* C. Construction / Remodeling / Painting / Flooring / Home Services Summary */}
          {(selectedService === 'remodeling' || selectedService === 'construction' || selectedService === 'estate' || selectedService === 'painting' || selectedService === 'flooring') && rangeResult && (
            <div className={`result-anim ${styles.receiptBox}`}>
              <div className={styles.receiptHeader}>
                <div className={styles.liveBadge}>
                  <span className={styles.pulseDot} />
                  Calculated Estimate
                </div>
                <h3>{selectedService === 'estate' ? 'Service Estimate Brief' : selectedService === 'painting' ? 'Painting Estimate Brief' : selectedService === 'flooring' ? 'Flooring Estimate Brief' : 'Architectural Brief'}</h3>
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
                {selectedService === 'estate' || selectedService === 'painting' || selectedService === 'flooring'
                  ? '*Exact quote is confirmed on-site based on materials, square footage, and scope before work commences.'
                  : '*An on-site architectural evaluation by a master builder is required for an exact proposal.'}
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

                  {/* If Estate Diagnostic service, offer immediate Pay & Book */}
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
                            <span>Connecting to Checkout...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard size={18} />
                            <span>Pay & Book &bull; ${rangeResult.min.toFixed(2)}</span>
                          </>
                        )}
                      </button>

                      <div className={styles.stripeSecurityNote}>
                        <Lock size={12} color="#10b981" />
                        <span>Secure checkout via Stripe &bull; Credit/Debit, Apple Pay</span>
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
