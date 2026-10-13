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
    badge: 'North American HQ',
    slug: 'atlanta',
    coordsText: '33.7490° N, 84.3880° W',
    x: 232,
    y: 260,
    labelOffset: { x: -75, y: 14 },
    desc: 'Our flagship North American headquarters, delivering ground-up luxury architectural builds, historic remodels, and total estate care.',
    specialties: ['Ground-Up Construction', 'Luxury Remodeling', 'Estate Management'],
    img: '/luxury-hero.jpg'
  },
  {
    id: 'washington-dc',
    city: 'Washington, DC',
    region: 'District of Columbia, USA',
    badge: 'Capital Division',
    slug: 'washington-dc',
    coordsText: '38.9072° N, 77.0369° W',
    x: 278,
    y: 226,
    labelOffset: { x: -115, y: -8 },
    desc: 'Bespoke rowhome restorations, luxury brownstone remodeling, and premier residential concierge services in the Nation’s Capital.',
    specialties: ['Historic Restoration', 'Modern Interiors', 'Private Concierge'],
    img: '/luxury-bathroom.jpg'
  },
  {
    id: 'maryland',
    city: 'Maryland',
    region: 'DMV Corridor, USA',
    badge: 'Statewide Care',
    slug: 'maryland',
    coordsText: '39.0458° N, 76.6413° W',
    x: 292,
    y: 216,
    labelOffset: { x: 14, y: -26 },
    desc: 'Statewide estate management and waterfront property renovations serving Bethesda, Potomac, Annapolis, and the Eastern Shore.',
    specialties: ['Waterfront Properties', 'Artisan Finishing', 'Preventative Care'],
    img: '/portfolio-images/IMG_8187.JPG'
  },
  {
    id: 'northern-virginia',
    city: 'Northern Virginia',
    region: 'DMV Corridor, USA',
    badge: 'Virginia Division',
    slug: 'northern-virginia',
    coordsText: '38.8048° N, 77.0469° W',
    x: 272,
    y: 236,
    labelOffset: { x: 14, y: 16 },
    desc: 'High-end residential transformations and luxury home services serving Arlington, Alexandria, McLean, Great Falls, and Fairfax County.',
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
            <span>SERVICE HUBS:</span>
            <span className={styles.tickerHighlight}>05 ACTIVE DIVISIONS</span>
          </div>
          <div className={styles.tickerItem}>
            <span>FOCUSED REGION:</span>
            <span className={styles.tickerHighlight}>
              {selectedLoc ? selectedLoc.city.toUpperCase() : 'ATLANTIC CORRIDOR'}
            </span>
          </div>
          <div className={styles.tickerItem}>
            <span>GPS COORDS:</span>
            <span style={{ color: '#cbd5e1' }}>
              {selectedLoc ? selectedLoc.coordsText : '40.7128° N, 74.0060° W'}
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
                <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
              </radialGradient>

              <linearGradient id="goldBeam" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="rgba(197, 160, 89, 0.2)" />
                <stop offset="50%" stopColor="rgba(212, 175, 55, 0.8)" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>

              <linearGradient id="geodesicArc" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(212, 175, 55, 0.85)" />
                <stop offset="50%" stopColor="rgba(96, 165, 250, 0.7)" />
                <stop offset="100%" stopColor="rgba(212, 175, 55, 0.85)" />
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

            {/* Equator & Meridian Labels */}
            <text x="50" y="296" fill="rgba(197, 160, 89, 0.4)" fontSize="9" fontFamily="monospace" letterSpacing="1">0° EQUATOR</text>
            <text x="506" y="555" fill="rgba(197, 160, 89, 0.4)" fontSize="9" fontFamily="monospace" letterSpacing="1">0° MERIDIAN</text>
            <text x="186" y="555" fill="rgba(148, 163, 184, 0.25)" fontSize="8" fontFamily="monospace">75° W</text>
            <text x="666" y="555" fill="rgba(148, 163, 184, 0.25)" fontSize="8" fontFamily="monospace">30° E</text>

            {/* ================= CONTINENTS VECTOR OUTLINES ================= */}
            <g id="continents">
              {/* North America */}
              <path
                d="M 65 110 
                   C 95 85, 160 70, 220 75
                   C 260 80, 290 65, 330 85
                   C 365 105, 395 125, 360 160
                   C 345 175, 350 190, 320 205
                   C 305 212, 295 218, 285 235
                   C 275 250, 260 270, 250 290
                   C 240 310, 220 325, 205 320
                   C 190 315, 175 300, 165 285
                   C 145 280, 130 260, 120 240
                   C 105 220, 85 200, 75 175
                   C 60 150, 55 125, 65 110 Z"
                fill="url(#landGradient)"
                stroke="rgba(197, 160, 89, 0.35)"
                strokeWidth="1.2"
              />
              <path
                d="M 245 270 C 255 285, 252 305, 246 318 C 240 312, 238 290, 240 275 Z"
                fill="#1e3a8a"
                fillOpacity="0.6"
                stroke="rgba(197, 160, 89, 0.4)"
                strokeWidth="1"
              />

              {/* South America */}
              <path
                d="M 240 340
                   C 270 330, 310 345, 335 365
                   C 365 390, 385 425, 360 460
                   C 340 490, 315 520, 290 545
                   C 280 550, 275 530, 270 500
                   C 260 460, 250 430, 235 395
                   C 225 375, 230 350, 240 340 Z"
                fill="url(#landGradient)"
                stroke="rgba(197, 160, 89, 0.25)"
                strokeWidth="1"
              />

              {/* British Isles */}
              <path
                d="M 505 140 
                   C 515 130, 530 135, 535 150 
                   C 540 165, 525 175, 515 170 
                   C 505 165, 500 150, 505 140 Z"
                fill="#2563eb"
                fillOpacity="0.45"
                stroke="#c5a059"
                strokeWidth="1.4"
              />
              <path
                d="M 490 148 C 496 142, 502 148, 500 158 C 495 162, 488 156, 490 148 Z"
                fill="#1e3a8a"
                fillOpacity="0.5"
                stroke="rgba(197, 160, 89, 0.4)"
                strokeWidth="1"
              />

              {/* Mainland Europe */}
              <path
                d="M 545 135
                   C 580 120, 620 125, 660 140
                   C 680 155, 675 175, 650 190
                   C 630 200, 610 215, 580 210
                   C 560 205, 545 185, 535 165
                   C 530 150, 535 140, 545 135 Z"
                fill="url(#landGradient)"
                stroke="rgba(197, 160, 89, 0.35)"
                strokeWidth="1.2"
              />
              <path
                d="M 515 190 C 535 185, 545 200, 540 220 C 525 225, 510 215, 515 190 Z"
                fill="#1e3a8a"
                fillOpacity="0.5"
                stroke="rgba(197, 160, 89, 0.3)"
                strokeWidth="1"
              />

              {/* Africa */}
              <path
                d="M 535 235
                   C 570 225, 630 230, 665 260
                   C 685 285, 690 320, 670 355
                   C 655 385, 645 425, 630 465
                   C 615 500, 595 530, 575 510
                   C 555 480, 545 435, 540 395
                   C 535 365, 515 345, 505 320
                   C 490 295, 495 265, 520 245
                   C 525 240, 530 238, 535 235 Z"
                fill="url(#landGradient)"
                stroke="rgba(197, 160, 89, 0.35)"
                strokeWidth="1.2"
              />
              <path
                d="M 675 425 C 685 415, 695 435, 690 460 C 680 470, 670 450, 675 425 Z"
                fill="#1e3a8a"
                fillOpacity="0.4"
                stroke="rgba(197, 160, 89, 0.3)"
                strokeWidth="0.8"
              />
            </g>

            {/* ================= GEODESIC CONNECTION ARCS ================= */}
            <g id="flightArcs">
              {/* Atlanta to Washington DC */}
              <path
                id="arc-atl-dc"
                d="M 232 260 Q 250 232, 278 226"
                fill="none"
                stroke="url(#geodesicArc)"
                strokeWidth="2.5"
                strokeDasharray="6 6"
              >
                <animate 
                  attributeName="stroke-dashoffset" 
                  from="100" 
                  to="0" 
                  dur="3.5s" 
                  repeatCount="indefinite" 
                />
              </path>

              {/* Atlanta to Northern Virginia */}
              <path
                d="M 232 260 Q 248 245, 272 236"
                fill="none"
                stroke="rgba(197, 160, 89, 0.45)"
                strokeWidth="1.8"
                strokeDasharray="4 4"
              />

              {/* Northern Virginia to Washington DC */}
              <path
                d="M 272 236 Q 275 231, 278 226"
                fill="none"
                stroke="url(#geodesicArc)"
                strokeWidth="2"
                strokeDasharray="3 3"
              />

              {/* Washington DC to Maryland */}
              <path
                id="arc-dc-md"
                d="M 278 226 Q 285 220, 292 216"
                fill="none"
                stroke="url(#geodesicArc)"
                strokeWidth="2.2"
                strokeDasharray="4 4"
              >
                <animate 
                  attributeName="stroke-dashoffset" 
                  from="100" 
                  to="0" 
                  dur="3s" 
                  repeatCount="indefinite" 
                />
              </path>

              {/* Pulsing light beacons moving along the corridor */}
              <circle r="3.5" fill="#ffffff" filter="url(#goldGlow)">
                <animateMotion dur="3.5s" repeatCount="indefinite" path="M 232 260 Q 250 232, 278 226" />
              </circle>
              <circle r="3" fill="#facc15" filter="url(#goldGlow)">
                <animateMotion dur="2.5s" repeatCount="indefinite" path="M 278 226 Q 285 220, 292 216" />
              </circle>
            </g>

            {/* ================= SERVICE LOCATIONS PINS ================= */}
            <g id="servicePins">
              {SERVICE_LOCATIONS.map((loc) => {
                const isSelected = selectedLoc?.id === loc.id
                return (
                  <g 
                    key={loc.id} 
                    transform={`translate(${loc.x}, ${loc.y})`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSelectCity(loc)}
                    onMouseEnter={() => handlePinMouseEnter(loc)}
                    onMouseLeave={handlePinMouseLeave}
                  >
                    {/* INVISIBLE LARGE HIT AREA for instant and forgiving hover */}
                    <circle
                      cx="0"
                      cy="-10"
                      r="36"
                      fill="transparent"
                      pointerEvents="all"
                    />

                    {/* Sonar Radar Wave 1 */}
                    <circle
                      cx="0"
                      cy="0"
                      r="12"
                      fill="none"
                      stroke={isSelected ? '#facc15' : '#c5a059'}
                      strokeWidth="1"
                      opacity="0.8"
                    >
                      <animate
                        attributeName="r"
                        values="4; 28; 38"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.9; 0.3; 0"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </circle>

                    {/* Sonar Radar Wave 2 (Offset) */}
                    <circle
                      cx="0"
                      cy="0"
                      r="18"
                      fill="none"
                      stroke={isSelected ? '#60a5fa' : '#c5a059'}
                      strokeWidth="1"
                      opacity="0.6"
                    >
                      <animate
                        attributeName="r"
                        values="4; 24; 34"
                        dur="3s"
                        begin="1.5s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.8; 0.2; 0"
                        dur="3s"
                        begin="1.5s"
                        repeatCount="indefinite"
                      />
                    </circle>

                    {/* Ground Target Anchor */}
                    <circle
                      cx="0"
                      cy="0"
                      r="5.5"
                      fill="#070d1a"
                      stroke={isSelected ? '#facc15' : '#c5a059'}
                      strokeWidth="2"
                    />

                    {/* Upright 3D Pin Beacon Light Needle */}
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="-26"
                      stroke="url(#goldBeam)"
                      strokeWidth={isSelected ? '2.5' : '1.8'}
                    />

                    {/* Beacon Top Glowing Core */}
                    <circle
                      cx="0"
                      cy="-26"
                      r={isSelected ? '6.5' : '4.5'}
                      fill={isSelected ? '#fef08a' : '#c5a059'}
                      filter="url(#goldGlow)"
                    >
                      <animate
                        attributeName="transform"
                        type="scale"
                        values="1; 1.25; 1"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>

                    {/* Floating City Label Tag */}
                    <g transform={`translate(${loc.labelOffset.x}, ${loc.labelOffset.y})`}>
                      <rect
                        x="0"
                        y="-12"
                        width={loc.city.length * 7.5 + 18}
                        height="20"
                        rx="4"
                        fill="rgba(7, 13, 26, 0.88)"
                        stroke={isSelected ? 'rgba(212, 175, 55, 0.85)' : 'rgba(255, 255, 255, 0.16)'}
                        strokeWidth="1"
                      />
                      <text
                        x="8"
                        y="2"
                        fill={isSelected ? '#facc15' : '#ffffff'}
                        fontSize="10"
                        fontWeight="600"
                        fontFamily="sans-serif"
                        letterSpacing="0.5"
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
            const isWest = selectedLoc.x < 420
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

                {/* Direct CTA Link */}
                <Link 
                  href={`/locations/${selectedLoc.slug}`}
                  className={styles.cardLinkBtn}
                >
                  <span>View {selectedLoc.city} Services</span>
                  <span>→</span>
                </Link>
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
            Operating Service Locations
          </div>
          <h1 className={styles.heroHeadline}>
            <em>Our</em><br />
            <span>Locations.</span>
          </h1>
          <p className={styles.subheadline}>
            Interactive architectural cartography serving Atlanta and the DMV Corridor (Washington DC, Maryland, and Northern Virginia) with uncompromising artisan standards.
          </p>
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
              <span>⟡ 3D View</span>
            </button>
            <button
              onClick={() => {
                setIs3DMode(false)
                setTilt({ rotateX: 0, rotateY: 0, z: 0 })
              }}
              className={`${styles.viewModeBtn} ${!is3DMode ? styles.viewModeActive : ''}`}
              title="Flat architectural cartography blueprint"
            >
              <span>▦ Flat Plan</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
