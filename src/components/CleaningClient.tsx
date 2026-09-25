'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import styles from './LandingPage.module.css'
import FamilyBanner from './FamilyBanner'
import EstimateCalculator from './EstimateCalculator'
import CleaningChecklist from './CleaningChecklist'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const faqs = [
  { q: "Do you supply all the cleaning products?", a: "Yes! We bring all our own premium, eco-friendly cleaning supplies and equipment so you don't have to worry about a thing." },
  { q: "Will the same team clean my home every time?", a: "We make every effort to send the same dedicated cleaning team to your home to ensure consistency and familiarity with your preferences." },
  { q: "What is the difference between a Standard and Deep Clean?", a: "A Standard Clean is perfect for recurring maintenance (dusting, vacuuming, mopping, bathrooms, kitchens). A Deep Clean goes further to include baseboards, interior windows, inside appliances, and deep scrubbing." }
]

export default function CleaningClient() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

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

    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className={styles.wrapper}>
      
      {/* 1. Fixed Parallax Hero */}
      <section className={styles.heroSection} style={{ overflow: 'hidden' }}>
        <div className={styles.heroImageWrapper}>
          <img 
            src="/award-bg.jpg" 
            alt="Pristine Living Room"
            className={styles.infiniteZoomImg}
          />
          {/* Sunny Golden Hour Overlay */}
          <div className={styles.heroOverlay} style={{ zIndex: 1, background: 'linear-gradient(45deg, rgba(255, 195, 113, 0.15) 0%, rgba(255, 229, 180, 0.05) 100%)', mixBlendMode: 'overlay' }}></div>
          <div className={styles.heroOverlay} style={{ zIndex: 2, background: 'radial-gradient(circle at top left, rgba(255, 220, 150, 0.15) 0%, transparent 60%)' }}></div>
        </div>
        
        {/* Ambient White Glow strictly behind the text to ensure absolute legibility of the Navy font */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%', background: 'linear-gradient(to top, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0) 100%)', zIndex: 3 }}></div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '60%', background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)', zIndex: 3 }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', textAlign: 'right', paddingBottom: '4rem' }}>
          <div className="reveal-up">
            <h1 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#1e3a8a', letterSpacing: '0.02em', margin: '0 0 1rem 0' }}>
              <span style={{ fontStyle: 'italic', fontWeight: 300 }}>House</span><br/>
              keeping.
            </h1>
          </div>
        </div>
      </section>

      {/* --- CONTENT WRAPPER FOR PARALLAX UNVEIL --- */}
      <div style={{ position: 'relative', zIndex: 5, backgroundColor: '#ffffff' }}>
        <FamilyBanner 
          prefix="YOUR" 
          suffix="Sanctuary." 
          content="At MAISON ATELIER, your comfort is our priority. As a family-driven company, we recognize the importance of a clean, healthy, and welcoming environment. Our housekeeping services are designed to give you peace of mind, meticulously maintaining your home so you can focus on what matters most."
        />
        <div style={{ paddingTop: '4rem' }}>

      {/* 3. Services (Premium Bento Layout) */}
      <section style={{ padding: '4rem 5% 4rem 5%', backgroundColor: '#fcfaf8' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="reveal-up" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: '3rem', color: '#1e3a8a' }}>
              Our <span style={{ fontStyle: 'italic', color: '#d97706' }}>Services</span>
            </h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', gridAutoRows: 'minmax(350px, auto)' }}>
            
            {/* Card 1 */}
            <div className="reveal-up parallax-img-container" style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', gridColumn: '1 / -1' }}>
              <img src="/award-bg.jpg" alt="Recurring Cleaning" style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10, 20, 40, 0.95) 0%, rgba(10, 20, 40, 0.2) 100%)' }}></div>
              <div style={{ position: 'relative', zIndex: 2, padding: '3rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: '#fff' }}>
                <h3 style={{ fontFamily: '"ivyprestige-headline", serif', fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>Recurring Cleaning</h3>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', color: '#fff' }}>Perfect for maintaining your home's pristine condition. Book us weekly, bi-weekly, or monthly.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="reveal-up parallax-img-container" style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden' }}>
              <img src="/luxury-bathroom.jpg" alt="Deep Cleaning" style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10, 20, 40, 0.95) 0%, rgba(10, 20, 40, 0.2) 100%)' }}></div>
              <div style={{ position: 'relative', zIndex: 2, padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: '#fff' }}>
                <h3 style={{ fontFamily: '"ivyprestige-headline", serif', fontSize: '1.8rem', marginBottom: '1rem', color: '#fff' }}>Deep Cleaning</h3>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1rem', opacity: 0.9, color: '#fff' }}>A rigorous, top-to-bottom clean focusing on every detail.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="reveal-up parallax-img-container" style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden' }}>
              <img src="/latelier-images/residential/kitchen.jpg" alt="Move In Out" style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20, 10, 5, 0.95) 0%, rgba(20, 10, 5, 0.2) 100%)' }}></div>
              <div style={{ position: 'relative', zIndex: 2, padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: '#fff' }}>
                <h3 style={{ fontFamily: '"ivyprestige-headline", serif', fontSize: '1.8rem', marginBottom: '1rem', color: '#fff' }}>Move In / Out</h3>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1rem', opacity: 0.9, color: '#fff' }}>Ensure a flawless transition into or out of your home.</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="reveal-up parallax-img-container" style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', gridColumn: '1 / -1' }}>
              <img src="/consultation-bg.jpg" alt="Specialty Cleans" style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10, 20, 40, 0.95) 0%, rgba(10, 20, 40, 0.2) 100%)' }}></div>
              <div style={{ position: 'relative', zIndex: 2, padding: '3rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: '#fff' }}>
                <h3 style={{ fontFamily: '"ivyprestige-headline", serif', fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>Specialty Cleans</h3>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', color: '#fff' }}>Post-construction fine-dust removal, seasonal resets, or event preparation.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* NEW: The Premium Interactive Checklist */}
      <CleaningChecklist />



      {/* CTA Section - Simple Link to Estimate */}
      <section style={{ padding: '4rem 5%', backgroundColor: '#1e3a8a', color: '#fff', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="reveal-up">
            <h2 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#fff', marginBottom: '1rem', fontWeight: 400 }}>
              Ready for a <span style={{ fontStyle: 'italic', color: '#d97706' }}>Spotless Home?</span>
            </h2>
            <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 'clamp(1rem, 2vw, 1.125rem)', opacity: 0.9, marginBottom: '2rem', lineHeight: 1.6 }}>
              Design your custom service and get an instant estimate in under 60 seconds. Our experts are standing by.
            </p>
            <Link href="/estimate" className="btn btn-primary" style={{ backgroundColor: '#d97706', color: '#fff', border: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Get Your Free Estimate
            </Link>
          </div>
        </div>
      </section>
      
        </div>
      </div> {/* END CONTENT WRAPPER */}

    </div>
  )
}
