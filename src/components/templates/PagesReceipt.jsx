import React from 'react'
import '../Receipt.css'

const PagesReceipt = React.forwardRef(({ books, username, period, stats, displayBooks, orderId, today, renderStars, formatPrice, getPeriodLabel, barcode, receiptTitle = 'PAGE COUNTER' }, ref) => {
  // Calculate pages-focused stats
  const totalPages = stats.totalPages
  
  // Calculate pages per month
  const monthlyPages = {}
  const currentYear = new Date().getFullYear()
  
  books.forEach(book => {
    if (book.dateFinished) {
      const date = new Date(book.dateFinished)
      const month = date.toLocaleString('default', { month: 'long' })
      monthlyPages[month] = (monthlyPages[month] || 0) + (book.pages || 0)
    }
  })
  
  const monthEntries = Object.entries(monthlyPages)
  const biggestMonth = monthEntries.length > 0 ? 
    monthEntries.sort((a, b) => b[1] - a[1])[0] : ['N/A', 0]
  
  const avgPagesPerMonth = monthEntries.length > 0 ? 
    Math.round(totalPages / monthEntries.length) : 0
  
  // Count books over 500 pages
  const longBooks = books.filter(book => book.pages >= 500).length

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
          <span>PAGES SUMMARY</span>
          <span>{today}</span>
        </div>
      </div>

      <div className="rrg-dashed" style={{ paddingTop: '0.9rem', paddingBottom: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginBottom: '0.6rem' }}>
          <span style={{ width: '45px' }}>★</span>
          <span style={{ flex: 1, paddingLeft: '0.35rem' }}>ITEM</span>
          <span style={{ width: '65px', textAlign: 'right' }}>PAGES</span>
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
      
      <div style={{ paddingTop: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 700 }}>
          <span>TOTAL PAGES</span>
          <span>{totalPages.toLocaleString()}</span>
        </div>
      </div>

      <div className="rrg-dashed" style={{ paddingTop: '0.9rem', paddingBottom: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span>TOTAL PAGES READ:</span>
          <span style={{ fontWeight: 600 }}>{totalPages.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span>AVG PAGES/MONTH:</span>
          <span style={{ fontWeight: 600 }}>{avgPagesPerMonth.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span>BIGGEST READING MONTH:</span>
          <span style={{ fontWeight: 600 }}>{biggestMonth[0]} ({biggestMonth[1].toLocaleString()} pages)</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span>BOOKS OVER 500 PAGES:</span>
          <span style={{ fontWeight: 600 }}>{longBooks}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span>COMPLETED BOOKS:</span>
          <span style={{ fontWeight: 600 }}>{stats.totalBooks}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span>AVG BOOK LENGTH:</span>
          <span style={{ fontWeight: 600 }}>{Math.round(totalPages / stats.totalBooks) || 0} pages</span>
        </div>
      </div>

      <div style={{ paddingTop: '0.9rem', paddingBottom: '0.9rem' }}>
        <div style={{ textAlign: 'center', fontWeight: 600, marginBottom: '0.8rem' }}>
          TOP 5 LONGEST BOOKS
        </div>
        
        {books
          .filter(book => book.pages > 0)
          .sort((a, b) => b.pages - a.pages)
          .slice(0, 5)
          .map((book, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {book.title}
              </span>
              <span style={{ fontWeight: 600, marginLeft: '0.5rem' }}>{book.pages} pg</span>
            </div>
          ))
        }
      </div>

      <div
        style={{
          borderTop: '1px solid rgba(0, 0, 0, 0.2)',
          marginTop: '0.8rem',
          paddingTop: '1rem',
          textAlign: 'center',
        }}
      >
        <div className="rrg-chip">QUALITY OVER QUANTITY</div>
        <p style={{ margin: '0.6rem 0 0', fontSize: '11px', opacity: 0.7 }}>{getPeriodLabel()}</p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <p style={{ margin: 0, fontSize: '14px' }}>KEEP TURNING PAGES!</p>
      </div>

      {barcode}

      <div style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
        <p style={{ margin: 0 }}>readingreceipt.app</p>
      </div>
    </div>
  )
})

PagesReceipt.displayName = 'PagesReceipt'

export default PagesReceipt
