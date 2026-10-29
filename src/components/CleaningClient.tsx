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
  { q: "What is the difference between a Standard and Deep Clean?", a: "A Standard Clean is perfect for recurring maintenance (dusting reachable surfaces, vacuuming, mopping, bathrooms, and exterior surfaces). A Deep Clean goes deeper to include hand-scrubbing all baseboards, door frames, and intensive grout/tile scrubbing. Interior appliances (inside oven, inside fridge) can be easily added as custom add-ons in our estimate calculator." }
]

export default function CleaningClient() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [isHeroHovered, setIsHeroHovered] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Scroll Detection for Hero Blur
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
        

        <div className="container" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '6rem' }}>
          
          <div 
            onMouseEnter={() => setIsHeroHovered(true)}
            onMouseLeave={() => setIsHeroHovered(false)}
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '2rem', 
              alignItems: 'flex-end', 
              padding: '2rem', 
              background: (isHeroHovered || isScrolled) ? 'rgba(255, 255, 255, 0.15)' : 'transparent', 
              backdropFilter: (isHeroHovered || isScrolled) ? 'blur(12px)' : 'none', 
              WebkitBackdropFilter: (isHeroHovered || isScrolled) ? 'blur(12px)' : 'none', 
              borderRadius: '20px',
              transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
            }}>
            
            {/* Left: Philosophy Text */}
            <div className="reveal-up">
              <h4 style={{ textTransform: 'uppercase', letterSpacing: '0.15em', color: '#d97706', fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', marginBottom: '1rem', fontWeight: 700 }}>Our Philosophy</h4>
              <h2 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: 'clamp(1.2rem, 4vw, 2.25rem)', fontWeight: 400, lineHeight: 1.2, color: '#1e3a8a', margin: '0 0 1rem 0' }}>
                The devil is in the <span style={{ fontStyle: 'italic' }}>details</span>, <br/>but so are we...
              </h2>
              <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 'clamp(0.95rem, 3vw, 1.1rem)', fontWeight: 600, lineHeight: 1.6, color: '#1e3a8a', maxWidth: '400px' }}>
                You’re in control of every detail, we’re here to execute. Live on your terms!
              </p>
            </div>

            {/* Right: Main Hero Title */}
            <div className="reveal-up" style={{ textAlign: 'right' }}>
              <h1 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: 'clamp(2rem, 8vw, 4.5rem)', color: '#1e3a8a', letterSpacing: '0.02em', margin: 0, textShadow: '0 0 15px rgba(255,255,255,0.5)' }}>
                <span style={{ fontStyle: 'italic', fontWeight: 300 }}>House</span><br/>
                Cleaning.
              </h1>
            </div>

          </div>
        </div>
      </section>

      {/* --- CONTENT WRAPPER FOR PARALLAX UNVEIL --- */}
      <div style={{ position: 'relative', zIndex: 5, backgroundColor: '#ffffff' }}>
        <FamilyBanner 
          prefix="YOUR" 
          suffix="Sanctuary." 
          content="At Atelier Maison, your comfort is our priority. As a family-driven company, we recognize the importance of a clean, healthy, and welcoming environment. Our House Cleaning services are designed to give you peace of mind, meticulously maintaining your home so you can focus on what matters most."
        />

        <div style={{ paddingTop: '0rem' }}>

        {/* Dedicated Regional Operating Divisions */}
        <section style={{ padding: '3rem 5% 1rem 5%', backgroundColor: '#ffffff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
              background: 'linear-gradient(135deg, #0B132B 0%, #1e3a8a 100%)',
              borderRadius: '24px',
              padding: 'clamp(2rem, 4vw, 3rem)',
              color: '#ffffff',
              boxShadow: '0 20px 40px rgba(11, 19, 43, 0.15)',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#facc15', fontWeight: 700, display: 'block', marginBottom: '0.75rem' }}>
                Dedicated Regional Operating Divisions
              </span>
              <h2 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', color: '#ffffff', margin: '0 0 1rem 0', fontWeight: 400 }}>
                Choose Your Market For Dedicated Local Service
              </h2>
              <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1.05rem', color: '#e2e8f0', maxWidth: '750px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
                We operate specialized local dispatch hubs with dedicated concierge and cleaning artisans. Select your area to access local reviews, neighborhood coverage, and instant quote booking:
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
                
                {/* Atlanta Card */}
                <Link 
                  href="/atlanta/house-cleaning" 
                  style={{
                    display: 'block',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    textAlign: 'left',
                    textDecoration: 'none',
                    color: '#ffffff',
                    transition: 'all 0.3s ease'
                  }}
                  className="hover-lift"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#facc15' }}>Atlanta House Cleaning</span>
                    <span style={{ fontSize: '1.2rem' }}>→</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
                    Serving Buckhead, Vinings, Midtown, Sandy Springs, Alpharetta & North Atlanta.
                  </p>
                  <span style={{ display: 'inline-block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ffffff', background: '#d97706', padding: '8px 18px', borderRadius: '50px', fontWeight: 600 }}>
                    Visit Atlanta Hub →
                  </span>
                </Link>

                {/* DMV Card */}
                <Link 
                  href="/dmv/house-cleaning" 
                  style={{
                    display: 'block',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    textAlign: 'left',
                    textDecoration: 'none',
                    color: '#ffffff',
                    transition: 'all 0.3s ease'
                  }}
                  className="hover-lift"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#facc15' }}>DMV House Cleaning</span>
                    <span style={{ fontSize: '1.2rem' }}>→</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
                    Serving Washington DC, Bethesda, Potomac, Arlington, Alexandria, McLean & Northern VA.
                  </p>
                  <span style={{ display: 'inline-block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ffffff', background: '#d97706', padding: '8px 18px', borderRadius: '50px', fontWeight: 600 }}>
                    Visit DMV Hub →
                  </span>
                </Link>

              </div>
            </div>
          </div>
        </section>

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
            <Link href="/estimate" className="reveal-up parallax-img-container" style={{ display: 'block', position: 'relative', borderRadius: '24px', overflow: 'hidden', gridColumn: '1 / -1', textDecoration: 'none' }}>
              <img src="/award-bg.jpg" alt="Recurring Cleaning" style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10, 20, 40, 0.95) 0%, rgba(10, 20, 40, 0.2) 100%)' }}></div>
              <div style={{ position: 'relative', zIndex: 2, padding: '3rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: '#fff' }}>
                <h3 style={{ fontFamily: '"ivyprestige-headline", serif', fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>Recurring Cleaning</h3>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', color: '#fff' }}>Perfect for maintaining your home's pristine condition. Book us weekly, bi-weekly, or monthly.</p>
              </div>
            </Link>

            {/* Card 2 */}
            <Link href="/estimate" className="reveal-up parallax-img-container" style={{ display: 'block', position: 'relative', borderRadius: '24px', overflow: 'hidden', textDecoration: 'none' }}>
              <img src="/luxury-bathroom.jpg" alt="Deep Cleaning" style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10, 20, 40, 0.95) 0%, rgba(10, 20, 40, 0.2) 100%)' }}></div>
              <div style={{ position: 'relative', zIndex: 2, padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: '#fff' }}>
                <h3 style={{ fontFamily: '"ivyprestige-headline", serif', fontSize: '1.8rem', marginBottom: '1rem', color: '#fff' }}>Deep Cleaning</h3>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1rem', opacity: 0.9, color: '#fff' }}>A rigorous, top-to-bottom clean focusing on every detail.</p>
              </div>
            </Link>

            {/* Card 3 */}
            <Link href="/estimate" className="reveal-up parallax-img-container" style={{ display: 'block', position: 'relative', borderRadius: '24px', overflow: 'hidden', textDecoration: 'none' }}>
              <img src="/latelier-images/residential/kitchen.jpg" alt="Move In Out" style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20, 10, 5, 0.95) 0%, rgba(20, 10, 5, 0.2) 100%)' }}></div>
              <div style={{ position: 'relative', zIndex: 2, padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: '#fff' }}>
                <h3 style={{ fontFamily: '"ivyprestige-headline", serif', fontSize: '1.8rem', marginBottom: '1rem', color: '#fff' }}>Move In / Out</h3>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1rem', opacity: 0.9, color: '#fff' }}>Ensure a flawless transition into or out of your home.</p>
              </div>
            </Link>

            {/* Card 4 */}
            <Link href="/estimate" className="reveal-up parallax-img-container" style={{ display: 'block', position: 'relative', borderRadius: '24px', overflow: 'hidden', gridColumn: '1 / -1', textDecoration: 'none' }}>
              <img src="/consultation-bg.jpg" alt="Specialty Cleans" style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10, 20, 40, 0.95) 0%, rgba(10, 20, 40, 0.2) 100%)' }}></div>
              <div style={{ position: 'relative', zIndex: 2, padding: '3rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: '#fff' }}>
                <h3 style={{ fontFamily: '"ivyprestige-headline", serif', fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>Specialty Cleans</h3>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', color: '#fff' }}>Post-construction fine-dust removal, seasonal resets, or event preparation.</p>
              </div>
            </Link>

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
