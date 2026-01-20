import React from 'react'

const TbrStatToggles = ({ showStats, setShowStats }) => {
  return (
    <div className="rrg-toggles-section">
      <label className="rrg-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input
          type="checkbox"
          checked={showStats.tbrSection !== false}
          onChange={(e) => setShowStats({ ...showStats, tbrSection: e.target.checked })}
          className="rrg-checkbox"
        />
        Show TBR Stats
      </label>

      {showStats.tbrSection !== false && (
        <div className="rrg-toggle-group" style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
          <label className="rrg-checkbox-label">
            <input
              type="checkbox"
              checked={showStats.tbrBooks !== false}
              onChange={(e) => setShowStats({ ...showStats, tbrBooks: e.target.checked })}
              className="rrg-checkbox"
            />
            Books on TBR
          </label>
          <label className="rrg-checkbox-label">
            <input
              type="checkbox"
              checked={showStats.tbrAddedThisYear !== false}
              onChange={(e) => setShowStats({ ...showStats, tbrAddedThisYear: e.target.checked })}
              className="rrg-checkbox"
            />
            Added This Year
          </label>
          <label className="rrg-checkbox-label">
            <input
              type="checkbox"
              checked={showStats.tbrOldest !== false}
              onChange={(e) => setShowStats({ ...showStats, tbrOldest: e.target.checked })}
              className="rrg-checkbox"
            />
            Oldest TBR Book
          </label>
          <label className="rrg-checkbox-label">
            <input
              type="checkbox"
              checked={showStats.tbrNewest !== false}
              onChange={(e) => setShowStats({ ...showStats, tbrNewest: e.target.checked })}
              className="rrg-checkbox"
            />
            Newest Addition
          </label>
        </div>
      )}
    </div>
  )
}

export default TbrStatToggles
