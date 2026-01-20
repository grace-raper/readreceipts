import React from 'react'
import '../Receipt.css'
import Barcode from './receipt-parts/Barcode'
import ReceiptHeader from './receipt-parts/ReceiptHeader'
import ReceiptMetadata from './receipt-parts/ReceiptMetadata'
import ReceiptItemList from './receipt-parts/ReceiptItemList'
import ReceiptTotal from './receipt-parts/ReceiptTotal'
import ReceiptSection from './receipt-parts/ReceiptSection'
import ReceiptStatRow from './receipt-parts/ReceiptStatRow'

const DefaultReceipt = React.forwardRef(({ books, username, period, stats, displayBooks, orderId, today, renderStars, formatPrice, getPeriodLabel, barcode, receiptTitle = 'READ RECEIPTS' }, ref) => {
  return (
    <div ref={ref} className="rrg-receipt">
      <ReceiptHeader title={receiptTitle} username={username} />
      
      <ReceiptMetadata 
        leftText={`ORDER #${orderId}`} 
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

      {stats.showStats?.statsSection !== false && (
        <ReceiptSection paddingTop="0.9rem" paddingBottom="0.9rem">
          {stats.showStats?.booksRead !== false && (
            <ReceiptStatRow label="BOOKS READ:" value={stats.totalBooks} />
          )}
          {stats.showStats?.avgRating !== false && (
            <ReceiptStatRow label="AVG RATING:" value={`${stats.avgRating}/5`} />
          )}
          {stats.showStats?.totalPages !== false && (
            <ReceiptStatRow label="TOTAL PAGES:" value={stats.totalPages.toLocaleString()} />
          )}
          {stats.showStats?.estHours !== false && (
            <ReceiptStatRow label="EST. READING TIME:" value={`${stats.totalHours} HOURS`} isLast />
          )}
        </ReceiptSection>
      )}

      <Barcode barcode={barcode} />
    </div>
  )
})

DefaultReceipt.displayName = 'DefaultReceipt'

export default DefaultReceipt
