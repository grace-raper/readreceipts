import React, { useState, useEffect } from 'react'
import { Cookie, X } from 'lucide-react'
import './CookieConsent.css'

const CONSENT_COOKIE_NAME = 'readreceipts_cookie_consent'
const CONSENT_EXPIRY_DAYS = 365

const CookieConsent = ({ onConsentChange }) => {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = getCookieConsent()
    if (consent === null) {
      // No consent recorded, show banner
      setShowBanner(true)
    } else {
      // User has already consented or declined
      onConsentChange?.(consent)
    }
  }, [onConsentChange])

  const getCookieConsent = () => {
    const consent = localStorage.getItem(CONSENT_COOKIE_NAME)
    if (consent === 'accepted') return true
    if (consent === 'declined') return false
    return null
  }

  const setConsent = (accepted) => {
    const value = accepted ? 'accepted' : 'declined'
    localStorage.setItem(CONSENT_COOKIE_NAME, value)
    
    // Also set as a cookie for compatibility
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + CONSENT_EXPIRY_DAYS)
    document.cookie = `${CONSENT_COOKIE_NAME}=${value}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`
    
    setShowBanner(false)
    onConsentChange?.(accepted)
  }

  const handleAccept = () => {
    setConsent(true)
  }

  const handleDecline = () => {
    setConsent(false)
  }

  if (!showBanner) return null

  return (
    <div className="cookie-consent-overlay">
      <div className="cookie-consent-banner">
        <button 
          className="cookie-consent-close" 
          onClick={handleDecline}
          aria-label="Close banner"
        >
          <X size={20} />
        </button>
        
        <div className="cookie-consent-content">
          <div className="cookie-consent-icon">
            <Cookie size={24} />
          </div>
          
          <div className="cookie-consent-text">
            <h3>We value your privacy</h3>
            <p>
              Read Receipts uses cookies and session recording to improve your experience and understand how you use our app. 
              Your reading data stays in your browser and is never sent to our servers. Session recordings help us fix bugs and improve usability, and are automatically deleted after 90 days.
              <a href="/cookies" target="_blank" rel="noopener noreferrer">Learn more</a>
            </p>
          </div>
        </div>

        <div className="cookie-consent-actions">
          <button 
            className="cookie-consent-button secondary" 
            onClick={handleDecline}
          >
            Decline
          </button>
          <button 
            className="cookie-consent-button primary" 
            onClick={handleAccept}
          >
            Accept Cookies
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookieConsent
