import React from 'react'
import SummaryStatsToggles from './SummaryStatsToggles'
import { trackSettingChange } from '../PostHogProvider'

const CustomizeMonthReceipt = ({ 
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  showStats,
  setShowStats,
  pagesPerHour,
  setPagesPerHour,
  onInteraction
}) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const handleMonthChange = (month) => {
    trackSettingChange('selected_month', month, {
      template: 'monthly',
      month_name: months[month],
      year: selectedYear,
      previous_value: selectedMonth,
      previous_month_name: months[selectedMonth]
    })
    onInteraction?.()
    setSelectedMonth(month)
  }

  const handleYearChange = (year) => {
    trackSettingChange('selected_year', year, {
      template: 'monthly',
      month: selectedMonth,
      previous_value: selectedYear
    })
    onInteraction?.()
    setSelectedYear(year)
  }

  return (
    <div className="rrg-settings-section">
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <label className="rrg-label">Month</label>
          <select 
            value={selectedMonth} 
            onChange={(e) => handleMonthChange(parseInt(e.target.value))} 
            className="rrg-select"
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div>
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

export default CustomizeMonthReceipt
