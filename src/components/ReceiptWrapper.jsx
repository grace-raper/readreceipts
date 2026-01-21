import React, { forwardRef } from 'react'
import './Receipt.css'
import DefaultReceipt from './templates/DefaultReceipt'
import YearReceipt from './templates/YearReceipt'
import MonthReceipt from './templates/MonthReceipt'
import SeasonReceipt from './templates/SeasonReceipt'
import TbrReceipt from './templates/TbrReceipt'
import CurrentlyReadingReceipt from './templates/CurrentlyReadingReceipt'

const ReceiptWrapper = forwardRef(({ 
  books, 
  username, 
  period,
  template = 'standard',
  shelfType = 'tbr',
  readingGoal = 12,
  showStats = {
    statsSection: true,
    booksRead: true,
    totalPages: true,
    estHours: true,
    avgRating: true,
    goalSection: true,
    goalBooks: true,
    goalBooksRead: true,
    goalProgress: true,
    highlightsSection: true,
    highlightsAvgLength: true,
    highlightsAvgRating: true,
    highlightsFiveStar: true,
    highlightsMostReadMonth: true,
    highlightsShortest: true,
    highlightsLongest: true,
    tbrSection: true,
    tbrBooks: true,
    tbrAddedThisYear: true,
    tbrOldest: true,
    tbrNewest: true,
  },
  pagesPerHour = 30,
  numBooksToShow = 10,
  selectedYear,
  selectedMonth,
  selectedSeason,
  customSeasonName,
  customSeasonStart,
  customSeasonEnd,
  receiptDate
}, ref) => {
  // Code39 barcode encoding
  const code39 = {
    '0': 'nnnwwnwnn',
    '1': 'wnnwnnnnw',
    '2': 'nnwwnnnnw',
    '3': 'wnwwnnnnn',
    '4': 'nnnwwnnnw',
    '5': 'wnnwwnnnn',
    '6': 'nnwwwnnnn',
    '7': 'nnnwnnwnw',
    '8': 'wnnwnnwnn',
    '9': 'nnwwnnwnn',
    A: 'wnnnnwnnw',
    B: 'nnwnnwnnw',
    C: 'wnwnnwnnn',
    D: 'nnnnwwnnw',
    E: 'wnnnwwnnn',
    F: 'nnwnwwnnn',
    G: 'nnnnnwwnw',
    H: 'wnnnnwwnn',
    I: 'nnwnnwwnn',
    J: 'nnnnwwwnn',
    K: 'wnnnnnnww',
    L: 'nnwnnnnww',
    M: 'wnwnnnnwn',
    N: 'nnnnwnnww',
    O: 'wnnnwnnwn',
    P: 'nnwnwnnwn',
    Q: 'nnnnnnwww',
    R: 'wnnnnnwwn',
    S: 'nnwnnnwwn',
    T: 'nnnnwnwwn',
    U: 'wwnnnnnnw',
    V: 'nwwnnnnnw',
    W: 'wwwnnnnnn',
    X: 'nwnnwnnnw',
    Y: 'wwnnwnnnn',
    Z: 'nwwnwnnnn',
    '-': 'nwnnnnwnw',
    '.': 'wwnnnnwnn',
    ' ': 'nwwnnnwnn',
    '$': 'nwnwnwnnn',
    '/': 'nwnwnnnwn',
    '+': 'nwnnnwnwn',
    '%': 'nnnwnwnwn',
    '*': 'nwnnwnwnn', // start/stop
  }

  const encodeCode39 = (text) => {
    const upper = `*${text.toUpperCase()}*`
    const unit = 2
    const wide = unit * 3
    let cursor = 0
    const bars = []

    upper.split('').forEach((ch) => {
      const pattern = code39[ch] || code39[' ']
      for (let i = 0; i < pattern.length; i++) {
        const isBar = i % 2 === 0
        const width = pattern[i] === 'w' ? wide : unit
        if (isBar) {
          bars.push({ x: cursor, width })
        }
        cursor += width
      }
      // narrow space between characters
      cursor += unit
    })

    // add quiet zones
    const quiet = unit * 10
    bars.forEach((bar) => {
      bar.x += quiet
    })
    const totalWidth = cursor + quiet
    return { bars, width: totalWidth }
  }

  const renderStars = (rating) => {
    if (!rating || Number(rating) <= 0) return '-/5'
    return `${Math.round(rating)}/5`
  }

  const formatPrice = (pages) => {
    const dollars = Math.floor(pages / 100)
    const cents = pages % 100
    return `$${dollars}.${cents.toString().padStart(2, '0')}`
  }

  // Books passed from parent are already qualified for the current template/period.
  // Still exclude hidden entries from stats/receipt output.
  const visibleBooks = books.filter((book) => !book.hidden)
  
  const getPeriodLabel = () => {
    if (template === 'monthly' && selectedMonth !== undefined) {
      const monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']
      return `${monthNames[selectedMonth]} ${selectedYear || new Date().getFullYear()}`
    } else if (template === 'yearly' && selectedYear) {
      return `${selectedYear}`
    } else if (template === 'seasonal') {
      if (selectedSeason === 'winter') return 'WINTER READS'
      if (selectedSeason === 'spring') return 'SPRING READS'
      if (selectedSeason === 'summer') return 'SUMMER READS'
      if (selectedSeason === 'fall') return 'FALL READS'
      if (selectedSeason === 'custom') return customSeasonName ? customSeasonName.toUpperCase() : 'CUSTOM SEASON'
    } else if (period === 'month') {
      return 'LAST MONTH'
    } else if (period === '6months') {
      return 'LAST 6 MONTHS'
    } else if (period === 'year') {
      return new Date().getFullYear().toString()
    }
    return 'ALL TIME'
  }

  const calculateStats = () => {
    const statsBooks =
      template === 'standard' || template === 'tbr'
        ? visibleBooks.slice(0, numBooksToShow || visibleBooks.length)
        : visibleBooks
    const totalPages = statsBooks.reduce((sum, book) => sum + (book.pages || 0), 0)
    const totalHours = Math.round((totalPages / pagesPerHour) * 10) / 10
    const booksWithRatings = statsBooks.filter((b) => b.rating > 0)
    const avgRating =
      booksWithRatings.length > 0
        ? (booksWithRatings.reduce((sum, b) => sum + b.rating, 0) / booksWithRatings.length).toFixed(1)
        : 0

    const safeGoal = Math.max(1, readingGoal || 1)

    return {
      totalBooks: statsBooks.length,
      totalPages,
      totalHours,
      avgRating,
      readingGoal: safeGoal,
      pagesPerHour,
      showStats: {
        statsSection: showStats?.statsSection ?? true,
        booksRead: showStats?.booksRead,
        totalPages: showStats?.totalPages,
        estHours: showStats?.estHours,
        avgRating: showStats?.avgRating,
        goalSection: showStats?.goalSection ?? true,
        goalBooks: showStats?.goalBooks ?? true,
        goalBooksRead: showStats?.goalBooksRead ?? true,
        goalProgress: showStats?.goalProgress ?? true,
        highlightsSection: showStats?.highlightsSection ?? true,
        highlightsAvgLength: showStats?.highlightsAvgLength ?? true,
        highlightsAvgRating: showStats?.highlightsAvgRating ?? true,
        highlightsFiveStar: showStats?.highlightsFiveStar ?? true,
        highlightsMostReadMonth: showStats?.highlightsMostReadMonth ?? true,
        highlightsShortest: showStats?.highlightsShortest ?? true,
        highlightsLongest: showStats?.highlightsLongest ?? true,
      }
    }
  }
  
  // Calculate stats based on visible books
  const stats = calculateStats()
  
  // Parent already applied template/period filters; limit count for standard and tbr templates.
  const displayBooks =
    template === 'standard' || template === 'tbr'
      ? visibleBooks.slice(0, numBooksToShow || visibleBooks.length)
      : visibleBooks
    
  const orderId = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, '0')
    
  // Generate appropriate date/date range based on template
  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const startMonth = start.toLocaleDateString('en-US', { month: 'short' })
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' })
    const startDay = start.getDate()
    const endDay = end.getDate()
    const startYear = start.getFullYear()
    const endYear = end.getFullYear()
    
    if (startYear === endYear) {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${endYear}`
    } else {
      return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`
    }
  }
  
  let today = ''
  
  if (template === 'yearly' && selectedYear) {
    // Year template: show date range (Jan 1 - Dec 31, YYYY)
    today = formatDateRange(
      new Date(selectedYear, 0, 1),
      new Date(selectedYear, 11, 31)
    )
  } else if (template === 'monthly' && selectedYear && selectedMonth !== undefined) {
    // Monthly template: show last day of month (e.g., "January 31, 2025")
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0).getDate()
    const displayDate = new Date(selectedYear, selectedMonth, lastDay)
    today = displayDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  } else if (template === 'seasonal') {
    // Seasonal template: show date range based on season
    if (selectedSeason === 'custom' && customSeasonStart && customSeasonEnd) {
      today = formatDateRange(customSeasonStart, customSeasonEnd)
    } else if (selectedSeason === 'winter') {
      const year = selectedYear || new Date().getFullYear()
      today = formatDateRange(new Date(year, 11, 1), new Date(year + 1, 1, 28))
    } else if (selectedSeason === 'spring') {
      const year = selectedYear || new Date().getFullYear()
      today = formatDateRange(new Date(year, 2, 1), new Date(year, 4, 31))
    } else if (selectedSeason === 'summer') {
      const year = selectedYear || new Date().getFullYear()
      today = formatDateRange(new Date(year, 5, 1), new Date(year, 7, 31))
    } else if (selectedSeason === 'fall') {
      const year = selectedYear || new Date().getFullYear()
      today = formatDateRange(new Date(year, 8, 1), new Date(year, 10, 30))
    }
  } else if ((template === 'tbr' || template === 'current') && receiptDate) {
    // TBR/Currently Reading: use custom receipt date
    const displayDate = new Date(receiptDate)
    today = displayDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  } else {
    // Default: use today's date
    const displayDate = new Date()
    today = displayDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Generate barcode component
  const barcode = (
    <div className="rrg-barcode">
      {(() => {
        const text = 'readreceipts.xyz'
        const { bars, width } = encodeCode39(text)
        const height = 110
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {bars.map((bar, idx) => (
              <rect key={idx} x={bar.x} y={8} width={bar.width} height={height - 16} fill="black" />
            ))}
          </svg>
        )
      })()}
    </div>
  )

  const getReceiptTitle = () => {
    if (template === 'seasonal') {
      if (selectedSeason === 'custom') {
        if (customSeasonName?.trim()) return customSeasonName
        return 'Read Receipts'
      }
      const nameMap = {
        winter: 'Winter Reading Receipt',
        spring: 'Spring Reading Receipt',
        summer: 'Summer Reading Receipt',
        fall: 'Fall Reading Receipt',
      }
      return nameMap[selectedSeason] || 'Read Receipts'
    } else if (template === 'monthly' && selectedMonth !== undefined) {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      return `${monthNames[selectedMonth]} Reading Receipt`
    }
    return 'Read Receipts'
  }

  const receiptTitle = getReceiptTitle()

  // Common props for all receipt templates
  const receiptProps = {
    books,
    username,
    period,
    template,
    stats,
    displayBooks,
    orderId,
    today,
    renderStars,
    formatPrice,
    getPeriodLabel,
    barcode,
    receiptTitle,
    ref
  }

  // Add additional props for specific templates
  const enhancedProps = {
    ...receiptProps,
    showStats,
    pagesPerHour,
    readingGoal,
    receiptTitle
  }
  
  // Render the selected template
  switch (template) {
    case 'yearly':
      return <YearReceipt {...enhancedProps} selectedYear={selectedYear} />
    case 'monthly':
      return <MonthReceipt {...enhancedProps} selectedYear={selectedYear} selectedMonth={selectedMonth} />
    case 'seasonal':
      return <SeasonReceipt 
        {...enhancedProps} 
        selectedSeason={selectedSeason}
        customSeasonName={customSeasonName}
        customSeasonStart={customSeasonStart}
        customSeasonEnd={customSeasonEnd}
      />
    case 'tbr':
      return <TbrReceipt 
        {...enhancedProps} 
        numBooksToShow={numBooksToShow || 5} 
      />
    case 'current':
      return <CurrentlyReadingReceipt {...enhancedProps} />
    case 'standard':
    default:
      return <DefaultReceipt {...receiptProps} numBooksToShow={numBooksToShow} />
  }
})

ReceiptWrapper.displayName = 'ReceiptWrapper'

export default ReceiptWrapper
