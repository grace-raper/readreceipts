import React, { useState, useRef } from 'react'
import { Upload, Plus, X, Download } from 'lucide-react'
import Papa from 'papaparse'
import html2canvas from 'html2canvas'
import './ReadingReceiptGenerator.css'

const ReadingReceiptGenerator = ({
  initialBooks = [],
  initialUsername = '',
  enableUpload = true,
  showInputPanel = true,
  showManualControls = true,
  showDownloadButton = true,
  showPageHeader = true,
}) => {
  const [books, setBooks] = useState(initialBooks)
  const [username, setUsername] = useState(initialUsername)
  const [goodreadsUrl, setGoodreadsUrl] = useState('')
  const [period, setPeriod] = useState('all')
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [manualBook, setManualBook] = useState({
    title: '',
    author: '',
    pages: '',
    rating: '',
    dateFinished: '',
  })
  const receiptRef = useRef(null)
  const fileInputRef = useRef(null)

  React.useEffect(() => {
    setBooks(initialBooks)
  }, [initialBooks])

  React.useEffect(() => {
    setUsername(initialUsername)
  }, [initialUsername])

  const extractGoodreadsUsername = (url) => {
    if (!url) return ''
    const match = url.match(/goodreads\.com\/([^/]+)/)
    return match ? match[1] : ''
  }

  const handleGoodreadsUrlChange = (url) => {
    setGoodreadsUrl(url)
    const extractedUsername = extractGoodreadsUsername(url)
    if (extractedUsername && !username) {
      setUsername(extractedUsername)
    }
  }

  const renderStars = (rating) => {
    if (!rating) return ''
    return `${Math.round(rating)}/5`
  }

  const handleCSVUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const parsedBooks = results.data
          .filter((row) => row.Title && row.Title.trim())
          .map((row) => ({
            title: row.Title || row.title || '',
            author: row.Author || row.author || row['Author l-f'] || '',
            pages: parseInt(row['Number of Pages'] || row.pages || row['Page Count'] || 0),
            rating: parseFloat(row['My Rating'] || row.rating || row.Rating || 0),
            dateFinished: row['Date Read'] || row['date finished'] || row['Date Finished'] || '',
            dateStarted: row['Date Started'] || row['date started'] || '',
          }))

        setBooks(parsedBooks)
        if (!username && results.data[0]?.['Goodreads User']) {
          setUsername(results.data[0]['Goodreads User'])
        }
      },
      error: (error) => {
        alert('Error parsing CSV: ' + error.message)
      },
    })
  }

  const triggerCSVPicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
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

  const removeBook = (index) => {
    setBooks(books.filter((_, i) => i !== index))
  }

  const filterBooksByPeriod = () => {
    if (period === 'all') return books

    const now = new Date()
    const filtered = books.filter((book) => {
      if (!book.dateFinished) return false
      const bookDate = new Date(book.dateFinished)

      if (period === 'month') {
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        return bookDate >= monthAgo
      } else if (period === '6months') {
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
        return bookDate >= sixMonthsAgo
      } else if (period === 'year') {
        return bookDate.getFullYear() === now.getFullYear()
      }
      return true
    })

    return filtered.length > 0 ? filtered : books
  }

  const calculateStats = () => {
    const filteredBooks = filterBooksByPeriod()
    const totalPages = filteredBooks.reduce((sum, book) => sum + (book.pages || 0), 0)
    const totalMinutes = totalPages
    const totalHours = Math.round(totalMinutes / 60)
    const booksWithRatings = filteredBooks.filter((b) => b.rating > 0)
    const avgRating =
      booksWithRatings.length > 0
        ? (booksWithRatings.reduce((sum, b) => sum + b.rating, 0) / booksWithRatings.length).toFixed(1)
        : 0

    const authorCounts = {}
    filteredBooks.forEach((book) => {
      if (book.author) {
        authorCounts[book.author] = (authorCounts[book.author] || 0) + 1
      }
    })
    const topAuthor = Object.entries(authorCounts).sort((a, b) => b[1] - a[1])[0]

    return {
      totalBooks: filteredBooks.length,
      totalPages,
      totalHours,
      avgRating,
      topAuthor: topAuthor ? `${topAuthor[0]} (${topAuthor[1]} books)` : 'N/A',
    }
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
    } catch (error) {
      console.error('Error generating image:', error)
      alert('Error generating image. Please try taking a screenshot instead.')
    }
  }

  const stats = calculateStats()
  const displayBooks = filterBooksByPeriod().slice(0, 10)
  const orderId = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, '0')
  const today = new Date()
    .toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    .toUpperCase()

  return (
    <div className="rrg-page">
      <div className="rrg-container">
        {showPageHeader && (
          <>
            <h1 className="rrg-title">Read Receipts</h1>
            <p className="rrg-subtitle">Upload your CSV or manually enter books to generate a retro reading receipt.</p>
          </>
        )}

        <div className="rrg-grid">
          {showInputPanel && (
            <div className="rrg-card">
            <h2>Input Data</h2>

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

            <div style={{ marginBottom: '1rem' }}>
              <label className="rrg-label">Goodreads Profile (optional)</label>
              <input
                type="url"
                value={goodreadsUrl}
                onChange={(e) => handleGoodreadsUrlChange(e.target.value)}
                placeholder="https://www.goodreads.com/yourusername"
                className="rrg-input"
              />
              {goodreadsUrl && extractGoodreadsUsername(goodreadsUrl) && (
                <p className="rrg-helper">✓ Username extracted: {extractGoodreadsUsername(goodreadsUrl)}</p>
              )}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="rrg-label">Time Period</label>
              <select value={period} onChange={(e) => setPeriod(e.target.value)} className="rrg-select">
                <option value="all">All Time</option>
                <option value="year">This Year</option>
                <option value="6months">Last 6 Months</option>
                <option value="month">Last Month</option>
              </select>
            </div>

            {enableUpload && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="rrg-label">Upload CSV (Goodreads/StoryGraph)</label>
                <div className="rrg-upload" role="button" tabIndex={0} onClick={triggerCSVPicker} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && triggerCSVPicker()}>
                  <input ref={fileInputRef} type="file" accept=".csv" onChange={handleCSVUpload} style={{ display: 'none' }} />
                  <Upload size={28} />
                  <div className="rrg-upload-title">Click to upload CSV file</div>
                  <div className="rrg-upload-sub">We parse Title, Author, Pages, Rating, Date</div>
                </div>
              </div>
            )}

            {showManualControls && (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <button className="rrg-button" onClick={() => setShowManualEntry(!showManualEntry)}>
                    <Plus size={18} />
                    Add Book Manually
                  </button>
                </div>

                {showManualEntry && (
                  <div className="rrg-manual">
                    <input
                      type="text"
                      placeholder="Title"
                      value={manualBook.title}
                      onChange={(e) => setManualBook({ ...manualBook, title: e.target.value })}
                      className="rrg-input"
                      style={{ marginBottom: '0.5rem' }}
                    />
                    <input
                      type="text"
                      placeholder="Author"
                      value={manualBook.author}
                      onChange={(e) => setManualBook({ ...manualBook, author: e.target.value })}
                      className="rrg-input"
                      style={{ marginBottom: '0.5rem' }}
                    />
                    <input
                      type="number"
                      placeholder="Pages"
                      value={manualBook.pages}
                      onChange={(e) => setManualBook({ ...manualBook, pages: e.target.value })}
                      className="rrg-input"
                      style={{ marginBottom: '0.5rem' }}
                    />
                    <input
                      type="number"
                      step="0.5"
                      max="5"
                      placeholder="Rating (1-5)"
                      value={manualBook.rating}
                      onChange={(e) => setManualBook({ ...manualBook, rating: e.target.value })}
                      className="rrg-input"
                      style={{ marginBottom: '0.5rem' }}
                    />
                    <input
                      type="date"
                      value={manualBook.dateFinished}
                      onChange={(e) => setManualBook({ ...manualBook, dateFinished: e.target.value })}
                      className="rrg-input"
                      style={{ marginBottom: '0.75rem' }}
                    />
                    <button className="rrg-button" onClick={addManualBook} style={{ background: '#16a34a' }}>
                      Add Book
                    </button>
                  </div>
                )}
              </>
            )}

            {books.length > 0 && (
              <div>
                <h3 style={{ marginBottom: '0.6rem', color: '#0f172a' }}>Books ({books.length})</h3>
                <div className="rrg-books">
                  {books.map((book, idx) => (
                    <div key={idx} className="rrg-book-row">
                      <div style={{ flex: 1 }}>
                        <div className="rrg-book-title">
                          {book.title} <span className="rrg-book-author">- {book.author}</span>
                        </div>
                      </div>
                      <button className="rrg-delete" onClick={() => removeBook(idx)} aria-label="Remove book">
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          )}

          <div className="rrg-preview">
            {showDownloadButton && (
              <button
                onClick={downloadReceipt}
                disabled={books.length === 0}
                className="rrg-button secondary"
                style={{ width: 'fit-content', minWidth: '220px' }}
              >
                <Download size={18} />
                Download Receipt
              </button>
            )}

            {books.length === 0 ? (
              <div className="rrg-empty">Upload data or add books to generate receipt</div>
            ) : (
              <div ref={receiptRef} className="rrg-receipt" id="receipt">
                <div className="rrg-receipt-header">
                  <h2 className="rrg-receipt-title">READ RECEIPTS</h2>
                  <p className="rrg-receipt-period">{getPeriodLabel()}</p>
                  <div className="rrg-chip">EVERY PAGE IS A PENNY</div>
                </div>

                <div className="rrg-dashed">
                  <p style={{ margin: 0 }}>ORDER #{orderId} FOR {username || 'READER'}</p>
                  <p style={{ margin: 0 }}>{today}</p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div className="rrg-row" style={{ fontWeight: 700, fontSize: '12px' }}>
                    <span>RATING • ITEM</span>
                    <span>PRICE</span>
                  </div>
                  {displayBooks.map((book, idx) => (
                    <div key={idx} className="rrg-item">
                      <div className="rrg-item-row">
                        <span className="rrg-item-rating">
                          {book.rating ? `${Math.round(parseFloat(book.rating))}/5` : '—/5'}
                        </span>
                        <span className="rrg-item-title">
                          {book.title} <span className="rrg-receipt-author">- {book.author}</span>
                        </span>
                        <span className="rrg-item-price">
                          {book.pages ? `$${(book.pages / 100).toFixed(2)}` : '$0.00'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rrg-dashed-top">
                  <div className="rrg-row">
                    <span>ITEM COUNT:</span>
                    <strong>{stats.totalBooks}</strong>
                  </div>
                  <div className="rrg-row">
                    <span>TOTAL PAGES:</span>
                    <strong>{stats.totalPages}</strong>
                  </div>
                  <div className="rrg-row">
                    <span>HOURS READING:</span>
                    <strong>{stats.totalHours}</strong>
                  </div>
                  {stats.avgRating > 0 && (
                    <div className="rrg-row">
                      <span>AVG RATING:</span>
                      <strong>{stats.avgRating}/5.0</strong>
                    </div>
                  )}
                  <div className="rrg-row">
                    <span>TOP AUTHOR:</span>
                    <strong style={{ fontSize: '12px' }}>{stats.topAuthor}</strong>
                  </div>
                </div>

                <div style={{ borderTop: '2px dashed #d1d5db', paddingTop: '0.75rem', marginTop: '1rem', fontSize: '12px', color: '#4b5563' }}>
                  <p style={{ margin: 0 }}>CARD #: **** **** **** {new Date().getFullYear()}</p>
                  <p style={{ margin: 0 }}>AUTH CODE: {Math.floor(Math.random() * 900000 + 100000)}</p>
                  <p style={{ margin: 0 }}>CARDHOLDER: {username || 'READER'}</p>
                </div>

                <div style={{ textAlign: 'center', marginTop: '0.9rem' }}>
                  <p style={{ margin: 0, fontSize: '14px' }}>THANK YOU FOR VISITING!</p>
                </div>

                <div className="rrg-barcode">
                  <svg width="200" height="60">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <rect
                        key={i}
                        x={i * 5}
                        y={Math.random() * 20}
                        width={Math.random() > 0.5 ? 2 : 3}
                        height={60 - Math.random() * 20}
                        fill="black"
                      />
                    ))}
                  </svg>
                </div>

                <div style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
                  <p style={{ margin: 0 }}>readingreceipt.app</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReadingReceiptGenerator
