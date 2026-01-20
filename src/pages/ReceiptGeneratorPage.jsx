import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { faker } from '@faker-js/faker'
import Papa from 'papaparse'
import { BookOpen, BookMarked, Calendar, ListChecks, Snowflake, Flower, Sun, Leaf, Edit2, Plus, Check } from 'lucide-react'
import ReceiptWrapper from '../components/ReceiptWrapper'
import SummaryStatsToggles from '../components/SummaryStatsToggles'
import TbrStatToggles from '../components/TbrStatToggles'
import ThankYouModal from '../components/ThankYouModal'
import '../ReadingReceiptGenerator.css'
import '../ReceiptTemplates.css'

const ReceiptGeneratorPage = ({ initialBooks, initialUsername, shelfCounts = { read: 0, currentlyReading: 0, toRead: 0 } }) => {
  const [books, setBooks] = useState(initialBooks)
  const [username, setUsername] = useState(initialUsername)
  const [period, setPeriod] = useState('all')
  const [template, setTemplate] = useState('standard')
  const [readingGoal, setReadingGoal] = useState(12)
  const today = new Date()
  const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const [selectedYear, setSelectedYear] = useState(lastMonthDate.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(lastMonthDate.getMonth())
  const [selectedSeason, setSelectedSeason] = useState('winter')
  const [customSeasonName, setCustomSeasonName] = useState('')
  const [customSeasonStart, setCustomSeasonStart] = useState('')
  const [customSeasonEnd, setCustomSeasonEnd] = useState('')
  const [pagesPerHour, setPagesPerHour] = useState(30)
  const [numBooksToShow, setNumBooksToShow] = useState(10)
  const [showStats, setShowStats] = useState({
    booksRead: true,
    totalPages: true,
    estHours: true,
    avgRating: true,
    statsSection: true,
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
  })
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [showAllBooksModal, setShowAllBooksModal] = useState(false)
  const [modalShelf, setModalShelf] = useState('all')
  const [showThankYouModal, setShowThankYouModal] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  const [chromeHidden, setChromeHidden] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [manualBook, setManualBook] = useState({
    title: '',
    author: '',
    pages: '',
    rating: '',
    dateFinished: '',
    dateStarted: '',
    hidden: false
  })
  const receiptRef = useRef(null)

  useEffect(() => {
    const savedSettings = localStorage.getItem('receiptSettings')
    if (savedSettings) {
      const {
        selectedYear: storedYear,
        selectedMonth: storedMonth,
        selectedSeason: storedSeason,
        customSeasonName: storedCustomSeasonName,
        customSeasonStart: storedCustomSeasonStart,
        customSeasonEnd: storedCustomSeasonEnd,
        pagesPerHour: storedPagesPerHour,
        numBooksToShow: storedNumBooksToShow,
        showStats: storedShowStats,
        showManualEntry: storedShowManualEntry,
        modalShelf: storedModalShelf,
        editingBook: storedEditingBook,
        manualBook: storedManualBook,
      } = JSON.parse(savedSettings)

      setSelectedYear(storedYear)
      setSelectedMonth(storedMonth)
      setSelectedSeason(storedSeason)
      setCustomSeasonName(storedCustomSeasonName)
      setCustomSeasonStart(storedCustomSeasonStart)
      setCustomSeasonEnd(storedCustomSeasonEnd)
      setPagesPerHour(storedPagesPerHour)
      setNumBooksToShow(storedNumBooksToShow || 10)
      setShowStats({
        statsSection: storedShowStats?.statsSection ?? true,
        booksRead: storedShowStats?.booksRead ?? true,
        totalPages: storedShowStats?.totalPages ?? true,
        estHours: storedShowStats?.estHours ?? true,
        avgRating: storedShowStats?.avgRating ?? true,
        goalSection: storedShowStats?.goalSection ?? true,
        goalBooks: storedShowStats?.goalBooks ?? true,
        goalBooksRead: storedShowStats?.goalBooksRead ?? true,
        goalProgress: storedShowStats?.goalProgress ?? true,
        highlightsSection: storedShowStats?.highlightsSection ?? true,
        highlightsAvgLength: storedShowStats?.highlightsAvgLength ?? true,
        highlightsAvgRating: storedShowStats?.highlightsAvgRating ?? true,
        highlightsFiveStar: storedShowStats?.highlightsFiveStar ?? true,
        highlightsMostReadMonth: storedShowStats?.highlightsMostReadMonth ?? true,
        highlightsShortest: storedShowStats?.highlightsShortest ?? true,
        highlightsLongest: storedShowStats?.highlightsLongest ?? true,
        tbrSection: storedShowStats?.tbrSection ?? true,
        tbrBooks: storedShowStats?.tbrBooks ?? true,
        tbrAddedThisYear: storedShowStats?.tbrAddedThisYear ?? true,
        tbrOldest: storedShowStats?.tbrOldest ?? true,
        tbrNewest: storedShowStats?.tbrNewest ?? true,
      })
      setShowManualEntry(storedShowManualEntry)
      setModalShelf(storedModalShelf)
      setEditingBook(storedEditingBook)
      setManualBook(storedManualBook)
    }
  }, [])

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const currentY = window.scrollY
      const delta = currentY - lastY
      if (Math.abs(delta) < 6) return
      setChromeHidden(delta > 0)
      lastY = currentY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const shareReceipt = async () => {
    if (!receiptRef.current) return downloadReceipt()
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true,
      })
      const dataUrl = canvas.toDataURL('image/png')
      if (navigator.canShare && navigator.canShare()) {
        const blob = await (await fetch(dataUrl)).blob()
        const file = new File([blob], 'reading-receipt.png', { type: 'image/png' })
        await navigator.share({
          files: [file],
          title: 'Reading Receipt',
          text: 'Check out my reading receipt',
        })
      } else {
        const link = document.createElement('a')
        link.download = `reading-receipt-${getPeriodLabel().replace(/\s/g, '-').toLowerCase()}.png`
        link.href = dataUrl
        link.click()
      }
    } catch (err) {
      console.error('Share failed, falling back to download', err)
      downloadReceipt()
    }
  }

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    if (showAllBooksModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = prevOverflow
    }
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [showAllBooksModal])

  const getSeasonRange = () => {
    const year = selectedYear
    if (selectedSeason === 'winter') {
      return {
        start: new Date(year - 1, 11, 1), // Dec previous year
        end: new Date(year, 1, 29, 23, 59, 59, 999), // end of Feb
      }
    }
    if (selectedSeason === 'spring') {
      return { start: new Date(year, 2, 1), end: new Date(year, 4, 31, 23, 59, 59, 999) }
    }
    if (selectedSeason === 'summer') {
      return { start: new Date(year, 5, 1), end: new Date(year, 7, 31, 23, 59, 59, 999) }
    }
    if (selectedSeason === 'fall') {
      return { start: new Date(year, 8, 1), end: new Date(year, 10, 30, 23, 59, 59, 999) }
    }
    if (selectedSeason === 'custom' && customSeasonStart && customSeasonEnd) {
      return { start: new Date(customSeasonStart), end: new Date(customSeasonEnd) }
    }
    return null
  }

  const getSeasonYearLabel = (year, season = selectedSeason) => {
    if (season === 'winter') {
      return `${year} - Dec '${String(year - 1).slice(-2)}, Jan '${String(year).slice(-2)}, Feb '${String(year).slice(-2)}`
    }
    if (season === 'spring') return `${year} - Mar, Apr, May`
    if (season === 'summer') return `${year} - Jun, Jul, Aug`
    if (season === 'fall') return `${year} - Sep, Oct, Nov`
    return `${year}`
  }

  const filterBooksForTemplate = () => {
    let filtered = books

    if (template === 'tbr') {
      return filtered.filter((b) => b.shelf === 'toRead')
    }

    if (template === 'current') {
      return filtered.filter((b) => b.shelf === 'currentlyReading')
    }

    if (template === 'yearly') {
      return filtered.filter((b) => {
        if (!b.dateFinished) return false
        const d = new Date(b.dateFinished)
        return d.getFullYear() === selectedYear
      })
    }

    if (template === 'monthly') {
      return filtered.filter((b) => {
        if (!b.dateFinished) return false
        const d = new Date(b.dateFinished)
        return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth
      })
    }

    if (template === 'seasonal') {
      const range = getSeasonRange()
      if (!range) return filtered
      return filtered.filter((b) => {
        if (!b.dateFinished) return false
        const d = new Date(b.dateFinished)
        return d >= range.start && d <= range.end
      })
    }

    // standard template — show all read books
    return filtered.filter((b) => b.shelf === 'read')
  }

  const addManualBook = () => {
    if (!manualBook.title || !manualBook.author) {
      alert('Please enter at least title and author')
      return
    }

    setBooks([
      ...books,
      {
        ...manualBook,
        pages: parseInt(manualBook.pages) || 0,
        rating: parseFloat(manualBook.rating) || 0,
      },
    ])

    setManualBook({
      title: '',
      author: '',
      pages: '',
      rating: '',
      dateFinished: '',
    })
    setShowManualEntry(false)
  }

  const startEditingBook = (index) => {
    setEditingBook({
      index,
      ...books[index],
      hidden: books[index].hidden || false,
      dateStarted: books[index].dateStarted || ''
    })
  }

  const saveEditedBook = () => {
    if (!editingBook) return
    
    const updatedBooks = [...books]
    updatedBooks[editingBook.index] = {
      title: editingBook.title,
      author: editingBook.author,
      pages: parseInt(editingBook.pages) || 0,
      rating: parseFloat(editingBook.rating) || 0,
      dateFinished: editingBook.dateFinished,
      dateStarted: editingBook.dateStarted,
      hidden: editingBook.hidden || false
    }
    
    setBooks(updatedBooks)
    setEditingBook(null)
  }
  
  const removeBook = (index) => {
    if (window.confirm('Are you sure you want to remove this book?')) {
      setBooks(books.filter((_, i) => i !== index))
    }
  }

  const cancelEditing = () => {
    setEditingBook(null)
  }

  const getPeriodLabel = () => {
    if (period === 'month') return 'LAST MONTH'
    if (period === '6months') return 'LAST 6 MONTHS'
    if (period === 'year') return new Date().getFullYear().toString()
    return 'ALL TIME'
  }

  const downloadReceipt = async () => {
    if (!receiptRef.current) return

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true,
      })
      const data = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `reading-receipt-${getPeriodLabel().replace(/\s/g, '-').toLowerCase()}.png`
      link.href = data
      link.click()
      
      // Show thank you modal after successful download
      setTimeout(() => {
        setShowThankYouModal(true)
      }, 500)
    } catch (error) {
      console.error('Error generating image:', error)
      alert('Error generating image. Please try taking a screenshot instead.')
    }
  }

  const displayBooks = filterBooksForTemplate()
  const modalDisplayBooks =
    modalShelf === 'all'
      ? books
      : books.filter((b) => {
          if (modalShelf === 'read') return b.shelf === 'read'
          if (modalShelf === 'currentlyReading') return b.shelf === 'currentlyReading'
          if (modalShelf === 'toRead') return b.shelf === 'toRead'
          return true
        })

  const effectiveNumBooksToShow = numBooksToShow || 1

  return (
    <div className="rrg-page">

      <div className="rrg-container">
        <div className="rrg-content">
          <div className="rrg-main-layout">
            <div className="rrg-customize">
              <h2>Customize</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="rrg-label">Receipt Template</label>
              <div className="rrg-template-grid rrg-template-grid--main">
                <button 
                  className={`rrg-template-button ${template === 'standard' ? 'active' : ''}`}
                  onClick={() => setTemplate('standard')}
                >
                  <BookOpen size={18} />
                  <span>Default</span>
                </button>
                <button 
                  className={`rrg-template-button ${template === 'yearly' ? 'active' : ''}`}
                  onClick={() => setTemplate('yearly')}
                >
                  <Calendar size={18} />
                  <span>Year</span>
                </button>
                <button 
                  className={`rrg-template-button ${template === 'monthly' ? 'active' : ''}`}
                  onClick={() => setTemplate('monthly')}
                >
                  <Calendar size={18} />
                  <span>Monthly</span>
                </button>
                <button 
                  className={`rrg-template-button ${template === 'seasonal' ? 'active' : ''}`}
                  onClick={() => setTemplate('seasonal')}
                >
                  <Calendar size={18} />
                  <span>Season</span>
                </button>
                <button 
                  className={`rrg-template-button ${template === 'tbr' ? 'active' : ''}`}
                  onClick={() => setTemplate('tbr')}
                >
                  <ListChecks size={18} />
                  <span>TBR</span>
                </button>
                <button 
                  className={`rrg-template-button ${template === 'current' ? 'active' : ''}`}
                  onClick={() => setTemplate('current')}
                >
                  <BookMarked size={18} />
                  <span>Current</span>
                </button>
              </div>
            </div>

            {/* Template-specific settings */}
            {template === 'tbr' && (
              <div className="rrg-settings-section">
                <div style={{ marginBottom: '1rem' }}>
                  <label className="rrg-label">Number of books to show</label>
                  <input
                    type="number"
                    value={numBooksToShow === null ? '' : numBooksToShow}
                    onChange={(e) => {
                      const val = e.target.value
                      if (val === '') return setNumBooksToShow(null)
                      const parsed = Math.max(1, Math.min(50, parseInt(val, 10) || 1))
                      setNumBooksToShow(parsed)
                    }}
                    className="rrg-input"
                    max="50"
                  />
                </div>

                <TbrStatToggles showStats={showStats} setShowStats={setShowStats} />
              </div>
            )}
            
            {template === 'standard' && (
              <div className="rrg-settings-section">
                <div style={{ marginBottom: '1rem' }}>
                  <label className="rrg-label">Number of books to include in stats</label>
                  <input
                    type="number"
                    value={numBooksToShow === null ? '' : numBooksToShow}
                    onChange={(e) => {
                      const val = e.target.value
                      if (val === '') return setNumBooksToShow(null)
                      const parsed = Math.max(1, Math.min(50, parseInt(val, 10) || 1))
                      setNumBooksToShow(parsed)
                    }}
                    className="rrg-input"
                    max="50"
                  />
                </div>

                <SummaryStatsToggles
                  showStats={showStats}
                  setShowStats={setShowStats}
                  pagesPerHour={pagesPerHour}
                  setPagesPerHour={setPagesPerHour}
                />
              </div>
            )}
            
            {template === 'yearly' && (
              <div className="rrg-settings-section">
                <div style={{ marginBottom: '1rem' }}>
                  <label className="rrg-label">Year</label>
                  <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))} 
                    className="rrg-select"
                  >
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <SummaryStatsToggles
                  showStats={showStats}
                  setShowStats={setShowStats}
                  pagesPerHour={pagesPerHour}
                  setPagesPerHour={setPagesPerHour}
                  showGoalControls
                  showHighlightControls
                  goalInput={
                    <div style={{ }}>
                      <label className="rrg-label" style={{ fontWeight: 400, fontSize: '0.9rem' }}>
                        What was your reading goal for {selectedYear || new Date().getFullYear()}?
                      </label>
                      <input
                        type="number"
                        value={readingGoal === null ? '' : readingGoal}
                        onChange={(e) => {
                          const val = e.target.value
                          if (val === '') {
                            setReadingGoal(null)
                            return
                          }
                          const parsed = Math.max(1, Math.min(5000, parseInt(val, 10) || 1))
                          setReadingGoal(parsed)
                        }}
                        className="rrg-input"
                        min="1"
                        max="5000"
                      />
                    </div>
                  }
                />
              </div>
            )}
            
            {template === 'monthly' && (
              <div className="rrg-settings-section">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <label className="rrg-label">Month</label>
                    <select 
                      value={selectedMonth} 
                      onChange={(e) => setSelectedMonth(parseInt(e.target.value))} 
                      className="rrg-select"
                    >
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                        <option key={index} value={index}>{month}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="rrg-label">Year</label>
                    <select 
                      value={selectedYear} 
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))} 
                      className="rrg-select"
                    >
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <SummaryStatsToggles
                  showStats={showStats}
                  setShowStats={setShowStats}
                  pagesPerHour={pagesPerHour}
                  setPagesPerHour={setPagesPerHour}
                />
              </div>
            )}
            
            {template === 'seasonal' && (
              <div className="rrg-settings-section">
                <div style={{ marginBottom: '1rem' }}>
                  <label className="rrg-label">Season</label>
                  <div className="rrg-template-grid rrg-template-grid--season">
                    <button 
                      className={`rrg-template-button ${selectedSeason === 'winter' ? 'active' : ''}`}
                      onClick={() => setSelectedSeason('winter')}
                    >
                      <Snowflake size={18} color={selectedSeason === 'winter' ? '#fff' : '#111'} />
                      <span>Winter</span>
                    </button>
                    <button 
                      className={`rrg-template-button ${selectedSeason === 'spring' ? 'active' : ''}`}
                      onClick={() => setSelectedSeason('spring')}
                    >
                      <Flower size={18} color={selectedSeason === 'spring' ? '#fff' : '#111'} />
                      <span>Spring</span>
                    </button>
                    <button 
                      className={`rrg-template-button ${selectedSeason === 'summer' ? 'active' : ''}`}
                      onClick={() => setSelectedSeason('summer')}
                    >
                      <Sun size={18} color={selectedSeason === 'summer' ? '#fff' : '#111'} />
                      <span>Summer</span>
                    </button>
                    <button 
                      className={`rrg-template-button ${selectedSeason === 'fall' ? 'active' : ''}`}
                      onClick={() => setSelectedSeason('fall')}
                    >
                      <Leaf size={18} color={selectedSeason === 'fall' ? '#fff' : '#111'} />
                      <span>Fall</span>
                    </button>
                    <button 
                      className={`rrg-template-button ${selectedSeason === 'custom' ? 'active' : ''}`}
                      onClick={() => setSelectedSeason('custom')}
                    >
                      <Calendar size={18} color={selectedSeason === 'custom' ? '#fff' : '#111'} />
                      <span>Custom</span>
                    </button>
                  </div>
                </div>
                
                {selectedSeason !== 'custom' && (
                  <div style={{ marginBottom: '1rem' }}>
                    <label className="rrg-label">Year</label>
                    <select 
                      value={selectedYear} 
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))} 
                      className="rrg-select"
                    >
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>
                          {getSeasonYearLabel(year, selectedSeason)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                {selectedSeason === 'custom' && (
                  <>
                    <div style={{ marginBottom: '1rem' }}>
                      <label className="rrg-label">Start / End Dates</label>
                      <div className="rrg-season-dates">
                        <input
                          type="date"
                          value={customSeasonStart}
                          onChange={(e) => setCustomSeasonStart(e.target.value)}
                          className="rrg-input"
                          style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}
                        />
                        <input
                          type="date"
                          value={customSeasonEnd}
                          onChange={(e) => setCustomSeasonEnd(e.target.value)}
                          className="rrg-input"
                          style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <label className="rrg-label">
                        Time Period Name <span style={{ fontStyle: 'italic', fontWeight: 'normal' }}>(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={customSeasonName}
                        onChange={(e) => setCustomSeasonName(e.target.value)}
                        placeholder="Vacation Reads, Summer Challenge"
                        className="rrg-input"
                      />
                    </div>
                  </>
                )}

                <SummaryStatsToggles
                  showStats={showStats}
                  setShowStats={setShowStats}
                  pagesPerHour={pagesPerHour}
                  setPagesPerHour={setPagesPerHour}
                />
              </div>
            )}
            
            <div className="rrg-books-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 className="rrg-settings-title" style={{ margin: 0 }}>
                  Qualifying Books ({displayBooks.length}/{books.length})
                </h3>
                <button 
                  onClick={() => setShowAllBooksModal(true)}
                  className="rrg-button secondary"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
                >
                  View All Books
                </button>
              </div>
              
              <div className="rrg-books">
                {books.length === 0 ? (
                  <div className="rrg-empty">No books yet. Add some manually or upload a CSV.</div>
                ) : displayBooks.length === 0 ? (
                  <div className="rrg-empty">No qualifying books match the current template settings.</div>
                ) : (
                  displayBooks.map((book) => {
                    const originalIndex = books.findIndex((b) => b === book)

                    const isEditing = editingBook && editingBook.index === originalIndex
                    const isHiddenDisplay = book.hidden && !isEditing

                    return (
                      <div key={originalIndex} className="rrg-book-row">
                        {editingBook && editingBook.index === originalIndex ? (
                          <div className="rrg-book-edit">
                            <div className="rrg-form-group">
                              <label className="rrg-label">Title</label>
                              <input
                                type="text"
                                value={editingBook.title}
                                onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                                className="rrg-input"
                              />
                            </div>

                            <div className="rrg-form-group">
                              <label className="rrg-label">Author</label>
                              <input
                                type="text"
                                value={editingBook.author}
                                onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                                className="rrg-input"
                              />
                            </div>

                            <div className="rrg-book-edit-row">
                              <div className="rrg-form-group">
                                <label className="rrg-label">Pages</label>
                                <input
                                  type="number"
                                  value={editingBook.pages}
                                  onChange={(e) => setEditingBook({ ...editingBook, pages: e.target.value })}
                                  className="rrg-input"
                                  min="0"
                                />
                              </div>

                              <div className="rrg-form-group">
                                <label className="rrg-label">Rating (0-5)</label>
                                <input
                                  type="number"
                                  value={editingBook.rating}
                                  onChange={(e) => setEditingBook({ ...editingBook, rating: e.target.value })}
                                  className="rrg-input"
                                  step="0.1"
                                  min="0"
                                  max="5"
                                />
                              </div>
                            </div>

                            <div className="rrg-book-edit-row">
                              <div className="rrg-form-group">
                                <label className="rrg-label">Date Started</label>
                                <input
                                  type="date"
                                  value={editingBook.dateStarted || ''}
                                  onChange={(e) => setEditingBook({ ...editingBook, dateStarted: e.target.value })}
                                  className="rrg-input"
                                />
                              </div>

                              <div className="rrg-form-group">
                                <label className="rrg-label">Date Finished</label>
                                <input
                                  type="date"
                                  value={editingBook.dateFinished || ''}
                                  onChange={(e) => setEditingBook({ ...editingBook, dateFinished: e.target.value })}
                                  className="rrg-input"
                                />
                              </div>
                            </div>

                            <div className="rrg-form-group rrg-checkbox-group">
                              <label className="rrg-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={editingBook.hidden || false}
                                  onChange={(e) => setEditingBook({ ...editingBook, hidden: e.target.checked })}
                                  className="rrg-checkbox"
                                />
                                Hide from receipt
                              </label>
                            </div>

                            <div className="rrg-book-edit-actions">
                              <button onClick={saveEditedBook} className="rrg-button" style={{ flex: 1 }}>
                                <Check size={16} /> Save
                              </button>
                              <button onClick={cancelEditing} className="rrg-button secondary" style={{ flex: 1 }}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div
                              style={{ flex: 1, minWidth: 0 }}
                              className={isHiddenDisplay ? 'hidden' : ''}
                            >
                              <div className="rrg-book-title">{book.title}</div>
                              <div className="rrg-book-author">{book.author}</div>
                              <div className="rrg-book-details">
                                {book.pages > 0 && <span>{book.pages} pages</span>}
                                {book.rating > 0 && <span>★{book.rating.toFixed(1)}</span>}
                                {book.dateFinished && <span>{new Date(book.dateFinished).toLocaleDateString()}</span>}
                                {book.hidden && <span className="rrg-hidden-badge">Hidden</span>}
                              </div>
                            </div>
                            <div className="rrg-book-actions">
                              <button
                                onClick={() => startEditingBook(originalIndex)}
                                className="rrg-button secondary"
                                style={{ padding: '0.35rem' }}
                              >
                                <Edit2 size={16} />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
              
              <div style={{ marginTop: '1rem' }}>
                <button onClick={() => setShowManualEntry(!showManualEntry)} className="rrg-button secondary" style={{ width: '100%' }}>
                  <Plus size={18} />
                  Add Book Manually
                </button>
              </div>
              
              {showManualEntry && (
                <div className="rrg-manual">
                  <h3 style={{ marginTop: '1rem', marginBottom: '0.75rem', fontSize: '14px' }}>Add a Book</h3>
                  <div className="rrg-form-group">
                    <label className="rrg-label">Title</label>
                    <input
                      type="text"
                      value={manualBook.title}
                      onChange={(e) => setManualBook({ ...manualBook, title: e.target.value })}
                      className="rrg-input"
                    />
                  </div>
                  
                  <div className="rrg-form-group">
                    <label className="rrg-label">Author</label>
                    <input
                      type="text"
                      value={manualBook.author}
                      onChange={(e) => setManualBook({ ...manualBook, author: e.target.value })}
                      className="rrg-input"
                    />
                  </div>
                  
                  <div className="rrg-book-edit-row">
                    <div className="rrg-form-group">
                      <label className="rrg-label">Pages</label>
                      <input
                        type="number"
                        value={manualBook.pages}
                        onChange={(e) => setManualBook({ ...manualBook, pages: e.target.value })}
                        className="rrg-input"
                        min="0"
                      />
                    </div>
                    
                    <div className="rrg-form-group">
                      <label className="rrg-label">Rating (0-5)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={manualBook.rating}
                        onChange={(e) => setManualBook({ ...manualBook, rating: e.target.value })}
                        className="rrg-input"
                      />
                    </div>
                  </div>
                  
                  <div className="rrg-book-edit-row">
                    <div className="rrg-form-group">
                      <label className="rrg-label">Date Started</label>
                      <input
                        type="date"
                        value={manualBook.dateStarted}
                        onChange={(e) => setManualBook({ ...manualBook, dateStarted: e.target.value })}
                        className="rrg-input"
                      />
                    </div>
                    
                    <div className="rrg-form-group">
                      <label className="rrg-label">Date Finished</label>
                      <input
                        type="date"
                        value={manualBook.dateFinished}
                        onChange={(e) => setManualBook({ ...manualBook, dateFinished: e.target.value })}
                        className="rrg-input"
                      />
                    </div>
                  </div>
                  
                  <div className="rrg-form-group rrg-checkbox-group">
                    <label className="rrg-checkbox-label">
                      <input
                        type="checkbox"
                        checked={manualBook.hidden || false}
                        onChange={(e) => setManualBook({ ...manualBook, hidden: e.target.checked })}
                        className="rrg-checkbox"
                      />
                      Hide from receipt
                    </label>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <button onClick={addManualBook} className="rrg-button" style={{ flex: 1 }}>
                      Add
                    </button>
                    <button onClick={() => setShowManualEntry(false)} className="rrg-button secondary" style={{ flex: 1 }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label className="rrg-label">Username (optional)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="BOOKWORM23"
                className="rrg-input"
              />
            </div>

            </div>
            
            <div className="rrg-preview">
              {displayBooks.length > 0 ? (
                <ReceiptWrapper
                  key={`${template}-${selectedSeason}-${selectedYear}-${selectedMonth}-${customSeasonName}-${customSeasonStart}-${customSeasonEnd}-${period}`}
                  ref={receiptRef}
                  books={displayBooks}
                  username={username}
                  period={period}
                  template={template}
                  readingGoal={readingGoal}
                  showStats={showStats}
                  pagesPerHour={pagesPerHour}
                  numBooksToShow={numBooksToShow}
                  selectedYear={selectedYear}
                  selectedMonth={selectedMonth}
                  selectedSeason={selectedSeason}
                  customSeasonName={customSeasonName}
                  customSeasonStart={customSeasonStart}
                  customSeasonEnd={customSeasonEnd}
                />
              ) : (
                <div className="rrg-empty" style={{ padding: '3rem 2rem' }}>
                  No books match the selected time period. Try selecting "All Time" or add more books.
                </div>
              )}
              <div className="rrg-preview-actions">
                <button
                  onClick={downloadReceipt}
                  disabled={displayBooks.length === 0}
                  className="rrg-button secondary"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {showAllBooksModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 999,
          }}
          onClick={() => setShowAllBooksModal(false)}
        >
          <div
            style={{
              background: '#fffaf1',
              padding: '0',
              borderRadius: '12px',
              maxWidth: '820px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                position: 'sticky',
                top: 0,
                background: '#fffaf1',
                zIndex: 1,
                padding: '1rem 1.5rem 0.75rem 1.5rem',
                marginBottom: '0.5rem',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                <div>
                  <h3 style={{ margin: 0 }}>All Books</h3>
                </div>
                <div
                  onClick={() => setShowAllBooksModal(false)}
                  style={{
                    width: 'auto',
                    padding: '0.35rem 0.5rem',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '1.4rem',
                    lineHeight: 1,
                    cursor: 'pointer'
                  }}
                  aria-label="Close"
                >
                  ×
                </div>
              </div>

              {/* Modal tabs for shelf filter */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                {[
                  { key: 'all', label: 'All' },
                  { key: 'read', label: 'Read' },
                  { key: 'currentlyReading', label: 'Currently Reading' },
                  { key: 'toRead', label: 'To Read' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setModalShelf(tab.key)}
                    style={{
                      padding: '0.4rem 0.9rem',
                      borderRadius: '999px',
                      border: modalShelf === tab.key ? '1px solid #2563eb' : '1px solid #e5e7eb',
                      background: modalShelf === tab.key ? '#eff6ff' : '#fff',
                      color: modalShelf === tab.key ? '#1d4ed8' : '#374151',
                      fontWeight: 600,
                      boxShadow: modalShelf === tab.key ? '0 6px 20px rgba(37, 99, 235, 0.15)' : 'none'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
              {modalDisplayBooks.length === 0 ? (
                <div className="rrg-empty">No books in this shelf.</div>
              ) : (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {modalDisplayBooks.map((book) => {
                    const originalIndex = books.findIndex((b) => b === book)
                  const shelfLabel =
                    book.shelf === 'currentlyReading'
                      ? 'currently-reading'
                      : book.shelf === 'toRead'
                      ? 'to-read'
                      : 'read'
                  const shelfColors = {
                    read: { bg: '#ecfdf3', fg: '#166534' },
                    toRead: { bg: '#fdf2f8', fg: '#9d174d' },
                    currentlyReading: { bg: '#eff6ff', fg: '#1d4ed8' },
                  }
                  const colors = shelfColors[book.shelf] || shelfColors.read

                    return (
                      <div
                        key={`all-book-${originalIndex}`}
                        className={`rrg-book-row ${book.hidden ? 'hidden' : ''}`}
                        style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}
                      >
                      {editingBook && editingBook.index === originalIndex ? (
                        <div className="rrg-book-edit">
                          <div className="rrg-form-group">
                            <label className="rrg-label">Title</label>
                            <input
                              type="text"
                              value={editingBook.title}
                              onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                              className="rrg-input"
                            />
                          </div>

                          <div className="rrg-form-group">
                            <label className="rrg-label">Author</label>
                            <input
                              type="text"
                              value={editingBook.author}
                              onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                              className="rrg-input"
                            />
                          </div>

                          <div className="rrg-book-edit-row">
                            <div className="rrg-form-group">
                              <label className="rrg-label">Pages</label>
                              <input
                                type="number"
                                value={editingBook.pages}
                                onChange={(e) => setEditingBook({ ...editingBook, pages: e.target.value })}
                                className="rrg-input"
                                min="0"
                              />
                            </div>

                            <div className="rrg-form-group">
                              <label className="rrg-label">Rating (0-5)</label>
                              <input
                                type="number"
                                value={editingBook.rating}
                                onChange={(e) => setEditingBook({ ...editingBook, rating: e.target.value })}
                                className="rrg-input"
                                step="0.1"
                                min="0"
                                max="5"
                              />
                            </div>
                          </div>

                          <div className="rrg-book-edit-row">
                            <div className="rrg-form-group">
                              <label className="rrg-label">Date Started</label>
                              <input
                                type="date"
                                value={editingBook.dateStarted || ''}
                                onChange={(e) => setEditingBook({ ...editingBook, dateStarted: e.target.value })}
                                className="rrg-input"
                              />
                            </div>

                            <div className="rrg-form-group">
                              <label className="rrg-label">Date Finished</label>
                              <input
                                type="date"
                                value={editingBook.dateFinished || ''}
                                onChange={(e) => setEditingBook({ ...editingBook, dateFinished: e.target.value })}
                                className="rrg-input"
                              />
                            </div>
                          </div>

                          <div className="rrg-form-group rrg-checkbox-group">
                            <label className="rrg-checkbox-label">
                              <input
                                type="checkbox"
                                checked={editingBook.hidden || false}
                                onChange={(e) => setEditingBook({ ...editingBook, hidden: e.target.checked })}
                                className="rrg-checkbox"
                              />
                              Hide from receipt
                            </label>
                          </div>

                          <div className="rrg-book-edit-actions">
                            <button onClick={saveEditedBook} className="rrg-button" style={{ flex: 1 }}>
                              <Check size={16} /> Save
                            </button>
                            <button onClick={cancelEditing} className="rrg-button secondary" style={{ flex: 1 }}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                alignSelf: 'flex-start',
                                padding: '0.25rem 0.65rem',
                                borderRadius: '999px',
                                background: colors.bg,
                                color: colors.fg,
                                fontSize: '0.8rem',
                                textTransform: 'capitalize',
                                whiteSpace: 'nowrap',
                                display: 'inline-block',
                                marginBottom: '0.35rem',
                              }}
                            >
                              {shelfLabel}
                            </div>
                            <div className="rrg-book-title">{book.title}</div>
                            <div className="rrg-book-author">{book.author}</div>
                            <div className="rrg-book-details">
                              {book.pages > 0 && <span>{book.pages} pages</span>}
                              {book.rating > 0 && <span>★{book.rating.toFixed(1)}</span>}
                              {book.dateFinished && <span>{new Date(book.dateFinished).toLocaleDateString()}</span>}
                              {book.hidden && <span className="rrg-hidden-badge">Hidden</span>}
                            </div>
                          </div>
                          <div className="rrg-book-actions" style={{ alignItems: 'flex-start', gap: '0.4rem' }}>
                            <button
                              onClick={() => startEditingBook(originalIndex)}
                              className="rrg-button secondary"
                              style={{ padding: '0.35rem' }}
                            >
                              <Edit2 size={16} />
                            </button>
                          </div>
                        </>
                      )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ThankYouModal isOpen={showThankYouModal} onClose={() => setShowThankYouModal(false)} />
    </div>
  )
}

export default ReceiptGeneratorPage
