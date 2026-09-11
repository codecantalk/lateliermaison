'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './LandingPage.module.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const slides = [
  { img: '/award-bg.jpg', title: 'Architectural transformation.', subtitle: 'Spa-like sanctuaries built entirely around you.' },
  { img: '/luxury-hero.jpg', title: 'Ground-up architecture.', subtitle: 'We bring your vision to life with uncompromising quality.' },
  { img: '/luxury-bathroom.jpg', title: 'Uncompromising perfection.', subtitle: 'Every detail meticulously curated and restored.' }
]

const services = [
  { title: 'Housekeeping', desc: 'Meticulous attention to detail for a pristine living space.', img: '/award-bg.jpg' },
  { title: 'Recurring Cleanings', desc: 'Book weekly, bi-weekly, or monthly for a flawless sanctuary.', img: '/luxury-hero.jpg' },
  { title: 'Moving Cleaning', desc: 'Pre- and post-move deep cleaning by our artisans.', img: '/luxury-bathroom.jpg' },
  { title: 'One-Time Reset', desc: 'Seeking a seasonal reset? Restored to absolute peak condition.', img: '/award-bg.jpg' }
]

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Hero Slider State
  const [currentSlide, setCurrentSlide] = useState(0)
  const slideRef = useRef<HTMLDivElement>(null)
  
  // Before/After Slider State
  const [wipeValue, setWipeValue] = useState(50)

  useEffect(() => {
    // Hero Slider Auto-Advance
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Animate Hero Text on slide change
    if (slideRef.current) {
      gsap.fromTo(slideRef.current.querySelectorAll('.hero-anim'), 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: 'power3.out' }
      )
      gsap.fromTo('.hero-bg-zoom',
        { scale: 1.1 },
        { scale: 1, duration: 6, ease: 'none' }
      )
    }
  }, [currentSlide])

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. Process Timeline SVG Animation
      const processPath = document.querySelector('.process-path') as SVGPathElement
      if (processPath) {
        const length = processPath.getTotalLength()
        gsap.set(processPath, { strokeDasharray: length, strokeDashoffset: length })
        gsap.to(processPath, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.process-section',
            start: 'top center',
            end: 'bottom center',
            scrub: true
          }
        })
      }

      // 1b. Animate the individual SVG icons when they scroll into view
      gsap.utils.toArray('.processStep').forEach((step: any) => {
        const paths = step.querySelectorAll('.icon-anim-path');
        paths.forEach((p: SVGPathElement) => {
          const l = p.getTotalLength();
          gsap.set(p, { strokeDasharray: l, strokeDashoffset: l });
          gsap.to(p, {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: step,
              start: 'top 80%'
            }
          });
        });
      });

      // Modern SVG 3D Wireframe Sphere Animation
      gsap.to('.modern-wireframe', {
        rotation: 360,
        transformOrigin: '500px 500px',
        duration: 90,
        repeat: -1,
        ease: 'linear'
      });
      
      Array.from({ length: 18 }).forEach((_, i) => {
        gsap.fromTo(`.wire-circle-${i}`, 
          { scaleY: 0.02 },
          {
            scaleY: 1,
            transformOrigin: '500px 500px',
            duration: 8,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.4
          }
        );
      });

      // 3. True Parallax for Banners
      gsap.utils.toArray('.parallax-img').forEach((elem: any) => {
        gsap.to(elem, {
          yPercent: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: elem.parentElement.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        })
      })

      // 4. Elegant Text & Image Reveals
      gsap.utils.toArray('.reveal-up').forEach((elem: any) => {
        gsap.from(elem, {
          y: 40,
          opacity: 0,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: elem,
            start: 'top 85%'
          }
        })
      })

      // 5. Floating Parallax for Uncompromising Standards Cards
      gsap.utils.toArray('.standards-card-anim').forEach((card: any, i: number) => {
        gsap.to(card, {
          y: -120 * (i + 1), // Each card moves up further/faster
          ease: 'none',
          scrollTrigger: {
            trigger: '.standards-section-anim',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        })
      })

      // 6. Dynamic Background Color Change on Scroll for Standards Section
      gsap.to('.standards-scroll-gradient', {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.standards-section-anim',
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: true
        }
      })

    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className={styles.wrapper}>
      
      {/* 1. GSAP Animated Hero Slider */}
      <section className={styles.heroSection}>
        {slides.map((slide, idx) => (
          <div 
            key={idx} 
            className={`${styles.heroSlide} ${idx === currentSlide ? styles.heroSlideActive : ''}`}
          >
            <div className={styles.heroImageWrapper}>
              <Image 
                src={slide.img} 
                alt="Luxury Background" 
                fill 
                className={`hero-bg-zoom ${styles.objectCover}`} 
                priority={idx === 0}
              />
              <div className={styles.heroOverlay}></div>
            </div>
          </div>
        ))}
        
        <div className={`container ${styles.heroContent}`} ref={slideRef}>
          <div className={styles.heroTextContainer}>
            <h4 className={`hero-anim ${styles.heroEyebrow}`} style={{ color: '#8A9CFF', textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '1.5rem', textShadow: '0 2px 15px rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ width: '40px', height: '2px', backgroundColor: '#8A9CFF', boxShadow: '0 2px 10px rgba(0,0,0,0.5)' }}></span>
              L'Atelier Maison
            </h4>
            <h1 className="hero-anim font-serif" style={{ marginBottom: '1rem', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>{slides[currentSlide].title}</h1>
            <p className={`hero-anim ${styles.heroSubtitle}`} style={{ fontSize: '1.25rem', marginBottom: '2rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{slides[currentSlide].subtitle}</p>
            <div className={`hero-anim ${styles.heroActions}`}>
              <Link href="/services" className="btn btn-primary" style={{ marginRight: '1rem' }}>Our Services</Link>
              <Link href="/portfolio" className="btn btn-secondary">View Portfolio</Link>
            </div>
          </div>
          
          <div className={styles.sliderDots}>
            {slides.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentSlide(idx)}
                className={`${styles.dot} ${idx === currentSlide ? styles.dotActive : ''}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. New Section: The L'Atelier Process (SVG Timeline) */}
      <section className={`process-section ${styles.processSection}`}>
        {/* Subtle Background Geometric Tile Animation */}
        <div className={styles.bgSvgWrapper}>
          <svg className="bg-anim-svg" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <defs>
              <radialGradient id="sphere-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#sphere-glow)" />
            <g className="modern-wireframe" stroke="var(--color-primary)" fill="none" strokeWidth="1" opacity="0.3">
              {Array.from({ length: 18 }).map((_, i) => (
                <g key={i} transform={`rotate(${i * 10} 500 500)`}>
                  <circle className={`wire-circle-${i}`} cx="500" cy="500" r="350" />
                </g>
              ))}
            </g>
          </svg>
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="reveal-up" style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)', maxWidth: '600px', margin: '0 auto var(--spacing-xl)' }}>
            <h4 className={styles.sectionEyebrow} style={{ color: 'var(--color-primary)' }}>Our Methodology</h4>
            <h2 className="font-serif" style={{ color: 'var(--color-text-inverse)' }}>The L'Atelier <span className="font-italic" style={{ color: 'var(--color-primary)' }}>Process</span></h2>
          </div>
          
          <div className={styles.processContainer}>
            <div className={styles.processLineWrapper}>
              <svg viewBox="0 0 10 600" className={styles.processSvg}>
                <line x1="5" y1="0" x2="5" y2="600" stroke="var(--color-border)" strokeWidth="2" />
                <line className="process-path" x1="5" y1="0" x2="5" y2="600" stroke="var(--color-primary)" strokeWidth="4" />
              </svg>
            </div>

            <div className={styles.processSteps}>
              <div className={`processStep reveal-up ${styles.processStep}`}>
                <div className={styles.stepIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle className="icon-anim-path" cx="12" cy="12" r="10"/><path className="icon-anim-path" d="M12 8v4l3 3"/></svg>
                </div>
                <div className={styles.stepContent}>
                  <h3 className="font-serif">01. Consultation</h3>
                  <p>A meticulous walk-through of your sanctuary to understand your exact requirements, materials, and preferences.</p>
                </div>
              </div>
              <div className={`processStep reveal-up ${styles.processStep}`}>
                <div className={styles.stepIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path className="icon-anim-path" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <div className={styles.stepContent}>
                  <h3 className="font-serif">02. Execution</h3>
                  <p>Our artisans deploy using industry-leading techniques and premium products tailored specifically to your home.</p>
                </div>
              </div>
              <div className={`processStep reveal-up ${styles.processStep}`}>
                <div className={styles.stepIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path className="icon-anim-path" d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline className="icon-anim-path" points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div className={styles.stepContent}>
                  <h3 className="font-serif">03. Perfection</h3>
                  <p>A rigorous final inspection ensures the L'Atelier standard is met, leaving behind nothing but absolute tranquility.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. New Section: Before & After Wipe Slider */}
      <section className={styles.wipeSection}>
        <div className="container">
          <div className="reveal-up" style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
            <h4 className={styles.sectionEyebrow}>The Transformation</h4>
            <h2 className="font-serif">A Masterpiece <span className="font-italic" style={{ color: 'var(--color-primary)' }}>Revealed</span></h2>
            <p>Drag the slider to see the standard of a L'Atelier home.</p>
          </div>
        </div>
        
        <div className={`reveal-up ${styles.wipeContainer}`}>
          {/* Before Image */}
          <Image src="/award-bg.jpg" alt="Before Cleaning" fill className={styles.objectCover} />
          
          {/* After Image (Clipped) */}
          <div className={styles.wipeAfter} style={{ clipPath: `inset(0 ${100 - wipeValue}% 0 0)` }}>
            <Image src="/luxury-bathroom.jpg" alt="After Cleaning" fill className={styles.objectCover} />
          </div>
          
          {/* Slider Handle */}
          <div className={styles.wipeHandleLine} style={{ left: `${wipeValue}%` }}>
            <div className={styles.wipeHandleBtn}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </div>
          </div>
          
          {/* Hidden Range Input for Interaction */}
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={wipeValue} 
            onChange={(e) => setWipeValue(Number(e.target.value))} 
            className={styles.wipeInput} 
          />
        </div>
      </section>

      {/* 3.5 New Section: Uncompromising Standards */}
      <section className={`standards-section-anim ${styles.standardsSection}`}>
        {/* Dynamic Gradient Overlay that fades in on scroll */}
        <div className="standards-scroll-gradient" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(250,246,240,0.4) 100%)', zIndex: 1, opacity: 0, pointerEvents: 'none' }}></div>
        <div className={styles.bgSvgWrapper} style={{ zIndex: 0 }}>
          <svg className="bg-anim-svg" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <rect width="100%" height="100%" fill="url(#sphere-glow)" />
            <g className="modern-wireframe" stroke="var(--color-primary)" fill="none" strokeWidth="1" opacity="0.3">
              {Array.from({ length: 18 }).map((_, i) => (
                <g key={i} transform={`rotate(${i * 10} 500 500)`}>
                  <circle className={`wire-circle-${i}`} cx="500" cy="500" r="350" />
                </g>
              ))}
            </g>
          </svg>
        </div>
        <div className={`container ${styles.standardsContent}`}>
          <div className={styles.standardsGrid}>
            <div className={`reveal-up ${styles.standardsHeader}`}>
              <h4 className={styles.sectionEyebrow} style={{ color: 'var(--color-primary)' }}>Our Promise</h4>
              <h2 className="font-serif">Uncompromising <br/><span className="font-italic" style={{ color: 'var(--color-primary)' }}>Standards</span></h2>
              <p>We do not clean homes; we curate sanctuaries. Every element of our service is designed to provide absolute peace of mind for the most discerning clientele.</p>
            </div>
            
            <div className={`standards-card-anim ${styles.standardsCard}`}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <h3 className="font-serif">Vetted Artisans</h3>
              <p>Our professionals undergo rigorous background checks, extensive training, and absolute NDA agreements to ensure your privacy and security.</p>
            </div>
            
            <div className={`standards-card-anim ${styles.standardsCard}`}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
              <h3 className="font-serif">Eco-Formulations</h3>
              <p>We utilize exclusively non-toxic, sustainable, and highly effective premium cleaning formulations that are perfectly safe for your family, pets, and delicate materials.</p>
            </div>

            <div className={`standards-card-anim ${styles.standardsCard}`}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <h3 className="font-serif">Absolute Discretion</h3>
              <p>We respect the sanctity of your home. We operate invisibly, efficiently, and with the utmost confidentiality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MaidBright Award Section (Restyled) */}
      <section className={styles.awardSection}>
        <div className="container">
          <div className={styles.awardGrid}>
            <div className={styles.awardImageContainer}>
              <Image src="/luxury-hero.jpg" alt="Immaculate Living Room" fill className={`reveal-up ${styles.objectCover}`} />
            </div>
            <div className={styles.awardText}>
              <h4 className={styles.sectionEyebrow}>Recognition</h4>
              <h2 className="reveal-up font-serif">Award Winning <span className="font-italic" style={{ color: 'var(--color-primary)' }}>Service</span></h2>
              <p className="reveal-up">
                Services to write home about. Recognized by top consumer organizations, including Yelp, Angie's List, and Consumer's Checkbook, our track record makes us confident in our quality-assured services.
              </p>
              
              <div className={`reveal-up ${styles.badges}`}>
                <div className={styles.badge}>Yelp Certified</div>
                <div className={styles.badge}>Angi 2024</div>
                <div className={styles.badge}>Best of Atlanta</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MaidBright Services Grid (Restyled) */}
      <section className={styles.servicesSection}>
        <div className="container">
          <div className="reveal-up" style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
            <h2 className="font-serif">Our <span className="font-italic" style={{ color: 'var(--color-primary)' }}>Expertise</span></h2>
          </div>
          
          <div className={styles.servicesGrid}>
            {services.map((svc, i) => (
              <Link href="/services" key={i} className={`reveal-up ${styles.serviceCard}`}>
                <div className={styles.serviceImageWrapper}>
                  <Image src={svc.img} alt={svc.title} fill className={styles.objectCover} />
                  <div className={styles.serviceOverlay}></div>
                </div>
                <div className={styles.serviceContent}>
                  <h3 className="font-serif">{svc.title}</h3>
                  <p>{svc.desc}</p>
                  <span className={styles.serviceLink}>Explore Service ⟶</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. MaidBright VIP Consultation Banner */}
      <section className={`consult-section ${styles.consultSection}`}>
        <div className={styles.parallaxBg}>
          <div className={`parallax-img ${styles.imageWrapper}`}>
            <Image src="/luxury-bathroom.jpg" alt="Luxury Bathroom" fill className={styles.objectCover} />
            <div className={styles.overlayEspressoHalf}></div>
          </div>
        </div>
        
        <div className="container">
          <div className={`reveal-up ${styles.consultCard}`}>
            <h2 className="font-serif">Free In-Home <span className="font-italic" style={{ color: 'var(--color-primary)' }}>Consultation</span></h2>
            <p>
              L'Atelier Maison offers free in-home consultations for those interested in recurring cleanings. You can also book your cleaning directly online if you are looking for an initial deep clean or moving transitions.
            </p>
            <Link href="/estimate" className="btn btn-secondary">Book My First Cleaning</Link>
          </div>
        </div>
      </section>

    </div>
  )
}
