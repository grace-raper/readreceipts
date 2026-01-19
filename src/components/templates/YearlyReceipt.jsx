import React from 'react'
import '../Receipt.css'

const YearlyReceipt = React.forwardRef(({ books, username, period, stats, displayBooks, orderId, today, renderStars, formatPrice, getPeriodLabel, barcode, receiptTitle = 'READ RECEIPTS' }, ref) => {
  // Additional stats for yearly receipt
  const currentYear = new Date().getFullYear()
  const booksWithRatings = books.filter(book => book.rating > 0)
  const fiveStarBooks = booksWithRatings.filter(book => Math.round(book.rating) === 5).length
  
  // Calculate most-read month
  const monthCounts = {}
  books.forEach(book => {
    if (book.dateFinished) {
      const date = new Date(book.dateFinished)
      const month = date.toLocaleString('default', { month: 'long' })
      monthCounts[month] = (monthCounts[month] || 0) + 1
    }
  })
  
  const mostReadMonth = Object.entries(monthCounts).sort((a, b) => b[1] - a[1])[0] || ['N/A', 0]
  
  // Find shortest and longest books
  const booksWithPages = books.filter(book => book.pages > 0)
  const shortestBook = booksWithPages.length > 0 ? 
    Math.min(...booksWithPages.map(book => book.pages)) : 'N/A'
  const longestBook = booksWithPages.length > 0 ? 
    Math.max(...booksWithPages.map(book => book.pages)) : 'N/A'

  // Calculate reading goal progress (mock - would be from user input)
  const goalBooks = 50
  const booksRead = books.length
  const progress = Math.round((booksRead / goalBooks) * 100)
  const booksBehind = goalBooks - booksRead > 0 ? goalBooks - booksRead : 0

  return (
    <div ref={ref} className="rrg-receipt">
      <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, letterSpacing: '0.12em' }}>{receiptTitle.toUpperCase()}</h2>
        <p style={{ margin: '0.3rem 0 0', fontSize: '11px', opacity: 0.7 }}>
          {username ? username.toUpperCase() : 'READER'}
        </p>
      </div>

      <div className="rrg-dashed-top" style={{ paddingTop: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '0.5rem' }}>
          <span>YOUR {currentYear} READING</span>
          <span>{today}</span>
        </div>
      </div>

      <div className="rrg-dashed" style={{ paddingTop: '0.9rem', paddingBottom: '0.9rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '45px minmax(0, 1fr) 35px',
            columnGap: '0.35rem',
            fontWeight: 600,
            marginBottom: '0.6rem',
          }}
        >
          <span style={{ textAlign: 'left' }}>★</span>
          <span style={{ textAlign: 'left' }}>ITEM</span>
          <span style={{ textAlign: 'right' }}>PAGES</span>
        </div>

        {displayBooks
          .filter(book => !book.hidden)
          .map((book, index) => (
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
      
      <div className="rrg-dashed" style={{ paddingTop: '0.9rem', paddingBottom: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span>BOOKS READ:</span>
          <span style={{ fontWeight: 600 }}>{stats.totalBooks}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span>PAGES READ:</span>
          <span style={{ fontWeight: 600 }}>{stats.totalPages.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span>AVG BOOK LENGTH:</span>
          <span style={{ fontWeight: 600 }}>{Math.round(stats.totalPages / stats.totalBooks) || 0} pages</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span>5★ READS:</span>
          <span style={{ fontWeight: 600 }}>{fiveStarBooks}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span>AVG RATING:</span>
          <span style={{ fontWeight: 600 }}>{stats.avgRating}/5</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span>MOST-READ MONTH:</span>
          <span style={{ fontWeight: 600 }}>{mostReadMonth[0]} ({mostReadMonth[1]} books)</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span>SHORTEST BOOK:</span>
          <span style={{ fontWeight: 600 }}>{shortestBook} pages</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span>LONGEST BOOK:</span>
          <span style={{ fontWeight: 600 }}>{longestBook} pages</span>
        </div>
      </div>

      <div style={{ paddingTop: '0.9rem', paddingBottom: '0.9rem' }}>
        <div style={{ textAlign: 'center', fontWeight: 600, marginBottom: '0.5rem' }}>
          {currentYear} READING GOAL
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span>GOAL BOOKS:</span>
          <span style={{ fontWeight: 600 }}>{goalBooks}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span>BOOKS READ:</span>
          <span style={{ fontWeight: 600 }}>{booksRead}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span>PROGRESS:</span>
          <span style={{ fontWeight: 600 }}>{progress}%</span>
        </div>
        
        {/* Progress bar */}
        <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e5e5', marginBottom: '0.5rem' }}>
          <div 
            style={{ 
              width: `${progress > 100 ? 100 : progress}%`, 
              height: '100%', 
              backgroundColor: '#16110d' 
            }} 
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{booksBehind > 0 ? 'BOOKS BEHIND PACE:' : 'VICTORY MARGIN:'}</span>
          <span style={{ fontWeight: 600 }}>
            {booksBehind > 0 ? booksBehind : `+${booksRead - goalBooks} books`}
          </span>
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
        <div className="rrg-chip">EVERY PAGE IS A JOURNEY</div>
        <p style={{ margin: '0.6rem 0 0', fontSize: '11px', opacity: 0.7 }}>{currentYear} SUMMARY</p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <p style={{ margin: 0, fontSize: '14px' }}>HAPPY READING!</p>
      </div>

      {barcode}

      <div style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
        <p style={{ margin: 0 }}>readingreceipt.app</p>
      </div>
    </div>
  )
})

YearlyReceipt.displayName = 'YearlyReceipt'

export default YearlyReceipt
