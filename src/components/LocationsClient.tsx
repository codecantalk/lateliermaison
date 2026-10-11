'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap/dist/gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import styles from './LandingPage.module.css'
import FamilyBanner from './FamilyBanner'
import LocationsMapHero from './LocationsMapHero'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const locations = [
  { city: 'Atlanta, GA', slug: 'atlanta', desc: 'Our North American headquarters, specializing in ground-up builds and luxury remodeling.', img: '/luxury-hero.jpg' },
  { city: 'Washington, DC', slug: 'washington-dc', desc: 'Capital division handling luxury remodeling and modern home services.', img: '/luxury-bathroom.jpg' },
  { city: 'Maryland', slug: 'maryland', desc: 'Premium property care and bespoke renovations serving the entire state of Maryland.', img: '/portfolio-images/IMG_8187.JPG' },
  { city: 'London, UK', slug: 'london', desc: 'Boutique architectural design studio focusing on uncompromising interior aesthetics and luxury flats.', img: '/award-bg.jpg' },
  { city: 'Lagos, NG', slug: 'lagos', desc: 'Bringing world-class artisan craftsmanship and premium estate management to West Africa.', img: '/portfolio-images/IMG_8188.JPG' },
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
      {/* 1. Interactive 3D Animated SVG Locations Map Hero */}
      <LocationsMapHero />

      {/* --- CONTENT WRAPPER FOR PARALLAX UNVEIL --- */}
      <div style={{ position: 'relative', zIndex: 5, backgroundColor: '#ffffff' }}>
        <FamilyBanner 
          prefix="OUR" 
          suffix="Reach." 
          content="At Atelier Maison, our family spans the globe. We bring our unwavering commitment to quality and luxurious living to select prime locations. Whether you are in Atlanta, the DMV Area, or Paris, our trusted team is ready to bring your architectural vision to life."
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
              <Link href={`/locations/${loc.slug}`} className="btn btn-outline" style={{ width: '100%' }}>View Local Services</Link>
            </div>
          ))}
        </div>
      </div>
        </div>
      </div> {/* END CONTENT WRAPPER */}

    </div>
  )
}
