import React from 'react'
import '../Receipt.css'
import ReceiptHeader from './receipt-parts/ReceiptHeader'
import ReceiptMetadata from './receipt-parts/ReceiptMetadata'
import ReceiptTotal from './receipt-parts/ReceiptTotal'
import ReceiptSection from './receipt-parts/ReceiptSection'
import ReceiptStatRow from './receipt-parts/ReceiptStatRow'
import DashedDivider from './receipt-parts/DashedDivider'

const CurrentlyReadingReceipt = React.forwardRef(({ books, username, stats, displayBooks, today, formatPrice, getPeriodLabel, barcode }, ref) => {
  const now = new Date()
  
  const avgLength = books.length > 0 ? 
    Math.round(books.reduce((sum, book) => sum + (book.pages || 0), 0) / books.length) : 0
  
  const oldestInProgress = books.length > 0 ? 
    books.reduce((oldest, book) => {
      if (!book.dateStarted) return oldest
      return new Date(book.dateStarted) < new Date(oldest.dateStarted || now) ? book : oldest
    }, books[0]) : null
  
  const oldestDays = oldestInProgress?.dateStarted ? 
    Math.round((now - new Date(oldestInProgress.dateStarted)) / (1000 * 60 * 60 * 24)) : 0
  
  const shelfStats = [
    { label: 'CURRENTLY READING:', value: `${books.length} books` },
    { label: 'AVERAGE LENGTH:', value: `${avgLength} pages` },
    { label: 'OLDEST IN PROGRESS:', value: oldestDays > 0 ? `${oldestDays} days` : 'N/A' },
    { label: 'TOTAL PAGES:', value: books.reduce((sum, book) => sum + (book.pages || 0), 0) }
  ]

  return (
    <div ref={ref} className="rrg-receipt">
      <ReceiptHeader title="CURRENTLY READING" username={username} />
      
      <DashedDivider marginTop="0.9rem" marginBottom="0" />
      
      <ReceiptMetadata 
        leftText="SHELF SUMMARY" 
        rightText={today} 
      />

      <DashedDivider marginTop="0.9rem" marginBottom="0.9rem" />

      <div>
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
      
      <DashedDivider marginTop="0.9rem" marginBottom="0.9rem" />
      
      <ReceiptTotal 
        label="TOTAL" 
        value={stats.totalPages} 
        formatPrice={formatPrice} 
      />

      <DashedDivider marginTop="0.9rem" marginBottom="0.9rem" />
      
      <ReceiptSection paddingTop="0" paddingBottom="0">
        {shelfStats.map((stat, index) => (
          <ReceiptStatRow 
            key={index} 
            label={stat.label} 
            value={stat.value} 
            isLast={index === shelfStats.length - 1}
          />
        ))}
      </ReceiptSection>

      <DashedDivider marginTop="0.8rem" marginBottom="0" />

      <div
        style={{
          paddingTop: '1rem',
          textAlign: 'center',
        }}
      >
        <div className="rrg-chip">IN PROGRESS</div>
        <p style={{ margin: '0.6rem 0 0', fontSize: '11px', opacity: 0.7 }}>{getPeriodLabel()}</p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <p style={{ margin: 0, fontSize: '14px' }}>KEEP READING!</p>
      </div>

      {barcode}

      <div style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
        <p style={{ margin: 0 }}>readingreceipt.app</p>
      </div>
    </div>
  )
})

CurrentlyReadingReceipt.displayName = 'CurrentlyReadingReceipt'

export default CurrentlyReadingReceipt
