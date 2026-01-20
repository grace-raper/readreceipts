import React from 'react'
import '../ReadingReceiptGenerator.css'

const CookiePolicyPage = ({ onNavigate }) => {
  return (
    <div className="rrg-page">
      <div className="rrg-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <h1 className="rrg-title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          Cookie Policy
        </h1>
        <p className="rrg-subtitle" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          How Read Receipts uses cookies and similar technologies.
        </p>

        <div className="rrg-card" style={{ marginBottom: '1rem' }}>
          <h2>What Are Cookies?</h2>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            Cookies are small text files stored on your device by your browser. We use them sparingly to improve your
            experience.
          </p>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1rem' }}>
          <h2>How We Use Cookies</h2>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li>Remember your recent data (books, username, shelf counts) via localStorage and/or cookies.</li>
            <li>Maintain session state while you navigate between pages.</li>
            <li>No third-party advertising cookies are used.</li>
          </ul>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1rem' }}>
          <h2>Managing Cookies</h2>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li>You can clear cookies/localStorage in your browser settings at any time.</li>
            <li>You can block cookies in your browser; core functionality (local data persistence) may be limited.</li>
          </ul>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1.5rem' }}>
          <h2>Changes</h2>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            Updates to this policy will be reflected here. Significant changes will be noted in-app.
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button className="rrg-button secondary" onClick={() => onNavigate?.('welcome')}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookiePolicyPage
