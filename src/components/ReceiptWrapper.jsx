import React, { forwardRef } from 'react'
import './Receipt.css'
import StandardReceipt from './templates/StandardReceipt'
import YearlyReceipt from './templates/YearlyReceipt'
import PagesReceipt from './templates/PagesReceipt'
import RatingsReceipt from './templates/RatingsReceipt'
import ShelfReceipt from './templates/ShelfReceipt'

const ReceiptWrapper = forwardRef(({ 
  books, 
  username, 
  period,
  template = 'standard',
  shelfType = 'tbr',
  readingGoal = 12,
  showStats = {
    booksRead: true,
    totalPages: true,
    estHours: true,
    avgRating: true,
    topAuthor: true
  },
  pagesPerHour = 30,
  numBooksToShow = 10,
  selectedYear,
  selectedMonth,
  selectedSeason,
  customSeasonName,
  customSeasonStart,
  customSeasonEnd
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
    const statsBooks = template === 'standard' ? visibleBooks.slice(0, numBooksToShow || visibleBooks.length) : visibleBooks
    const totalPages = statsBooks.reduce((sum, book) => sum + (book.pages || 0), 0)
    const totalHours = Math.round((totalPages / pagesPerHour) * 10) / 10
    const booksWithRatings = statsBooks.filter((b) => b.rating > 0)
    const avgRating =
      booksWithRatings.length > 0
        ? (booksWithRatings.reduce((sum, b) => sum + b.rating, 0) / booksWithRatings.length).toFixed(1)
        : 0

    const authorCounts = {}
    statsBooks.forEach((book) => {
      if (book.author) {
        authorCounts[book.author] = (authorCounts[book.author] || 0) + 1
      }
    })
    const topAuthor = Object.entries(authorCounts).sort((a, b) => b[1] - a[1])[0]

    return {
      totalBooks: statsBooks.length,
      totalPages,
      totalHours,
      avgRating,
      topAuthor: topAuthor ? `${topAuthor[0]} (${topAuthor[1]} books)` : 'N/A',
      readingGoal,
      pagesPerHour,
      showStats
    }
  }
  
  // Calculate stats based on visible books
  const stats = calculateStats()
  
  // Parent already applied template/period filters; only limit count for standard template.
  const displayBooks =
    template === 'standard' ? visibleBooks.slice(0, numBooksToShow) : visibleBooks
    
  const orderId = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, '0')
    
  // Generate appropriate date based on template and period
  let displayDate = new Date()
  let dateFormat = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }
  
  if (template === 'yearly' && selectedYear) {
    // For yearly template, show December 31 of the selected year
    displayDate = new Date(selectedYear, 11, 31)
    dateFormat = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }
  } else if (template === 'monthly' && selectedYear && selectedMonth !== undefined) {
    // For monthly template, show the last day of the selected month
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0).getDate()
    displayDate = new Date(selectedYear, selectedMonth, lastDay)
    dateFormat = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }
  } else if (template === 'seasonal') {
    if (selectedSeason === 'winter') {
      displayDate = new Date(new Date().getFullYear(), 1, 28) // Feb 28
    } else if (selectedSeason === 'spring') {
      displayDate = new Date(new Date().getFullYear(), 4, 31) // May 31
    } else if (selectedSeason === 'summer') {
      displayDate = new Date(new Date().getFullYear(), 7, 31) // Aug 31
    } else if (selectedSeason === 'fall') {
      displayDate = new Date(new Date().getFullYear(), 10, 30) // Nov 30
    } else if (selectedSeason === 'custom' && customSeasonEnd) {
      displayDate = new Date(customSeasonEnd)
    }
    dateFormat = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }
  }
  
  const today = displayDate
    .toLocaleDateString('en-US', dateFormat)
    .toUpperCase()

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
      return <YearlyReceipt {...enhancedProps} selectedYear={selectedYear} />
    case 'monthly':
      return <YearlyReceipt {...enhancedProps} selectedYear={selectedYear} selectedMonth={selectedMonth} />
    case 'seasonal':
      return <YearlyReceipt 
        {...enhancedProps} 
        selectedSeason={selectedSeason}
        customSeasonName={customSeasonName}
        customSeasonStart={customSeasonStart}
        customSeasonEnd={customSeasonEnd}
      />
    case 'pages':
      return <PagesReceipt {...enhancedProps} />
    case 'ratings':
      return <RatingsReceipt {...enhancedProps} />
    case 'tbr':
      return <ShelfReceipt 
        {...enhancedProps} 
        shelfType="tbr" 
        numBooksToShow={numBooksToShow || 5} 
      />
    case 'current':
      return <ShelfReceipt {...enhancedProps} shelfType="current" />
    case 'standard':
    default:
      return <StandardReceipt {...enhancedProps} numBooksToShow={numBooksToShow} />
  }
})

ReceiptWrapper.displayName = 'ReceiptWrapper'

export default ReceiptWrapper
