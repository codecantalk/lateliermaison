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

export default function AboutClient() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax Hero
      gsap.to('.hero-parallax-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      })

      // Standard reveals
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

      // Image reveals
      gsap.utils.toArray('.reveal-image').forEach((img: any) => {
        gsap.fromTo(img,
          { scale: 1.1, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: img,
              start: 'top 80%'
            }
          }
        )
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className={styles.wrapper}>
      
      {/* Hero Section */}
      <section className={`about-hero ${styles.heroSection}`} style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
        <div className={styles.heroImageWrapper}>
          <Image src="/award-bg.jpg" alt="L'Atelier Maison About" fill className={`hero-parallax-bg ${styles.objectCover}`} priority />
          <div className={styles.heroOverlay}></div>
        </div>
        
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroTextContainer}>
            <h4 className="reveal-up" style={{ color: '#8A9CFF', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>The Philosophy</h4>
            <h1 className="reveal-up font-serif" style={{ color: '#fff', marginBottom: '1.5rem', textShadow: '0 2px 20px rgba(0,0,0,0.5)', fontSize: 'clamp(4rem, 8vw, 8rem)' }}>Heritage &<br/><span className="font-italic" style={{ color: 'var(--color-primary)' }}>Vision</span></h1>
            <p className="reveal-up" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.5rem', marginBottom: '2rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>We curate sanctuaries for generations to come.</p>
          </div>
        </div>
      </section>

      {/* Founder's Statement (Asymmetrical Layout) */}
      <section style={{ padding: '8rem 0', backgroundColor: 'var(--color-bg)', position: 'relative' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '6rem', alignItems: 'flex-start' }}>
            
            {/* Left Column: Massive Statement */}
            <div className="reveal-up" style={{ position: 'sticky', top: '150px' }}>
              <h4 style={{ color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.5rem' }}>Our Commitment</h4>
              <h2 className="font-serif" style={{ fontSize: '3rem', color: 'var(--color-secondary)', lineHeight: 1.2 }}>
                At L'Atelier Maison, <br/>we prioritize <span className="font-italic" style={{ color: 'var(--color-primary)' }}>YOU.</span>
              </h2>
            </div>
            
            {/* Right Column: Flowing Text & Image */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              <div className="reveal-up" style={{ fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--color-text)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <p>As a family-oriented company, we prioritize the needs, values, and visions of every client we work with. Building a home or remodeling a space is deeply personal, and our mission is to ensure you feel supported, heard, and understood throughout the entire process.</p>
                <p>From the first concept to the final finishing touch, we are dedicated to bringing your unique vision to life, crafting spaces that truly reflect who you are and what you value most. At L'Atelier Maison, it’s more than construction—it’s about creating the foundation for your family’s future.</p>
              </div>

              <div className="reveal-image" style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '4px', overflow: 'hidden' }}>
                <Image src="/luxury-hero.jpg" alt="Craftsmanship" fill style={{ objectFit: 'cover' }} />
              </div>

              <div className="reveal-up" style={{ fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--color-text)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <p>Whether you're planning a small renovation or building your dream home, we are the trusted contractors to bring your vision to life. Your home should reflect who you are, and we guarantee it will.</p>
                <p style={{ fontStyle: 'italic', color: 'var(--color-secondary)', fontSize: '1.8rem', margin: '1rem 0' }}>"Maison — where your vision becomes home."</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Craftsmanship & Team Section */}
      <section style={{ padding: '8rem 0', backgroundColor: 'var(--color-secondary)', color: 'var(--color-text-inverse)' }}>
        <div className="container">
          <div className="reveal-up" style={{ textAlign: 'center', marginBottom: '5rem', maxWidth: '800px', margin: '0 auto 5rem' }}>
            <h4 style={{ color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.5rem' }}>Excellence</h4>
            <h2 className="font-serif" style={{ fontSize: '3rem' }}>The Highest Standard</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            
            <div className="reveal-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ position: 'relative', width: '100%', height: '450px', borderRadius: '4px', overflow: 'hidden' }}>
                <Image src="/consultation-bg.jpg" alt="Artisans" fill style={{ objectFit: 'cover' }} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '2rem' }}>Master Artisans</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.6 }}>We employ only the most highly vetted and extensively trained craftsmen. Our teams combine traditional generational techniques with modern structural innovations to ensure perfection in every joint, seam, and finish.</p>
            </div>

            <div className="reveal-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '4rem' }}>
              <div style={{ position: 'relative', width: '100%', height: '450px', borderRadius: '4px', overflow: 'hidden' }}>
                <Image src="/luxury-bathroom.jpg" alt="Materials" fill style={{ objectFit: 'cover' }} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '2rem' }}>Rare Materials</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.6 }}>From hand-quarried Italian marble to ethically sourced African mahogany, we travel the world to procure materials that possess distinct character, unrivaled durability, and timeless aesthetic value.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Our Journey / Timeline Section */}
      <section style={{ padding: '8rem 0', backgroundColor: 'var(--color-bg)', position: 'relative' }}>
        <div className="container">
          <div className="reveal-up" style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h4 style={{ color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.5rem' }}>Our Journey</h4>
            <h2 className="font-serif" style={{ fontSize: '3.5rem', color: 'var(--color-secondary)' }}>A Legacy of <span className="font-italic" style={{ color: 'var(--color-primary)' }}>Excellence</span></h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '3rem', marginTop: '4rem' }}>
            {[
              { year: '2010', title: 'The Foundation', desc: 'L\'Atelier Maison was founded with a singular vision: to bring uncompromising European architectural standards and rigorous attention to detail to North American luxury homes.' },
              { year: '2015', title: 'European Expansion', desc: 'Opened our boutique design studios in London and Paris, establishing our global supply chain for rare, hand-selected materials and forging relationships with master artisans.' },
              { year: '2020', title: 'Estate Management', desc: 'Launched our exclusive estate management and concierge services, offering full-lifecycle care and maintenance for the pristine sanctuaries we curate.' },
              { year: 'Present', title: 'Global Recognition', desc: 'Recognized as an industry leader in ultra-luxury builds and holistic home management, proudly serving the most discerning clientele across four continents.' }
            ].map((item, i) => (
              <div key={i} className="reveal-up" style={{ position: 'relative', paddingTop: '2rem', borderTop: '1px solid rgba(65, 105, 225, 0.3)' }}>
                <div style={{ position: 'absolute', left: '0', top: '-6px', width: '11px', height: '11px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></div>
                <h3 className="font-serif" style={{ fontSize: '3rem', color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>{item.year}</h3>
                <h4 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.title}</h4>
                <p style={{ color: 'var(--color-text)', fontSize: '1.1rem', lineHeight: '1.7' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section style={{ padding: '8rem 0', backgroundColor: 'var(--color-secondary)', color: 'var(--color-text-inverse)' }}>
        <div className="container">
          <div className="reveal-up" style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h4 style={{ color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.5rem' }}>The Visionaries</h4>
            <h2 className="font-serif" style={{ fontSize: '3.5rem' }}>Our Leadership</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem' }}>
            
            <div className="reveal-up" style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', width: '100%', height: '500px', borderRadius: '4px', overflow: 'hidden', marginBottom: '2.5rem' }}>
                <Image src="/award-bg.jpg" alt="Founder" fill style={{ objectFit: 'cover', filter: 'grayscale(100%) brightness(0.8)' }} className={styles.zoomImage} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Eleanor Vance</h3>
              <p style={{ color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '1rem', marginBottom: '1.5rem' }}>Founder & Principal Architect</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto' }}>Pioneering the fusion of historic European restoration techniques with modern sustainable architecture.</p>
            </div>

            <div className="reveal-up" style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', width: '100%', height: '500px', borderRadius: '4px', overflow: 'hidden', marginBottom: '2.5rem' }}>
                <Image src="/hero-bg.jpg" alt="Director" fill style={{ objectFit: 'cover', filter: 'grayscale(100%) brightness(0.8)' }} className={styles.zoomImage} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Julian Sterling</h3>
              <p style={{ color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.9rem', marginBottom: '1rem' }}>Director of Estate Management</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>Ensuring every L'Atelier property is meticulously maintained to the absolute highest standard of perfection.</p>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
