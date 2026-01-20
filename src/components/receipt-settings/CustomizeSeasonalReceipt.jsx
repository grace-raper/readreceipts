import React from 'react'
import { Snowflake, Flower, Sun, Leaf, Calendar } from 'lucide-react'
import SummaryStatsToggles from './SummaryStatsToggles'

const CustomizeSeasonalReceipt = ({ 
  selectedSeason,
  setSelectedSeason,
  selectedYear,
  setSelectedYear,
  customSeasonName,
  setCustomSeasonName,
  customSeasonStart,
  setCustomSeasonStart,
  customSeasonEnd,
  setCustomSeasonEnd,
  getSeasonYearLabel,
  showStats,
  setShowStats,
  pagesPerHour,
  setPagesPerHour
}) => {
  return (
    <div className="rrg-settings-section">
      <div style={{ marginBottom: '1rem' }}>
        <label className="rrg-label">Season</label>
        <div className="rrg-template-grid rrg-template-grid--season">
          <button 
            className={`rrg-template-button ${selectedSeason === 'winter' ? 'active' : ''}`}
            onClick={() => setSelectedSeason('winter')}
          >
            <Snowflake size={18} color={selectedSeason === 'winter' ? '#fff' : '#111'} />
            <span>Winter</span>
          </button>
          <button 
            className={`rrg-template-button ${selectedSeason === 'spring' ? 'active' : ''}`}
            onClick={() => setSelectedSeason('spring')}
          >
            <Flower size={18} color={selectedSeason === 'spring' ? '#fff' : '#111'} />
            <span>Spring</span>
          </button>
          <button 
            className={`rrg-template-button ${selectedSeason === 'summer' ? 'active' : ''}`}
            onClick={() => setSelectedSeason('summer')}
          >
            <Sun size={18} color={selectedSeason === 'summer' ? '#fff' : '#111'} />
            <span>Summer</span>
          </button>
          <button 
            className={`rrg-template-button ${selectedSeason === 'fall' ? 'active' : ''}`}
            onClick={() => setSelectedSeason('fall')}
          >
            <Leaf size={18} color={selectedSeason === 'fall' ? '#fff' : '#111'} />
            <span>Fall</span>
          </button>
          <button 
            className={`rrg-template-button ${selectedSeason === 'custom' ? 'active' : ''}`}
            onClick={() => setSelectedSeason('custom')}
          >
            <Calendar size={18} color={selectedSeason === 'custom' ? '#fff' : '#111'} />
            <span>Custom</span>
          </button>
        </div>
      </div>
      
      {selectedSeason !== 'custom' && (
        <div style={{ marginBottom: '1rem' }}>
          <label className="rrg-label">Year</label>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))} 
            className="rrg-select"
          >
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>
                {getSeasonYearLabel(year, selectedSeason)}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {selectedSeason === 'custom' && (
        <>

          <div style={{ marginBottom: '1rem' }}>
            <label className="rrg-label">Start / End Dates</label>
            <div className="rrg-season-dates">
              <input
                type="date"
                value={customSeasonStart}
                onChange={(e) => setCustomSeasonStart(e.target.value)}
                className="rrg-input"
                style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}
              />
              <input
                type="date"
                value={customSeasonEnd}
                onChange={(e) => setCustomSeasonEnd(e.target.value)}
                className="rrg-input"
                style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}
              />
            </div>
          </div>
                    <div style={{ marginBottom: '1rem' }}>
            <label className="rrg-label"><em>Season Name (optional)</em></label>
            <input
              type="text"
              value={customSeasonName}
              onChange={(e) => setCustomSeasonName(e.target.value)}
              placeholder="e.g., Summer Reading Challenge, Q1 Reads"
              className="rrg-input"
            />
          </div>
        </>
      )}

      <SummaryStatsToggles
        showStats={showStats}
        setShowStats={setShowStats}
        pagesPerHour={pagesPerHour}
        setPagesPerHour={setPagesPerHour}
      />
    </div>
  )
}

export default CustomizeSeasonalReceipt
