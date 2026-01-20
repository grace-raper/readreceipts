import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { faker } from '@faker-js/faker'
import Papa from 'papaparse'
import { Edit2, Check } from 'lucide-react'
import ReceiptWrapper from '../components/ReceiptWrapper'
import ThankYouModal from '../components/ThankYouModal'
import TemplateSelector from '../components/receipt-generator/TemplateSelector'
import TemplateSettingsPanel from '../components/receipt-generator/TemplateSettingsPanel'
import BookManagementModal from '../components/receipt-generator/BookManagementModal'
import ManualBookForm from '../components/receipt-generator/ManualBookForm'
import { getSeasonYearLabel } from '../components/receipt-generator/utils/seasonUtils'
import { filterBooksForTemplate } from '../components/receipt-generator/utils/bookFilters'
import { downloadReceipt as downloadReceiptUtil, shareReceipt as shareReceiptUtil } from '../components/receipt-generator/utils/receiptUtils'
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
    await shareReceiptUtil(receiptRef, getPeriodLabel, downloadReceipt)
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

  const getSeasonYearLabelWrapper = (year, season = selectedSeason) => {
    return getSeasonYearLabel(year, season)
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
    await downloadReceiptUtil(receiptRef, getPeriodLabel)
    // Show thank you modal after successful download
    setTimeout(() => {
      setShowThankYouModal(true)
    }, 500)
  }

  const displayBooks = filterBooksForTemplate(books, template, {
    selectedYear,
    selectedMonth,
    selectedSeason,
    customSeasonStart,
    customSeasonEnd
  })
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
            
            <TemplateSelector template={template} setTemplate={setTemplate} />

            <TemplateSettingsPanel
              template={template}
              numBooksToShow={numBooksToShow}
              setNumBooksToShow={setNumBooksToShow}
              showStats={showStats}
              setShowStats={setShowStats}
              pagesPerHour={pagesPerHour}
              setPagesPerHour={setPagesPerHour}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              readingGoal={readingGoal}
              setReadingGoal={setReadingGoal}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedSeason={selectedSeason}
              setSelectedSeason={setSelectedSeason}
              customSeasonName={customSeasonName}
              setCustomSeasonName={setCustomSeasonName}
              customSeasonStart={customSeasonStart}
              setCustomSeasonStart={setCustomSeasonStart}
              customSeasonEnd={customSeasonEnd}
              setCustomSeasonEnd={setCustomSeasonEnd}
              getSeasonYearLabel={getSeasonYearLabelWrapper}
            />
            
            {/* Remove old seasonal template code below */}
            {false && template === 'seasonal' && (
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
              
              <ManualBookForm
                showManualEntry={showManualEntry}
                setShowManualEntry={setShowManualEntry}
                manualBook={manualBook}
                setManualBook={setManualBook}
                addManualBook={addManualBook}
              />
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


      <BookManagementModal
        showAllBooksModal={showAllBooksModal}
        setShowAllBooksModal={setShowAllBooksModal}
        books={books}
        modalShelf={modalShelf}
        setModalShelf={setModalShelf}
        editingBook={editingBook}
        setEditingBook={setEditingBook}
        startEditingBook={startEditingBook}
        saveEditedBook={saveEditedBook}
        cancelEditing={cancelEditing}
      />

      <ThankYouModal isOpen={showThankYouModal} onClose={() => setShowThankYouModal(false)} />
    </div>
  )
}

export default ReceiptGeneratorPage
