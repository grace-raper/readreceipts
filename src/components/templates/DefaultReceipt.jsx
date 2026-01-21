import React from 'react'
import '../Receipt.css'
import Barcode from './receipt-parts/Barcode'
import ReceiptHeader from './receipt-parts/ReceiptHeader'
import ReceiptMetadata from './receipt-parts/ReceiptMetadata'
import ReceiptItemList from './receipt-parts/ReceiptItemList'
import ReceiptTotal from './receipt-parts/ReceiptTotal'
import ReceiptSection from './receipt-parts/ReceiptSection'
import ReceiptStatRow from './receipt-parts/ReceiptStatRow'
import DashedDivider from './receipt-parts/DashedDivider'

const DefaultReceipt = React.forwardRef(({ books, username, period, stats, displayBooks, orderId, today, renderStars, formatPrice, getPeriodLabel, barcode, barcodeText, receiptTitle = 'READ RECEIPTS' }, ref) => {
  return (
    <div ref={ref} className="rrg-receipt">
      <ReceiptHeader title={receiptTitle} username={username} />
      
      <DashedDivider marginTop="0.9rem" marginBottom="0.9rem" />
      
      <ReceiptMetadata 
        leftText={username ? `CUSTOMER: ${username.toUpperCase()}` : 'CUSTOMER: GUEST'} 
        rightText={today} 
      />

      <DashedDivider marginTop="0.9rem" marginBottom="0.9rem" />
      
      <ReceiptItemList 
        displayBooks={displayBooks}
        renderStars={renderStars}
        formatPrice={formatPrice}
      />
      
      <DashedDivider marginTop="0.9rem" marginBottom="0.9rem" />
      
      <ReceiptTotal 
        label="TOTAL" 
        value={stats.totalPages} 
        formatPrice={formatPrice} 
      />

      {stats.showStats?.statsSection !== false && (
        <>
          <DashedDivider marginTop="0.9rem" marginBottom="0.9rem" />
          
          <ReceiptSection paddingTop="0" paddingBottom="0">
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
        </>
      )}

      <Barcode barcode={barcode} encode={barcodeText} />
    </div>
  )
})

DefaultReceipt.displayName = 'DefaultReceipt'

export default DefaultReceipt
