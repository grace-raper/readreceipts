import React from 'react'
import '../Receipt.css'

const ShelfReceipt = React.forwardRef(({ books, username, period, stats, displayBooks, orderId, today, renderStars, formatPrice, getPeriodLabel, barcode, shelfType = 'tbr', showStats = {} }, ref) => {
  // Shelf-based receipt (TBR, Currently Reading, DNF)
  const currentYear = new Date().getFullYear()
  const now = new Date()
  
  // Helper function for date formatting
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'N/A'
    
    const date = new Date(dateString)
    const diffDays = Math.round((now - date) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 30) return `${diffDays} days ago`
    if (diffDays < 365) return `${Math.round(diffDays / 30)} months ago`
    return `${Math.round(diffDays / 365)} years ago`
  }
  
  // Configure template based on shelf type
  let title = 'TBR BOOKS'
  let slogan = 'SO MANY BOOKS, SO LITTLE TIME'
  let footerText = 'HAPPY READING!'
  
  if (shelfType === 'current') {
    title = 'CURRENTLY READING'
    slogan = 'IN PROGRESS'
    footerText = 'KEEP READING!'
  } else if (shelfType === 'dnf') {
    title = 'DNF BOOKS'
    slogan = "LIFE'S TOO SHORT"
    footerText = 'NO REGRETS!'
  }
  
  // Calculate shelf-specific stats
  let shelfStats = []
  
  if (shelfType === 'tbr') {
    // TBR stats
    const oldestBook = books.length > 0 ? 
      books.reduce((oldest, book) => {
        if (!book.dateAdded) return oldest
        return new Date(book.dateAdded) < new Date(oldest.dateAdded || now) ? book : oldest
      }, books[0]) : null
    
    const addedThisYear = books.filter(book => {
      if (!book.dateAdded) return false
      const addedDate = new Date(book.dateAdded)
      return addedDate.getFullYear() === currentYear
    }).length
    
    shelfStats = [
      { key: 'tbrBooks', label: 'BOOKS ON TBR:', value: books.length },
      { key: 'tbrAddedThisYear', label: 'ADDED THIS YEAR:', value: addedThisYear },
      { key: 'tbrOldest', label: 'OLDEST TBR BOOK:', value: oldestBook?.dateAdded ? new Date(oldestBook.dateAdded).getFullYear() : 'N/A' },
      { key: 'tbrNewest', label: 'NEWEST ADDITION:', value: formatTimeAgo(books[0]?.dateAdded) }
    ]
  } else if (shelfType === 'current') {
    // Currently Reading stats
    const avgLength = books.length > 0 ? 
      Math.round(books.reduce((sum, book) => sum + (book.pages || 0), 0) / books.length) : 0
    
    const oldestInProgress = books.length > 0 ? 
      books.reduce((oldest, book) => {
        if (!book.dateStarted) return oldest
        return new Date(book.dateStarted) < new Date(oldest.dateStarted || now) ? book : oldest
      }, books[0]) : null
    
    const oldestDays = oldestInProgress?.dateStarted ? 
      Math.round((now - new Date(oldestInProgress.dateStarted)) / (1000 * 60 * 60 * 24)) : 0
    
    shelfStats = [
      { label: 'CURRENTLY READING:', value: `${books.length} books` },
      { label: 'AVERAGE LENGTH:', value: `${avgLength} pages` },
      { label: 'OLDEST IN PROGRESS:', value: oldestDays > 0 ? `${oldestDays} days` : 'N/A' },
      { label: 'TOTAL PAGES:', value: books.reduce((sum, book) => sum + (book.pages || 0), 0) }
    ]
  } else if (shelfType === 'dnf') {
    // DNF stats
    const dnfThisYear = books.filter(book => {
      if (!book.dateUpdated) return false
      const updatedDate = new Date(book.dateUpdated)
      return updatedDate.getFullYear() === currentYear
    }).length
    
    const avgPagesRead = books.length > 0 && books.some(b => b.pagesRead) ? 
      Math.round(books.reduce((sum, book) => sum + (book.pagesRead || 0), 0) / books.length) : 'N/A'
    
    shelfStats = [
      { label: 'DNF BOOKS:', value: books.length },
      { label: 'DNF THIS YEAR:', value: dnfThisYear },
      { label: 'AVG PAGES READ:', value: avgPagesRead },
      { label: 'MOST RECENT DNF:', value: formatTimeAgo(books[0]?.dateUpdated) }
    ]
  }

  return (
    <div ref={ref} className="rrg-receipt">
      <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, letterSpacing: '0.12em' }}>{title}</h2>
        <p style={{ margin: '0.3rem 0 0', fontSize: '11px', opacity: 0.7 }}>
          {username ? username.toUpperCase() : 'READER'}
        </p>
      </div>

      <div className="rrg-dashed-top" style={{ paddingTop: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '0.5rem' }}>
          <span>SHELF SUMMARY</span>
          <span>{today}</span>
        </div>
      </div>

      <div className="rrg-dashed" style={{ paddingTop: '0.9rem', paddingBottom: '0.9rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 35px',
            columnGap: '0.35rem',
            fontWeight: 600,
            marginBottom: '0.6rem'
          }}
        >
          <span>ITEM</span>
          <span style={{ textAlign: 'right', display: 'block' }}>PAGES</span>
        </div>

        {displayBooks
          .filter(book => !book.hidden)
          .map((book, index) => (
            <div key={index} className="rrg-item-row rrg-item-row--shelf">
              <div className="rrg-item-title">
                {book.title}
                {book.author && ` - ${book.author}`}
              </div>
              <div className="rrg-item-price">
                {formatPrice(book.pages)}
              </div>
            </div>
          ))}
      </div>
      
      <div style={{ paddingTop: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 700 }}>
          <span>TOTAL</span>
          <span>{formatPrice(stats.totalPages)}</span>
        </div>
      </div>

      {shelfType !== 'tbr' || showStats?.tbrSection !== false ? (
        <div className="rrg-dashed" style={{ paddingTop: '0.9rem', paddingBottom: '0.9rem' }}>
          {shelfStats
            .filter((stat) => shelfType !== 'tbr' || showStats?.[stat.key] !== false)
            .map((stat, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span>{stat.label}</span>
                <span style={{ fontWeight: 600 }}>{stat.value}</span>
              </div>
            ))}
        </div>
      ) : null}

      <div
        style={{
          borderTop: '1px solid rgba(0, 0, 0, 0.2)',
          marginTop: '0.8rem',
          paddingTop: '1rem',
          textAlign: 'center',
        }}
      >
        <div className="rrg-chip">{slogan}</div>
        <p style={{ margin: '0.6rem 0 0', fontSize: '11px', opacity: 0.7 }}>{getPeriodLabel()}</p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <p style={{ margin: 0, fontSize: '14px' }}>{footerText}</p>
      </div>

      {barcode}

      <div style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
        <p style={{ margin: 0 }}>readingreceipt.app</p>
      </div>
    </div>
  )
})

ShelfReceipt.displayName = 'ShelfReceipt'

export default ShelfReceipt
