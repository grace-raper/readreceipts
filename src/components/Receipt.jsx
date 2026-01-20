import React, { forwardRef } from 'react'
import './Receipt.css'

const Receipt = forwardRef(({ books, username, period }, ref) => {
  const code39 = {
    '0': 'nnnwwnwnn',
    '1': 'wnnwnnnnw',
    '2': 'nnwwnnnnw',
    '3': 'wnwwnnnnn',
    '4': 'nnnwwnnnw',
    '5': 'wnnwwnnnn',
    '6': 'nnwwwnnnn',
    '7': 'nnnwnnwnw',
    '8': 'wnnwnnwnn',
    '9': 'nnwwnnwnn',
    A: 'wnnnnwnnw',
    B: 'nnwnnwnnw',
    C: 'wnwnnwnnn',
    D: 'nnnnwwnnw',
    E: 'wnnnwwnnn',
    F: 'nnwnwwnnn',
    G: 'nnnnnwwnw',
    H: 'wnnnnwwnn',
    I: 'nnwnnwwnn',
    J: 'nnnnwwwnn',
    K: 'wnnnnnnww',
    L: 'nnwnnnnww',
    M: 'wnwnnnnwn',
    N: 'nnnnwnnww',
    O: 'wnnnwnnwn',
    P: 'nnwnwnnwn',
    Q: 'nnnnnnwww',
    R: 'wnnnnnwwn',
    S: 'nnwnnnwwn',
    T: 'nnnnwnwwn',
    U: 'wwnnnnnnw',
    V: 'nwwnnnnnw',
    W: 'wwwnnnnnn',
    X: 'nwnnwnnnw',
    Y: 'wwnnwnnnn',
    Z: 'nwwnwnnnn',
    '-': 'nwnnnnwnw',
    '.': 'wwnnnnwnn',
    ' ': 'nwwnnnwnn',
    '$': 'nwnwnwnnn',
    '/': 'nwnwnnnwn',
    '+': 'nwnnnwnwn',
    '%': 'nnnwnwnwn',
    '*': 'nwnnwnwnn', // start/stop
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
      // narrow space between characters
      cursor += unit
    })

    // add quiet zones
    const quiet = unit * 10
    bars.forEach((bar) => {
      bar.x += quiet
    })
    const totalWidth = cursor + quiet
    return { bars, width: totalWidth }
  }

  const renderStars = (rating) => {
    if (!rating) return ''
    return `${Math.round(rating)}/5`
  }

  const formatPrice = (pages) => {
    const dollars = Math.floor(pages / 100)
    const cents = pages % 100
    return `$${dollars}.${cents.toString().padStart(2, '0')}`
  }

  const getPeriodLabel = () => {
    if (period === 'month') return 'LAST MONTH'
    if (period === '6months') return 'LAST 6 MONTHS'
    if (period === 'year') return new Date().getFullYear().toString()
    return 'ALL TIME'
  }

  const calculateStats = () => {
    const totalPages = books.reduce((sum, book) => sum + (book.pages || 0), 0)
    const totalMinutes = totalPages
    const totalHours = Math.round(totalMinutes / 60)
    const booksWithRatings = books.filter((b) => b.rating > 0)
    const avgRating =
      booksWithRatings.length > 0
        ? (booksWithRatings.reduce((sum, b) => sum + b.rating, 0) / booksWithRatings.length).toFixed(1)
        : 0

    const authorCounts = {}
    books.forEach((book) => {
      if (book.author) {
        authorCounts[book.author] = (authorCounts[book.author] || 0) + 1
      }
    })
    const topAuthorEntry = Object.entries(authorCounts).sort((a, b) => b[1] - a[1])[0]

    return {
      totalBooks: books.length,
      totalPages,
      totalHours,
      avgRating,
      topAuthor: topAuthorEntry ? topAuthorEntry[0].toUpperCase() : 'N/A',
    }
  }

  const stats = calculateStats()
  const displayBooks = books.slice(0, 10)
  const orderId = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, '0')
  const today = new Date()
    .toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    .toUpperCase()

  return (
    <div ref={ref} className="rrg-receipt">
      <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, letterSpacing: '0.12em' }}>READ RECEIPTS</h2>
        <p style={{ margin: '0.3rem 0 0', fontSize: '11px', opacity: 0.7 }}>
          {username ? username.toUpperCase() : 'READER'}
        </p>
      </div>

      <div className="rrg-dashed-top" style={{ paddingTop: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '0.5rem' }}>
          <span>ORDER #{orderId}</span>
          <span>{today}</span>
        </div>
      </div>

      <div className="rrg-dashed" style={{ paddingTop: '0.9rem', paddingBottom: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginBottom: '0.6rem' }}>
          <span style={{ width: '45px' }}>RATING</span>
          <span style={{ flex: 1, paddingLeft: '0.35rem' }}>ITEM</span>
          <span style={{ width: '65px', textAlign: 'right' }}>PAGES</span>
        </div>

        {displayBooks.map((book, index) => (
          <div key={index} className="rrg-item-row">
            <div className="rrg-item-rating">{renderStars(book.rating)}</div>
            <div className="rrg-item-title">
              {book.title}
              {book.author && ` - ${book.author}`}
            </div>
            <div className="rrg-item-price">{formatPrice(book.pages)}</div>
          </div>
        ))}
      </div>

      <div style={{ paddingTop: '0.9rem', paddingBottom: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span>BOOKS READ:</span>
          <span style={{ fontWeight: 600 }}>{stats.totalBooks}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span>TOTAL PAGES:</span>
          <span style={{ fontWeight: 600 }}>{stats.totalPages.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span>EST. HOURS:</span>
          <span style={{ fontWeight: 600 }}>{stats.totalHours}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span>AVG RATING:</span>
          <span style={{ fontWeight: 600 }}>{stats.avgRating}/5</span>
        </div>
        {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>TOP AUTHOR:</span>
          <span style={{ fontWeight: 600 }}>{stats.topAuthor}</span>
        </div> */}
      </div>

      <div style={{ paddingTop: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 700 }}>
          <span>TOTAL</span>
          <span>{formatPrice(stats.totalPages)}</span>
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid rgba(0, 0, 0, 0.2)',
          marginTop: '0.8rem',
          paddingTop: '1rem',
          textAlign: 'center',
        }}
      >
        <div className="rrg-chip">EVERY PAGE IS A PENNY</div>
        <p style={{ margin: '0.6rem 0 0', fontSize: '11px', opacity: 0.7 }}>{getPeriodLabel()}</p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <p style={{ margin: 0, fontSize: '14px' }}>THANK YOU FOR VISITING!</p>
      </div>

      <div className="rrg-barcode">
        {(() => {
          const text = 'readreceipts.xyz'
          const { bars, width } = encodeCode39(text)
          const height = 110
          return (
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
              {bars.map((bar, idx) => (
                <rect key={idx} x={bar.x} y={8} width={bar.width} height={height - 16} fill="black" />
              ))}
            </svg>
          )
        })()}
      </div>

      <div style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
        <p style={{ margin: 0 }}>readingreceipt.app</p>
      </div>
    </div>
  )
})

Receipt.displayName = 'Receipt'

export default Receipt
