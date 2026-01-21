import { useState, useEffect } from 'react'
import WelcomePage from './pages/WelcomePage'
import GoodreadsImportPage from './pages/GoodreadsImportPage'
import StoryGraphImportPage from './pages/StoryGraphImportPage'
import ManualImportPage from './pages/ManualImportPage'
import ReceiptGeneratorPage from './pages/ReceiptGeneratorPage'
import AboutPage from './pages/AboutPage'
import FeedbackPage from './pages/FeedbackPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import CookiePolicyPage from './pages/CookiePolicyPage'
import Header from './components/Header'
import Footer from './components/Footer'
import sampleBooks from './sampleBooks'
import { trackPageView, trackNavigation } from './components/PostHogProvider'

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
  
  // Determine initial stage from URL path
  const getInitialStage = () => {
    const path = window.location.pathname
    if (path === '/import' || path === '/goodreads') return 'goodreads'
    if (path === '/storygraph') return 'storygraph'
    if (path === '/manual') return 'manual'
    if (path === '/receipt' || path === '/generator') return 'receipt'
    if (path === '/about') return 'about'
    if (path === '/feedback') return 'feedback'
    return 'welcome'
  }
  
  const [stage, setStage] = useState(getInitialStage())
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

  // Update URL when stage changes
  useEffect(() => {
    const pathMap = {
      welcome: '/',
      goodreads: '/import',
      storygraph: '/storygraph',
      manual: '/manual',
      receipt: '/receipt',
      about: '/about',
      feedback: '/feedback'
    }
    const newPath = pathMap[stage] || '/'
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath)
    }
    
    // Track page view
    trackPageView(stage, {
      path: newPath,
      has_books: books.length > 0,
      book_count: books.length
    })
  }, [stage, books.length])

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setStage(getInitialStage())
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleNavigate = (destination) => {
    trackNavigation(stage, destination)
    setStage(destination)
  }

  const handleImportComplete = (importedBooks, importedUsername, importedShelfCounts) => {
    if (importedBooks && importedBooks.length > 0) {
      setBooks(importedBooks)
      setUsername(importedUsername || 'READER')
      if (importedShelfCounts) {
        setShelfCounts(importedShelfCounts)
      }
      trackNavigation(stage, 'receipt')
      setStage('receipt')
    } else {
      trackNavigation(stage, 'welcome')
      setStage('welcome')
    }
  }

  return (
    <div className="rrg-app-shell">
      <Header currentPage={stage} onNavigate={handleNavigate} />
      <main className="rrg-main">
        {stage === 'goodreads' && <GoodreadsImportPage onImportComplete={handleImportComplete} />}
        {stage === 'storygraph' && <StoryGraphImportPage onImportComplete={handleImportComplete} />}
        {stage === 'manual' && <ManualImportPage onImportComplete={handleImportComplete} />}
        {stage === 'receipt' && (
          <ReceiptGeneratorPage
            initialBooks={books}
            initialUsername={username}
            shelfCounts={shelfCounts}
          />
        )}
        {stage === 'about' && <AboutPage />}
        {stage === 'feedback' && <FeedbackPage />}
        {stage === 'privacy' && <PrivacyPolicyPage onNavigate={handleNavigate} />}
        {stage === 'cookies' && <CookiePolicyPage onNavigate={handleNavigate} />}
        {stage === 'welcome' && <WelcomePage onNavigate={handleNavigate} />}
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  )
}

export default App
