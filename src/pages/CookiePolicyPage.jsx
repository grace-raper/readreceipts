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
          Last updated: January 20, 2026
        </p>

        <div className="rrg-card" style={{ marginBottom: '1rem' }}>
          <h2>What Are Cookies?</h2>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            Cookies are small text files stored on your device by your web browser. They help websites remember information about your visit, making your experience more convenient and personalized. Read Receipts uses cookies and similar technologies (like localStorage) responsibly and transparently.
          </p>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1rem' }}>
          <h2>Types of Cookies & Storage We Use</h2>
          
          <h3 style={{ fontSize: '1rem', marginTop: '0.75rem', marginBottom: '0.5rem' }}>1. Essential Storage (Always Active)</h3>
          <p style={{ margin: '0.5rem 0', lineHeight: 1.6 }}>
            <strong>localStorage - Reading Data:</strong>
          </p>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li><strong>Purpose:</strong> Stores your imported books, username, shelf counts, and receipt customization settings</li>
            <li><strong>Data Stored:</strong> Book titles, authors, pages, ratings, dates, username, template preferences</li>
            <li><strong>Duration:</strong> Persists until you manually clear browser data</li>
            <li><strong>Why Essential:</strong> Allows you to return to the app without re-importing your data</li>
            <li><strong>Privacy:</strong> This data never leaves your device and is not sent to any server</li>
          </ul>

          <h3 style={{ fontSize: '1rem', marginTop: '0.75rem', marginBottom: '0.5rem' }}>2. Analytics Cookies (Requires Consent)</h3>
          <p style={{ margin: '0.5rem 0', lineHeight: 1.6 }}>
            <strong>PostHog Analytics Cookies:</strong>
          </p>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li><strong>Cookie Names:</strong> ph_* (e.g., ph_phc_*, ph_session_id)</li>
            <li><strong>Purpose:</strong> Track user interactions, page views, feature usage, and session recordings</li>
            <li><strong>Data Collected:</strong> Anonymous user ID, session ID, page views, button clicks, browser info, device type</li>
            <li><strong>Duration:</strong> Session cookies (deleted when browser closes) and persistent cookies (up to 1 year)</li>
            <li><strong>Third Party:</strong> PostHog (app.posthog.com)</li>
            <li><strong>Privacy:</strong> Does NOT collect book titles, authors, ratings, or any reading history</li>
          </ul>

          <h3 style={{ fontSize: '1rem', marginTop: '0.75rem', marginBottom: '0.5rem' }}>3. Consent Cookie (Always Active)</h3>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li><strong>Cookie Name:</strong> readreceipts_cookie_consent</li>
            <li><strong>Purpose:</strong> Remembers your cookie consent preferences</li>
            <li><strong>Duration:</strong> 1 year</li>
            <li><strong>Why Essential:</strong> Prevents the cookie banner from appearing on every visit</li>
          </ul>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1rem' }}>
          <h2>How We Use Cookies</h2>
          
          <h3 style={{ fontSize: '1rem', marginTop: '0.75rem', marginBottom: '0.5rem' }}>Essential Functions</h3>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li>Save your imported reading data locally so you don't need to re-upload</li>
            <li>Remember your receipt customization preferences (template, settings, year/month selections)</li>
            <li>Maintain your username and shelf organization</li>
          </ul>

          <h3 style={{ fontSize: '1rem', marginTop: '0.75rem', marginBottom: '0.5rem' }}>Analytics (With Your Consent)</h3>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li>Understand which receipt templates are most popular</li>
            <li>Identify which features users find valuable</li>
            <li>Track user journeys to improve the experience</li>
            <li>Record anonymized sessions to identify bugs and usability issues</li>
            <li>Make data-driven decisions about future features</li>
          </ul>

          <p style={{ margin: '0.75rem 0 0', lineHeight: 1.6 }}>
            <strong>Important:</strong> We do NOT use cookies for advertising, tracking across websites, or selling your data.
          </p>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1rem' }}>
          <h2>Your Cookie Choices</h2>
          
          <h3 style={{ fontSize: '1rem', marginTop: '0.75rem', marginBottom: '0.5rem' }}>Accept or Decline Analytics</h3>
          <p style={{ margin: '0.5rem 0', lineHeight: 1.6 }}>
            When you first visit Read Receipts, you'll see a cookie consent banner. You can:
          </p>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li><strong>Accept:</strong> Allow analytics cookies to help us improve the app</li>
            <li><strong>Decline:</strong> Use the app without analytics tracking (essential localStorage still works)</li>
            <li><strong>Change Later:</strong> Revoke or grant consent at any time by clearing cookies and refreshing</li>
          </ul>

          <h3 style={{ fontSize: '1rem', marginTop: '0.75rem', marginBottom: '0.5rem' }}>Browser Settings</h3>
          <p style={{ margin: '0.5rem 0', lineHeight: 1.6 }}>
            You can also manage cookies through your browser settings:
          </p>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
            <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
            <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
          </ul>
          <p style={{ margin: '0.75rem 0 0', lineHeight: 1.6 }}>
            <strong>Note:</strong> Blocking all cookies or clearing localStorage will remove your saved reading data and require you to re-import.
          </p>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1rem' }}>
          <h2>Third-Party Cookies</h2>
          <p style={{ margin: '0 0 0.5rem', lineHeight: 1.6 }}>
            Read Receipts uses PostHog for analytics. PostHog may set cookies to track sessions and user behavior. PostHog's cookies are only set if you consent to analytics.
          </p>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li><strong>PostHog Privacy Policy:</strong> <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#d97706' }}>posthog.com/privacy</a></li>
            <li><strong>PostHog Cookie Policy:</strong> <a href="https://posthog.com/docs/privacy/cookies" target="_blank" rel="noopener noreferrer" style={{ color: '#d97706' }}>posthog.com/docs/privacy/cookies</a></li>
          </ul>
          <p style={{ margin: '0.75rem 0 0', lineHeight: 1.6 }}>
            We do not use any advertising networks, social media tracking pixels, or other third-party cookies beyond PostHog analytics.
          </p>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1rem' }}>
          <h2>Do Not Track</h2>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            Read Receipts respects browser "Do Not Track" (DNT) signals. If your browser sends a DNT signal, we will not initialize analytics tracking, even if you previously consented.
          </p>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1.5rem' }}>
          <h2>Updates to This Policy</h2>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            We may update this cookie policy to reflect changes in our practices or for legal reasons. The "Last updated" date at the top indicates when changes were made. Significant updates will be communicated through the website.
          </p>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1.5rem' }}>
          <h2>Questions?</h2>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            If you have questions about our use of cookies, please contact us at <strong>readreceipts@graceraper.com</strong> or review our <button onClick={() => onNavigate?.('privacy')} style={{ background: 'none', border: 'none', color: '#d97706', textDecoration: 'underline', cursor: 'pointer', padding: 0, font: 'inherit' }}>Privacy Policy</button>.
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
