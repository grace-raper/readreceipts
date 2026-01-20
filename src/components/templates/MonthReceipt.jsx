import React from 'react'
import '../Receipt.css'
import Barcode from './receipt-parts/Barcode'
import ReceiptHeader from './receipt-parts/ReceiptHeader'
import ReceiptMetadata from './receipt-parts/ReceiptMetadata'
import ReceiptItemList from './receipt-parts/ReceiptItemList'
import ReceiptTotal from './receipt-parts/ReceiptTotal'
import ReceiptSection from './receipt-parts/ReceiptSection'
import ReceiptStatRow from './receipt-parts/ReceiptStatRow'

const MonthReceipt = React.forwardRef(({ books, username, period, stats, displayBooks, orderId, today, renderStars, formatPrice, getPeriodLabel, barcode, receiptTitle = 'READ RECEIPTS', selectedYear, selectedMonth }, ref) => {
  const booksWithRatings = books.filter(book => book.rating > 0)
  const fiveStarBooks = booksWithRatings.filter(book => Math.round(book.rating) === 5).length
  const showStats = stats?.showStats || {
    statsSection: true,
    booksRead: true,
    totalPages: true,
    estHours: true,
    avgRating: true,
  }

  return (
    <div ref={ref} className="rrg-receipt">
      <ReceiptHeader title={receiptTitle} username={username} />
      
      <ReceiptMetadata 
        leftText={`MONTHLY READING`} 
        rightText={today} 
      />

      <ReceiptItemList 
        displayBooks={displayBooks}
        renderStars={renderStars}
        formatPrice={formatPrice}
      />
      
      <ReceiptTotal 
        label="TOTAL" 
        value={stats.totalPages} 
        formatPrice={formatPrice} 
      />

      {showStats.statsSection !== false && (
        <ReceiptSection dashed paddingTop="0.9rem" paddingBottom="0.9rem">
          {showStats.booksRead && (
            <ReceiptStatRow label="BOOKS READ:" value={stats.totalBooks} />
          )}
          {showStats.avgRating && (
            <ReceiptStatRow label="AVG RATING:" value={`${stats.avgRating}/5`} />
          )}
          {showStats.totalPages && (
            <ReceiptStatRow label="PAGES READ:" value={stats.totalPages.toLocaleString()} />
          )}
          {showStats.estHours && (
            <ReceiptStatRow label="EST. READING TIME:" value={`${stats.totalHours} hrs`} />
          )}
          {showStats.fiveStarBooks !== false && (
            <ReceiptStatRow label="5★ READS:" value={fiveStarBooks} isLast />
          )}
        </ReceiptSection>
      )}

      <Barcode barcode={barcode} marginTop="0.35rem" />
    </div>
  )
})

MonthReceipt.displayName = 'MonthReceipt'

export default MonthReceipt
