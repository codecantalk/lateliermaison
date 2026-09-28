'use client'

import React from 'react'

interface FamilyBannerProps {
  prefix: string
  suffix: string
  content: string
}

export default function FamilyBanner({ prefix, suffix, content }: FamilyBannerProps) {
  return (
    <section style={{ padding: '4rem 5%', backgroundColor: '#1e3a8a', color: '#ffffff' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center' }}>
          
          {/* Left: Tiny SVG & Title */}
          <div className="reveal-up" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: '1 1 300px' }}>
            <svg className="intro-svg" width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="#d97706" strokeWidth="2" style={{ flexShrink: 0 }}>
              <rect className="draw-path" pathLength="100" x="10" y="10" width="80" height="80" />
              <path className="draw-path" pathLength="100" d="M50 10 L10 50 L50 90 L90 50 Z" />
              <path className="draw-path" pathLength="100" d="M25 50 V85 H75 V50" />
              <circle className="draw-path" pathLength="100" cx="50" cy="50" r="10" />
            </svg>
            <div>
              <h2 style={{ fontFamily: '"ivyprestige-headline", "Playfair Display", serif', fontSize: '2rem', fontWeight: 400, color: '#ffffff', lineHeight: 1.1, margin: '0 0 0.25rem 0' }}>
                <span style={{ fontStyle: 'italic', color: '#d97706' }}>{prefix}</span> {suffix}
              </h2>
              <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.25rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>by family.</span>
            </div>
          </div>

          {/* Right: Content */}
          <div className="reveal-up" style={{ flex: '2 1 400px' }}>
            <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1rem', fontWeight: 400, lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', margin: 0 }}>
              {content}
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
