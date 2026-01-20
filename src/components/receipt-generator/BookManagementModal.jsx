import React from 'react'
import { Edit2, Check } from 'lucide-react'

const BookManagementModal = ({
  showAllBooksModal,
  setShowAllBooksModal,
  books,
  modalShelf,
  setModalShelf,
  editingBook,
  setEditingBook,
  startEditingBook,
  saveEditedBook,
  cancelEditing
}) => {
  if (!showAllBooksModal) return null

  const modalDisplayBooks = modalShelf === 'all'
    ? books
    : books.filter((b) => {
        if (modalShelf === 'read') return b.shelf === 'read'
        if (modalShelf === 'currentlyReading') return b.shelf === 'currentlyReading'
        if (modalShelf === 'toRead') return b.shelf === 'toRead'
        return true
      })

  const shelfColors = {
    read: { bg: '#ecfdf3', fg: '#166534' },
    toRead: { bg: '#fdf2f8', fg: '#9d174d' },
    currentlyReading: { bg: '#eff6ff', fg: '#1d4ed8' },
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
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
                  cursor: 'pointer',
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
                          <div className="rrg-book-title">{book.title}</div>
                          <div className="rrg-book-author">{book.author}</div>
                          <div className="rrg-book-details">
                            {book.pages > 0 && <span>{book.pages} pages</span>}
                            {book.rating > 0 && <span>★{book.rating.toFixed(1)}</span>}
                            {book.dateFinished && <span>{new Date(book.dateFinished).toLocaleDateString()}</span>}
                            {book.hidden && <span className="rrg-hidden-badge">Hidden</span>}
                            <span
                              style={{
                                background: colors.bg,
                                color: colors.fg,
                                padding: '0.15rem 0.5rem',
                                borderRadius: '999px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                              }}
                            >
                              {shelfLabel}
                            </span>
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
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookManagementModal
