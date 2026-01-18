import React, { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import Papa from 'papaparse'
import '../ReadingReceiptGenerator.css'

const GoodreadsImportPage = ({ onImportComplete }) => {
  const fileInputRef = useRef(null)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState('')

  const isCompletedRow = (row) => {
    const shelf = row['Exclusive Shelf']
    return shelf && shelf.toLowerCase().trim() === 'read'
  }

  const normalizeRow = (row) => ({
    title: row.Title || row.title || '',
    author: row.Author || row.author || row['Author l-f'] || '',
    pages: parseInt(row['Number of Pages'] || row.pages || row['Page Count'] || 0),
    rating: parseFloat(row['My Rating'] || row.rating || row.Rating || 0),
    dateFinished: row['Date Read'] || row['date finished'] || row['Date Finished'] || '',
    dateStarted: row['Date Started'] || row['date started'] || '',
  })

  const parseCsv = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const completedRows = results.data.filter(isCompletedRow)
          const parsedBooks = completedRows
            .filter((row) => row.Title && row.Title.trim())
            .map(normalizeRow)

          if (parsedBooks.length === 0) {
            reject(new Error('No completed books found. Make sure your CSV has books marked as "read".'))
            return
          }

          resolve({
            books: parsedBooks,
            username: results.data[0]?.['Goodreads User'] || '',
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
      const { books, username } = await parseCsv(file)
      setUploadSuccess(`✓ Loaded ${books.length} completed book${books.length !== 1 ? 's' : ''}`)
      setTimeout(() => {
        onImportComplete(books, username)
      }, 800)
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
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#efe', border: '1px solid #cfc', borderRadius: '4px', color: '#3c3' }}>
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
