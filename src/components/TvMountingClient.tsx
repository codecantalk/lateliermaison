'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import landingStyles from './LandingPage.module.css'
import FamilyBanner from './FamilyBanner'
import BottomCTA from './BottomCTA'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function TvMountingClient() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHeroHovered, setIsHeroHovered] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal Animations
      gsap.utils.toArray('.reveal-up').forEach((elem: any) => {
        gsap.fromTo(elem, 
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: elem,
              start: 'top 85%'
            }
          }
        )
      })

      // Image Parallax for Alternating Sections
      gsap.utils.toArray('.parallax-img-container').forEach((container: any) => {
        const img = container.querySelector('img')
        if (img) {
          gsap.to(img, {
            yPercent: 15,
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          })
        }
      })

      // Premium Precision Mounting Animation
      const tlMount = gsap.timeline({ repeat: -1, repeatDelay: 2.5 })
      gsap.set('.premium-tv', { y: 60, rotation: -6, transformOrigin: 'center center' })
      gsap.set('.laser-guide', { opacity: 0 })
      gsap.set('.laser-text-green', { opacity: 0 })
      gsap.set('.laser-text-red', { opacity: 1 })
      gsap.set('.laser-guide line', { stroke: '#EF4444' }) // Starts Red

      tlMount
        .to('.laser-guide', { opacity: 1, duration: 0.8, ease: 'power2.out' })
        .to('.premium-tv', { y: 0, duration: 1.5, ease: 'power2.inOut' }, '+=0.5')
        .to('.premium-tv', { rotation: 0, duration: 1.5, ease: 'power3.out' })
        .to('.laser-text-red', { opacity: 0, duration: 0.2 }, '-=0.2')
        .to('.laser-text-green', { opacity: 1, duration: 0.2 }, '-=0.2')
        .to('.laser-guide line', { stroke: '#10B981', duration: 0.2 }, '-=0.2')
        .to('.premium-tv', { scale: 1.02, duration: 0.3, yoyo: true, repeat: 1, ease: 'power1.inOut' }) // lock-in effect
        .to('.laser-guide', { opacity: 0, duration: 0.8 }, '+=1.5')

      // Premium Wire Concealment Animation
      const tlWire = gsap.timeline({ repeat: -1, repeatDelay: 2 })
      gsap.set('.blueprint-scanner', { y: 0, opacity: 0 })
      gsap.set('.reveal-rect', { height: 0 })

      tlWire
        .to('.blueprint-scanner', { opacity: 1, duration: 0.5 })
        .to('.blueprint-scanner', { y: 220, duration: 2, ease: 'power2.inOut' })
        .to('.reveal-rect', { height: 220, duration: 2, ease: 'power2.inOut' }, '<')
        .to('.blueprint-scanner', { opacity: 0, duration: 0.5 })
        .to('.reveal-rect', { height: 0, duration: 0.8, ease: 'power2.inOut' }, '+=2')

    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className={landingStyles.wrapper}>
      
      {/* 1. Fixed Parallax Hero */}
      <section className={landingStyles.heroSection} style={{ overflow: 'hidden' }}>
        <div className={landingStyles.heroImageWrapper}>
          <img 
            src="/homeservices/tv-mounting.webp" 
            alt="Premium TV Mounting"
            className={landingStyles.infiniteZoomImg}
          />
          {/* Sunny Golden Hour Overlay */}
          <div className={landingStyles.heroOverlay} style={{ zIndex: 1, background: 'linear-gradient(45deg, rgba(255, 195, 113, 0.15) 0%, rgba(255, 229, 180, 0.05) 100%)', mixBlendMode: 'overlay' }}></div>
          <div className={landingStyles.heroOverlay} style={{ zIndex: 2, background: 'radial-gradient(circle at top left, rgba(255, 220, 150, 0.15) 0%, transparent 60%)' }}></div>
        </div>
        
        <div className="container" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', textAlign: 'right', paddingBottom: '4rem' }}>
          <div className="reveal-up">
            <h1 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: 'clamp(1.75rem, 8vw, 4.5rem)', color: '#ffffff', letterSpacing: '0.02em', margin: '0 0 1rem 0', textShadow: '0 0 15px rgba(0,0,0,0.5)' }}>
              <span style={{ fontStyle: 'italic', fontWeight: 300 }}>TV</span><br/>
              Mounting.
            </h1>
          </div>
        </div>
      </section>

      {/* --- CONTENT WRAPPER FOR PARALLAX UNVEIL --- */}
      <div style={{ position: 'relative', zIndex: 5, backgroundColor: '#ffffff' }}>
        <FamilyBanner 
          prefix="YOUR" 
          suffix="Entertainment." 
          content="At Atelier Maison, we elevate your entertainment space. We offer flawless, highly secure TV mounting with pristine wire management. No messy cables, no crooked screens—just a beautiful cinematic experience integrated seamlessly into your home."
        />
        <div style={{ paddingTop: '4rem' }}>

        {/* 3. Services (Alternating Layout) */}
        <section style={{ padding: '4rem 5% 8rem 5%', backgroundColor: '#fcfaf8' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            
            {/* Service 1 - Text Left, Image Right */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center', marginBottom: '8rem' }}>
              <div className="reveal-up" style={{ paddingRight: '2rem' }}>
                <h3 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: '2.5rem', color: '#1e3a8a', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                  <span style={{ fontStyle: 'italic', color: '#d97706' }}>PRECISION</span> <br/>MOUNTING
                </h3>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1.125rem', lineHeight: 1.8, color: '#4b5563' }}>
                  We securely mount TVs of all sizes to any surface—drywall, brick, stone, or over fireplaces. Our technicians use laser leveling and premium brackets to ensure a rock-solid, perfectly centered installation.
                </p>
                <div style={{ marginTop: '2rem' }}>
                  <Link href="/estimate?service=tv" className="btn btn-primary" style={{ backgroundColor: '#1e3a8a', border: 'none' }}>Get an Estimate</Link>
                </div>
              </div>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', overflow: 'hidden', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
                <svg viewBox="0 0 400 500" width="100%" height="100%" style={{ background: '#F8F9FA' }}>
                  <defs>
                    <pattern id="archGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#E2E8F0" strokeWidth="1"/>
                    </pattern>
                    <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    <linearGradient id="tvScreen" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1E293B" />
                      <stop offset="100%" stopColor="#0F172A" />
                    </linearGradient>
                    <linearGradient id="tvGlare" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                      <stop offset="50%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>
                  </defs>
                  
                  <rect width="400" height="500" fill="url(#archGrid)" />
                  
                  {/* Elegant Wall Bracket */}
                  <g className="bracket" transform="translate(130, 235)">
                    <rect width="140" height="30" rx="3" fill="#64748B" />
                    <circle cx="20" cy="15" r="4" fill="#334155" />
                    <circle cx="120" cy="15" r="4" fill="#334155" />
                  </g>
                  
                  {/* Laser Guide */}
                  <g className="laser-guide">
                    <line x1="0" y1="250" x2="400" y2="250" strokeWidth="2" filter="url(#laserGlow)" strokeDasharray="6,4" opacity="0.8" />
                    <line x1="200" y1="0" x2="200" y2="500" strokeWidth="1" filter="url(#laserGlow)" opacity="0.4" />
                    
                    <rect x="160" y="225" width="80" height="50" rx="6" fill="#0F172A" opacity="0.9" />
                    <text className="laser-text-red" x="200" y="255" fontFamily="monospace" fontSize="18" fill="#EF4444" textAnchor="middle" fontWeight="bold">-6.0°</text>
                    <text className="laser-text-green" x="200" y="255" fontFamily="monospace" fontSize="18" fill="#10B981" textAnchor="middle" fontWeight="bold">0.0°</text>
                  </g>

                  {/* Premium TV */}
                  <g className="premium-tv" transform="translate(50, 150)">
                    {/* TV Bezel */}
                    <rect width="300" height="170" rx="6" fill="#475569" />
                    {/* Screen */}
                    <rect x="2" y="2" width="296" height="166" rx="4" fill="url(#tvScreen)" />
                    {/* Glare */}
                    <rect x="2" y="2" width="296" height="166" rx="4" fill="url(#tvGlare)" />
                    {/* Content Placeholder */}
                    <rect x="20" y="20" width="260" height="130" rx="2" fill="rgba(255,255,255,0.02)" />
                  </g>
                </svg>
              </div>
            </div>

            {/* Service 2 - Image Left, Text Right */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
              {/* Force image to first visually on desktop */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', overflow: 'hidden', borderRadius: '12px', order: -1, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
                <svg viewBox="0 0 400 500" width="100%" height="100%" style={{ background: '#F8F9FA' }}>
                  <rect width="400" height="500" fill="url(#archGrid)" />
                  
                  {/* Floating Console */}
                  <rect x="80" y="400" width="240" height="30" rx="4" fill="#CBD5E1" />
                  <rect x="100" y="430" width="200" height="20" fill="#94A3B8" />

                  {/* Soundbar */}
                  <rect x="140" y="385" width="120" height="10" rx="5" fill="#334155" />

                  {/* Premium TV (smaller and higher) */}
                  <g className="tv-top" transform="translate(100, 50)">
                    <rect width="200" height="120" rx="6" fill="#475569" />
                    <rect x="2" y="2" width="196" height="116" rx="4" fill="url(#tvScreen)" />
                  </g>

                  {/* The Mess */}
                  <g className="tangled-cables" fill="none" strokeWidth="4" strokeLinecap="round">
                    <path d="M 200 170 C 120 220, 280 290, 190 385" stroke="#334155" />
                    <path d="M 210 170 C 290 240, 110 310, 200 385" stroke="#64748B" />
                    <path d="M 190 170 C 160 210, 240 280, 210 385" stroke="#94A3B8" />
                    <path d="M 205 170 C 240 230, 170 300, 205 385" stroke="#475569" />
                  </g>

                  {/* In-Wall Raceway / Clean Finish */}
                  <clipPath id="revealMask">
                    <rect className="reveal-rect" x="0" y="170" width="400" height="0" />
                  </clipPath>
                  
                  <g className="concealed-finish" clipPath="url(#revealMask)">
                    <rect x="160" y="170" width="80" height="215" fill="#F8F9FA" />
                    <rect x="190" y="170" width="20" height="215" fill="#F1F5F9" />
                    <line x1="190" y1="170" x2="190" y2="385" stroke="#E2E8F0" strokeWidth="1" />
                    <line x1="210" y1="170" x2="210" y2="385" stroke="#E2E8F0" strokeWidth="1" />
                  </g>

                  {/* The Scanner / Blueprint effect */}
                  <g className="blueprint-scanner" transform="translate(0, 170)">
                    <rect x="80" y="0" width="240" height="2" fill="#0EA5E9" />
                    <rect x="80" y="-30" width="240" height="30" fill="url(#blueScanGradient)" opacity="0.2" />
                  </g>
                  
                  <defs>
                    <linearGradient id="blueScanGradient" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="#0EA5E9" stopOpacity="1" />
                      <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="reveal-up" style={{ paddingLeft: '2rem' }}>
                <h3 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: '2.5rem', color: '#1e3a8a', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                  <span style={{ fontStyle: 'italic', color: '#d97706' }}>WIRE</span> <br/>CONCEALMENT
                </h3>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1.125rem', lineHeight: 1.8, color: '#4b5563' }}>
                  No more messy tangles of cords. We expertly hide all power cables and HDMI wires behind the wall to deliver a clean, floating aesthetic that turns your TV into a piece of art.
                </p>
                <div style={{ marginTop: '2rem' }}>
                  <Link href="/estimate?service=tv" className="btn btn-primary" style={{ backgroundColor: '#1e3a8a', border: 'none' }}>Get an Estimate</Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        <BottomCTA 
          title="Ready for" 
          titleHighlight="Perfect Viewing?" 
          text={[
            "Transform your entertainment experience with flawless mounting and seamless wire concealment.",
            "Design your custom service and get an instant estimate in under 60 seconds."
          ]}
        />

        </div>
      </div>
    </div>
  )
}
