import { useState } from 'react'
import WelcomePage from './pages/WelcomePage'
import GoodreadsImportPage from './pages/GoodreadsImportPage'
import ReceiptGeneratorPage from './pages/ReceiptGeneratorPage'
import sampleBooks from './sampleBooks'

const App = () => {
  const [stage, setStage] = useState('welcome') // welcome | goodreads | receipt
  const [books, setBooks] = useState(sampleBooks)
  const [username, setUsername] = useState('READER')

  const handleNavigate = (destination) => {
    setStage(destination)
  }

  const handleImportComplete = (importedBooks, importedUsername) => {
    if (importedBooks && importedBooks.length > 0) {
      setBooks(importedBooks)
      setUsername(importedUsername || 'READER')
      setStage('receipt')
    } else {
      setStage('welcome')
    }
  }

  if (stage === 'goodreads') {
    return <GoodreadsImportPage onImportComplete={handleImportComplete} />
  }

  if (stage === 'receipt') {
    return <ReceiptGeneratorPage initialBooks={books} initialUsername={username} />
  }

  return <WelcomePage onNavigate={handleNavigate} />
}

export default App
