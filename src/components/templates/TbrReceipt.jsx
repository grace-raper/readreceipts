import React from 'react'
import '../Receipt.css'
import ReceiptHeader from './receipt-parts/ReceiptHeader'
import ReceiptMetadata from './receipt-parts/ReceiptMetadata'
import ReceiptTotal from './receipt-parts/ReceiptTotal'
import ReceiptSection from './receipt-parts/ReceiptSection'
import ReceiptStatRow from './receipt-parts/ReceiptStatRow'
import Barcode from './receipt-parts/Barcode'
import DashedDivider from './receipt-parts/DashedDivider'

const TbrReceipt = React.forwardRef(({ books, username, stats, displayBooks, today, formatPrice, getPeriodLabel, barcode, showStats = {} }, ref) => {
  const currentYear = new Date().getFullYear()
  const now = new Date()
  
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
  
  const shelfStats = [
    { key: 'tbrBooks', label: 'BOOKS ON TBR:', value: books.length },
    { key: 'tbrAddedThisYear', label: 'ADDED THIS YEAR:', value: addedThisYear },
    { key: 'tbrOldest', label: 'OLDEST TBR BOOK:', value: oldestBook?.dateAdded ? new Date(oldestBook.dateAdded).getFullYear() : 'N/A' },
    { key: 'tbrNewest', label: 'NEWEST ADDITION:', value: formatTimeAgo(books[0]?.dateAdded) }
  ]

  return (
    <div ref={ref} className="rrg-receipt">
      <ReceiptHeader title="TBR BOOKS" username={username} />
      
      <DashedDivider marginTop="0.9rem" marginBottom="0.9rem" />
      
      <ReceiptMetadata 
        leftText={username ? `CUSTOMER: ${username.toUpperCase()}` : 'CUSTOMER: GUEST'} 
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

      {showStats?.tbrSection !== false && (
        <>
          <DashedDivider marginTop="0.9rem" marginBottom="0.9rem" />
          
          <ReceiptSection paddingTop="0" paddingBottom="0">
          {shelfStats
            .filter((stat) => showStats?.[stat.key] !== false)
            .map((stat, index) => (
              <ReceiptStatRow 
                key={index} 
                label={stat.label} 
                value={stat.value} 
                isLast={index === shelfStats.filter((s) => showStats?.[s.key] !== false).length - 1}
              />
            ))}
        </ReceiptSection>
        </>
      )}
      <Barcode barcode={barcode}/>
    </div>
  )
})

TbrReceipt.displayName = 'TbrReceipt'

export default TbrReceipt
