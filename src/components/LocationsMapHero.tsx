'use client'

import { useState, useRef, useEffect, MouseEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './LocationsMapHero.module.css'

export interface ServiceLocation {
  id: string
  city: string
  region: string
  badge: string
  slug: string
  cleaningUrl: string
  email: string
  hubAddress: string
  coordsText: string
  x: number // SVG Coordinate X
  y: number // SVG Coordinate Y
  labelOffset: { x: number; y: number }
  desc: string
  specialties: string[]
  img: string
}

export const SERVICE_LOCATIONS: ServiceLocation[] = [
  {
    id: 'atlanta',
    city: 'Atlanta',
    region: 'Georgia, USA',
    badge: 'Flagship Headquarters',
    slug: 'atlanta',
    cleaningUrl: '/atlanta/house-cleaning',
    email: 'atlanta@lateliermaison.com',
    hubAddress: 'Cumberland Blvd SE, Vinings / Atlanta, GA 30339',
    coordsText: '33.7490° N, 84.3880° W',
    x: 320,
    y: 390,
    labelOffset: { x: -85, y: 16 },
    desc: 'Our flagship Atlanta headquarters serving Buckhead, Vinings, Midtown, Sandy Springs, Alpharetta, and greater Atlanta with luxury house cleaning, remodeling, and estate care.',
    specialties: ['Luxury House Cleaning', 'Bespoke Remodeling', 'Estate Concierge'],
    img: '/luxury-hero.jpg'
  },
  {
    id: 'washington-dc',
    city: 'Washington, DC',
    region: 'District of Columbia, USA',
    badge: 'Capital Division',
    slug: 'washington-dc',
    cleaningUrl: '/dmv/house-cleaning',
    email: 'dmv@lateliermaison.com',
    hubAddress: '4600 Powder Mill Rd, Beltsville, MD 20705',
    coordsText: '38.9072° N, 77.0369° W',
    x: 690,
    y: 200,
    labelOffset: { x: -115, y: -10 },
    desc: 'Bespoke rowhome restorations, luxury brownstone remodeling, and premier residential concierge services across Georgetown, Capitol Hill, and Northwest DC.',
    specialties: ['Historic Restoration', 'Modern Interiors', 'Private Concierge'],
    img: '/luxury-bathroom.jpg'
  },
  {
    id: 'maryland',
    city: 'Maryland',
    region: 'DMV Corridor, USA',
    badge: 'Maryland Division',
    slug: 'maryland',
    cleaningUrl: '/dmv/house-cleaning',
    email: 'dmv@lateliermaison.com',
    hubAddress: '4600 Powder Mill Rd, Beltsville, MD 20705',
    coordsText: '39.0458° N, 76.6413° W',
    x: 740,
    y: 165,
    labelOffset: { x: 14, y: -22 },
    desc: 'Regional dispatch hub and estate management serving Bethesda, Potomac, Chevy Chase, Silver Spring, Beltsville, and Annapolis waterfront estates.',
    specialties: ['Waterfront Estates', 'Artisan Finishing', 'Concierge Cleaning'],
    img: '/portfolio-images/IMG_8187.JPG'
  },
  {
    id: 'northern-virginia',
    city: 'Northern Virginia',
    region: 'DMV Corridor, USA',
    badge: 'Virginia Division',
    slug: 'northern-virginia',
    cleaningUrl: '/dmv/house-cleaning',
    email: 'dmv@lateliermaison.com',
    hubAddress: '4600 Powder Mill Rd, Beltsville, MD 20705',
    coordsText: '38.8048° N, 77.0469° W',
    x: 640,
    y: 235,
    labelOffset: { x: 14, y: 16 },
    desc: 'High-end residential transformations and luxury home cleaning serving Arlington, Alexandria, McLean, Great Falls, Vienna, and Tysons.',
    specialties: ['Estate Renovation', 'Artisan Finishing', 'Concierge Cleaning'],
    img: '/portfolio-images/IMG_8184.JPG'
  }
]

export default function LocationsMapHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isCardHoveredRef = useRef(false)

  const [activeLocation, setActiveLocation] = useState<ServiceLocation | null>(null)
  const [hoveredLocation, setHoveredLocation] = useState<ServiceLocation | null>(null)
  const [is3DMode, setIs3DMode] = useState<boolean>(true)
  
  // 3D Parallax Tilt state
  const [tilt, setTilt] = useState({ rotateX: 18, rotateY: -4, z: 0 })
  const [scrollProgress, setScrollProgress] = useState(0)

  // Target location for card
  const selectedLoc = activeLocation || hoveredLocation || null

  // Mouse Parallax movement
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!is3DMode || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    // Base pitch is 18deg X, -4deg Y
    const targetRotateX = 18 - y * 16
    const targetRotateY = -4 + x * 20
    setTilt({
      rotateX: targetRotateX,
      rotateY: targetRotateY,
      z: 0
    })
  }

  const handleMouseLeave = () => {
    if (!is3DMode) return
    setTilt({ rotateX: 18, rotateY: -4, z: 0 })
  }

  // Smooth Hover Handlers with Graceful Timeout
  const handlePinMouseEnter = (loc: ServiceLocation) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    setHoveredLocation(loc)
  }

  const handlePinMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isCardHoveredRef.current) {
        setHoveredLocation(null)
      }
    }, 280)
  }

  const handleCardMouseEnter = () => {
    isCardHoveredRef.current = true
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
  }

  const handleCardMouseLeave = () => {
    isCardHoveredRef.current = false
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredLocation(null)
    }, 200)
  }

  // Scroll Parallax reaction
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      const factor = Math.min(scrollY / 600, 1)
      setScrollProgress(factor)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Quick focus on a city (clicking locks active state)
  const handleSelectCity = (loc: ServiceLocation) => {
    if (activeLocation?.id === loc.id) {
      setActiveLocation(null)
    } else {
      setActiveLocation(loc)
      if (is3DMode) {
        const relX = (loc.x - 500) / 500
        const relY = (loc.y - 290) / 290
        setTilt({
          rotateX: 18 - relY * 8,
          rotateY: -4 + relX * 10,
          z: 25
        })
      }
    }
  }

  const calculatedTransform = is3DMode
    ? `rotateX(${tilt.rotateX + scrollProgress * 8}deg) rotateY(${tilt.rotateY}deg) scale(${1 - scrollProgress * 0.06}) translateZ(${tilt.z}px)`
    : `rotateX(0deg) rotateY(0deg) scale(1) translateZ(0px)`

  return (
    <section 
      ref={containerRef}
      className={styles.heroContainer}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic Background Atmosphere */}
      <div className={styles.ambientGlowPrimary} />
      <div className={styles.ambientGlowSecondary} />
      <div className={styles.cyberGrid} />

      {/* Top Bar: Live HUD Coordinates Ticker on Top-Right */}
      <div className={styles.topBar}>
        <div className={styles.tickerBox}>
          <div className={styles.tickerItem}>
            <span>OPERATING DIVISIONS:</span>
            <span className={styles.tickerHighlight}>02 ACTIVE HUBS (ATLANTA & DMV)</span>
          </div>
          <div className={styles.tickerItem}>
            <span>FOCUSED REGION:</span>
            <span className={styles.tickerHighlight}>
              {selectedLoc ? selectedLoc.city.toUpperCase() : 'ATLANTA & DMV CORRIDOR'}
            </span>
          </div>
          <div className={styles.tickerItem}>
            <span>DISPATCH STATUS:</span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>
              ● LIVE CONCIERGE (MON–SAT 8AM–6PM)
            </span>
          </div>
        </div>
      </div>

      {/* 3D Map Viewport - Positioned on Center-Right */}
      <div className={styles.mapViewport}>
        <div 
          className={styles.map3dStage}
          style={{ transform: calculatedTransform }}
        >
          {/* Main SVG Map Canvas */}
          <svg 
            viewBox="0 0 1000 580" 
            className={styles.svgMap}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Gradients */}
              <radialGradient id="landGradient" cx="50%" cy="50%" r="65%">
                <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#0B132B" stopOpacity="0.85" />
              </radialGradient>

              <linearGradient id="goldBeam" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="rgba(197, 160, 89, 0.2)" />
                <stop offset="50%" stopColor="rgba(212, 175, 55, 0.8)" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>

              <linearGradient id="geodesicArc" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(212, 175, 55, 0.9)" />
                <stop offset="50%" stopColor="rgba(96, 165, 250, 0.75)" />
                <stop offset="100%" stopColor="rgba(212, 175, 55, 0.9)" />
              </linearGradient>

              {/* Dot pattern */}
              <pattern id="matrixDots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="rgba(148, 163, 184, 0.12)" />
              </pattern>

              {/* Glowing Filters */}
              <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ocean Dot Matrix Grid */}
            <rect x="0" y="0" width="1000" height="580" fill="url(#matrixDots)" />

            {/* Subtle Graticule Lines (Latitude & Longitude) */}
            <g stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.75" strokeDasharray="3 5">
              <line x1="40" y1="120" x2="960" y2="120" />
              <line x1="40" y1="210" x2="960" y2="210" />
              <line x1="40" y1="300" x2="960" y2="300" stroke="rgba(197, 160, 89, 0.15)" strokeDasharray="none" />
              <line x1="40" y1="390" x2="960" y2="390" />
              <line x1="40" y1="480" x2="960" y2="480" />

              <line x1="180" y1="40" x2="180" y2="540" />
              <line x1="340" y1="40" x2="340" y2="540" />
              <line x1="500" y1="40" x2="500" y2="540" stroke="rgba(197, 160, 89, 0.15)" strokeDasharray="none" />
              <line x1="660" y1="40" x2="660" y2="540" />
              <line x1="820" y1="40" x2="820" y2="540" />
            </g>

            {/* Regional Corridor Coordinates */}
            <text x="50" y="555" fill="rgba(197, 160, 89, 0.7)" fontSize="9" fontFamily="monospace" letterSpacing="1.5">✦ ATLANTA (GA) &bull; WASHINGTON DC &bull; MARYLAND &bull; NORTHERN VIRGINIA</text>
            <text x="760" y="555" fill="rgba(148, 163, 184, 0.4)" fontSize="8" fontFamily="monospace">EAST COAST CORRIDOR &bull; 02 ACTIVE HUBS</text>

            {/* ================= VECTOR LANDMASS OUTLINES ================= */}
            {/* Elegant US East Coast Corridor spanning Georgia up to Mid-Atlantic */}
            <g id="landmass">
              <path
                d="M 160 480 
                   C 200 470, 240 450, 270 420
                   C 290 400, 310 390, 340 370
                   C 390 340, 440 320, 490 280
                   C 540 250, 590 230, 630 210
                   C 660 190, 710 160, 760 140
                   C 810 120, 860 110, 890 90
                   C 870 140, 840 180, 800 220
                   C 760 250, 720 280, 680 320
                   C 630 360, 580 400, 520 430
                   C 460 460, 400 485, 340 500
                   C 270 515, 200 500, 160 480 Z"
                fill="url(#landGradient)"
                stroke="rgba(197, 160, 89, 0.35)"
                strokeWidth="1.2"
              />

              {/* Inset state boundary accents */}
              <path
                d="M 320 390 Q 480 300, 680 200"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
                strokeDasharray="2 4"
              />
            </g>

            {/* ================= GEODESIC CONNECTION ARCS ================= */}
            <g id="flightArcs">
              {/* Grand Geodesic Arc: Atlanta Hub (320, 390) <-> Washington DC / DMV (690, 200) */}
              <path
                id="arc-atl-dmv"
                d="M 320 390 Q 480 240, 690 200"
                fill="none"
                stroke="url(#geodesicArc)"
                strokeWidth="2.5"
                strokeDasharray="6 6"
              >
                <animate 
                  attributeName="stroke-dashoffset" 
                  from="120" 
                  to="0" 
                  dur="4s" 
                  repeatCount="indefinite" 
                />
              </path>

              {/* Sub-arc: Washington DC <-> Maryland (740, 165) */}
              <path
                d="M 690 200 Q 715 180, 740 165"
                fill="none"
                stroke="rgba(197, 160, 89, 0.5)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              {/* Sub-arc: Washington DC <-> Northern Virginia (640, 235) */}
              <path
                d="M 690 200 Q 665 218, 640 235"
                fill="none"
                stroke="rgba(197, 160, 89, 0.5)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              {/* Flying Energy Particle */}
              <circle r="3.5" fill="#facc15" filter="url(#goldGlow)">
                <animateMotion 
                  path="M 320 390 Q 480 240, 690 200" 
                  dur="3s" 
                  repeatCount="indefinite" 
                />
              </circle>
            </g>

            {/* ================= PINS & RADAR PULSE BEACONS ================= */}
            <g id="servicePins">
              {SERVICE_LOCATIONS.map((loc) => {
                const isSelected = selectedLoc?.id === loc.id
                const isAtlanta = loc.id === 'atlanta'

                return (
                  <g 
                    key={loc.id}
                    className={styles.pinGroup}
                    onClick={() => handleSelectCity(loc)}
                    onMouseEnter={() => handlePinMouseEnter(loc)}
                    onMouseLeave={handlePinMouseLeave}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Animated Radar Pulse Rings */}
                    <circle
                      cx={loc.x}
                      cy={loc.y}
                      r="12"
                      fill="none"
                      stroke={isSelected ? '#facc15' : isAtlanta ? '#c5a059' : '#38bdf8'}
                      strokeWidth="1.2"
                      opacity="0.8"
                    >
                      <animate
                        attributeName="r"
                        from="6"
                        to={isAtlanta ? "34" : "26"}
                        dur={isAtlanta ? "2.4s" : "2.8s"}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        from="0.85"
                        to="0"
                        dur={isAtlanta ? "2.4s" : "2.8s"}
                        repeatCount="indefinite"
                      />
                    </circle>

                    {/* Outer Gold Ring */}
                    <circle
                      cx={loc.x}
                      cy={loc.y}
                      r={isAtlanta ? "8" : "6.5"}
                      fill="rgba(7, 15, 30, 0.9)"
                      stroke={isSelected ? '#ffffff' : '#c5a059'}
                      strokeWidth={isSelected ? '2' : '1.5'}
                    />

                    {/* Glowing Core Dot */}
                    <circle
                      cx={loc.x}
                      cy={loc.y}
                      r={isAtlanta ? "4.5" : "3.5"}
                      fill={isSelected ? '#facc15' : isAtlanta ? '#f59e0b' : '#38bdf8'}
                      filter="url(#goldGlow)"
                    />

                    {/* City Label Badge */}
                    <g transform={`translate(${loc.x + loc.labelOffset.x}, ${loc.y + loc.labelOffset.y})`}>
                      <rect
                        x="-4"
                        y="-10"
                        width={loc.city.length * 7.5 + 24}
                        height="20"
                        rx="10"
                        fill="rgba(11, 19, 43, 0.92)"
                        stroke={isSelected ? 'rgba(212, 175, 55, 0.9)' : 'rgba(255, 255, 255, 0.18)'}
                        strokeWidth="1"
                      />
                      <text
                        x="8"
                        y="4"
                        fill={isSelected ? '#facc15' : '#ffffff'}
                        fontSize="10.5"
                        fontWeight="600"
                        fontFamily="sans-serif"
                        letterSpacing="0.4"
                      >
                        {loc.city}
                      </text>
                    </g>
                  </g>
                )
              })}
            </g>
          </svg>

          {/* Floating Detail Tooltip Card with Pointer Indicator */}
          {selectedLoc && (() => {
            const pinXPercent = (selectedLoc.x / 1000) * 100
            const pinYPercent = (selectedLoc.y / 580) * 100
            const isWest = selectedLoc.x < 500
            const cardLeft = isWest 
              ? `calc(${pinXPercent}% + 28px)` 
              : `calc(${pinXPercent}% - 340px)`
            const cardTop = `calc(${Math.min(Math.max(pinYPercent - 20, 6), 55)}%)`

            return (
              <div 
                className={styles.tooltipCard}
                style={{
                  left: cardLeft,
                  top: cardTop
                }}
                onMouseEnter={handleCardMouseEnter}
                onMouseLeave={handleCardMouseLeave}
              >
                {/* Pointer Arrow pointing to beacon */}
                {isWest ? (
                  <div className={styles.cardPointerLeft} />
                ) : (
                  <div className={styles.cardPointerRight} />
                )}

                <button 
                  className={styles.cardCloseBtn}
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveLocation(null)
                    setHoveredLocation(null)
                  }}
                  aria-label="Close details"
                >
                  ✕
                </button>

                <div className={styles.cardHeader}>
                  <span className={styles.cardBadge}>{selectedLoc.badge}</span>
                  <span className={styles.cardCoords}>{selectedLoc.coordsText}</span>
                </div>

                <h3 className={styles.cardTitle}>{selectedLoc.city}</h3>
                <div className={styles.cardSubtitle}>{selectedLoc.region}</div>

                {/* Thumbnail */}
                <div className={styles.cardThumb}>
                  <Image 
                    src={selectedLoc.img} 
                    alt={selectedLoc.city}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="320px"
                  />
                </div>

                <p className={styles.cardDesc}>{selectedLoc.desc}</p>

                {/* Direct Action Links */}
                <div className={styles.cardActionGroup}>
                  <Link 
                    href={selectedLoc.cleaningUrl}
                    className={styles.cardLinkBtn}
                  >
                    <span>{selectedLoc.city.includes('Atlanta') ? 'Atlanta House Cleaning' : 'DMV House Cleaning'}</span>
                    <span>→</span>
                  </Link>

                  <Link 
                    href={`/locations/${selectedLoc.slug}`}
                    className={styles.cardSecondaryBtn}
                  >
                    <span>Explore Regional Overview</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            )
          })()}
        </div>
      </div>

      {/* Bottom Section: Title placed in lower-left, Controls Bar below */}
      <div className={styles.bottomSection}>
        <div className={styles.titleBox}>
          <div className={styles.eyebrow}>
            <span className={styles.liveDot} />
            Active Operating Regions &bull; Atlanta & DMV
          </div>
          <h1 className={styles.heroHeadline}>
            <em>Two Hubs.</em><br />
            <span>One Standard.</span>
          </h1>
          <p className={styles.subheadline}>
            L&apos;Atelier Maison provides bespoke luxury house cleaning, fine remodeling, and estate management exclusively across Atlanta, GA and the DMV Corridor (Washington DC, Maryland, and Northern Virginia).
          </p>

          {/* Quick Action Buttons directly in Hero */}
          <div className={styles.heroActionGroup}>
            <Link href="/atlanta/house-cleaning" className={styles.heroActionBtn}>
              <span>📍 Atlanta Division</span>
              <span>→</span>
            </Link>
            <Link href="/dmv/house-cleaning" className={styles.heroActionBtn}>
              <span>📍 DMV Division</span>
              <span>→</span>
            </Link>
            <Link href="/estimate" className={styles.heroActionEstimateBtn}>
              <span>Instant Estimate</span>
            </Link>
          </div>
        </div>

        {/* Controls Bar: City Selector Pills & 3D View Toggle */}
        <div className={styles.controlsBar}>
          <div className={styles.cityTabs}>
            {SERVICE_LOCATIONS.map((loc) => {
              const isActive = selectedLoc?.id === loc.id
              return (
                <button
                  key={loc.id}
                  onClick={() => handleSelectCity(loc)}
                  onMouseEnter={() => handlePinMouseEnter(loc)}
                  onMouseLeave={handlePinMouseLeave}
                  className={`${styles.cityTabBtn} ${isActive ? styles.cityTabActive : ''}`}
                >
                  <span>{loc.city}</span>
                </button>
              )
            })}
          </div>

          <div className={styles.viewModeGroup}>
            <button
              onClick={() => setIs3DMode(true)}
              className={`${styles.viewModeBtn} ${is3DMode ? styles.viewModeActive : ''}`}
              title="Interactive 3D isometric view with mouse tilt"
            >
              <span>⟡ 3D Interactive</span>
            </button>
            <button
              onClick={() => {
                setIs3DMode(false)
                setTilt({ rotateX: 0, rotateY: 0, z: 0 })
              }}
              className={`${styles.viewModeBtn} ${!is3DMode ? styles.viewModeActive : ''}`}
              title="Flat architectural cartography blueprint"
            >
              <span>▦ Flat Cartography</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
