import React from 'react'
import '../Receipt.css'
import ReceiptHeader from './receipt-parts/ReceiptHeader'
import ReceiptMetadata from './receipt-parts/ReceiptMetadata'
import ReceiptTotal from './receipt-parts/ReceiptTotal'
import ReceiptSection from './receipt-parts/ReceiptSection'
import ReceiptStatRow from './receipt-parts/ReceiptStatRow'
import Barcode from './receipt-parts/Barcode'
import DashedDivider from './receipt-parts/DashedDivider'

const CurrentlyReadingReceipt = React.forwardRef(({ books, username, stats, displayBooks, today, formatPrice, getPeriodLabel, barcode }, ref) => {
  const now = new Date()
  
  return (
    <div ref={ref} className="rrg-receipt">
      <ReceiptHeader title="CURRENTLY READING" username={username} />
      
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

      <Barcode barcode={barcode}/>
    </div>
  )
})

CurrentlyReadingReceipt.displayName = 'CurrentlyReadingReceipt'

export default CurrentlyReadingReceipt
