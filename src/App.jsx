import { useState } from 'react'
import { Upload } from 'lucide-react'
import Papa from 'papaparse'
import ReadingReceiptGenerator from './ReadingReceiptGenerator'
import sampleBooks from './sampleBooks'

const App = () => {
  const [stage, setStage] = useState('welcome') // welcome | goodreads | receipt
  const [books, setBooks] = useState(sampleBooks)
  const [username, setUsername] = useState('READER')
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState('')

  const isCompletedRow = (row) => {
    const shelf =
      (row['Exclusive Shelf'] ||
        row['exclusive_shelf'] ||
        row['Bookshelves'] ||
        row['bookshelves'] ||
        row.shelf ||
        '').toString().toLowerCase()
    // Goodreads uses “Exclusive Shelf” for canonical status. Only allow “read”.
    return shelf.trim() === 'read'
  }

  const normalizeRow = (row) => ({
    title: row.Title || row.title || '',
    author: row.Author || row.author || row['Author l-f'] || '',
    pages: parseInt(row['Number of Pages'] || row.pages || row['Page Count'] || 0),
    rating: parseFloat(row['My Rating'] || row.rating || row.Rating || 0),
    dateFinished: row['Date Read'] || row['date read'] || row['Date Finished'] || row['date finished'] || '',
    dateStarted: row['Date Started'] || row['date started'] || '',
  })

  const parseCsv = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const parsedBooks = results.data
            .filter((row) => row.Title && row.Title.trim() && isCompletedRow(row))
            .map((row) => normalizeRow(row))

          if (parsedBooks.length === 0) {
            reject(new Error('No completed books found. Ensure your CSV includes read books and a "Title" column.'))
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
      const { books: parsed, username: parsedUser } = await parseCsv(file)
      setBooks(parsed)
      if (parsedUser) setUsername(parsedUser)
      setUploadSuccess(`Loaded ${parsed.length} books from Goodreads.`)
    } catch (err) {
      setUploadError(err.message)
    }
  }

  const goToReceipt = () => {
    setStage('receipt')
  }

  const renderWelcome = () => (
    <div className="rrg-page">
      <div className="rrg-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 3.5rem)' }}>
        <h1 className="rrg-title">Read Receipts</h1>
        <p className="rrg-subtitle" style={{ maxWidth: '780px', margin: '0 auto 1rem' }}>
          Turn your reading history into a vintage-styled receipt. Try the sample, then import your own.
        </p>

        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', width: '100%' }}>
          <ReadingReceiptGenerator
            initialBooks={sampleBooks}
            initialUsername="BOOKWORM"
            enableUpload={false}
            showInputPanel={false}
            showManualControls={false}
            showDownloadButton={false}
            showPageHeader={false}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
          <button className="rrg-button secondary" style={{ width: '220px' }} onClick={() => setStage('goodreads')}>
            Import from Goodreads
          </button>
          <button className="rrg-button" style={{ width: '220px', opacity: 0.5 }} disabled>
            Import from StoryGraph (soon)
          </button>
          <button className="rrg-button" style={{ width: '220px', opacity: 0.5 }} disabled>
            Manual import (soon)
          </button>
        </div>
      </div>
    </div>
  )

  const renderGoodreads = () => (
    <div className="rrg-page">
      <div className="rrg-container">
        <h1 className="rrg-title">Goodreads Import</h1>
        <p className="rrg-subtitle">Export your Goodreads library as CSV, upload, then build your receipt.</p>

        <div className="rrg-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="rrg-card">
            <h2>Step-by-step</h2>
            <ol style={{ lineHeight: 1.6, paddingLeft: '1.2rem' }}>
              <li>Log in on goodreads.com (web).</li>
              <li>Go to “My Books” → left sidebar “Import and Export”.</li>
              <li>Under Export, click “Export Library”.</li>
              <li>Download the generated CSV (“Your export from…” link).</li>
            </ol>
          </div>

          <div className="rrg-card">
            <h2>Upload CSV</h2>
            <div className="rrg-upload" role="button" tabIndex={0} onClick={() => document.getElementById('goodreads-upload').click()} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ' ? document.getElementById('goodreads-upload').click() : null)}>
              <input id="goodreads-upload" type="file" accept=".csv" onChange={handleGoodreadsUpload} style={{ display: 'none' }} />
              <Upload size={28} />
              <div className="rrg-upload-title">Click to upload Goodreads CSV</div>
              <div className="rrg-upload-sub">We validate Title, Author, Pages, Rating, Date.</div>
            </div>
            {uploadError && <p style={{ color: '#b3261e', marginTop: '0.75rem' }}>{uploadError}</p>}
            {uploadSuccess && <p style={{ color: '#1b7f3e', marginTop: '0.75rem' }}>{uploadSuccess}</p>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="rrg-button secondary" style={{ width: '220px' }} onClick={() => setStage('welcome')}>
            Back
          </button>
          <button
            className="rrg-button"
            style={{ width: '220px' }}
            onClick={goToReceipt}
            disabled={books.length === 0}
          >
            Create Receipt
          </button>
        </div>
      </div>
    </div>
  )

  const renderReceipt = () => (
    <ReadingReceiptGenerator
      initialBooks={books}
      initialUsername={username}
      enableUpload={false}
      showInputPanel
      showManualControls
      showPageHeader={false}
    />
  )

  if (stage === 'goodreads') return renderGoodreads()
  if (stage === 'receipt') return renderReceipt()
  return renderWelcome()
}

export default App
