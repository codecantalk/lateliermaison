'use client'

import { useState } from 'react'
import styles from './EstimateCalculator.module.css' // Reusing premium form styles

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here we would typically send the data to a backend or email service
    setSubmitted(true)
  }

  return (
    <div style={{ paddingTop: '150px', paddingBottom: '100px', backgroundColor: 'var(--color-bg)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="font-serif" style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--color-secondary)' }}>Contact Us.</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '3rem', lineHeight: 1.6 }}>
          Request a consultation for luxury home cleaning, bespoke remodeling, or comprehensive property services. 
          Please provide details below so we can best assist you.
        </p>

        {submitted ? (
          <div className={styles.form} style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h2 className="font-serif" style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>Thank You.</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Your request has been received. Our team will contact you shortly to discuss your project.</p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>Full Name *</label>
                <input type="text" className={styles.input} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Phone Number *</label>
                <input type="tel" className={styles.input} required />
              </div>
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>Email Address *</label>
                <input type="email" className={styles.input} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Address / ZIP Code *</label>
                <input type="text" className={styles.input} required />
              </div>
            </div>

            <div className={styles.stepGroup} style={{ marginTop: '1.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Service Needed *</label>
              <select className={styles.input} required style={{ appearance: 'auto' }}>
                <option value="">Select a service...</option>
                <option value="cleaning">Luxury Home Cleaning</option>
                <option value="remodeling">Home Remodeling</option>
                <option value="painting">Painting</option>
                <option value="tv-mounting">TV Mounting</option>
                <option value="flooring">Flooring</option>
                <option value="estate">Estate / Property Care</option>
                <option value="other">Other Home Services</option>
              </select>
            </div>

            <div className={styles.inputRow} style={{ marginTop: '1.5rem' }}>
              <div className={styles.inputGroup}>
                <label>Estimated Budget</label>
                <select className={styles.input} style={{ appearance: 'auto' }}>
                  <option value="">Select budget range...</option>
                  <option value="under-1k">Under $1,000</option>
                  <option value="1k-5k">$1,000 - $5,000</option>
                  <option value="5k-20k">$5,000 - $20,000</option>
                  <option value="20k+">$20,000+</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Expected Timeline</label>
                <select className={styles.input} style={{ appearance: 'auto' }}>
                  <option value="">Select timeline...</option>
                  <option value="asap">As soon as possible</option>
                  <option value="1-month">Within 1 month</option>
                  <option value="3-months">Within 3 months</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div className={styles.stepGroup} style={{ marginTop: '1.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Project Details *</label>
              <textarea className={styles.input} rows={4} required placeholder="Please describe what you need help with..." style={{ resize: 'vertical' }}></textarea>
            </div>

            <div className={styles.stepGroup} style={{ marginTop: '1.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Upload Photos (Optional)</label>
              <input type="file" className={styles.input} multiple accept="image/*" style={{ padding: '9px 16px', background: 'transparent' }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Upload pictures of the space or issues you want addressed.</p>
            </div>

            <button type="submit" className={`btn btn-primary ${styles.fullWidthBtn}`} style={{ marginTop: '2rem', padding: '16px', fontSize: '1.1rem' }}>
              Submit Request
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
