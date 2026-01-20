import React, { useRef, useState } from 'react'
import { Upload, BookOpen, BookMarked, BookX, ArrowRight } from 'lucide-react'
import Papa from 'papaparse'
import '../ReadingReceiptGenerator.css'
import { trackImport, trackEvent } from '../components/PostHogProvider'

const GoodreadsImportPage = ({ onImportComplete }) => {
  const fileInputRef = useRef(null)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState('')
  const [parsedData, setParsedData] = useState(null)
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
    setParsedData(null)

    trackEvent('csv_upload_attempted', {
      file_name: file.name,
      file_size: file.size
    })

    try {
      const { books, username, shelfCounts } = await parseCsv(file)
      setUploadSuccess(
        `✓ Successfully parsed file — ${shelfCounts.read || 0} read; ${shelfCounts.currentlyReading || 0} currently reading; ${shelfCounts.toRead || 0} to-read.`
      )
      setParsedData({ books, username, shelfCounts })
      
      trackImport('goodreads', books.length, shelfCounts)
    } catch (err) {
      setUploadError(err.message)
      trackEvent('csv_upload_failed', {
        error: err.message,
        file_name: file.name
      })
    }
  }

  const triggerCSVPicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleCreateReceipt = () => {
    if (!parsedData) return
    trackEvent('create_receipt_clicked', {
      total_books: parsedData.books.length,
      read_books: parsedData.shelfCounts.read,
      currently_reading: parsedData.shelfCounts.currentlyReading,
      to_read: parsedData.shelfCounts.toRead
    })
    onImportComplete(parsedData.books, parsedData.username, parsedData.shelfCounts)
  }

  return (
    <div className="rrg-page rrg-page-compact">
      <div className="rrg-container" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div className="rrg-import-inner">
        <div className="rrg-card">
          <h2>How to get your Goodreads Data: </h2>
          <p style={{ margin: '0 0 0.75rem', lineHeight: 1.6 }}>
            Goodreads doesn’t offer an API, but you can download your data from the desktop version of their website. This will <strong>NOT</strong> work in the Goodreads app.  
            </p>
            <ol style={{ paddingLeft: '1.25rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            <li>Go to Goodreads on a laptop/desktop and log in.</li>
            <li>Navigate to <strong>My Books</strong>.</li>
            <li>Scroll to the bottom and click <strong>Import and export</strong>.</li>
            <li>Click <strong>Export Library</strong> to download the CSV file.</li>
          </ol>
            <p>
              You can also try visiting the export page directly. If you are currently a mobile device, try long-pressing this link and then selecting "Open in New Tab": {' '}
            <a href="https://www.goodreads.com/review/import" target="_blank" rel="noreferrer">
              https://www.goodreads.com/review/import
            </a>
              . 
          </p>

          
          

          <h3 style={{ marginTop: 0 }}>Upload your CSV</h3>
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
        <div className="rrg-import-actions">
          <button className="rrg-button secondary" onClick={() => onImportComplete(null, null)}>
            ← Back to Home
          </button>
          {parsedData && (
            <button className="rrg-button" onClick={handleCreateReceipt}>
              <>
                Create receipt
                <ArrowRight size={16} />
              </>
            </button>
          )}
        </div>
        </div>
      </div>
    </div>
  )
}

export default GoodreadsImportPage
