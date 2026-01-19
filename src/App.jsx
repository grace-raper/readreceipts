import { useState } from 'react'
import WelcomePage from './pages/WelcomePage'
import GoodreadsImportPage from './pages/GoodreadsImportPage'
import ReceiptGeneratorPage from './pages/ReceiptGeneratorPage'
import sampleBooks from './sampleBooks'

const App = () => {
  const [stage, setStage] = useState('welcome') // welcome | goodreads | receipt
  const [books, setBooks] = useState(sampleBooks.map(book => ({ ...book, shelf: 'read', hidden: false })))
  const [username, setUsername] = useState('READER')
  const [shelfCounts, setShelfCounts] = useState({
    read: sampleBooks.length,
    currentlyReading: 0,
    toRead: 0
  })

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

  if (stage === 'goodreads') {
    return <GoodreadsImportPage onImportComplete={handleImportComplete} />
  }

  if (stage === 'receipt') {
    return <ReceiptGeneratorPage 
      initialBooks={books} 
      initialUsername={username} 
      shelfCounts={shelfCounts}
    />
  }

  return <WelcomePage onNavigate={handleNavigate} />
}

export default App
