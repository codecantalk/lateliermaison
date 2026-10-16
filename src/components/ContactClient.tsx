'use client'

import { useState, useRef } from 'react'
import styles from './EstimateCalculator.module.css' // Reusing premium form styles
import { createClient } from '@/lib/supabase/client'

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [fileNames, setFileNames] = useState<string[]>([])
  const formRef = useRef<HTMLFormElement>(null)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    
    try {
      if (!formRef.current) return;
      const formData = new FormData(formRef.current)
      
      const fileInput = formRef.current.querySelector('input[type="file"]') as HTMLInputElement
      const files = fileInput?.files
      
      let imageUrls: string[] = []
      
      // Upload Images
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          const fileExt = file.name.split('.').pop()
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
          const filePath = `contacts/${fileName}`

          const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file)
            
          if (uploadError) {
            console.error('Upload error:', uploadError)
            throw new Error(`Upload failed: ${uploadError.message || 'Check storage configuration and policies.'}`)
          }
          
          const { data } = supabase.storage.from('images').getPublicUrl(filePath)
          imageUrls.push(data.publicUrl)
        }
      }

      // Submit to backend API which saves to DB and sends real-time emails
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.get('full_name'),
          phone: formData.get('phone'),
          email: formData.get('email'),
          address: formData.get('address'),
          service: formData.get('service'),
          budget: formData.get('budget'),
          timeline: formData.get('timeline'),
          details: formData.get('details'),
          imageUrls: imageUrls,
        }),
      })

      const resData = await response.json()
      if (!response.ok) {
        throw new Error(resData.error || 'Failed to submit contact request.')
      }

      setSubmitted(true)
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred.')
    } finally {
      setLoading(false)
    }
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
          <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
            {errorMsg && (
              <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                {errorMsg}
              </div>
            )}
            
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>Full Name *</label>
                <input name="full_name" type="text" className={styles.input} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Phone Number *</label>
                <input name="phone" type="tel" className={styles.input} required />
              </div>
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>Email Address *</label>
                <input name="email" type="email" className={styles.input} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Address / ZIP Code *</label>
                <input name="address" type="text" className={styles.input} required />
              </div>
            </div>

            <div className={styles.stepGroup} style={{ marginTop: '1.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Service Needed *</label>
              <select name="service" className={styles.input} required style={{ appearance: 'auto' }}>
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
                <select name="budget" className={styles.input} style={{ appearance: 'auto' }}>
                  <option value="">Select budget range...</option>
                  <option value="under-1k">Under $1,000</option>
                  <option value="1k-5k">$1,000 - $5,000</option>
                  <option value="5k-20k">$5,000 - $20,000</option>
                  <option value="20k+">$20,000+</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Expected Timeline</label>
                <select name="timeline" className={styles.input} style={{ appearance: 'auto' }}>
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
              <textarea name="details" className={styles.input} rows={4} required placeholder="Please describe what you need help with..." style={{ resize: 'vertical' }}></textarea>
            </div>

            <div className={styles.stepGroup} style={{ marginTop: '1.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Upload Photos (Optional)</label>
              
              <div style={{ position: 'relative' }}>
                <input 
                  id="photo-upload"
                  name="photos" 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }} 
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    setFileNames(files.map(f => f.name))
                  }}
                />
                <label 
                  htmlFor="photo-upload" 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '0.5rem', 
                    padding: '0.75rem 1.5rem', 
                    backgroundColor: '#f8fafc', 
                    border: '1px dashed #cbd5e1', 
                    borderRadius: '4px', 
                    cursor: 'pointer',
                    color: 'var(--color-primary)',
                    fontWeight: 500,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Choose Files
                </label>
              </div>

              {fileNames.length > 0 && (
                <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {fileNames.map((name, idx) => (
                    <span key={idx} style={{ background: '#e2e8f0', color: '#475569', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                      {name}
                    </span>
                  ))}
                </div>
              )}
              
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Upload pictures of the space or issues you want addressed.</p>
            </div>

            <button type="submit" className={`btn btn-primary ${styles.fullWidthBtn}`} style={{ marginTop: '2rem', padding: '16px', fontSize: '1.1rem' }} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
