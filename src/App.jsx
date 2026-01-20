import { useState, useEffect } from 'react'
import WelcomePage from './pages/WelcomePage'
import GoodreadsImportPage from './pages/GoodreadsImportPage'
import ReceiptGeneratorPage from './pages/ReceiptGeneratorPage'
import AboutPage from './pages/AboutPage'
import FeedbackPage from './pages/FeedbackPage'
import Header from './components/Header'
import Footer from './components/Footer'
import sampleBooks from './sampleBooks'

const STORAGE_KEY = 'readReceiptsData'

const App = () => {
  // Load persisted data from localStorage or use defaults
  const loadPersistedData = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return {
          books: parsed.books || sampleBooks.map(book => ({ ...book, shelf: 'read', hidden: false })),
          username: parsed.username || 'READER',
          shelfCounts: parsed.shelfCounts || {
            read: sampleBooks.length,
            currentlyReading: 0,
            toRead: 0
          }
        }
      }
    } catch (error) {
      console.error('Error loading persisted data:', error)
    }
    return {
      books: sampleBooks.map(book => ({ ...book, shelf: 'read', hidden: false })),
      username: 'READER',
      shelfCounts: {
        read: sampleBooks.length,
        currentlyReading: 0,
        toRead: 0
      }
    }
  }

  const persistedData = loadPersistedData()
  const [stage, setStage] = useState('welcome') // welcome | goodreads | receipt
  const [books, setBooks] = useState(persistedData.books)
  const [username, setUsername] = useState(persistedData.username)
  const [shelfCounts, setShelfCounts] = useState(persistedData.shelfCounts)

  // Persist data to localStorage whenever it changes
  useEffect(() => {
    try {
      const dataToStore = {
        books,
        username,
        shelfCounts
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore))
    } catch (error) {
      console.error('Error persisting data:', error)
    }
  }, [books, username, shelfCounts])

  const handleNavigate = (destination) => {
    setStage(destination)
  }

  const handleImportComplete = (importedBooks, importedUsername, importedShelfCounts) => {
    if (importedBooks && importedBooks.length > 0) {
      setBooks(importedBooks)
      setUsername(importedUsername || 'READER')
      if (importedShelfCounts) {
        setShelfCounts(importedShelfCounts)
      }
      setStage('receipt')
    } else {
      setStage('welcome')
    }
  }

  return (
    <>
      <Header currentPage={stage} onNavigate={handleNavigate} />
      {stage === 'goodreads' && (
        <GoodreadsImportPage onImportComplete={handleImportComplete} />
      )}
      {stage === 'receipt' && (
        <ReceiptGeneratorPage
          initialBooks={books}
          initialUsername={username}
          shelfCounts={shelfCounts}
        />
      )}
      {stage === 'about' && <AboutPage />}
      {stage === 'feedback' && <FeedbackPage />}
      {stage === 'welcome' && <WelcomePage onNavigate={handleNavigate} />}
      <Footer />
    </>
  )
}

export default App
