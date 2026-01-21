import React, { useState, useEffect } from 'react'
import { Plus, Trash2, ArrowRight } from 'lucide-react'
import '../ReadingReceiptGenerator.css'
import { trackEvent } from '../components/PostHogProvider'

const ManualImportPage = ({ onImportComplete }) => {
  const [books, setBooks] = useState([
    {
      title: '',
      author: '',
      pages: '',
      rating: '',
      dateFinished: '',
      dateStarted: '',
      shelf: 'read',
      hidden: false
    }
  ])
  const [username, setUsername] = useState('')
  const [pageStartTime] = useState(Date.now())
  const [bookAddStartTime, setBookAddStartTime] = useState(Date.now())

  useEffect(() => {
    trackEvent('import_page_visited', {
      source: 'manual'
    })

    return () => {
      const timeSpent = Math.round((Date.now() - pageStartTime) / 1000)
      const validBooks = books.filter(book => book.title.trim() && book.author.trim())
      trackEvent('import_page_exited', {
        source: 'manual',
        time_spent_seconds: timeSpent,
        books_entered: validBooks.length,
        had_success: validBooks.length > 0
      })
    }
  }, [pageStartTime, books])

  const addBook = () => {
    const timeToAddBook = Math.round((Date.now() - bookAddStartTime) / 1000)
    setBooks([
      ...books,
      {
        title: '',
        author: '',
        pages: '',
        rating: '',
        dateFinished: '',
        dateStarted: '',
        shelf: 'read',
        hidden: false
      }
    ])
    trackEvent('manual_import_book_added', {
      total_books: books.length + 1,
      time_since_last_add_seconds: timeToAddBook
    })
    setBookAddStartTime(Date.now())
  }

  const removeBook = (index) => {
    const newBooks = books.filter((_, i) => i !== index)
    setBooks(newBooks.length > 0 ? newBooks : [{
      title: '',
      author: '',
      pages: '',
      rating: '',
      dateFinished: '',
      dateStarted: '',
      shelf: 'read',
      hidden: false
    }])
    trackEvent('manual_import_book_removed', {
      total_books: newBooks.length
    })
  }

  const updateBook = (index, field, value) => {
    const newBooks = [...books]
    newBooks[index] = { ...newBooks[index], [field]: value }
    setBooks(newBooks)
  }

  const handleCreateReceipt = () => {
    const validBooks = books.filter(book => book.title.trim() && book.author.trim())
    
    if (validBooks.length === 0) {
      trackEvent('manual_import_validation_failed', {
        total_books_attempted: books.length,
        reason: 'no_valid_books'
      })
      alert('Please add at least one book with a title and author.')
      return
    }

    const normalizedBooks = validBooks.map(book => ({
      ...book,
      pages: parseInt(book.pages) || 0,
      rating: parseFloat(book.rating) || 0,
      shelf: book.shelf || 'read',
      hidden: false
    }))

    const shelfCounts = {
      read: normalizedBooks.filter(b => b.shelf === 'read').length,
      currentlyReading: normalizedBooks.filter(b => b.shelf === 'currentlyReading').length,
      toRead: normalizedBooks.filter(b => b.shelf === 'toRead').length
    }

    const timeSpent = Math.round((Date.now() - pageStartTime) / 1000)
    const avgTimePerBook = normalizedBooks.length > 0 ? Math.round(timeSpent / normalizedBooks.length) : 0
    
    trackEvent('import_success', {
      source: 'manual',
      total_books: normalizedBooks.length,
      read_books: shelfCounts.read,
      currently_reading: shelfCounts.currentlyReading,
      to_read: shelfCounts.toRead,
      time_spent_seconds: timeSpent,
      avg_time_per_book_seconds: avgTimePerBook,
      books_with_pages: normalizedBooks.filter(b => b.pages > 0).length,
      books_with_rating: normalizedBooks.filter(b => b.rating > 0).length,
      books_with_dates: normalizedBooks.filter(b => b.dateFinished || b.dateStarted).length
    })

    onImportComplete(normalizedBooks, username || 'READER', shelfCounts)
  }

  return (
    <div className="rrg-page rrg-page-compact">
      <div className="rrg-container" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div className="rrg-import-inner">
          <div className="rrg-card">
            <h2>Manual Book Entry</h2>
            <p style={{ margin: '0 0 1rem', lineHeight: 1.6 }}>
              Add your books manually by filling out the form below. Only title and author are required.
            </p>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem', letterSpacing: '0.02em' }}>
                Your Name (optional)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  border: '2px solid #1f1307',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  background: '#fffaf1'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              {books.map((book, index) => (
                <div
                  key={index}
                  style={{
                    background: '#fdf7ec',
                    border: '2px solid #1f1307',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Book {index + 1}</h3>
                    {books.length > 1 && (
                      <button
                        onClick={() => removeBook(index)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#c33',
                          padding: '0.25rem'
                        }}
                        aria-label="Remove book"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                        Title *
                      </label>
                      <input
                        type="text"
                        value={book.title}
                        onChange={(e) => updateBook(index, 'title', e.target.value)}
                        placeholder="Book title"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '2px solid #1f1307',
                          borderRadius: '4px',
                          fontSize: '0.9rem',
                          background: '#fffaf1'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                        Author *
                      </label>
                      <input
                        type="text"
                        value={book.author}
                        onChange={(e) => updateBook(index, 'author', e.target.value)}
                        placeholder="Author name"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '2px solid #1f1307',
                          borderRadius: '4px',
                          fontSize: '0.9rem',
                          background: '#fffaf1'
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                          Pages
                        </label>
                        <input
                          type="number"
                          value={book.pages}
                          onChange={(e) => updateBook(index, 'pages', e.target.value)}
                          placeholder="0"
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '2px solid #1f1307',
                            borderRadius: '4px',
                            fontSize: '0.9rem',
                            background: '#fffaf1'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                          Rating (0-5)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="5"
                          value={book.rating}
                          onChange={(e) => updateBook(index, 'rating', e.target.value)}
                          placeholder="0"
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '2px solid #1f1307',
                            borderRadius: '4px',
                            fontSize: '0.9rem',
                            background: '#fffaf1'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                          Date Started
                        </label>
                        <input
                          type="date"
                          value={book.dateStarted}
                          onChange={(e) => updateBook(index, 'dateStarted', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '2px solid #1f1307',
                            borderRadius: '4px',
                            fontSize: '0.9rem',
                            background: '#fffaf1'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                          Date Finished
                        </label>
                        <input
                          type="date"
                          value={book.dateFinished}
                          onChange={(e) => updateBook(index, 'dateFinished', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '2px solid #1f1307',
                            borderRadius: '4px',
                            fontSize: '0.9rem',
                            background: '#fffaf1'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                        Shelf
                      </label>
                      <select
                        value={book.shelf}
                        onChange={(e) => updateBook(index, 'shelf', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '2px solid #1f1307',
                          borderRadius: '4px',
                          fontSize: '0.9rem',
                          background: '#fffaf1',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="read">Read</option>
                        <option value="currentlyReading">Currently Reading</option>
                        <option value="toRead">To Read</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addBook}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px dashed #1f1307',
                borderRadius: '6px',
                background: 'transparent',
                color: '#1f1307',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                letterSpacing: '0.02em',
                textTransform: 'uppercase'
              }}
            >
              <Plus size={18} />
              Add Another Book
            </button>
          </div>

          <div className="rrg-import-actions">
            <button className="rrg-button secondary" onClick={() => onImportComplete(null, null)}>
              ← Back to Home
            </button>
            <button className="rrg-button" onClick={handleCreateReceipt}>
              <>
                Create receipt
                <ArrowRight size={16} />
              </>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManualImportPage
