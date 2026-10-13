'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

type PackageId = 'standard' | 'deep' | 'move_in_out'

interface RoomCategory {
  category: string
  icon: string
  image: string
  tasks: string[]
}

interface PackageData {
  id: PackageId
  name: string
  badge: string
  subtitle: string
  description: string
  importantNotice: string
  rooms: RoomCategory[]
}

const PACKAGES: Record<PackageId, PackageData> = {
  standard: {
    id: 'standard',
    name: 'Standard Cleaning',
    badge: 'Routine Maintenance',
    subtitle: 'Regular upkeep to preserve a pristine, healthy home environment.',
    description: 'Our recurring maintenance clean covers all high-touch surfaces, bathrooms, kitchens, and floors. Perfect for weekly, bi-weekly, or monthly home care.',
    importantNotice: 'Baseboards receive light surface dusting. Intensive hand-scrubbing of baseboards and appliance interiors are part of Deep Cleaning / Add-ons.',
    rooms: [
      {
        category: 'Living Rooms & Common Areas',
        icon: '🛋️',
        image: '/remodeling-basement-full.jpg',
        tasks: [
          'Dust accessible surfaces, tabletops, and open shelves',
          'Clean and polish mirrors and glass decor',
          'Wipe light switches and frequently touched door handles',
          'Light surface dusting of baseboards and reachable sills',
          'Vacuum rugs, carpets, and main seating cushions',
          'Sweep and damp-mop all hard surface floors',
          'Tidy common areas and straighten throw pillows'
        ]
      },
      {
        category: 'Kitchen',
        icon: '🍳',
        image: '/remodeling-kitchen-full.jpg',
        tasks: [
          'Wipe down and sanitize countertops and backsplashes',
          'Wipe exterior faces of appliances (fridge, oven, microwave, dishwasher)',
          'Clean interior and exterior of microwave',
          'Scrub, sanitize, and polish the sink and faucet',
          'Wipe and degrease stovetop surfaces',
          'Spot-clean exterior cabinet doors and handles',
          'Sweep and microfiber mop hard floors, empty trash'
        ]
      },
      {
        category: 'Bathrooms',
        icon: '🛁',
        image: '/remodeling-bathroom-full.jpg',
        tasks: [
          'Clean and disinfect toilet bowl, exterior, seat, and base',
          'Scrub and sanitize showers, tubs, and tile surrounds',
          'Clean and polish vanity countertop, sink, and chrome fixtures',
          'Clean mirrors to a streak-free shine',
          'Sweep and disinfect tile flooring and mats',
          'Neatly fold clean towels and empty wastebaskets'
        ]
      },
      {
        category: 'Bedrooms',
        icon: '🛏️',
        image: '/latelier-images/home/IMG_8191.JPG',
        tasks: [
          'Straighten bed linens and arrange pillows (linens changed if fresh set provided)',
          'Dust dressers, nightstands, and decorative lamps',
          'Wipe reachable window sills and picture frames',
          'Vacuum carpets and mop under exposed bed perimeters',
          'Empty bedroom trash bins and replace liners'
        ]
      },
      {
        category: 'Add-On Services',
        icon: '💎',
        image: '/latelier-images/home/IMG_8185.JPG',
        tasks: [
          'Interior Oven Detailing (Available as Quote Add-On)',
          'Interior Refrigerator Sanitizing (Available as Quote Add-On)',
          'Interior Kitchen Cabinet Detailing (Available as Quote Add-On)',
          'Interior Window Glass Washing (Available as Quote Add-On)',
          'Dishwashing & Laundry Loads (Available as Quote Add-On)'
        ]
      }
    ]
  },
  deep: {
    id: 'deep',
    name: 'Deep Cleaning',
    badge: 'Intensive Reset',
    subtitle: 'Top-to-bottom restorative clean targeting built-up grime and detailed trim.',
    description: 'Our most comprehensive home reset. We tackle neglected corners, hand-wash all baseboards and woodwork, deep-scrub bathroom grout, and eliminate stubborn buildup.',
    importantNotice: 'Hand-scrubbing of all baseboards and trim is included. Interior appliance detailing (inside oven, inside fridge) is available as tailored add-ons in the calculator.',
    rooms: [
      {
        category: 'Living Rooms & Common Areas',
        icon: '🛋️',
        image: '/remodeling-basement-full.jpg',
        tasks: [
          'Detailed hand-scrubbing of all baseboards and door casings',
          'Wipe down doors, doorframes, and light switch plates',
          'Detailed dusting of window sills, blinds, and window tracks',
          'Vacuum upholstery crevices and move light furniture to vacuum beneath',
          'Dust ceiling fans, accessible vents, and light fixtures',
          'Deep vacuum carpet edges and damp-mop floors with specialized cleaners',
          'Spot-clean reachable walls and polish all wooden surfaces'
        ]
      },
      {
        category: 'Kitchen',
        icon: '🍳',
        image: '/remodeling-kitchen-full.jpg',
        tasks: [
          'Intensive degrease and scrub of cooktop and hood exterior',
          'Hand-wash exterior cabinet faces, drawer fronts, and hardware',
          'Deep scrub tile grout lines, backsplashes, and corners',
          'Scrub and sanitize sink basin, faucet, and disposal rim',
          'Polish exterior stainless steel appliances to mirror finish',
          'Hand-wipe kitchen baseboards, moldings, and trim',
          'Note: Inside oven and inside fridge detailing can be added in the quote form'
        ]
      },
      {
        category: 'Bathrooms',
        icon: '🛁',
        image: '/remodeling-bathroom-full.jpg',
        tasks: [
          'Deep scrub shower wall tiles, grout lines, and glass doors',
          'Limescale, hard-water, and soap scum treatment on fixtures',
          'Sanitize soaking tubs, jets, and surround surfaces',
          'Complete disinfection of toilet (bowl, exterior, pedestal, and behind)',
          'Hand-wash bathroom baseboards, doors, and trim',
          'Clean and polish vanity drawers and exterior cabinetry',
          'Deep clean corners, floor edges, and exhaust fan covers'
        ]
      },
      {
        category: 'Bedrooms',
        icon: '🛏️',
        image: '/latelier-images/home/IMG_8191.JPG',
        tasks: [
          'Hand-wipe all baseboards, door frames, and window sills',
          'Detailed dusting of all furniture tops, fronts, and legs',
          'Dust ceiling fan blades, light fixtures, and wall art',
          'Vacuum carpet perimeter edges and beneath movable furniture',
          'Polish mirrors and wipe down closet door exteriors'
        ]
      },
      {
        category: 'Add-On Services',
        icon: '💎',
        image: '/latelier-images/home/IMG_8185.JPG',
        tasks: [
          'Inside Oven Degreasing & Rack Scrubbing (+$45 in Calculator)',
          'Inside Refrigerator Sanitizing & Shelves (+$45 in Calculator)',
          'Inside Kitchen Cabinets & Drawers (+$60 in Calculator)',
          'Interior Window Glass & Track Cleaning (+$50 in Calculator)',
          'Finished Basement & Extra Living Suites (Custom Add-On)'
        ]
      }
    ]
  },
  move_in_out: {
    id: 'move_in_out',
    name: 'Move-In / Move-Out',
    badge: 'Turnkey Detailing',
    subtitle: 'Vacant property turnaround for smooth moving transitions and deposits.',
    description: 'Designed for vacant homes transitioning between residents. We ensure every drawer, closet, appliance exterior, and square inch is pristine and ready for occupancy.',
    importantNotice: 'Includes wiping inside empty closets, drawers, and cabinets. Pair with interior oven & fridge add-ons for complete 100% turnkey handover.',
    rooms: [
      {
        category: 'Living Rooms & Common Areas',
        icon: '🛋️',
        image: '/remodeling-basement-full.jpg',
        tasks: [
          'Hand-scrub all baseboards, trim, and doorframes across vacant rooms',
          'Wipe inside empty coat closets, shelves, and hanging rods',
          'Clean interior window sills, tracks, and frames',
          'Dust accessible ceiling fixtures, fans, and vents',
          'Spot-clean marks on doors and walls where possible',
          'Edge-to-edge vacuuming and deep mopping of all open floor plans'
        ]
      },
      {
        category: 'Kitchen',
        icon: '🍳',
        image: '/remodeling-kitchen-full.jpg',
        tasks: [
          'Wipe down inside and outside of all empty kitchen cabinets and drawers',
          'Sanitize countertops, backsplashes, and food prep surfaces',
          'Scrub stovetop, burner grates, and range hood exterior',
          'Scrub and sanitize sink, faucet, and plumbing fixtures',
          'Wipe all exterior appliance faces and kickplates',
          'Sweep and mop kitchen floor to baseboard edges'
        ]
      },
      {
        category: 'Bathrooms',
        icon: '🛁',
        image: '/remodeling-bathroom-full.jpg',
        tasks: [
          'Deep scrub and sanitize shower stalls, glass, and bathtub basins',
          'Full sanitization of toilet bowl, pedestal, and surrounding walls',
          'Wipe inside and outside empty medicine cabinets and vanities',
          'Polish faucets, chrome fixtures, and mirrors',
          'Hand-wash baseboards and scrub tile grout',
          'Disinfect bathroom floors completely'
        ]
      },
      {
        category: 'Bedrooms',
        icon: '🛏️',
        image: '/latelier-images/home/IMG_8191.JPG',
        tasks: [
          'Wipe inside empty bedroom closets, shelving, and built-ins',
          'Hand-scrub baseboards, door frames, and window sills',
          'Clean switch plates and vacuum all corners and closet floors',
          'Deep vacuum carpets and microfiber damp-mop hard surface floors'
        ]
      },
      {
        category: 'Add-On Services',
        icon: '💎',
        image: '/latelier-images/home/IMG_8185.JPG',
        tasks: [
          'Inside Oven Degreasing (Recommended for Move-Out)',
          'Inside Refrigerator Detailing (Recommended for Move-Out)',
          'Interior Window Glass Polish (Recommended for Move-Out)',
          'Garage Sweeping & Debris Clearing (Available upon request)'
        ]
      }
    ]
  }
}

