import React from 'react'
import SummaryStatsToggles from './SummaryStatsToggles'
import { trackSettingChange } from '../PostHogProvider'

const CustomizeDefaultReceipt = ({ 
  numBooksToShow, 
  setNumBooksToShow,
  showStats,
  setShowStats,
  pagesPerHour,
  setPagesPerHour,
  onInteraction
}) => {
  const handleNumBooksChange = (newValue) => {
    trackSettingChange('num_books_to_show', newValue, {
      template: 'default',
      previous_value: numBooksToShow
    })
    onInteraction?.()
    setNumBooksToShow(newValue)
  }

  return (
    <div className="rrg-settings-section">
      <div style={{ marginBottom: '1rem' }}>
        <label className="rrg-label">Number of books to include in stats</label>
        <input
          type="number"
          value={numBooksToShow === null ? '' : numBooksToShow}
          onChange={(e) => {
            const val = e.target.value
            if (val === '') return handleNumBooksChange(null)
            const parsed = Math.max(1, Math.min(50, parseInt(val, 10) || 1))
            handleNumBooksChange(parsed)
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
