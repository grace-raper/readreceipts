import React from 'react'
import '../Receipt.css'

const StandardReceipt = React.forwardRef(({ books, username, period, stats, displayBooks, orderId, today, renderStars, formatPrice, getPeriodLabel, barcode, receiptTitle = 'READ RECEIPTS' }, ref) => {
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
          <span>ORDER #{orderId}</span>
          <span>{today}</span>
        </div>
      </div>

      <div className="rrg-dashed" style={{ paddingTop: '0.9rem', paddingBottom: '0.9rem'}}>
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
                {book.author && (
                  <span className="rrg-item-author"> - {book.author}</span>
                )}
              </div>
              <div className="rrg-item-price">{formatPrice(book.pages)}</div>
            </div>
          ))}
      </div>
      
      <div className="rrg-dashed" style={{ paddingTop: '0.9rem', paddingBottom: '0.9rem' }}>
        {stats.showStats?.booksRead !== false && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span>BOOKS READ:</span>
            <span style={{ fontWeight: 600 }}>{stats.totalBooks}</span>
          </div>
        )}
        {stats.showStats?.totalPages !== false && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span>TOTAL PAGES:</span>
            <span style={{ fontWeight: 600 }}>{stats.totalPages.toLocaleString()}</span>
          </div>
        )}
        {stats.showStats?.estHours !== false && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span>EST. READING TIME:</span>
            <span style={{ fontWeight: 600 }}>{stats.totalHours} HOURS</span>
          </div>
        )}
        {stats.showStats?.avgRating !== false && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span>AVG RATING:</span>
            <span style={{ fontWeight: 600 }}>{stats.avgRating}/5</span>
          </div>
        )}
        {stats.showStats?.topAuthor !== false && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>TOP AUTHOR:</span>
            <span style={{ fontWeight: 600, fontSize: '11px' }}>{stats.topAuthor}</span>
          </div>
        )}
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

      {barcode}

      <div style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
        <p style={{ margin: 0 }}>readingreceipt.app</p>
      </div>
    </div>
  )
})

StandardReceipt.displayName = 'StandardReceipt'

export default StandardReceipt
