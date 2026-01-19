import React, { useRef, useState } from 'react'
import { Upload, BookOpen, BookMarked, BookX } from 'lucide-react'
import Papa from 'papaparse'
import '../ReadingReceiptGenerator.css'

const GoodreadsImportPage = ({ onImportComplete }) => {
  const fileInputRef = useRef(null)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState('')
  const [shelfCounts, setShelfCounts] = useState({
    read: 0,
    currentlyReading: 0,
    toRead: 0
  })

  const getShelfType = (row) => {
    const shelf = row['Exclusive Shelf']?.toLowerCase().trim()
    if (!shelf) return null
    
    if (shelf === 'read') return 'read'
    if (shelf === 'currently-reading') return 'currentlyReading'
    if (shelf === 'to-read') return 'toRead'
    return null
  }

  const normalizeRow = (row, shelfType) => ({
    title: row.Title || row.title || '',
    author: row.Author || row.author || row['Author l-f'] || '',
    pages: parseInt(row['Number of Pages'] || row.pages || row['Page Count'] || 0),
    rating: parseFloat(row['My Rating'] || row.rating || row.Rating || 0),
    dateFinished: row['Date Read'] || row['date finished'] || row['Date Finished'] || '',
    dateStarted: row['Date Started'] || row['date started'] || '',
    dateAdded: row['Date Added'] || '',
    shelf: shelfType,
    progress: shelfType === 'currentlyReading' ? Math.floor(Math.random() * 80) + 5 : 0, // Mock progress for currently reading
    hidden: false
  })

  const parseCsv = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          // Group books by shelf type
          const books = []
          const counts = { read: 0, currentlyReading: 0, toRead: 0 }
          
          results.data.forEach(row => {
            if (!row.Title || !row.Title.trim()) return
            
            const shelfType = getShelfType(row)
            if (!shelfType) return
            
            counts[shelfType]++
            books.push(normalizeRow(row, shelfType))
          })
          
          setShelfCounts(counts)
          
          if (books.length === 0) {
            reject(new Error('No valid books found in the CSV file.'))
            return
          }
          
          // Sort books: read books by date finished (newest first), others by date added
          books.sort((a, b) => {
            if (a.shelf === 'read' && b.shelf === 'read') {
              // Sort read books by date finished (newest first)
              return new Date(b.dateFinished || 0) - new Date(a.dateFinished || 0)
            } else {
              // Sort other books by date added (newest first)
              return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0)
            }
          })

          resolve({
            books,
            username: results.data[0]?.['Goodreads User'] || '',
            shelfCounts: counts
          })
        },
        error: (err) => reject(err),
      })
    })
  }

  const handleGoodreadsUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError('')
    setUploadSuccess('')

    try {
      const { books, username, shelfCounts } = await parseCsv(file)
      setUploadSuccess(
        <>
          <div>✓ Successfully loaded your Goodreads library</div>
          <div className="shelf-counts">
            <div><BookOpen size={14} /> {shelfCounts.read} read</div>
            <div><BookMarked size={14} /> {shelfCounts.currentlyReading} currently reading</div>
            <div><BookX size={14} /> {shelfCounts.toRead} to read</div>
          </div>
        </>
      )
      setTimeout(() => {
        onImportComplete(books, username, shelfCounts)
      }, 1200)
    } catch (err) {
      setUploadError(err.message)
    }
  }

  const triggerCSVPicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="rrg-page">
      <div className="rrg-container" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h1 className="rrg-title">Import from Goodreads</h1>
        <p className="rrg-subtitle">Follow these steps to download and upload your reading history.</p>

        <div className="rrg-card" style={{ marginBottom: '1.5rem' }}>
          <h2>How to get your Goodreads CSV</h2>
          <ol style={{ paddingLeft: '1.25rem', lineHeight: 1.7 }}>
            <li>Go to Goodreads and log in</li>
            <li>
              Navigate to <strong>My Books</strong>
            </li>
            <li>
              Scroll to the bottom and click <strong>Import and export</strong>
            </li>
            <li>
              Click <strong>Export Library</strong>
            </li>
            <li>Download the CSV file</li>
          </ol>
        </div>

        <div className="rrg-card">
          <h2>Upload your CSV</h2>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleGoodreadsUpload}
            style={{ display: 'none' }}
          />
          <div className="rrg-upload" onClick={triggerCSVPicker}>
            <Upload size={32} style={{ marginBottom: '0.5rem' }} />
            <div className="rrg-upload-title">Click to upload CSV</div>
            <div className="rrg-upload-sub">Only books marked as "read" will be imported</div>
          </div>

          {uploadError && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fee', border: '1px solid #fcc', borderRadius: '4px', color: '#c33' }}>
              {uploadError}
            </div>
          )}

          {uploadSuccess && (
            <div className="rrg-success-message">
              {uploadSuccess}
            </div>
          )}
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button className="rrg-button secondary" onClick={() => onImportComplete(null, null)}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default GoodreadsImportPage
