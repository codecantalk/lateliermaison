'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap/dist/gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import styles from './LandingPage.module.css'
import FamilyBanner from './FamilyBanner'

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
    <div ref={containerRef} className={styles.wrapper} style={{ backgroundColor: 'var(--color-bg)', position: 'relative', overflow: 'hidden' }}>
      {/* 1. Fixed Parallax Hero */}
      <section className={styles.heroSection} style={{ overflow: 'hidden' }}>
        <div className={styles.heroImageWrapper}>
          <img 
            src="/award-bg.jpg" 
            alt="Locations"
            className={styles.infiniteZoomImg}
          />
          {/* Sunny Golden Hour Overlay */}
          <div className={styles.heroOverlay} style={{ zIndex: 1, background: 'linear-gradient(45deg, rgba(255, 195, 113, 0.15) 0%, rgba(255, 229, 180, 0.05) 100%)', mixBlendMode: 'overlay' }}></div>
          <div className={styles.heroOverlay} style={{ zIndex: 2, background: 'radial-gradient(circle at top left, rgba(255, 220, 150, 0.15) 0%, transparent 60%)' }}></div>
        </div>
        

        <div className="container" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', textAlign: 'right', paddingBottom: '4rem' }}>
          <div className="reveal-up">
            <h1 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#1e3a8a', letterSpacing: '0.02em', margin: '0 0 1rem 0' }}>
              <span style={{ fontStyle: 'italic', fontWeight: 300 }}>Our</span><br/>
              Locations.
            </h1>
          </div>
        </div>
      </section>

      {/* --- CONTENT WRAPPER FOR PARALLAX UNVEIL --- */}
      <div style={{ position: 'relative', zIndex: 5, backgroundColor: '#ffffff' }}>
        <FamilyBanner 
          prefix="OUR" 
          suffix="Reach." 
          content="At Atelier Maison, our family spans the globe. We bring our unwavering commitment to quality and luxurious living to select prime locations. Whether you are in London, Atlanta, or Lagos, our trusted team is ready to bring your architectural vision to life."
        />
        <div style={{ paddingTop: '4rem' }}>
        <p className="loc-title" style={{ maxWidth: '600px', margin: 'var(--spacing-md) auto 0', fontSize: '1.25rem', color: 'var(--color-text-muted)', textAlign: 'center', paddingBottom: '4rem' }}>
          Serving the most discerning clients across four continents with uncompromising standards.
        </p>
      <div className="container" style={{ paddingBottom: 'var(--spacing-4xl)', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--spacing-2xl)' }}>
          {locations.map((loc, i) => (
            <div key={i} className={`loc-card ${styles.glassCard}`} style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: '100%', height: '260px', marginBottom: '2rem', borderRadius: '4px', overflow: 'hidden' }}>
                <Image src={loc.img} alt={loc.city} fill style={{ objectFit: 'cover' }} className={styles.zoomImage}  sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              <h3 className="font-serif" style={{ color: 'var(--color-secondary)', fontSize: '2.25rem', marginBottom: '1rem' }}>{loc.city}</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem', lineHeight: 1.6 }}>{loc.desc}</p>
              <Link href="/estimate" className="btn btn-outline" style={{ width: '100%' }}>Contact Office</Link>
            </div>
          ))}
        </div>
      </div>
        </div>
      </div> {/* END CONTENT WRAPPER */}

    </div>
  )
}
