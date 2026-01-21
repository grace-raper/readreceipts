import React from 'react'
import TbrStatToggles from './TbrStatToggles'

const CustomizeTbrReceipt = ({ 
  numBooksToShow,
  setNumBooksToShow,
  showStats,
  setShowStats,
  receiptDate,
  setReceiptDate,
  onInteraction
}) => {
  return (
    <div className="rrg-settings-section">
      <div style={{ marginBottom: '1rem' }}>
        <label className="rrg-label">Receipt Date</label>
        <input
          type="date"
          value={receiptDate}
          onChange={(e) => {
            setReceiptDate(e.target.value)
            onInteraction?.()
          }}
          className="rrg-input"
        />
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label className="rrg-label">Number of books to show</label>
        <input
          type="number"
          value={numBooksToShow === null ? '' : numBooksToShow}
          onChange={(e) => {
            const val = e.target.value
            if (val === '') return setNumBooksToShow(null)
            const parsed = Math.max(1, Math.min(50, parseInt(val, 10) || 1))
            setNumBooksToShow(parsed)
          }}
          className="rrg-input"
          max="50"
        />
      </div>

      <TbrStatToggles showStats={showStats} setShowStats={setShowStats} />
    </div>
  )
}

export default CustomizeTbrReceipt
