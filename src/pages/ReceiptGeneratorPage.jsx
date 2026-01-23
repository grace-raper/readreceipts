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
import { trackTemplateSelection, trackReceiptDownload, trackBookAction, trackEvent } from '../components/PostHogProvider'
import '../ReadingReceiptGenerator.css'
import '../ReceiptTemplates.css'

const ReceiptGeneratorPage = ({ initialBooks, initialUsername, shelfCounts = { read: 0, currentlyReading: 0, toRead: 0 }, onNavigate }) => {
  // Load from localStorage first, fallback to props only if nothing saved
  const getInitialState = () => {
    if (typeof window === 'undefined') return null
    try {
      const saved = localStorage.getItem('receiptSettings')
      if (saved) return JSON.parse(saved)
      const shared = localStorage.getItem('social_share_state')
      if (shared) {
        const sharedParsed = JSON.parse(shared)
        if (sharedParsed?.receiptConfig) {
          return {
            ...sharedParsed.receiptConfig,
            books: sharedParsed.books,
            username: sharedParsed.username
          }
        }
      }
    } catch (e) {
      console.error('Error loading initial state', e)
    }
    return null
  }

  const initialState = getInitialState()

  const [books, setBooks] = useState(initialState?.books || initialBooks)
  const [username, setUsername] = useState(() => {
    if (initialState?.username !== undefined) return initialState.username
    if (initialUsername) return initialUsername
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rrg_customer_name') || ''
    }
    return ''
  })
  const [period, setPeriod] = useState(initialState?.period || 'all')
  const [template, setTemplate] = useState(initialState?.template || 'standard')
  const [readingGoal, setReadingGoal] = useState(initialState?.readingGoal ?? 12)
  
  // Template engagement tracking
  const templateStartTimeRef = useRef(Date.now())
  const currentTemplateRef = useRef('standard')
  const templateInteractionsRef = useRef(0)
  const today = new Date()
  const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const [selectedYear, setSelectedYear] = useState(initialState?.selectedYear ?? lastMonthDate.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(initialState?.selectedMonth ?? lastMonthDate.getMonth())
  const [selectedSeason, setSelectedSeason] = useState(initialState?.selectedSeason || 'winter')
  const [customSeasonName, setCustomSeasonName] = useState(initialState?.customSeasonName || '')
  const [customSeasonStart, setCustomSeasonStart] = useState(initialState?.customSeasonStart || '')
  const [customSeasonEnd, setCustomSeasonEnd] = useState(initialState?.customSeasonEnd || '')
  const [receiptDate, setReceiptDate] = useState(initialState?.receiptDate || new Date().toISOString().split('T')[0])
  const [pagesPerHour, setPagesPerHour] = useState(initialState?.pagesPerHour ?? 30)
  const [numBooksToShow, setNumBooksToShow] = useState(initialState?.numBooksToShow ?? 10)
  const [showStats, setShowStats] = useState(initialState?.showStats || {
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
  const [showManualEntry, setShowManualEntry] = useState(initialState?.showManualEntry ?? false)
  const [showAllBooksModal, setShowAllBooksModal] = useState(false)
  const [modalShelf, setModalShelf] = useState(initialState?.modalShelf || 'all')
  const [showThankYouModal, setShowThankYouModal] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  const [chromeHidden, setChromeHidden] = useState(false)
  const [editingBook, setEditingBook] = useState(initialState?.editingBook || null)
  const [manualBook, setManualBook] = useState(initialState?.manualBook || {
    title: '',
    author: '',
    pages: '',
    rating: '',
    dateFinished: '',
    dateStarted: '',
    hidden: false
  })
  const receiptRef = useRef(null)
  const hasHydratedRef = useRef(false)

  useEffect(() => {
    // State already initialized from localStorage, just mark as hydrated
    hasHydratedRef.current = true
  }, [])

  useEffect(() => {
    if (!hasHydratedRef.current) return

    const settingsToSave = {
      selectedYear,
      selectedMonth,
      selectedSeason,
      customSeasonName,
      customSeasonStart,
      customSeasonEnd,
      pagesPerHour,
      numBooksToShow,
      showStats,
      showManualEntry,
      modalShelf,
      editingBook,
      manualBook,
      period,
      template,
      readingGoal,
      books,
      username
    }
    try {
      localStorage.setItem('receiptSettings', JSON.stringify(settingsToSave))
    } catch (e) {
      console.error('Error saving receipt settings', e)
    }
  }, [
    selectedYear,
    selectedMonth,
    selectedSeason,
    customSeasonName,
    customSeasonStart,
    customSeasonEnd,
    pagesPerHour,
    numBooksToShow,
    showStats,
    showManualEntry,
    modalShelf,
    editingBook,
    manualBook,
    period,
    template,
    readingGoal,
    books,
    username
  ])

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

  // Track time spent on each template
  useEffect(() => {
    // When template changes, track time spent on previous template
    if (currentTemplateRef.current !== template) {
      const timeSpent = Math.round((Date.now() - templateStartTimeRef.current) / 1000) // seconds
      
      trackEvent('template_engagement', {
        template_type: currentTemplateRef.current,
        time_spent_seconds: timeSpent,
        interactions_count: templateInteractionsRef.current,
        switched_to: template
      })
      
      // Reset for new template
      templateStartTimeRef.current = Date.now()
      currentTemplateRef.current = template
      templateInteractionsRef.current = 0
    }
  }, [template])

  // Track when user leaves page (final template engagement)
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - templateStartTimeRef.current) / 1000)
      trackEvent('template_engagement_final', {
        template_type: currentTemplateRef.current,
        time_spent_seconds: timeSpent,
        interactions_count: templateInteractionsRef.current
      })
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

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

  // Helper to track interactions on current template
  const trackInteraction = () => {
    templateInteractionsRef.current += 1
  }

  const getSeasonYearLabelWrapper = (year, season = selectedSeason) => {
    return getSeasonYearLabel(year, season)
  }

  const addManualBook = () => {
    if (!manualBook.title || !manualBook.author) {
      alert('Please enter at least title and author')
      return
    }

    const newBook = {
      ...manualBook,
      pages: parseInt(manualBook.pages) || 0,
      rating: parseFloat(manualBook.rating) || 0,
    }

    setBooks([...books, newBook])

    trackBookAction('manual_add', {
      has_pages: !!newBook.pages,
      has_rating: !!newBook.rating,
      has_date_finished: !!newBook.dateFinished,
      has_date_started: !!newBook.dateStarted
    })

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
    
    const originalBook = books[editingBook.index]
    
    const updatedBook = {
      title: editingBook.title,
      author: editingBook.author,
      pages: parseInt(editingBook.pages) || 0,
      rating: parseFloat(editingBook.rating) || 0,
      dateFinished: editingBook.dateFinished,
      dateStarted: editingBook.dateStarted,
      hidden: editingBook.hidden || false
    }
    
    const updatedBooks = [...books]
    updatedBooks[editingBook.index] = updatedBook
    
    setBooks(updatedBooks)
    
    // Track what fields were modified (anonymized - no book titles/authors)
    const modifications = {
      title_modified: originalBook.title !== updatedBook.title,
      author_modified: originalBook.author !== updatedBook.author,
      pages_modified: originalBook.pages !== updatedBook.pages,
      rating_modified: originalBook.rating !== updatedBook.rating,
      date_finished_modified: originalBook.dateFinished !== updatedBook.dateFinished,
      date_started_modified: originalBook.dateStarted !== updatedBook.dateStarted,
      hidden_modified: (originalBook.hidden || false) !== updatedBook.hidden,
      
      // Include new values for numeric fields (safe to track)
      new_pages: updatedBook.pages || null,
      previous_pages: originalBook.pages || null,
      new_rating: updatedBook.rating || null,
      previous_rating: originalBook.rating || null,
      
      // Track if dates were added/removed
      date_finished_added: !originalBook.dateFinished && !!updatedBook.dateFinished,
      date_finished_removed: !!originalBook.dateFinished && !updatedBook.dateFinished,
      date_started_added: !originalBook.dateStarted && !!updatedBook.dateStarted,
      date_started_removed: !!originalBook.dateStarted && !updatedBook.dateStarted,
      
      // Summary
      fields_modified_count: [
        originalBook.title !== updatedBook.title,
        originalBook.author !== updatedBook.author,
        originalBook.pages !== updatedBook.pages,
        originalBook.rating !== updatedBook.rating,
        originalBook.dateFinished !== updatedBook.dateFinished,
        originalBook.dateStarted !== updatedBook.dateStarted,
        (originalBook.hidden || false) !== updatedBook.hidden
      ].filter(Boolean).length,
      
      was_hidden: updatedBook.hidden,
      has_pages: !!updatedBook.pages,
      has_rating: !!updatedBook.rating
    }
    
    trackBookAction('edit', modifications)
    
    setEditingBook(null)
  }
  
  const removeBook = (index) => {
    if (window.confirm('Are you sure you want to remove this book?')) {
      trackBookAction('remove', {
        book_count_after: books.length - 1
      })
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
    // Calculate time spent on this template before download
    const timeSpentOnTemplate = Math.round((Date.now() - templateStartTimeRef.current) / 1000)
    
    // Comprehensive receipt settings for analytics
    const receiptSettings = {
      // Template identification
      template_type: template,
      
      // Book counts
      num_books_shown: effectiveNumBooksToShow,
      total_qualifying_books: displayBooks.length,
      total_books: books.length,
      total_read: shelfCounts.read,
      total_currently_reading: shelfCounts.currentlyReading,
      total_tbr: shelfCounts.toRead,
      
      // Time period settings
      selected_year: selectedYear,
      selected_month: selectedMonth,
      selected_season: selectedSeason,
      custom_season_name: customSeasonName || null,
      custom_season_start: customSeasonStart || null,
      custom_season_end: customSeasonEnd || null,
      
      // Customization settings
      reading_goal: readingGoal,
      pages_per_hour: pagesPerHour,
      num_books_to_show_setting: numBooksToShow,
      
      // Stats toggles (detailed breakdown)
      stats_section_enabled: showStats.statsSection,
      books_read_stat: showStats.booksRead,
      total_pages_stat: showStats.totalPages,
      est_hours_stat: showStats.estHours,
      avg_rating_stat: showStats.avgRating,
      goal_section_enabled: showStats.goalSection,
      goal_books_stat: showStats.goalBooks,
      goal_books_read_stat: showStats.goalBooksRead,
      goal_progress_stat: showStats.goalProgress,
      highlights_section_enabled: showStats.highlightsSection,
      highlights_avg_length: showStats.highlightsAvgLength,
      highlights_avg_rating: showStats.highlightsAvgRating,
      highlights_five_star: showStats.highlightsFiveStar,
      highlights_most_read_month: showStats.highlightsMostReadMonth,
      highlights_shortest: showStats.highlightsShortest,
      highlights_longest: showStats.highlightsLongest,
      tbr_section_enabled: showStats.tbrSection,
      tbr_books_stat: showStats.tbrBooks,
      tbr_added_this_year: showStats.tbrAddedThisYear,
      tbr_oldest: showStats.tbrOldest,
      tbr_newest: showStats.tbrNewest,
      
      // Engagement metrics
      time_spent_on_template_seconds: timeSpentOnTemplate,
      interactions_on_template: templateInteractionsRef.current,
      
      // Summary counts
      total_stats_enabled: Object.entries(showStats).filter(([k, v]) => v).length,
      stats_enabled_list: Object.entries(showStats).filter(([k, v]) => v).map(([k]) => k)
    }
    
    trackReceiptDownload(template, receiptSettings)
    
    await downloadReceiptUtil(receiptRef, getPeriodLabel)
    
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
              <h2 style={{ margin: '0 0 0.6rem', padding: 0 }}>Design Your Receipt:</h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <label className="rrg-label">Customer Name (optional)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('rrg_customer_name', e.target.value)
                  }
                }}
                placeholder="BOOKWORM23"
                className="rrg-input"
              />
            </div>
            
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
              receiptDate={receiptDate}
              setReceiptDate={setReceiptDate}
              getSeasonYearLabel={getSeasonYearLabelWrapper}
              onInteraction={trackInteraction}
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
                  receiptDate={receiptDate}
                />
              ) : (
                <div className="rrg-empty" style={{ padding: '3rem 2rem' }}>
                  No books match the selected time period. Try selecting "All Time" or add more books.
                </div>
              )}
              <div
                className="rrg-preview-actions"
                style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}
              >
                <button
                  onClick={downloadReceipt}
                  disabled={displayBooks.length === 0}
                  className="rrg-button secondary"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    const config = {
                      template,
                      period,
                      selectedYear,
                      selectedMonth,
                      selectedSeason,
                      customSeasonName,
                      customSeasonStart,
                      customSeasonEnd,
                      receiptDate,
                      pagesPerHour,
                      numBooksToShow,
                      showStats,
                      readingGoal,
                      displayBooks,
                      username
                    }
                    try {
                      localStorage.setItem(
                        'social_share_state',
                        JSON.stringify({
                          receiptConfig: config,
                          books: displayBooks,
                          username
                        })
                      )
                    } catch (e) {
                      console.error('Error saving social share state', e)
                    }
                    onNavigate?.('share-social', config)
                  }}
                  disabled={displayBooks.length === 0}
                  className="rrg-button"
                >
                  Share for Social
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
