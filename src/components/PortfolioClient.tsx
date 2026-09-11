'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Portfolio.module.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const portfolioItems = [
  { img: '/luxury-hero.jpg', title: 'The Glass House', location: 'Paris, FR' },
  { img: '/luxury-bathroom.jpg', title: 'Spa Sanctuary', location: 'London, UK' },
  { img: '/award-bg.jpg', title: 'Modern Minimalism', location: 'Atlanta, GA' },
  { img: '/luxury-hero.jpg', title: 'Historic Restoration', location: 'Lagos, NG' },
  { img: '/award-bg.jpg', title: 'Coastal Retreat', location: 'Malibu, CA' },
  { img: '/luxury-bathroom.jpg', title: 'Urban Penthouse', location: 'New York, NY' },
]

export default function PortfolioClient() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. Hero Animations
      gsap.fromTo('.hero-title-anim', 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: 'power3.out', delay: 0.2 }
      )
      
      // Hero Background Parallax
      gsap.to('.hero-parallax-bg', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: `.${styles.heroSection}`,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      })

      // Hero SVG Breathing (Infinite)
      gsap.to('.hero-svg-breathe', {
        scale: 1.05,
        rotation: 2,
        duration: 15,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      })

      // 2. Grid Items - Wipe Reveal & Inner Parallax
      gsap.utils.toArray(`.${styles.gridItem}`).forEach((item: any) => {
        // Wipe Reveal
        gsap.to(item, {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 1.5,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
          }
        })

        // Inner Image Parallax
        const img = item.querySelector(`.${styles.parallaxImage}`)
        if (img) {
          gsap.fromTo(img, 
            { yPercent: -10 },
            {
              yPercent: 10,
              ease: 'none',
              scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
              }
            }
          )
        }
      })

      // 3. Floating SVG Accents
      gsap.utils.toArray('.accent-anim').forEach((accent: any, i: number) => {
        gsap.to(accent, {
          y: -100 * (i + 1),
          rotation: 45 * (i % 2 === 0 ? 1 : -1),
          ease: 'none',
          scrollTrigger: {
            trigger: `.${styles.gridContainer}`,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        })
      })

    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className={styles.wrapper}>
      
      {/* Cinematic Hero */}
      <section className={styles.heroSection}>
        <div className={styles.heroImageContainer}>
          <Image src="/luxury-hero.jpg" alt="Luxury Architecture" fill className="hero-parallax-bg" style={{objectFit: 'cover'}} priority />
        </div>
        <div className={styles.heroOverlay}></div>
        
        {/* SVG Overlay */}
        <div className={styles.heroSvgOverlay}>
          <svg className="hero-svg-breathe" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-primary)" strokeWidth="0.2" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-primary)" strokeWidth="0.1" />
            <path d="M10 50 L90 50 M50 10 L50 90" stroke="var(--color-primary)" strokeWidth="0.1" />
          </svg>
        </div>

        <div className={styles.heroContent}>
          <h4 className="hero-title-anim" style={{ color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Our Work</h4>
          <h1 className="hero-title-anim font-serif" style={{ fontSize: 'clamp(3.5rem, 6vw, 6rem)', lineHeight: 1.1, marginBottom: '1.5rem', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>The <span className="font-italic" style={{ color: 'var(--color-primary)' }}>Portfolio</span></h1>
          <p className="hero-title-anim" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            A curated selection of our most exquisite architectural transformations and ground-up builds across the globe.
          </p>
        </div>
      </section>

      {/* Asymmetrical Grid Section */}
      <section className="container">
        <div className={styles.gridContainer}>
          
          {/* Floating SVG Accents in Background */}
          <svg className={`accent-anim ${styles.accentSvg} ${styles.accent1}`} viewBox="0 0 100 100">
            <rect x="10" y="10" width="80" height="80" fill="none" stroke="var(--color-primary)" strokeWidth="0.5" transform="rotate(45 50 50)" />
          </svg>
          <svg className={`accent-anim ${styles.accentSvg} ${styles.accent2}`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-primary)" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="var(--color-primary)" strokeWidth="0.2" />
          </svg>
          
          {portfolioItems.map((item, i) => (
            <div key={i} className={styles.gridItem}>
              <Image src={item.img} alt={item.title} fill className={styles.parallaxImage} />
              <div className={styles.itemOverlay}>
                <div className={styles.itemText}>
                  <h3 className={`font-serif ${styles.itemTitle}`}>{item.title}</h3>
                  <p className={styles.itemLocation}>{item.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Premium Newsletter Section */}
      <section className={styles.newsletter}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1" style={{ margin: '0 auto 1.5rem' }}>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <h2 className="font-serif" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>The <span className="font-italic" style={{ color: 'var(--color-primary)' }}>Journal</span></h2>
          <p style={{ marginBottom: '2.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>
            Receive exclusive insights into our latest projects, architectural trends, and private events.
          </p>
          <form style={{ display: 'flex', gap: '1rem', flexDirection: 'row' }} onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Email Address" required className={styles.newsletterInput} />
            <button type="submit" className="btn btn-primary" style={{ padding: '18px 40px' }}>Subscribe</button>
          </form>
        </div>
      </section>

    </div>
  )
}
