import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PostHogProvider } from './components/PostHogProvider.jsx'
import CookieConsent from './components/CookieConsent.jsx'

const CONSENT_COOKIE_NAME = 'readreceipts_cookie_consent'

function Root() {
  const [hasConsent, setHasConsent] = useState(null)

  useEffect(() => {
    // Check for existing consent on mount
    const consent = localStorage.getItem(CONSENT_COOKIE_NAME)
    if (consent === 'accepted') {
      setHasConsent(true)
    } else if (consent === 'declined') {
      setHasConsent(false)
    }
  }, [])

  const handleConsentChange = (accepted) => {
    setHasConsent(accepted)
  }

  return (
    <StrictMode>
      <PostHogProvider hasConsent={hasConsent}>
        <App />
        <CookieConsent onConsentChange={handleConsentChange} />
      </PostHogProvider>
    </StrictMode>
  )
}

createRoot(document.getElementById('root')).render(<Root />)
