import React from 'react'
import '../ReadingReceiptGenerator.css'

const PrivacyPolicyPage = ({ onNavigate }) => {
  return (
    <div className="rrg-page">
      <div className="rrg-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <h1 className="rrg-title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          Privacy Policy
        </h1>
        <p className="rrg-subtitle" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          How Read Receipts collects, uses, and protects your data.
        </p>

        <div className="rrg-card" style={{ marginBottom: '1rem' }}>
          <h2>Information We Collect</h2>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li>Uploaded CSV files are processed locally in your browser to generate receipts.</li>
            <li>We do not send your CSV data to our servers.</li>
            <li>Optional input fields (name, dates, ratings) stay in your browser unless you export a receipt.</li>
          </ul>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1rem' }}>
          <h2>How We Use Data</h2>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li>To render a receipt preview in your session.</li>
            <li>To persist your last-used data locally so you don’t have to re-import.</li>
            <li>To generate an exportable PNG of your receipt (performed locally in the browser).</li>
          </ul>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1rem' }}>
          <h2>Local Storage</h2>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            We store your last imported books, username, and shelf counts in your browser’s localStorage. You can clear
            this anytime via your browser settings.
          </p>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1rem' }}>
          <h2>Analytics & Tracking</h2>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            We do not run ads or invasive tracking. If lightweight analytics are added in the future, they will be
            anonymized and disclosed here.
          </p>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1rem' }}>
          <h2>Data Sharing</h2>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            We do not sell or share your uploaded data. Receipts you export are yours to save or share.
          </p>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1.5rem' }}>
          <h2>Your Choices</h2>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li>Clear local data via your browser settings.</li>
            <li>Choose not to upload or enter personal information.</li>
            <li>Contact us at readreceipts@graceraper.com for questions.</li>
          </ul>
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

export default PrivacyPolicyPage
