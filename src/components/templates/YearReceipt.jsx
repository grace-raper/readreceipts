import React from 'react'
import '../Receipt.css'
import Barcode from './receipt-parts/Barcode'
import ReceiptHeader from './receipt-parts/ReceiptHeader'
import ReceiptMetadata from './receipt-parts/ReceiptMetadata'
import ReceiptItemList from './receipt-parts/ReceiptItemList'
import ReceiptTotal from './receipt-parts/ReceiptTotal'
import ReceiptSection from './receipt-parts/ReceiptSection'
import ReceiptStatRow from './receipt-parts/ReceiptStatRow'
import ReceiptSectionHeader from './receipt-parts/ReceiptSectionHeader'
import DashedDivider from './receipt-parts/DashedDivider'

const YearReceipt = React.forwardRef(({ books, username, period, template, stats, displayBooks, orderId, today, renderStars, formatPrice, getPeriodLabel, barcode, receiptTitle = 'READ RECEIPTS', selectedYear }, ref) => {
  // Additional stats for yearly receipt
  const currentYear = new Date().getFullYear()
  const displayYear = selectedYear || currentYear
  const booksWithRatings = books.filter(book => book.rating > 0)
  const fiveStarBooks = booksWithRatings.filter(book => Math.round(book.rating) === 5).length
  const isYearTemplate = template === 'yearly'
  const showStats = stats?.showStats || {
    statsSection: true,
    booksRead: true,
    totalPages: true,
    estHours: true,
    avgRating: true,
    topAuthor: true,
  }
  
  // Calculate most-read month
  const monthCounts = {}
  books.forEach(book => {
    if (book.dateFinished) {
      const date = new Date(book.dateFinished)
      const month = date.toLocaleString('default', { month: 'long' })
      monthCounts[month] = (monthCounts[month] || 0) + 1
    }
  })
  
  const mostReadMonth = Object.entries(monthCounts).sort((a, b) => b[1] - a[1])[0] || ['N/A', 0]
  const mostReadMonthLabel = (mostReadMonth[0] || 'N/A').toString().toUpperCase()
  
  // Find shortest and longest books
  const booksWithPages = books.filter(book => book.pages > 0)
  const shortestBook = booksWithPages.length > 0 ? 
    Math.min(...booksWithPages.map(book => book.pages)) : 'N/A'
  const longestBook = booksWithPages.length > 0 ? 
    Math.max(...booksWithPages.map(book => book.pages)) : 'N/A'

  // Calculate reading goal progress using provided stats
  const goalBooks = stats.readingGoal || 1
  const booksRead = books.length
  const progress = Math.round((booksRead / goalBooks) * 100)

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

      {showStats.statsSection !== false && (
        <>
          <DashedDivider marginTop="0.9rem" marginBottom="0.9rem" />
          
          <ReceiptSection paddingTop="0" paddingBottom="0">
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
            <ReceiptStatRow label="EST. READING TIME:" value={`${stats.totalHours} hrs`} isLast />
          )}
        </ReceiptSection>
        </>
      )}

      {isYearTemplate && showStats.goalSection !== false && (
        <>
          <DashedDivider marginTop="0.9rem" marginBottom="0.9rem" />
          
          <ReceiptSection paddingTop="0" paddingBottom="0">
          <ReceiptSectionHeader 
            title={`${displayYear} READING GOAL`} 
            align="left" 
          />
          {showStats.goalBooks !== false && (
            <ReceiptStatRow label="GOAL BOOKS:" value={goalBooks} />
          )}
          {showStats.goalBooksRead !== false && (
            <ReceiptStatRow label="BOOKS READ:" value={booksRead} />
          )}
          {showStats.goalProgress !== false && (
            <ReceiptStatRow label="PROGRESS:" value={`${progress}%`} />
          )}
          
          {/* Progress bar */}
          {showStats.goalProgress !== false && (
            <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e5e5', marginBottom: '0.5rem' }}>
              <div 
                style={{ 
                  width: `${progress > 100 ? 100 : progress}%`, 
                  height: '100%', 
                  backgroundColor: '#16110d' 
                }} 
              />
            </div>
          )}
        </ReceiptSection>
        </>
      )}

      {isYearTemplate && showStats.highlightsSection !== false && (
        <>
          <DashedDivider marginTop="0.9rem" marginBottom="0.9rem" />
          
          <ReceiptSection paddingTop="0" paddingBottom="0">
          <ReceiptSectionHeader 
            title={`${displayYear} HIGHLIGHTS`} 
            align="left" 
          />
          {showStats.highlightsAvgLength !== false && (
            <ReceiptStatRow label="AVG BOOK LENGTH:" value={`${Math.round(stats.totalPages / stats.totalBooks) || 0} pages`} />
          )}
          {showStats.highlightsAvgRating !== false && showStats.avgRating !== false && (
            <ReceiptStatRow label="AVG RATING:" value={`${stats.avgRating}/5`} />
          )}
          {showStats.highlightsFiveStar !== false && (
            <ReceiptStatRow label="5★ READS:" value={fiveStarBooks} />
          )}
          {showStats.highlightsMostReadMonth !== false && (
            <ReceiptStatRow label="MOST-READ MONTH:" value={`${mostReadMonthLabel} (${mostReadMonth[1]} BOOKS)`} />
          )}
          {showStats.highlightsShortest !== false && (
            <ReceiptStatRow label="SHORTEST BOOK:" value={`${shortestBook} PAGES`} />
          )}
          {showStats.highlightsLongest !== false && (
            <ReceiptStatRow label="LONGEST BOOK:" value={`${longestBook} PAGES`} />
          )}
          {showStats.topAuthor && (
            <ReceiptStatRow label="TOP AUTHOR:" value={stats.topAuthor} isLast />
          )}
        </ReceiptSection>
        </>
      )}

      <Barcode barcode={barcode}/>
    </div>
  )
})

YearReceipt.displayName = 'YearReceipt'

export default YearReceipt
