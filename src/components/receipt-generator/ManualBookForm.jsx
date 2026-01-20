import React from 'react'
import { Plus, Check } from 'lucide-react'

const ManualBookForm = ({ 
  showManualEntry, 
  setShowManualEntry, 
  manualBook, 
  setManualBook, 
  addManualBook 
}) => {
  return (
    <>
      <div style={{ marginTop: '1rem' }}>
        <button 
          onClick={() => setShowManualEntry(!showManualEntry)} 
          className="rrg-button secondary" 
          style={{ width: '100%' }}
        >
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
    </>
  )
}

export default ManualBookForm
