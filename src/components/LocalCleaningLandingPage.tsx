'use client'

import { useState, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Phone, Mail, MapPin, Clock, Sparkles, ShieldCheck, 
  CheckCircle2, Star, ArrowRight, ChevronDown, ChevronUp, 
  Calendar, Check, X, Award, ExternalLink
} from 'lucide-react'
import styles from './LocalCleaningLandingPage.module.css'
import CleaningChecklist from './CleaningChecklist'
import EstimateCalculator from './EstimateCalculator'

export interface LocalLandingConfig {
  regionId: 'atlanta' | 'dmv'
  cityName: string
  shortName: string
  stateLabel: string
  heroHeadline: string
  heroSubtitle: string
  address: {
    street: string
    cityStateZip: string
    full: string
  }
  phone: string
  phoneClean: string
  email: string
  hours: string
  heroImage: string
  googleReviewsUrl: string
  serviceAreas: {
    district: string
    neighborhoods: string[]
  }[]
  allNeighborhoods: string[]
  testimonials: {
    name: string
    neighborhood: string
    quote: string
    service: string
    date: string
  }[]
  faqs: {
    q: string
    a: string
  }[]
  geo: {
    latitude: number
    longitude: number
    addressLocality: string
    addressRegion: string
    postalCode: string
    streetAddress: string
  }
}

export default function LocalCleaningLandingPage({ config }: { config: LocalLandingConfig }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const googleReviewsUrl = config.googleReviewsUrl || 
    (process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL || 'https://www.google.com/search?q=L%27Atelier+Maison+Atlanta+reviews')

  // Generate Local Business & HouseCleaning Schema
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'HouseCleaning',
    name: `L'Atelier Maison - Luxury House Cleaning ${config.shortName}`,
    image: 'https://www.lateliermaison.com/luxury-hero.jpg',
    telephone: `+1${config.phoneClean}`,
    email: config.email,
    url: `https://www.lateliermaison.com/${config.regionId}/house-cleaning`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: config.geo.streetAddress,
      addressLocality: config.geo.addressLocality,
      addressRegion: config.geo.addressRegion,
      postalCode: config.geo.postalCode,
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: config.geo.latitude,
      longitude: config.geo.longitude
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '18:00'
      }
    ],
    priceRange: '$$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '48',
      bestRating: '5',
      worstRating: '1'
    },
    areaServed: config.allNeighborhoods.map(neighborhood => ({
      '@type': 'AdministrativeArea',
      name: `${neighborhood}, ${config.geo.addressRegion}`
    }))
  }

  const faqSchemaData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a
      }
    }))
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaData) }}
      />

      {/* 1. Top Local Announcement Ribbon */}
      <div className={styles.topRibbon}>
        <span>
          ✨ <strong>{config.shortName} Operating Division:</strong> Serving {config.stateLabel}
        </span>
        <span>•</span>
        <span>Same-Week Availability For New Clients</span>
        <span>•</span>
        <a href={`tel:${config.phoneClean}`} className={styles.topRibbonLink}>
          Call {config.phone}
        </a>
      </div>

      {/* 2. Conversion-Focused Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroGlow}></div>
        <div className={styles.heroBackground}>
          <Image
            src={config.heroImage}
            alt={`Luxury House Cleaning in ${config.cityName}`}
            fill
            priority
            style={{ objectFit: 'cover' }}
          />
        </div>

        <div className={styles.heroContainer}>
          <div className={styles.heroGrid}>
            
            {/* Left Column: Local Value Proposition */}
            <div className={styles.heroContent}>
              
              {/* Clickable Google Reviews Badge */}
              <a
                href={googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.googleBadge}
                title="View verified 5.0 Google Reviews (Opens in new tab)"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>5.0 Star Rating on Google</span>
                <span style={{ color: '#facc15' }}>★★★★★</span>
                <ExternalLink size={13} style={{ opacity: 0.8 }} />
              </a>

              {/* Main H1 Headline */}
              <h1 className={styles.heroHeadline}>
                {config.regionId === 'atlanta' ? (
                  <>Pristine Luxury <span className={styles.goldAccent}>House Cleaning</span> in Atlanta, GA.</>
                ) : (
                  <>White-Glove <span className={styles.goldAccent}>House Cleaning</span> in the DMV Area.</>
                )}
              </h1>

              {/* Subheadline */}
              <p className={styles.heroSubtitle}>
                {config.heroSubtitle}
              </p>

              {/* Primary Call-to-Actions */}
              <div className={styles.heroCtaGroup}>
                <a href="#estimate-calculator" className={styles.btnPrimary}>
                  <span>Get Instant Price & Book</span>
                  <ArrowRight size={18} />
                </a>

                <a href={`tel:${config.phoneClean}`} className={styles.btnPhone}>
                  <Phone size={18} color="#facc15" />
                  <span>Call {config.phone}</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className={styles.trustBadgesRow}>
                <div className={styles.trustBadgeItem}>
                  <ShieldCheck size={18} />
                  <span>$2M Fully Insured</span>
                </div>
                <div className={styles.trustBadgeItem}>
                  <Sparkles size={18} />
                  <span>Eco-Luxe Non-Toxic</span>
                </div>
                <div className={styles.trustBadgeItem}>
                  <Award size={18} />
                  <span>100% Satisfaction</span>
                </div>
                <div className={styles.trustBadgeItem}>
                  <CheckCircle2 size={18} />
                  <span>Vetted Cleaners</span>
                </div>
              </div>

            </div>

            {/* Right Column: Local Hub Summary Card */}
            <div className={styles.heroQuickCard}>
              <div className={styles.heroQuickCardHeader}>
                <span className={styles.cardHubBadge}>
                  {config.shortName} Division
                </span>
                <div style={{ display: 'flex', gap: '2px', color: '#d97706', fontSize: '0.9rem' }}>
                  ★★★★★
                </div>
              </div>

              <h3 className={styles.cardTitle}>
                Direct Local Service
              </h3>
              <p className={styles.cardSubtitle}>
                Dedicated concierge & cleaning crews stationed in {config.shortName} for prompt, reliable arrivals.
              </p>

              <div className={styles.cardFeatureList}>
                <div className={styles.cardFeatureItem}>
                  <Check size={18} />
                  <span><strong>Same Cleaning Crew:</strong> Familiar faces who learn your home's unique preferences.</span>
                </div>
                <div className={styles.cardFeatureItem}>
                  <Check size={18} />
                  <span><strong>All Supplies Included:</strong> Hospital-grade HEPA filters & organic plant-based formulas.</span>
                </div>
                <div className={styles.cardFeatureItem}>
                  <Check size={18} />
                  <span><strong>Zero Long-Term Contracts:</strong> Transparent flat-rate pricing with seamless rescheduling.</span>
                </div>
              </div>

              <div className={styles.cardContactBox}>
                <div><strong>Local Hub:</strong> {config.address.street}, {config.address.cityStateZip}</div>
                <div><strong>Direct Dispatch:</strong> <a href={`tel:${config.phoneClean}`}>{config.phone}</a></div>
                <div><strong>Regional Email:</strong> <a href={`mailto:${config.email}`}>{config.email}</a></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Physical Operating Hub Bar */}
      <section className={styles.localHubBar}>
        <div className={styles.hubContainer}>
          <div className={styles.hubItem}>
            <div className={styles.hubIcon}><MapPin size={22} /></div>
            <div>
              <div className={styles.hubLabel}>{config.shortName} Office</div>
              <div className={styles.hubValue}>{config.address.full}</div>
            </div>
          </div>

          <div className={styles.hubItem}>
            <div className={styles.hubIcon}><Phone size={22} /></div>
            <div>
              <div className={styles.hubLabel}>Local Inquiries & Bookings</div>
              <div className={styles.hubValue}><a href={`tel:${config.phoneClean}`}>{config.phone}</a></div>
            </div>
          </div>

          <div className={styles.hubItem}>
            <div className={styles.hubIcon}><Mail size={22} /></div>
            <div>
              <div className={styles.hubLabel}>Regional Email</div>
              <div className={styles.hubValue}><a href={`mailto:${config.email}`}>{config.email}</a></div>
            </div>
          </div>

          <div className={styles.hubItem}>
            <div className={styles.hubIcon}><Clock size={22} /></div>
            <div>
              <div className={styles.hubLabel}>Operating Hours</div>
              <div className={styles.hubValue}>{config.hours}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Cleaning Packages Overview */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Tailored Cleaning Solutions</span>
          <h2 className={styles.sectionTitle}>
            Designed for <span className={styles.goldAccent}>{config.shortName}</span> Residences
          </h2>
          <p className={styles.sectionSubtitle}>
            Whether you reside in a modern downtown high-rise, historic brownstone, or expansive suburban estate, we offer precision cleaning programs tailored to your lifestyle.
          </p>
        </div>

        <div className={styles.packagesGrid}>
          {/* Package 1: Recurring */}
          <div className={`${styles.packageCard} ${styles.popularCard}`}>
            <span className={styles.popularBadge}>Most Requested</span>
            <div>
              <h3 className={styles.packageName}>Recurring Maintenance</h3>
              <p className={styles.packageDesc}>
                Weekly, bi-weekly, or monthly visits to keep your residence permanently immaculate without lifting a finger.
              </p>
              <ul className={styles.packageFeatures}>
                <li className={styles.packageFeatureItem}><Check size={18} /><span>Dedicated recurring cleaners assigned to your home</span></li>
                <li className={styles.packageFeatureItem}><Check size={18} /><span>High-touch sanitization, dusting, vacuuming & hard floor mopping</span></li>
                <li className={styles.packageFeatureItem}><Check size={18} /><span>Complete bathroom & kitchen sanitization</span></li>
                <li className={styles.packageFeatureItem}><Check size={18} /><span>Discounted recurring rate lock guarantee</span></li>
              </ul>
            </div>
            <a href="#estimate-calculator" className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center' }}>
              Calculate Recurring Price
            </a>
          </div>

          {/* Package 2: Deep Clean */}
          <div className={styles.packageCard}>
            <div>
              <h3 className={styles.packageName}>Deep Sanctuary Reset</h3>
              <p className={styles.packageDesc}>
                An exhaustive, top-to-bottom overhaul tackling neglected crevices, baseboards, and intensive build-up.
              </p>
              <ul className={styles.packageFeatures}>
                <li className={styles.packageFeatureItem}><Check size={18} /><span>Hand-scrubbed baseboards, door frames, and window sills</span></li>
                <li className={styles.packageFeatureItem}><Check size={18} /><span>Deep grout scrubbing and limescale removal</span></li>
                <li className={styles.packageFeatureItem}><Check size={18} /><span>Under and behind easily movable furniture</span></li>
                <li className={styles.packageFeatureItem}><Check size={18} /><span>Ideal seasonal refresh (Spring / Fall / Holiday)</span></li>
              </ul>
            </div>
            <a href="#estimate-calculator" className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center', backgroundColor: '#0B132B' }}>
              Quote Deep Clean
            </a>
          </div>

          {/* Package 3: Move In / Move Out */}
          <div className={styles.packageCard}>
            <div>
              <h3 className={styles.packageName}>Move In / Move Out</h3>
              <p className={styles.packageDesc}>
                Flawless transition cleaning ensuring 100% deposit return or an ultra-hygienic welcoming start in your new home.
              </p>
              <ul className={styles.packageFeatures}>
                <li className={styles.packageFeatureItem}><Check size={18} /><span>Full interior & exterior cabinet/drawer sanitization</span></li>
                <li className={styles.packageFeatureItem}><Check size={18} /><span>Inside refrigerator and oven scrub included upon request</span></li>
                <li className={styles.packageFeatureItem}><Check size={18} /><span>Closets, pantries, fixtures, and interior glass reset</span></li>
                <li className={styles.packageFeatureItem}><Check size={18} /><span>Guaranteed handover ready for closing inspection</span></li>
              </ul>
            </div>
            <a href="#estimate-calculator" className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center', backgroundColor: '#0B132B' }}>
              Quote Move In/Out
            </a>
          </div>
        </div>
      </section>

      {/* 5. Interactive Room Checklist */}
      <section className={styles.sectionAlt} style={{ padding: '2rem 1.5rem 4rem 1.5rem' }}>
        <CleaningChecklist />
      </section>

      {/* 6. Why L'Atelier Maison (Comparison Matrix) */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>The Clear Difference</span>
          <h2 className={styles.sectionTitle}>
            Why Discerning Homeowners Choose <span className={styles.goldAccent}>L'Atelier Maison</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            See how our luxury standard compares to conventional maid services and on-demand gig apps in {config.shortName}.
          </p>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.comparisonTable}>
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Standard Comparison</th>
                <th className={styles.highlightCol} style={{ width: '30%' }}>L'Atelier Maison</th>
                <th style={{ width: '30%' }}>Conventional Cleaners</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Dedicated Recurring Crew</strong></td>
                <td className={styles.highlightCol}><Check size={18} style={{ color: '#16a34a', display: 'inline', marginRight: 6 }} /> Consistent familiar faces</td>
                <td><X size={18} style={{ color: '#dc2626', display: 'inline', marginRight: 6 }} /> Random strangers each visit</td>
              </tr>
              <tr>
                <td><strong>Eco-Luxe Non-Toxic Solutions</strong></td>
                <td className={styles.highlightCol}><Check size={18} style={{ color: '#16a34a', display: 'inline', marginRight: 6 }} /> 100% pet & child safe</td>
                <td><X size={18} style={{ color: '#dc2626', display: 'inline', marginRight: 6 }} /> Harsh industrial bleach / ammonia</td>
              </tr>
              <tr>
                <td><strong>Insurance & Bonding</strong></td>
                <td className={styles.highlightCol}><Check size={18} style={{ color: '#16a34a', display: 'inline', marginRight: 6 }} /> $2,000,000 commercial liability</td>
                <td><span style={{ color: '#d97706' }}>⚠ Often minimal or uninsured</span></td>
              </tr>
              <tr>
                <td><strong>Hospital-Grade HEPA Vacuums</strong></td>
                <td className={styles.highlightCol}><Check size={18} style={{ color: '#16a34a', display: 'inline', marginRight: 6 }} /> Traps 99.97% allergens & dust</td>
                <td><X size={18} style={{ color: '#dc2626', display: 'inline', marginRight: 6 }} /> Standard vacuums re-exhausting dust</td>
              </tr>
              <tr>
                <td><strong>Instant Transparent Online Pricing</strong></td>
                <td className={styles.highlightCol}><Check size={18} style={{ color: '#16a34a', display: 'inline', marginRight: 6 }} /> Instant 60-second price estimate</td>
                <td><X size={18} style={{ color: '#dc2626', display: 'inline', marginRight: 6 }} /> Requires days of in-home walkthroughs</td>
              </tr>
              <tr>
                <td><strong>100% Satisfaction Guarantee</strong></td>
                <td className={styles.highlightCol}><Check size={18} style={{ color: '#16a34a', display: 'inline', marginRight: 6 }} /> Free reclean within 24 hours</td>
                <td><X size={18} style={{ color: '#dc2626', display: 'inline', marginRight: 6 }} /> No guarantee or refunds</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. Local Service Areas & Neighborhoods */}
      <section className={styles.sectionAlt}>
        <div className={styles.coverageContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Local Coverage</span>
            <h2 className={styles.sectionTitle}>
              Serving Greater <span className={styles.goldAccent}>{config.shortName}</span> & Beyond
            </h2>
            <p className={styles.sectionSubtitle}>
              Our mobile artisan teams are dispatched directly across the following prime communities in {config.stateLabel}:
            </p>
          </div>

          <div className={styles.neighborhoodPills}>
            {config.allNeighborhoods.map((neighborhood, index) => (
              <span key={index} className={styles.neighborhoodPill}>
                📍 {neighborhood}
              </span>
            ))}
          </div>

          <div className={styles.districtGrid}>
            {config.serviceAreas.map((area, idx) => (
              <div key={idx} className={styles.districtCard}>
                <h4>{area.district}</h4>
                <p>
                  Specialized crews providing routine maintenance and estate care across {area.neighborhoods.slice(0, 4).join(', ')} and surrounding communities.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Local Google Reviews */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <a
            href={googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.googleBadgeLight}
            style={{ margin: '0 auto 1.5rem auto' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Verified 5.0 Rating on Google</span>
            <span style={{ color: '#facc15' }}>★★★★★</span>
          </a>

          <h2 className={styles.sectionTitle}>
            What <span className={styles.goldAccent}>{config.shortName}</span> Homeowners Say
          </h2>
          <p className={styles.sectionSubtitle}>
            Read genuine feedback from verified local clients in {config.shortName}.
          </p>
        </div>

        <div className={styles.reviewsGrid}>
          {config.testimonials.map((t, idx) => (
            <div key={idx} className={styles.reviewCard}>
              <div>
                <div className={styles.reviewStars}>★★★★★</div>
                <p className={styles.reviewText}>"{t.quote}"</p>
              </div>

              <div className={styles.reviewAuthor}>
                <div>
                  <h4 className={styles.authorName}>{t.name}</h4>
                  <div className={styles.authorMeta}>{t.neighborhood} • {t.service}</div>
                </div>
                <a 
                  href={googleReviewsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.verifiedGoogle}
                >
                  ✓ Verified Google Review ↗
                </a>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <a
            href={googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnPhone}
            style={{ color: '#1e3a8a', borderColor: '#c5a059' }}
          >
            <span>Read All Google Business Reviews</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* 9. Live Instant Estimate & Booking Calculator */}
      <section id="estimate-calculator" className={styles.sectionAlt} style={{ scrollMarginTop: '80px' }}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Transparent Flat-Rate Pricing</span>
          <h2 className={styles.sectionTitle}>
            Calculate Your <span className={styles.goldAccent}>{config.shortName}</span> Estimate
          </h2>
          <p className={styles.sectionSubtitle}>
            Configure your home details below for an instant quote in 60 seconds. No waiting, no surprise fees.
          </p>
        </div>

        <div style={{ maxWidth: '1000px', margin: '0 auto', background: '#ffffff', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
          <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading calculator...</div>}>
            <EstimateCalculator defaultService="cleaning" />
          </Suspense>
        </div>
      </section>

      {/* 10. Local FAQs Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Common Questions</span>
          <h2 className={styles.sectionTitle}>
            Frequently Asked in <span className={styles.goldAccent}>{config.shortName}</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Have questions about our supplies, scheduling, or security? We have answers.
          </p>
        </div>

        <div className={styles.faqContainer}>
          {config.faqs.map((faq, index) => {
            const isOpen = openFaq === index
            return (
              <div key={index} className={styles.faqItem}>
                <button
                  type="button"
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={20} color="#d97706" /> : <ChevronDown size={20} color="#64748b" />}
                </button>
                {isOpen && (
                  <div className={styles.faqAnswer}>
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 11. Final CTA Banner */}
      <section style={{ backgroundColor: '#0B132B', color: '#ffffff', padding: '5rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#facc15', fontWeight: 700, display: 'block', marginBottom: '1rem' }}>
            Transform Your Sanctuary Today
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', margin: '0 0 1.25rem 0', fontWeight: 400 }}>
            Experience the #1 Luxury House Cleaning in <span style={{ color: '#c5a059', fontStyle: 'italic' }}>{config.shortName}</span>
          </h2>
          <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Book online in under 60 seconds or speak directly with our local concierge team.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#estimate-calculator" className={styles.btnPrimary} style={{ padding: '1.1rem 2.5rem', fontSize: '1rem' }}>
              Book Your Cleaning Now
            </a>
            <a href={`tel:${config.phoneClean}`} className={styles.btnPhone} style={{ padding: '1.1rem 2rem' }}>
              <Phone size={18} color="#facc15" />
              <span>Call Local Team: {config.phone}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 12. Sticky Mobile Bottom Call / Book Bar */}
      <div className={styles.mobileStickyBar}>
        <a href={`tel:${config.phoneClean}`} className={styles.mobileCallBtn}>
          <Phone size={16} color="#0B132B" />
          <span>Call Now</span>
        </a>
        <a href="#estimate-calculator" className={styles.mobileBookBtn}>
          <span>Instant Quote</span>
          <ArrowRight size={15} />
        </a>
      </div>

    </div>
  )
}
