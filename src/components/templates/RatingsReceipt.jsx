import React from 'react'
import '../Receipt.css'

const RatingsReceipt = React.forwardRef(({ books, username, period, stats, displayBooks, orderId, today, renderStars, formatPrice, getPeriodLabel, barcode, receiptTitle = 'RATINGS REPORT' }, ref) => {
  // Calculate ratings-focused stats
  const booksWithRatings = books.filter(book => book.rating > 0)
  const ratedBooks = booksWithRatings.length
  
  // Count books by rating
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: booksWithRatings.filter(book => Math.round(book.rating) === rating).length
  }))
  
  // Find lowest rated book
  const lowestRatedBooks = booksWithRatings.length > 0 ? 
    booksWithRatings
      .filter(book => book.rating > 0)
      .sort((a, b) => a.rating - b.rating)
      .slice(0, 1) : []
  
  // Calculate most generous month (highest avg rating)
  const monthlyRatings = {}
  const monthlyRatingCounts = {}
  
  booksWithRatings.forEach(book => {
    if (book.dateFinished && book.rating) {
      const date = new Date(book.dateFinished)
      const month = date.toLocaleString('default', { month: 'long' })
      monthlyRatings[month] = (monthlyRatings[month] || 0) + book.rating
      monthlyRatingCounts[month] = (monthlyRatingCounts[month] || 0) + 1
    }
  })
  
  const monthlyAvgs = Object.entries(monthlyRatings)
    .filter(([month, total]) => monthlyRatingCounts[month] >= 2) // At least 2 books
    .map(([month, total]) => ({
      month,
      avg: total / monthlyRatingCounts[month]
    }))
  
  const generousMonth = monthlyAvgs.length > 0 ?
    monthlyAvgs.sort((a, b) => b.avg - a.avg)[0] : null

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
          <span>RATINGS SUMMARY</span>
          <span>{today}</span>
        </div>
      </div>

      <div className="rrg-dashed" style={{ paddingTop: '0.9rem', paddingBottom: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginBottom: '0.6rem' }}>
          <span style={{ width: '45px' }}>RATING</span>
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
          <span>TOTAL</span>
          <span>{formatPrice(stats.totalPages)}</span>
        </div>
      </div>

      <div className="rrg-dashed" style={{ paddingTop: '0.9rem', paddingBottom: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span>BOOKS RATED:</span>
          <span style={{ fontWeight: 600 }}>{ratedBooks}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span>AVERAGE RATING:</span>
          <span style={{ fontWeight: 600 }}>{stats.avgRating}/5</span>
        </div>
        
        {/* Rating distribution */}
        {ratingCounts.map(({ rating, count }) => (
          <div key={rating} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span>{rating}★ BOOKS:</span>
            <span style={{ fontWeight: 600 }}>{count}</span>
          </div>
        ))}
        
        {lowestRatedBooks.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span>LOWEST-RATED BOOK:</span>
            <span style={{ fontWeight: 600 }}>★{lowestRatedBooks[0].rating.toFixed(1)}</span>
          </div>
        )}
        
        {generousMonth && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span>MOST GENEROUS MONTH:</span>
            <span style={{ fontWeight: 600 }}>{generousMonth.month} ({generousMonth.avg.toFixed(1)}★)</span>
          </div>
        )}
      </div>

      <div className="rrg-dashed" style={{ paddingTop: '0.9rem', paddingBottom: '0.9rem' }}>
        <div style={{ textAlign: 'center', fontWeight: 600, marginBottom: '0.8rem' }}>
          TOP 5 HIGHEST RATED BOOKS
        </div>
        
        {booksWithRatings
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 5)
          .map((book, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {book.title}
              </span>
              <span style={{ fontWeight: 600, marginLeft: '0.5rem' }}>★{book.rating.toFixed(1)}</span>
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
        <div className="rrg-chip">STARS TELL THE STORY</div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
        {barcode}
        <div style={{ fontSize: '11px', color: '#4b5563', marginTop: '0.25rem' }}>https://readreceipts.xyz</div>
      </div>
    </div>
  )
})

RatingsReceipt.displayName = 'RatingsReceipt'

export default RatingsReceipt
