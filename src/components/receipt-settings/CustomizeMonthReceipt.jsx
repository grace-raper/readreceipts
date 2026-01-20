import React from 'react'
import SummaryStatsToggles from './SummaryStatsToggles'

const CustomizeMonthReceipt = ({ 
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  showStats,
  setShowStats,
  pagesPerHour,
  setPagesPerHour
}) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <div className="rrg-settings-section">
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <label className="rrg-label">Month</label>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))} 
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
            onChange={(e) => setSelectedYear(parseInt(e.target.value))} 
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
