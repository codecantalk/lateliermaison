'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import styles from './LandingPage.module.css' // Reusing premium styles

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const services = [
  {
    id: 'new-construction',
    title: 'New Construction',
    subtitle: 'Ground-Up Architecture',
    desc: 'From initial concept to final walk-through, we build your legacy.',
    href: '/services/new-construction',
    img: '/luxury-hero.jpg'
  },
  {
    id: 'remodeling',
    title: 'Bathroom Remodeling',
    subtitle: 'Architectural Transformation',
    desc: 'From cosmetic updates to full-gut master suite luxury.',
    href: '/services/bathroom-remodeling',
    img: '/luxury-bathroom.jpg'
  },
  {
    id: 'estate',
    title: 'Estate Management',
    subtitle: 'Bespoke Home Services',
    desc: 'Comprehensive maintenance, plumbing, electrical, and repairs.',
    href: '/services/estate-management',
    img: '/award-bg.jpg'
  },
  {
    id: 'cleaning',
    title: 'Housekeeping',
    subtitle: 'The L\'Atelier Reset',
    desc: 'Meticulous, eco-friendly curation of your sanctuary.',
    href: '/services/cleaning',
    img: '/luxury-bathroom.jpg'
  }
]

export default function ServicesClient() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro Animations
      gsap.from('.hub-title', { y: 50, opacity: 0, duration: 1.2, ease: 'power3.out' })
      
      // Floating Parallax Cards
      gsap.utils.toArray('.service-hub-card').forEach((card: any, i: number) => {
        gsap.fromTo(card, 
          { y: 150, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            }
          }
        )
      })

    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className={styles.wrapper} style={{ backgroundColor: 'var(--color-bg-alt)', minHeight: '100vh' }}>
      <div className="container" style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
        <h4 className={`hub-title ${styles.sectionEyebrow}`}>Our Expertise</h4>
        <h1 className="hub-title font-serif" style={{ fontSize: 'clamp(3rem, 5vw, 5rem)' }}>The <span className="font-italic" style={{ color: 'var(--color-primary)' }}>Services</span></h1>
        <p className="hub-title" style={{ maxWidth: '600px', margin: 'var(--spacing-md) auto 0', fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>
          We do not merely maintain homes; we engineer perfection. Select an architectural discipline below.
        </p>
      </div>

      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-2xl)' }}>
        {services.map((svc) => (
          <Link key={svc.id} href={svc.href} className="service-hub-card" style={{ textDecoration: 'none', display: 'block', group: 'true' }}>
            <div style={{ position: 'relative', height: '400px', overflow: 'hidden', borderRadius: '4px', marginBottom: 'var(--spacing-md)' }}>
              <Image 
                src={svc.img} 
                alt={svc.title} 
                fill 
                className={styles.objectCover} 
                style={{ transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,20,18,0.8), transparent)' }}></div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, padding: 'var(--spacing-lg)', color: 'var(--color-text-inverse)' }}>
                <h4 style={{ color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{svc.subtitle}</h4>
                <h2 className="font-serif" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{svc.title}</h2>
              </div>
            </div>
            <p style={{ color: 'var(--color-text)', fontSize: '1.125rem' }}>{svc.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
