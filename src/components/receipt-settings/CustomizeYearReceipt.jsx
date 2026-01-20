import React from 'react'
import SummaryStatsToggles from './SummaryStatsToggles'
import { trackSettingChange } from '../PostHogProvider'

const CustomizeYearReceipt = ({ 
  selectedYear,
  setSelectedYear,
  readingGoal,
  setReadingGoal,
  showStats,
  setShowStats,
  pagesPerHour,
  setPagesPerHour,
  onInteraction
}) => {
  const handleYearChange = (year) => {
    trackSettingChange('selected_year', year, {
      template: 'yearly',
      previous_value: selectedYear
    })
    onInteraction?.()
    setSelectedYear(year)
  }

  const handleReadingGoalChange = (goal) => {
    trackSettingChange('reading_goal', goal, {
      template: 'yearly',
      year: selectedYear,
      previous_value: readingGoal
    })
    onInteraction?.()
    setReadingGoal(goal)
  }

  return (
    <div className="rrg-settings-section">
      <div style={{ marginBottom: '1rem' }}>
        <label className="rrg-label">Year</label>
        <select 
          value={selectedYear} 
          onChange={(e) => handleYearChange(parseInt(e.target.value))} 
          className="rrg-select"
        >
          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <SummaryStatsToggles
        showStats={showStats}
        setShowStats={setShowStats}
        pagesPerHour={pagesPerHour}
        setPagesPerHour={setPagesPerHour}
        showGoalControls
        showHighlightControls
        goalInput={
          <div>
            <label className="rrg-label" style={{ fontWeight: 400, fontSize: '0.9rem' }}>
              What was your reading goal for {selectedYear || new Date().getFullYear()}?
            </label>
            <input
              type="number"
              value={readingGoal === null ? '' : readingGoal}
              onChange={(e) => {
                const val = e.target.value
                if (val === '') {
                  handleReadingGoalChange(null)
                  return
                }
                const parsed = Math.max(1, Math.min(5000, parseInt(val, 10) || 1))
                handleReadingGoalChange(parsed)
              }}
              className="rrg-input"
              min="1"
              max="5000"
            />
          </div>
        }
      />
    </div>
  )
}

export default CustomizeYearReceipt
