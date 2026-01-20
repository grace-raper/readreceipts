import React from 'react'
import Receipt from '../components/Receipt'
import sampleBooks from '../sampleBooks'
import '../ReadingReceiptGenerator.css'

const WelcomePage = ({ onNavigate }) => {
  return (
    <div className="rrg-page">
      <div className="rrg-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 3.5rem)', gap: '0.75rem' }}>
        <h1 className="rrg-title">Read Receipts</h1>
        <p className="rrg-subtitle" style={{ maxWidth: '780px', margin: '0 auto 1rem' }}>
          Turn your reading history into a vintage-styled receipt. Try the sample, then import your own.
        </p>

        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Receipt books={sampleBooks} username="BOOKWORM" period="all" />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
          <button className="rrg-button secondary" style={{ width: '220px' }} onClick={() => onNavigate('goodreads')}>
            Import from Goodreads
          </button>
          <button className="rrg-button" style={{ width: '220px', opacity: 0.5 }} disabled>
            Import from StoryGraph (soon)
          </button>
          <button className="rrg-button" style={{ width: '220px', opacity: 0.5 }} disabled>
            Manual import (soon)
          </button>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage
