'use client'

import { useEffect, useRef } from 'react'
import FamilyBanner from './FamilyBanner'
import BottomCTA from './BottomCTA'
import RemodelingChecklist from './RemodelingChecklist'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import landingStyles from './LandingPage.module.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function RemodelingClient() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal animations for text
      gsap.utils.toArray('.reveal-up').forEach((elem: any) => {
        gsap.from(elem, {
          y: 50,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: elem,
            start: 'top 85%'
          }
        })
      })

      // Smooth card reveal for remodeling sections
      gsap.utils.toArray('.remodel-card-anim').forEach((card: any) => {
        gsap.from(card, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%'
          }
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} style={{ width: '100%', overflow: 'hidden', backgroundColor: '#ffffff' }}>
      
      {/* 1. Fixed Parallax Hero */}
      <section className={landingStyles.heroSection} style={{ overflow: 'hidden' }}>
        <div className={landingStyles.heroImageWrapper}>
          <img 
            src="/bathroom-remodeling-herosection.webp" 
            alt="Remodeling"
            className={landingStyles.infiniteZoomImg}
          />
          {/* Sunny Golden Hour Overlay */}
          <div className={landingStyles.heroOverlay} style={{ zIndex: 1, background: 'linear-gradient(45deg, rgba(255, 195, 113, 0.15) 0%, rgba(255, 229, 180, 0.05) 100%)', mixBlendMode: 'overlay' }}></div>
          <div className={landingStyles.heroOverlay} style={{ zIndex: 2, background: 'radial-gradient(circle at top left, rgba(255, 220, 150, 0.15) 0%, transparent 60%)' }}></div>
        </div>
        

        <div className="container" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', textAlign: 'right', paddingBottom: '4rem' }}>
          <div className="reveal-up">
            <h1 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: 'clamp(1.75rem, 8vw, 4.5rem)', color: '#1e3a8a', letterSpacing: '0.02em', margin: '0 0 1rem 0' }}>
              <span style={{ fontStyle: 'italic', fontWeight: 300 }}>Home</span><br/>
              Remodeling.
            </h1>
          </div>
        </div>
      </section>

      {/* --- CONTENT WRAPPER FOR PARALLAX UNVEIL --- */}
      <div style={{ position: 'relative', zIndex: 5, backgroundColor: '#ffffff' }}>
        <FamilyBanner 
          prefix="YOUR" 
          suffix="Revival." 
          content="At Atelier Maison, we breathe new life into existing spaces. Our family approaches home remodeling with a deep respect for the original structure while infusing it with modern luxury and elegance. We seamlessly blend the old with the new, ensuring your home perfectly evolves with your lifestyle."
        />
        <div style={{ paddingTop: '4rem' }}>

        {/* Intro text moved to BottomCTA */}

        {/* 3. Services (Alternating Editorial Showcase Layout) */}
        <section style={{ padding: '5rem 5% 8rem 5%', backgroundColor: '#fcfaf8' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8rem' }}>
            
            {/* Service 1 - Bathroom: Text Left, Full Image Right */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
              <div className="reveal-up" style={{ paddingRight: '1rem' }}>
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  fontSize: '0.78rem', 
                  letterSpacing: '0.18em', 
                  textTransform: 'uppercase', 
                  color: '#d97706', 
                  fontWeight: 600, 
                  marginBottom: '1rem',
                  background: 'rgba(217, 119, 6, 0.08)',
                  padding: '5px 12px',
                  borderRadius: '100px',
                  border: '1px solid rgba(217, 119, 6, 0.2)'
                }}>
                  01 / Sanctuary & Spa
                </div>
                <h3 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: 'clamp(2.2rem, 3.5vw, 3rem)', color: '#1e3a8a', marginBottom: '1.25rem', lineHeight: 1.15 }}>
                  <span style={{ fontStyle: 'italic', fontWeight: 300, color: '#d97706' }}>BATHROOM</span> <br/>REMODELING
                </h3>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1.1rem', lineHeight: 1.8, color: '#4b5563', marginBottom: '2rem' }}>
                  Elevate your daily routine with a bespoke luxury bathroom renovation. From zero-threshold walk-in rain showers with frameless architectural glass to custom double vanities and freestanding soaking tubs, we transform private suites into tranquil spa sanctuaries.
                </p>

                {/* Feature highlights */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '2.5rem' }}>
                  {[
                    'Frameless Glass Showers',
                    'Freestanding Soaking Tubs',
                    'Custom Floating Vanities',
                    'Heated Radiant Tile Floors'
                  ].map((feat, idx) => (
                    <div key={idx} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      fontSize: '0.88rem', 
                      color: '#1e293b', 
                      fontWeight: 500,
                      background: '#ffffff',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 0, 0, 0.06)'
                    }}>
                      <span style={{ color: '#d97706', fontSize: '1rem' }}>✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <Link 
                  href="/estimate?service=remodeling&scope=full" 
                  className="btn btn-outline" 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>Estimate Bathroom Renovation</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Full Image Container - Native 3:2 Aspect Ratio */}
              <div 
                className="remodel-card-anim"
                style={{ 
                  position: 'relative', 
                  width: '100%', 
                  aspectRatio: '3 / 2', 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                  backgroundColor: '#0f172a'
                }}
              >
                <img 
                  src="/remodeling-bathroom-full.jpg" 
                  alt="Full Architectural View - Bathroom Remodeling" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(8px)',
                  color: '#e2e8f0',
                  fontSize: '0.72rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '6px 14px',
                  borderRadius: '100px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  pointerEvents: 'none',
                  fontWeight: 500
                }}>
                  Full Architectural View
                </div>
              </div>
            </div>

            {/* Service 2 - Kitchen: Full Image Left, Text Right */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
              {/* Full Image Container - Native 3:2 Aspect Ratio */}
              <div 
                className="remodel-card-anim"
                style={{ 
                  position: 'relative', 
                  width: '100%', 
                  aspectRatio: '3 / 2', 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                  backgroundColor: '#0f172a',
                  order: 1
                }}
              >
                <img 
                  src="/remodeling-kitchen-full.jpg" 
                  alt="Full Architectural View - Kitchen Remodeling" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(8px)',
                  color: '#e2e8f0',
                  fontSize: '0.72rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '6px 14px',
                  borderRadius: '100px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  pointerEvents: 'none',
                  fontWeight: 500
                }}>
                  Full Architectural View
                </div>
              </div>

              <div className="reveal-up" style={{ paddingLeft: '1rem', order: 2 }}>
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  fontSize: '0.78rem', 
                  letterSpacing: '0.18em', 
                  textTransform: 'uppercase', 
                  color: '#d97706', 
                  fontWeight: 600, 
                  marginBottom: '1rem',
                  background: 'rgba(217, 119, 6, 0.08)',
                  padding: '5px 12px',
                  borderRadius: '100px',
                  border: '1px solid rgba(217, 119, 6, 0.2)'
                }}>
                  02 / Culinary Center
                </div>
                <h3 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: 'clamp(2.2rem, 3.5vw, 3rem)', color: '#1e3a8a', marginBottom: '1.25rem', lineHeight: 1.15 }}>
                  <span style={{ fontStyle: 'italic', fontWeight: 300, color: '#d97706' }}>KITCHEN</span> <br/>REMODELING
                </h3>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1.1rem', lineHeight: 1.8, color: '#4b5563', marginBottom: '2rem' }}>
                  The heart of your home deserves to be extraordinary. We design and build culinary centers that blend commercial-grade appliances with handcrafted custom cabinetry, dramatic waterfall marble islands, and timeless architectural detailing tailored for grand entertaining.
                </p>

                {/* Feature highlights */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '2.5rem' }}>
                  {[
                    'Waterfall Marble Islands',
                    'Custom Architectural Millwork',
                    'Chef Range & Double Ovens',
                    'Designer Pendant Illumination'
                  ].map((feat, idx) => (
                    <div key={idx} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      fontSize: '0.88rem', 
                      color: '#1e293b', 
                      fontWeight: 500,
                      background: '#ffffff',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 0, 0, 0.06)'
                    }}>
                      <span style={{ color: '#d97706', fontSize: '1rem' }}>✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <Link 
                  href="/estimate?service=remodeling&scope=full" 
                  className="btn btn-outline" 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>Estimate Kitchen Renovation</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Service 3 - Basement: Text Left, Full Image Right */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
              <div className="reveal-up" style={{ paddingRight: '1rem' }}>
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  fontSize: '0.78rem', 
                  letterSpacing: '0.18em', 
                  textTransform: 'uppercase', 
                  color: '#d97706', 
                  fontWeight: 600, 
                  marginBottom: '1rem',
                  background: 'rgba(217, 119, 6, 0.08)',
                  padding: '5px 12px',
                  borderRadius: '100px',
                  border: '1px solid rgba(217, 119, 6, 0.2)'
                }}>
                  03 / Lower-Level Retreat
                </div>
                <h3 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: 'clamp(2.2rem, 3.5vw, 3rem)', color: '#1e3a8a', marginBottom: '1.25rem', lineHeight: 1.15 }}>
                  <span style={{ fontStyle: 'italic', fontWeight: 300, color: '#d97706' }}>INTERIOR</span> <br/>BASEMENTS
                </h3>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1.1rem', lineHeight: 1.8, color: '#4b5563', marginBottom: '2rem' }}>
                  Unlock the full square footage of your estate. Whether you envision a sophisticated lounge with a wet bar and shuffleboard table, a private cinematic acoustic theater, or a temperature-controlled wine room, we transform lower levels into premier architectural living destinations.
                </p>

                {/* Feature highlights */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '2.5rem' }}>
                  {[
                    'Custom Lounges & Wet Bars',
                    'Acoustic Home Theaters',
                    'Game Rooms & Shuffleboards',
                    'Private Luxury Guest Suites'
                  ].map((feat, idx) => (
                    <div key={idx} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      fontSize: '0.88rem', 
                      color: '#1e293b', 
                      fontWeight: 500,
                      background: '#ffffff',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 0, 0, 0.06)'
                    }}>
                      <span style={{ color: '#d97706', fontSize: '1rem' }}>✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <Link 
                  href="/estimate?service=remodeling&scope=full" 
                  className="btn btn-outline" 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>Estimate Basement Renovation</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Full Image Container - Native 3:2 Aspect Ratio */}
              <div 
                className="remodel-card-anim"
                style={{ 
                  position: 'relative', 
                  width: '100%', 
                  aspectRatio: '3 / 2', 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                  backgroundColor: '#0f172a'
                }}
              >
                <img 
                  src="/remodeling-basement-full.jpg" 
                  alt="Full Architectural View - Interior Basements" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(8px)',
                  color: '#e2e8f0',
                  fontSize: '0.72rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '6px 14px',
                  borderRadius: '100px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  pointerEvents: 'none',
                  fontWeight: 500
                }}>
                  Full Architectural View
                </div>
              </div>
            </div>

          </div>
        </section>

        <RemodelingChecklist />

        {/* 4. CTA */}
        <BottomCTA 
          title="Transform your" 
          titleHighlight="space"
          text={[
            "Transforming older rooms in your home into a beautiful and functional space requires the expertise of a trusted and skilled renovation team.",
            "Atelier Maison is your ideal partner for the project, offering a commitment to excellence in every stage—from initial consultation to final installation.",
            "We take pride in delivering results that exceed expectations, ensuring your home renovation is seamless and enjoyable. With Atelier Maison, you can look forward to a stunning, highly functional kitchen that you’ll cherish for years to come."
          ]}
          buttonText="Start Your Renovation"
        />

        </div>
      </div> {/* END CONTENT WRAPPER */}

    </div>
  )
}