export default function CleaningChecklist() {
  const [activePackage, setActivePackage] = useState<PackageId>('deep')
  const [activeRoomIndex, setActiveRoomIndex] = useState(0)

  const currentPkg = PACKAGES[activePackage]
  // Fallback if room index out of bounds
  const currentRoom = currentPkg.rooms[activeRoomIndex] || currentPkg.rooms[0]

  const handlePackageChange = (pkgId: PackageId) => {
    setActivePackage(pkgId)
    // Keep same room category if valid, otherwise reset to 0
    if (activeRoomIndex >= PACKAGES[pkgId].rooms.length) {
      setActiveRoomIndex(0)
    }
  }

  return (
    <section style={{ padding: '6rem 5%', backgroundColor: '#f8fafc', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div className="reveal-up" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '0.8rem', 
            letterSpacing: '0.15em', 
            textTransform: 'uppercase', 
            color: '#d97706', 
            fontWeight: 700,
            marginBottom: '1rem',
            background: 'rgba(217, 119, 6, 0.08)',
            padding: '6px 16px',
            borderRadius: '100px',
            border: '1px solid rgba(217, 119, 6, 0.2)'
          }}>
            L'Atelier Standards & Scope
          </div>
          <h2 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 400, color: '#1e3a8a', margin: '0 0 1rem 0' }}>
            Interactive Cleaning <span style={{ fontStyle: 'italic', color: '#d97706' }}>Checklist</span>
          </h2>
          <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1.05rem', color: '#4b5563', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
            Toggle between our service packages below to see the exact room-by-room tasks and specifications included in each clean.
          </p>
        </div>

        {/* 1. TOP-LEVEL PACKAGE SELECTOR TABS */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '0.75rem', 
          flexWrap: 'wrap', 
          marginBottom: '2rem' 
        }}>
          {(['standard', 'deep', 'move_in_out'] as PackageId[]).map((pkgKey) => {
            const pkg = PACKAGES[pkgKey]
            const isSelected = activePackage === pkgKey
            return (
              <button
                key={pkgKey}
                onClick={() => handlePackageChange(pkgKey)}
                id={`btn-checklist-${pkgKey}`}
                style={{
                  background: isSelected ? '#1e3a8a' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#1e3a8a',
                  border: isSelected ? '1px solid #1e3a8a' : '1px solid rgba(30, 58, 138, 0.15)',
                  padding: '0.85rem 1.75rem',
                  borderRadius: '100px',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 10px 25px -5px rgba(30, 58, 138, 0.3)' : '0 2px 6px rgba(0,0,0,0.03)',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>{pkgKey === 'standard' ? '🌿' : pkgKey === 'deep' ? '✨' : '📦'}</span>
                <span>{pkg.name}</span>
                {isSelected && (
                  <span style={{ 
                    fontSize: '0.7rem', 
                    background: '#d97706', 
                    color: '#fff', 
                    padding: '2px 8px', 
                    borderRadius: '20px', 
                    marginLeft: '4px' 
                  }}>
                    Active
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* 2. DYNAMIC PACKAGE OVERVIEW BANNER */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
          borderRadius: '20px',
          padding: '1.75rem 2rem',
          border: '1px solid rgba(30, 58, 138, 0.1)',
          marginBottom: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
            <div>
              <span style={{ 
                fontSize: '0.75rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.12em', 
                color: '#d97706', 
                fontWeight: 700 
              }}>
                {currentPkg.badge}
              </span>
              <h3 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: '1.75rem', color: '#1e3a8a', margin: '4px 0 0 0' }}>
                {currentPkg.name} Specification
              </h3>
            </div>
            <Link 
              href={`/estimate?service=cleaning`} 
              className="btn btn-primary"
              style={{ padding: '8px 20px', fontSize: '0.85rem' }}
            >
              Get Estimated Quote →
            </Link>
          </div>
          <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '0.98rem', color: '#4b5563', margin: '0 0 0.75rem 0', lineHeight: 1.6 }}>
            {currentPkg.description}
          </p>
          <div style={{
            fontSize: '0.88rem',
            color: '#1e3a8a',
            background: 'rgba(30, 58, 138, 0.05)',
            padding: '8px 14px',
            borderRadius: '8px',
            borderLeft: '3px solid #d97706',
            fontWeight: 500
          }}>
            ℹ️ {currentPkg.importantNotice}
          </div>
        </div>

        {/* 3. MAIN CHECKLIST CONTAINER */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.85)', 
          backdropFilter: 'blur(20px)', 
          borderRadius: '24px', 
          padding: '2rem', 
          border: '1px solid rgba(255,255,255,0.9)', 
          boxShadow: '0 20px 40px rgba(0,0,0,0.03)' 
        }}>
          
          {/* Room Category Tabs */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.75rem', 
            borderBottom: '1px solid rgba(30, 58, 138, 0.1)', 
            paddingBottom: '1.25rem', 
            justifyContent: 'center' 
          }}>
            {currentPkg.rooms.map((room, index) => {
              const isActive = activeRoomIndex === index
              return (
                <button
                  key={index}
                  onClick={() => setActiveRoomIndex(index)}
                  style={{
                    background: isActive ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.08), rgba(217, 119, 6, 0.05))' : 'transparent',
                    color: isActive ? '#1e3a8a' : '#6b7280',
                    border: 'none',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '50px',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    borderBottom: isActive ? '2px solid #1e3a8a' : '2px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>{room.icon}</span> 
                  <span>{room.category}</span>
                </button>
              )
            })}
          </div>

          {/* Room Content Display */}
          <div style={{ minHeight: '340px', padding: '2rem 0.5rem' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activePackage}-${activeRoomIndex}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}
              >
                {/* Left: Room Preview Image */}
                <div style={{ 
                  position: 'relative', 
                  width: '100%', 
                  aspectRatio: '4 / 3', 
                  borderRadius: '16px', 
                  overflow: 'hidden', 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  backgroundColor: '#0f172a'
                }}>
                  <Image
                    src={currentRoom.image}
                    alt={currentRoom.category}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'cover' }}
                  />
                  <div style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, transparent 55%)' 
                  }} />
                  <div style={{ position: 'absolute', bottom: '16px', left: '16px', color: '#ffffff' }}>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fbbf24', fontWeight: 600 }}>
                      {currentPkg.name}
                    </div>
                    <div style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: '1.4rem' }}>
                      {currentRoom.category}
                    </div>
                  </div>
                </div>

                {/* Right: Tasks List */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.85rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '0.5rem',
                    borderBottom: '1px solid #e2e8f0',
                    paddingBottom: '0.5rem'
                  }}>
                    <span style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '1rem' }}>
                      {currentRoom.category} Tasks
                    </span>
                    <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      {currentRoom.tasks.length} Checkpoints
                    </span>
                  </div>

                  {currentRoom.tasks.map((task, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: '0.85rem', 
                        background: '#ffffff', 
                        padding: '1rem 1.25rem', 
                        borderRadius: '12px', 
                        boxShadow: '0 2px 10px rgba(0,0,0,0.02)', 
                        border: '1px solid rgba(0,0,0,0.06)' 
                      }}
                    >
                      <div style={{ 
                        width: '22px', 
                        height: '22px', 
                        borderRadius: '50%', 
                        background: '#fef3c7', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        flexShrink: 0, 
                        marginTop: '2px' 
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '0.95rem', color: '#1e293b', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                        {task}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  )
}
