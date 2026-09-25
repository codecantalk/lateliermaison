'use client'

import { useEffect, useRef } from 'react'
import FamilyBanner from './FamilyBanner'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Portfolio.module.css'
import landingStyles from './LandingPage.module.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const DEFAULT_ITEMS = [
  { img: '/latelier-images/portfolio/IMG_8183.JPG', title: 'The Glass House', location: 'Paris, FR' },
  { img: '/latelier-images/portfolio/IMG_8184.JPG', title: 'Spa Sanctuary', location: 'London, UK' },
  { img: '/latelier-images/portfolio/IMG_8185.JPG', title: 'Modern Minimalism', location: 'Atlanta, GA' },
  { img: '/latelier-images/portfolio/IMG_8186.JPG', title: 'Historic Restoration', location: 'Lagos, NG' },
  { img: '/latelier-images/portfolio/IMG_8187.JPG', title: 'Coastal Retreat', location: 'Malibu, CA' },
  { img: '/latelier-images/portfolio/IMG_8188.JPG', title: 'Urban Penthouse', location: 'New York, NY' },
  { img: '/latelier-images/portfolio/IMG_8189.JPG', title: 'Mountain Chalet', location: 'Aspen, CO' },
  { img: '/latelier-images/portfolio/IMG_8190.JPG', title: 'Desert Oasis', location: 'Scottsdale, AZ' },
  { img: '/latelier-images/portfolio/IMG_8191.JPG', title: 'Mid-Century Modern', location: 'Palm Springs, CA' },
  { img: '/latelier-images/portfolio/5A6BE788-BBDC-4362-83B1-50E26B74249D.JPG', title: 'Lakefront Estate', location: 'Lake Tahoe, NV' },
]

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function PortfolioClient() {
  const containerRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const [portfolioItems, setPortfolioItems] = useState(DEFAULT_ITEMS)
  const supabase = createClient()

  useEffect(() => {
    async function loadPortfolio() {
      const { data } = await supabase.from('portfolio_items').select('*').order('sort_order', { ascending: true })
      if (data && data.length > 0) {
        const mapped = data.map(item => ({
          img: item.image_url,
          title: item.title,
          location: item.category
        }))
        setPortfolioItems(mapped)
      }
    }
    loadPortfolio()
    
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        
        // 1. Hero Animations (Reveal)
        gsap.fromTo('.reveal-up', 
          { y: 50, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: 'power3.out', delay: 0.2 }
        )

        // 2. Editorial Gallery Parallax & Reveals
        gsap.utils.toArray(`.${styles.editorialCard}`).forEach((card: any, i: number) => {
          
          // Image zoom effect
          const imgWrapper = card.querySelector(`.${styles.editorialImageWrapper}`)
          if (imgWrapper) {
            gsap.fromTo(imgWrapper, 
              { scale: 0.9, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 85%",
                  end: "center center",
                  scrub: 1
                }
              }
            )
          }
          
          // Inner image parallax (moving up slightly)
          const img = card.querySelector(`.${styles.editorialImage}`)
          if (img) {
            gsap.fromTo(img, 
              { yPercent: -15 },
              {
                yPercent: 15,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true
                }
              }
            )
          }

          // Text reveal
          const text = card.querySelector(`.${styles.editorialText}`)
          if (text) {
            gsap.fromTo(text,
              { y: 50, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 75%",
                }
              }
            )
          }

        })

      }, containerRef)
      return () => ctx.revert()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [portfolioItems])

  return (
    <div ref={containerRef} className={styles.wrapper}>
      
      {/* 1. Fixed Parallax Hero */}
      <section className={landingStyles.heroSection} style={{ overflow: 'hidden' }}>
        <div className={landingStyles.heroImageWrapper}>
          <img 
            src="/latelier-images/portfolio/IMG_8184.JPG" 
            alt="Luxury Architecture"
            className={landingStyles.infiniteZoomImg}
          />
          {/* Sunny Golden Hour Overlay */}
          <div className={landingStyles.heroOverlay} style={{ zIndex: 1, background: 'linear-gradient(45deg, rgba(255, 195, 113, 0.15) 0%, rgba(255, 229, 180, 0.05) 100%)', mixBlendMode: 'overlay' }}></div>
          <div className={landingStyles.heroOverlay} style={{ zIndex: 2, background: 'radial-gradient(circle at top left, rgba(255, 220, 150, 0.15) 0%, transparent 60%)' }}></div>
        </div>
        
        {/* Ambient White Glow strictly behind the text to ensure absolute legibility of the Navy font */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%', background: 'linear-gradient(to top, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0) 100%)', zIndex: 3 }}></div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '60%', background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)', zIndex: 3 }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', textAlign: 'right', paddingBottom: '4rem' }}>
          <div className="reveal-up">
            <h1 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#1e3a8a', letterSpacing: '0.02em', margin: '0 0 1rem 0' }}>
              <span style={{ fontStyle: 'italic', fontWeight: 300 }}>The</span><br/>
              Portfolio.
            </h1>
          </div>
        </div>
      </section>

      {/* --- CONTENT WRAPPER FOR PARALLAX UNVEIL --- */}
      <div style={{ position: 'relative', zIndex: 5, backgroundColor: '#ffffff' }}>
        <FamilyBanner 
          prefix="OUR" 
          suffix="Masterpieces." 
          content="At MAISON ATELIER, we don't just build houses; we craft bespoke homes tailored to your unique lifestyle. Explore our portfolio to see how our family's dedication to architectural brilliance and refined elegance has transformed visions into stunning realities."
        />
        <div style={{ paddingTop: '4rem' }}>

      {/* Editorial Premium Gallery */}
      <section className={styles.editorialGalleryWrapper} ref={galleryRef}>
        <div className={styles.editorialContainer}>
          {portfolioItems.map((item, i) => (
            <div key={i} className={`${styles.editorialCard} ${styles[`editorialCard${i + 1}`]}`}>
              
              <div className={styles.editorialImageWrapper}>
                <Image src={item.img} alt={item.title} fill className={styles.editorialImage} sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              
              <div className={styles.editorialText}>
                <span className={styles.editorialNumber} style={{ fontWeight: 100 }}>0{i + 1}</span>
                <h3 className={`font-serif ${styles.editorialTitle}`}>{item.title}</h3>
                <p className={styles.editorialLocation} style={{ fontWeight: 100 }}>{item.location}</p>
                <div className={styles.editorialLine}></div>
              </div>

            </div>
          ))}
        </div>
      </section>
        </div>
      </div> {/* END CONTENT WRAPPER */}
    </div>
  )
}
