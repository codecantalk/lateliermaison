'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap/dist/gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import styles from './Footer.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [settings, setSettings] = useState<any>({
    email: 'support@lateliermaison.com',
    phone: '334-487-5707',
    address: 'Buckhead, Atlanta GA',
    availability: 'Serving Atlanta & DMV Area'
  });
  
  const supabase = createClient();

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'contact_info').single();
      if (data) setSettings(data.value);
    }
    fetchSettings();

    const ctx = gsap.context(() => {
      // 1. Base Reveal on Scroll
      gsap.fromTo('.footer-watermark-letter', 
        { 
          y: 100, 
          rotationX: -90,
          opacity: 0,
        },
        {
          y: 0,
          rotationX: 0,
          opacity: 0.15,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 60%',
            end: 'bottom bottom',
            scrub: 1
          }
        }
      );

      // 2. Infinite Light Sweep Effect (adjusted for light theme)
      gsap.to('.footer-watermark-letter', {
        color: '#4169E1', // Royal blue highlight instead of white
        textShadow: '0px 0px 25px rgba(65, 105, 225, 0.4)',
        duration: 2,
        stagger: {
          each: 0.15,
          repeat: -1,
          yoyo: true
        },
        ease: 'sine.inOut'
      });
      
    }, footerRef);

    return () => ctx.revert();
  }, []);

  // Refresh ScrollTrigger when the route changes because the page height changes
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <footer ref={footerRef} className={`footer-bg-color-anim ${styles.footer}`}>
      <div className={`container ${styles.footerContent}`}>
        <div className={styles.mainGrid}>
          
          {/* Column 1: Brand & Manifesto */}
          <div className={styles.footerCol}>
            <div className={styles.manifesto}>
              <div style={{ marginBottom: '1.5rem' }}>
                <Image src="/logo.png" alt="L'Atelier Maison Logo" width={80} height={80} style={{ objectFit: 'contain' }} />
              </div>
              <h3 className="font-serif">Curated sanctuaries.</h3>
              <p>Elevating the standard of living for the most discerning clientele. We preserve the integrity and beauty of your most valuable asset.</p>
            </div>
            <div className={styles.socials} style={{ marginTop: '2.5rem' }}>
              <a href="https://www.instagram.com/lateliermaison" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://www.pinterest.com/lateliermaison" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="22" x2="12" y2="10"/><path d="M12 10a4 4 0 1 0-4-4 4 4 0 0 0 4 4z"/><path d="M8 14H4a2 2 0 0 0-2 2v6"/><path d="M22 14h-4a2 2 0 0 0-2 2v6"/></svg>
              </a>
              <a href="https://www.facebook.com/lateliermaison" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Locations */}
          <div className={styles.footerCol}>
            <div className={styles.navGrid}>
              <div className={styles.linkGroup}>
                <h4 className={styles.colTitle}>Atlanta</h4>
                <ul className={styles.contactList}>
                  <li><p style={{ margin: 0 }}>Cumberland Blvd SE<br/>Vinings, GA -- 30339</p></li>
                  <li><a href="tel:3344875707">334-487-5707</a></li>
                  <li><a href="mailto:support@lateliermaison.com" style={{ fontSize: '0.85rem' }}>support@lateliermaison.com</a></li>
                </ul>
              </div>
              <div className={styles.linkGroup}>
                <h4 className={styles.colTitle}>DMV Area</h4>
                <ul className={styles.contactList}>
                  <li><p style={{ margin: 0 }}>4600 Powder Mill Rd<br/>Beltsville, MD 20705<br/>United States</p></li>
                  <li><a href="mailto:support@lateliermaison.com" style={{ fontSize: '0.85rem' }}>support@lateliermaison.com</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Column 3: Locations & Hours */}
          <div className={styles.footerCol}>
            <div className={styles.navGrid}>
              <div className={styles.linkGroup}>

                <h4 className={styles.colTitle}>Hours</h4>
                <ul className={styles.contactList}>
                  <li><p style={{ margin: 0, fontWeight: 500 }}>Monday — Saturday</p></li>
                  <li><p style={{ margin: 0 }}>8am — 6pm</p></li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Massive Brand Watermark at Bottom */}
      <div className={styles.watermarkContainer}>
        {"L'ATELIER MAISON".split('').map((char, index) => (
          <span key={index} className={`footer-watermark-letter ${styles.watermarkLetter}`}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>

      <div className={styles.footerBottom}>
        <div className={`container ${styles.footerBottomInner}`}>
          <p>Copyright 2026 &copy; MAISON. All Rights Reserved.</p>
          <div className={styles.legalLinks}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
