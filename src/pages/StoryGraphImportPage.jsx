import React, { useRef, useState, useEffect } from 'react'
import { Upload, ArrowRight } from 'lucide-react'
import Papa from 'papaparse'
import '../ReadingReceiptGenerator.css'
import { trackImport, trackEvent } from '../components/PostHogProvider'

const StoryGraphImportPage = ({ onImportComplete }) => {
  const fileInputRef = useRef(null)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState('')
  const [parsedData, setParsedData] = useState(null)
  const [shelfCounts, setShelfCounts] = useState({
    read: 0,
    currentlyReading: 0,
    toRead: 0
  })
  const [pageStartTime] = useState(Date.now())

  useEffect(() => {
    trackEvent('import_page_visited', {
      source: 'storygraph'
    })

    return () => {
      const timeSpent = Math.round((Date.now() - pageStartTime) / 1000)
      trackEvent('import_page_exited', {
        source: 'storygraph',
        time_spent_seconds: timeSpent,
        had_success: !!parsedData
      })
    }
  }, [pageStartTime, parsedData])

  const getShelfType = (row) => {
    const shelf = row['Read Status']?.toLowerCase().trim()
    if (!shelf) return null
    
    if (shelf === 'read') return 'read'
    if (shelf === 'currently reading' || shelf === 'currently-reading') return 'currentlyReading'
    if (shelf === 'to read' || shelf === 'to-read') return 'toRead'
    return null
  }

  const normalizeRow = (row, shelfType) => ({
    title: row.Title || row.title || '',
    author: row['Author(s)'] || row.Author || row.author || '',
    pages: parseInt(row.Pages || row.pages || row['Page Count'] || 0),
    rating: parseFloat(row['Star Rating'] || row.Rating || row.rating || 0),
    dateFinished: row['Last Date Read'] || row['Date Read'] || row['date finished'] || '',
    dateStarted: row['Date Started'] || row['date started'] || '',
    dateAdded: row['Date Added'] || '',
    shelf: shelfType,
    progress: shelfType === 'currentlyReading' ? Math.floor(Math.random() * 80) + 5 : 0,
    hidden: false
  })

  const parseCsv = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
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
          
          books.sort((a, b) => {
            if (a.shelf === 'read' && b.shelf === 'read') {
              return new Date(b.dateFinished || 0) - new Date(a.dateFinished || 0)
            } else {
              return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0)
            }
          })

          resolve({
            books,
            username: '',
            shelfCounts: counts
          })
        },
        error: (err) => reject(err),
      })
    })
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError('')
    setUploadSuccess('')
    setParsedData(null)

    trackEvent('csv_upload_attempted', {
      source: 'storygraph',
      file_name: file.name,
      file_size: file.size
    })

    try {
      const { books, username, shelfCounts } = await parseCsv(file)
      setUploadSuccess(
        `✓ Successfully parsed file — ${shelfCounts.read || 0} read; ${shelfCounts.currentlyReading || 0} currently reading; ${shelfCounts.toRead || 0} to-read.`
      )
      setParsedData({ books, username, shelfCounts })
      
      trackImport('storygraph', books.length, shelfCounts)
    } catch (err) {
      setUploadError(err.message)
      trackEvent('csv_upload_failed', {
        source: 'storygraph',
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
    const timeSpent = Math.round((Date.now() - pageStartTime) / 1000)
    trackEvent('import_success', {
      source: 'storygraph',
      total_books: parsedData.books.length,
      read_books: parsedData.shelfCounts.read,
      currently_reading: parsedData.shelfCounts.currentlyReading,
      to_read: parsedData.shelfCounts.toRead,
      time_spent_seconds: timeSpent
    })
    onImportComplete(parsedData.books, parsedData.username, parsedData.shelfCounts)
  }

  return (
    <div className="rrg-page rrg-page-compact">
      <div className="rrg-container" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div className="rrg-import-inner">
        <div className="rrg-card">
          <h2>How to get your StoryGraph Data:</h2>
          <p style={{ margin: '0 0 0.75rem', lineHeight: 1.6 }}>
            StoryGraph allows you to export your reading data as a CSV file from your account settings.
          </p>
          <ol style={{ paddingLeft: '1.25rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            <li>Go to <a href="https://app.thestorygraph.com" target="_blank" rel="noreferrer">StoryGraph</a> and log in.</li>
            <li>Click on your profile icon in the top right.</li>
            <li>Select <strong>Manage Account</strong> from the dropdown.</li>
            <li>Scroll down to <strong>Manage Your Data</strong> section.</li>
            <li>Click the <strong>Export your library</strong> button and then click the <strong>Generate your Export</strong> button to download your reading data.</li>
          </ol>
          <p>
            You can also try visiting the export page directly:{' '}
            <a href="https://app.thestorygraph.com/user-export" target="_blank" rel="noreferrer">
              https://app.thestorygraph.com/user-export
            </a>
          </p>

          <h3 style={{ marginTop: '1.5rem' }}>Upload your CSV</h3>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleUpload}
            style={{ display: 'none' }}
          />
          <div className="rrg-upload" onClick={triggerCSVPicker}>
            <Upload size={32} style={{ marginBottom: '0.5rem' }} />
            <div className="rrg-upload-title">Click to upload CSV</div>
            <div className="rrg-upload-sub">All shelves will be imported</div>
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

export default StoryGraphImportPage
