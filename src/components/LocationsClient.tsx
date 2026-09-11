'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap/dist/gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import styles from './LandingPage.module.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const locations = [
  { city: 'Atlanta, GA', desc: 'Our North American headquarters, specializing in ground-up builds and luxury remodeling.', img: '/luxury-hero.jpg' },
  { city: 'London, UK', desc: 'European division handling historic restorations and modern estate management.', img: '/luxury-bathroom.jpg' },
  { city: 'Paris, FR', desc: 'Boutique architectural design studio focusing on uncompromising interior aesthetics.', img: '/award-bg.jpg' },
  { city: 'Lagos, NG', desc: 'African flagship office delivering monumental new construction projects.', img: '/luxury-hero.jpg' },
]

export default function LocationsClient() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.from('.loc-title', { y: 50, opacity: 0, duration: 1.2, ease: 'power3.out', stagger: 0.2 })

      // SVG wireframe rotation
      gsap.utils.toArray('.wire-circle').forEach((circle: any, i: number) => {
        gsap.to(circle, {
          rotation: 360,
          transformOrigin: '500px 500px',
          duration: 20 + i * 2,
          repeat: -1,
          ease: 'none'
        });
      });

      // SVG Parallax
      gsap.to('.bg-anim-svg', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      // Card reveal
      gsap.utils.toArray('.loc-card').forEach((card: any) => {
        gsap.fromTo(card, 
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%'
            }
          }
        )
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className={styles.wrapper} style={{ backgroundColor: 'var(--color-bg)', paddingTop: '10rem', position: 'relative', overflow: 'hidden' }}>
      
      {/* Dynamic Background Gradient */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(250,246,240,0.4) 100%)', zIndex: 0, pointerEvents: 'none' }}></div>

      {/* SVG Background Animation */}
      <div className={styles.bgSvgWrapper} style={{ zIndex: 0 }}>
        <svg className="bg-anim-svg" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <defs>
            <radialGradient id="sphere-glow-loc" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#sphere-glow-loc)" />
          <g stroke="var(--color-primary)" fill="none" strokeWidth="0.8" opacity="0.2">
            {Array.from({ length: 18 }).map((_, i) => (
              <g key={i} transform={`rotate(${i * 10} 500 500)`}>
                <circle className="wire-circle" cx="500" cy="500" r="350" />
              </g>
            ))}
          </g>
        </svg>
      </div>

      <div className="container" style={{ textAlign: 'center', marginBottom: 'var(--spacing-3xl)', position: 'relative', zIndex: 2 }}>
        <h4 className="loc-title font-sans" style={{ color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem', fontWeight: 600 }}>Global Presence</h4>
        <h1 className="loc-title font-serif" style={{ fontSize: 'clamp(3.5rem, 6vw, 6rem)', color: 'var(--color-text)', lineHeight: 1.1 }}>Our <span className="font-italic" style={{ color: 'var(--color-primary)' }}>Locations</span></h1>
        <p className="loc-title" style={{ maxWidth: '600px', margin: 'var(--spacing-md) auto 0', fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>
          Serving the most discerning clients across four continents with uncompromising standards.
        </p>
      </div>

      <div className="container" style={{ paddingBottom: 'var(--spacing-4xl)', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--spacing-2xl)' }}>
          {locations.map((loc, i) => (
            <div key={i} className={`loc-card ${styles.glassCard}`} style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: '100%', height: '260px', marginBottom: '2rem', borderRadius: '4px', overflow: 'hidden' }}>
                <Image src={loc.img} alt={loc.city} fill style={{ objectFit: 'cover' }} className={styles.zoomImage} />
              </div>
              <h3 className="font-serif" style={{ color: 'var(--color-secondary)', fontSize: '2.25rem', marginBottom: '1rem' }}>{loc.city}</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem', lineHeight: 1.6 }}>{loc.desc}</p>
              <Link href="/estimate" className="btn btn-outline" style={{ width: '100%' }}>Contact Office</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
