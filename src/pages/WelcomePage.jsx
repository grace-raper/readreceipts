import React from 'react'
import DefaultReceipt from '../components/templates/DefaultReceipt'
import sampleBooks from '../sampleBooks'
import '../ReadingReceiptGenerator.css'
import { trackEvent } from '../components/PostHogProvider'

const WelcomePage = ({ onNavigate }) => {
  const handleImportClick = (source) => {
    trackEvent('import_button_clicked', {
      source,
      page: 'welcome'
    })
    onNavigate('goodreads')
  }
  // Helper functions for sample receipt
  const renderStars = (rating) => {
    if (!rating) return ''
    return `${Math.round(rating)}/5`
  }

  const formatPrice = (pages) => {
    const dollars = Math.floor(pages / 100)
    const cents = pages % 100
    return `$${dollars}.${cents.toString().padStart(2, '0')}`
  }

  const getPeriodLabel = () => 'ALL TIME'

  const calculateStats = () => {
    const totalPages = sampleBooks.reduce((sum, book) => sum + (book.pages || 0), 0)
    const totalMinutes = totalPages
    const totalHours = Math.round(totalMinutes / 60)
    const booksWithRatings = sampleBooks.filter((b) => b.rating > 0)
    const avgRating =
      booksWithRatings.length > 0
        ? (booksWithRatings.reduce((sum, b) => sum + b.rating, 0) / booksWithRatings.length).toFixed(1)
        : 0

    return {
      totalBooks: sampleBooks.length,
      totalPages,
      totalHours,
      avgRating,
    }
  }

  const stats = calculateStats()
  const displayBooks = sampleBooks.slice(0, 10)
  const orderId = '1234'
  const today = new Date()
    .toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    .toUpperCase()

  const code39 = {
    '0': 'nnnwwnwnn', '1': 'wnnwnnnnw', '2': 'nnwwnnnnw', '3': 'wnwwnnnnn',
    '4': 'nnnwwnnnw', '5': 'wnnwwnnnn', '6': 'nnwwwnnnn', '7': 'nnnwnnwnw',
    '8': 'wnnwnnwnn', '9': 'nnwwnnwnn', A: 'wnnnnwnnw', B: 'nnwnnwnnw',
    C: 'wnwnnwnnn', D: 'nnnnwwnnw', E: 'wnnnwwnnn', F: 'nnwnwwnnn',
    G: 'nnnnnwwnw', H: 'wnnnnwwnn', I: 'nnwnnwwnn', J: 'nnnnwwwnn',
    K: 'wnnnnnnww', L: 'nnwnnnnww', M: 'wnwnnnnwn', N: 'nnnnwnnww',
    O: 'wnnnwnnwn', P: 'nnwnwnnwn', Q: 'nnnnnnwww', R: 'wnnnnnwwn',
    S: 'nnwnnnwwn', T: 'nnnnwnwwn', U: 'wwnnnnnnw', V: 'nwwnnnnnw',
    W: 'wwwnnnnnn', X: 'nwnnwnnnw', Y: 'wwnnwnnnn', Z: 'nwwnwnnnn',
    '-': 'nwnnnnwnw', '.': 'wwnnnnwnn', ' ': 'nwwnnnwnn', '$': 'nwnwnwnnn',
    '/': 'nwnwnnnwn', '+': 'nwnnnwnwn', '%': 'nnnwnwnwn', '*': 'nwnnwnwnn',
  }

  const encodeCode39 = (text) => {
    const upper = `*${text.toUpperCase()}*`
    const unit = 2
    const wide = unit * 3
    let cursor = 0
    const bars = []

    upper.split('').forEach((ch) => {
      const pattern = code39[ch] || code39[' ']
      for (let i = 0; i < pattern.length; i++) {
        const isBar = i % 2 === 0
        const width = pattern[i] === 'w' ? wide : unit
        if (isBar) {
          bars.push({ x: cursor, width })
        }
        cursor += width
      }
      cursor += unit
    })

    const quiet = unit * 10
    bars.forEach((bar) => {
      bar.x += quiet
    })
    const totalWidth = cursor + quiet
    return { bars, width: totalWidth }
  }

  const barcode = encodeCode39('readreceipts.xyz')

  return (
    <div className="rrg-page">
      <div className="rrg-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 3.5rem)', gap: '0.75rem' }}>
        <h1 className="rrg-title">Read Receipts</h1>
        <p className="rrg-subtitle" style={{ maxWidth: '780px', margin: '0 auto 1rem' }}>
          Turn your reading history into a vintage-styled receipt. Try the sample, then import your own.
        </p>

        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', width: '100%' }}>
          <DefaultReceipt 
            books={sampleBooks}
            username="BOOKWORM"
            period="all"
            stats={stats}
            displayBooks={displayBooks}
            orderId={orderId}
            today={today}
            renderStars={renderStars}
            formatPrice={formatPrice}
            getPeriodLabel={getPeriodLabel}
            barcode={barcode}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
          <button className="rrg-button secondary" style={{ width: '220px' }} onClick={() => handleImportClick('goodreads')}>
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
