import React from 'react'
import SummaryStatsToggles from './SummaryStatsToggles'

const CustomizeDefaultReceipt = ({ 
  numBooksToShow, 
  setNumBooksToShow,
  showStats,
  setShowStats,
  pagesPerHour,
  setPagesPerHour
}) => {
  return (
    <div className="rrg-settings-section">
      <div style={{ marginBottom: '1rem' }}>
        <label className="rrg-label">Number of books to include in stats</label>
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

      <SummaryStatsToggles
        showStats={showStats}
        setShowStats={setShowStats}
        pagesPerHour={pagesPerHour}
        setPagesPerHour={setPagesPerHour}
      />
    </div>
  )
}

export default CustomizeDefaultReceipt
