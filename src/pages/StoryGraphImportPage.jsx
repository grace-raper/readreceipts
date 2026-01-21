import React, { useRef, useState, useEffect } from 'react'
import { Upload, ArrowRight, Info } from 'lucide-react'
import Papa from 'papaparse'
import '../ReadingReceiptGenerator.css'
import { trackImport, trackEvent } from '../components/PostHogProvider'

const StoryGraphImportPage = ({ onImportComplete }) => {
  const fileInputRef = useRef(null)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState('')
  const [parsedData, setParsedData] = useState(null)
  const [isEnrichingPages, setIsEnrichingPages] = useState(false)
  const [enrichmentProgress, setEnrichmentProgress] = useState({ current: 0, total: 0 })
  const [isProcessing, setIsProcessing] = useState(false)
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
    isbn: (row['ISBN/UID'] || row.ISBN || '').toString().trim(),
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

  const sanitizeIsbn = (rawIsbn) => {
    if (!rawIsbn) return ''
    const digits = rawIsbn.toString().replace(/[^0-9Xx]/g, '')
    if (digits.length === 10 || digits.length === 13) return digits
    return ''
  }

  const fetchPageCountForIsbn = async (isbn) => {
    try {
      const resp = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`)
      if (!resp.ok) return null
      const data = await resp.json()
      const entry = data[`ISBN:${isbn}`]
      const pagination = entry?.pagination || entry?.number_of_pages
      if (pagination) {
        const parsed = parseInt(pagination.toString().replace(/[^0-9]/g, ''), 10)
        if (!Number.isNaN(parsed) && parsed > 0) return parsed
      }
      return null
    } catch {
      return null
    }
  }

  const enrichPageCounts = async (books) => {
    const needsLookup = books.filter((b) => (!b.pages || b.pages === 0) && sanitizeIsbn(b.isbn))
    if (needsLookup.length === 0) return books

    const enrichmentStartTime = Date.now()
    setIsEnrichingPages(true)
    setEnrichmentProgress({ current: 0, total: needsLookup.length })
    
    let successCount = 0
    let failureCount = 0
    
    try {
      for (let i = 0; i < needsLookup.length; i++) {
        const book = needsLookup[i]
        const isbn = sanitizeIsbn(book.isbn)
        if (!isbn) {
          failureCount++
          continue
        }
        const pages = await fetchPageCountForIsbn(isbn)
        if (pages) {
          book.pages = pages
          successCount++
        } else {
          failureCount++
        }
        setEnrichmentProgress({ current: i + 1, total: needsLookup.length })
      }
      
      const enrichmentDuration = Math.round((Date.now() - enrichmentStartTime) / 1000)
      trackEvent('page_count_enrichment_completed', {
        source: 'storygraph',
        total_queries: needsLookup.length,
        successful_queries: successCount,
        failed_queries: failureCount,
        duration_seconds: enrichmentDuration,
        books_with_zero_pages: books.filter(b => !b.pages || b.pages === 0).length
      })
    } finally {
      setIsEnrichingPages(false)
      setEnrichmentProgress({ current: 0, total: 0 })
    }
    return books
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError('')
    setUploadSuccess('')
    setParsedData(null)
    setIsProcessing(true)

    trackEvent('csv_upload_attempted', {
      source: 'storygraph',
      file_name: file.name,
      file_size: file.size
    })

    try {
      const { books, username, shelfCounts } = await parseCsv(file)
      await enrichPageCounts(books)
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
    } finally {
      setIsProcessing(false)
    }
  }

  const triggerCSVPicker = () => {
    if (fileInputRef.current && !isProcessing) {
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
          <div className="rrg-alert rrg-alert-info" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8f4ec', border: '1px solid #e2d9c8', borderRadius: '8px', padding: '0.75rem', marginTop: '0.75rem' }}>
            <Info size={18} color="#d97706" />
            <div style={{ lineHeight: 1.5 }}>
              StoryGraph exports do not include page counts. We look up page counts using the Open Library API by ISBN. If Open Library is missing data, those books may still show 0 pages. Minor discrepancies may occur between StoryGraph and Open Library data.
            </div>
          </div>

          <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>Upload your CSV</h3>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleUpload}
            style={{ display: 'none' }}
            disabled={isProcessing}
          />
          <div 
            className="rrg-upload" 
            onClick={triggerCSVPicker}
            style={{ 
              opacity: isProcessing ? 0.6 : 1, 
              cursor: isProcessing ? 'not-allowed' : 'pointer' 
            }}
          >
            <Upload size={32} style={{ marginBottom: '0.5rem' }} />
            <div className="rrg-upload-title">
              {isProcessing ? 'Processing...' : 'Click to upload CSV'}
            </div>
            <div className="rrg-upload-sub">All shelves will be imported</div>
          </div>

          {isEnrichingPages && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f8f4ec', border: '1px solid #e2d9c8', borderRadius: '4px' }}>
              <div style={{ marginBottom: '0.5rem', fontWeight: 600 }}>
                Looking up page counts... ({enrichmentProgress.current} of {enrichmentProgress.total})
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e2d9c8', borderRadius: '4px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${enrichmentProgress.total > 0 ? (enrichmentProgress.current / enrichmentProgress.total) * 100 : 0}%`, 
                    height: '100%', 
                    background: '#d97706', 
                    transition: 'width 0.3s ease' 
                  }}
                />
              </div>
            </div>
          )}

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
