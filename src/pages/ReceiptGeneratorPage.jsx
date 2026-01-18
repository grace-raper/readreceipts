import React, { useState, useRef } from 'react'
import { Download, Plus, X } from 'lucide-react'
import html2canvas from 'html2canvas'
import Receipt from '../components/Receipt'
import ThankYouModal from '../components/ThankYouModal'
import '../ReadingReceiptGenerator.css'

const ReceiptGeneratorPage = ({ initialBooks, initialUsername }) => {
  const [books, setBooks] = useState(initialBooks)
  const [username, setUsername] = useState(initialUsername)
  const [period, setPeriod] = useState('all')
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [showThankYouModal, setShowThankYouModal] = useState(false)
  const [manualBook, setManualBook] = useState({
    title: '',
    author: '',
    pages: '',
    rating: '',
    dateFinished: '',
  })
  const receiptRef = useRef(null)

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

  const displayBooks = filterBooksByPeriod()

  return (
    <div className="rrg-page">
      <div className="rrg-container">
        <h1 className="rrg-title">Read Receipts</h1>
        <p className="rrg-subtitle">Customize your receipt and download it.</p>

        <div className="rrg-grid">
          <div className="rrg-card">
            <h2>Customize</h2>

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
              <label className="rrg-label">Time Period</label>
              <select value={period} onChange={(e) => setPeriod(e.target.value)} className="rrg-select">
                <option value="all">All Time</option>
                <option value="year">This Year</option>
                <option value="6months">Last 6 Months</option>
                <option value="month">Last Month</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <button onClick={() => setShowManualEntry(!showManualEntry)} className="rrg-button secondary" style={{ width: '100%' }}>
                <Plus size={18} />
                Add Book Manually
              </button>
            </div>

            {showManualEntry && (
              <div className="rrg-manual">
                <h3 style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '14px' }}>Add a Book</h3>
                <input
                  type="text"
                  placeholder="Book Title"
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
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="Rating (0-5)"
                  value={manualBook.rating}
                  onChange={(e) => setManualBook({ ...manualBook, rating: e.target.value })}
                  className="rrg-input"
                  style={{ marginBottom: '0.5rem' }}
                />
                <input
                  type="date"
                  placeholder="Date Finished"
                  value={manualBook.dateFinished}
                  onChange={(e) => setManualBook({ ...manualBook, dateFinished: e.target.value })}
                  className="rrg-input"
                  style={{ marginBottom: '0.75rem' }}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={addManualBook} className="rrg-button" style={{ flex: 1 }}>
                    Add
                  </button>
                  <button onClick={() => setShowManualEntry(false)} className="rrg-button secondary" style={{ flex: 1 }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="rrg-books">
              <h3 style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '14px' }}>
                Your Books ({books.length})
              </h3>
              {books.length === 0 ? (
                <div className="rrg-empty">No books yet. Add some manually or upload a CSV.</div>
              ) : (
                books.map((book, index) => (
                  <div key={index} className="rrg-book-row">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="rrg-book-title">{book.title}</div>
                      <div className="rrg-book-author">{book.author}</div>
                    </div>
                    <button onClick={() => removeBook(index)} className="rrg-button secondary" style={{ padding: '0.35rem' }}>
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rrg-preview">
            <button onClick={downloadReceipt} disabled={displayBooks.length === 0} className="rrg-button secondary">
              <Download size={18} />
              Download Receipt
            </button>
            {displayBooks.length > 0 ? (
              <Receipt ref={receiptRef} books={displayBooks} username={username} period={period} />
            ) : (
              <div className="rrg-empty" style={{ padding: '3rem 2rem' }}>
                No books match the selected time period. Try selecting "All Time" or add more books.
              </div>
            )}
          </div>
        </div>
      </div>

      <ThankYouModal isOpen={showThankYouModal} onClose={() => setShowThankYouModal(false)} />
    </div>
  )
}

export default ReceiptGeneratorPage
