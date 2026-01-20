import React from 'react'
import { trackSettingChange } from '../PostHogProvider'

const SummaryStatsToggles = ({
  showStats,
  setShowStats,
  pagesPerHour,
  setPagesPerHour,
  showGoalControls = false,
  showHighlightControls = false,
  goalInput = null
}) => {
  const handleToggle = (settingName, newValue) => {
    trackSettingChange(settingName, newValue, {
      section: 'summary_stats',
      previous_value: showStats[settingName]
    })
    setShowStats({ ...showStats, [settingName]: newValue })
  }

  const handlePagesPerHourChange = (newValue) => {
    trackSettingChange('pages_per_hour', newValue, {
      section: 'reading_speed',
      previous_value: pagesPerHour
    })
    setPagesPerHour(newValue)
  }
  return (
    <div className="rrg-toggles-section">
      <label className="rrg-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input
          type="checkbox"
          checked={showStats.statsSection}
          onChange={(e) => handleToggle('statsSection', e.target.checked)}
          className="rrg-checkbox"
        />
        Show Summary Stats
      </label>

      {showStats.statsSection && (
        <div className="rrg-toggle-group" style={{ paddingLeft: '1.5rem', marginTop: '0.75rem' }}>
          <label className="rrg-checkbox-label">
            <input
              type="checkbox"
              checked={showStats.booksRead}
              onChange={(e) => handleToggle('booksRead', e.target.checked)}
              className="rrg-checkbox"
            />
            Books Read
          </label>

          <label className="rrg-checkbox-label">
            <input
              type="checkbox"
              checked={showStats.avgRating}
              onChange={(e) => handleToggle('avgRating', e.target.checked)}
              className="rrg-checkbox"
            />
            Avg Rating
          </label>

          <label className="rrg-checkbox-label">
            <input
              type="checkbox"
              checked={showStats.totalPages}
              onChange={(e) => handleToggle('totalPages', e.target.checked)}
              className="rrg-checkbox"
            />
            Total Pages
          </label>

          <label className="rrg-checkbox-label">
            <input
              type="checkbox"
              checked={showStats.estHours}
              onChange={(e) => handleToggle('estHours', e.target.checked)}
              className="rrg-checkbox"
            />
            Est. Reading Time
          </label>

          {showStats.estHours && (
            <div style={{ marginLeft: '2rem', marginTop: '-0.5rem', maxWidth: '100%' }}>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.85rem', color: '#4b5563' }}>
                We estimate reading time based the total number of pages read and on your estimated reading speed. How many pages do you read per hour?
              </p>
              <input
                type="number"
                value={pagesPerHour ?? ''}
                onChange={(e) => {
                  const val = e.target.value
                  if (val === '') return handlePagesPerHourChange('')
                  const parsed = parseInt(val, 10)
                  handlePagesPerHourChange(Math.max(1, Math.min(200, parsed || 30)))
                }}
                onBlur={() => {
                  setPagesPerHour((prev) => {
                    if (prev === '' || prev === null || Number.isNaN(prev)) return 30
                    return Math.max(1, Math.min(200, Number(prev) || 30))
                  })
                }}
                className="rrg-input"
                min="1"
                max="200"
                style={{ marginTop: '0.5rem', marginBottom: '0.5rem', padding: '0.35rem 0.5rem', fontSize: '0.9rem' }}
              />
            </div>
          )}
        </div>
      )}

      {showGoalControls && (
        <>
          <hr style={{ border: 'none', borderTop: '1px dashed rgba(0,0,0,0.2)', margin: '1rem 0 0.5rem' }} />
          <label className="rrg-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="checkbox"
              checked={showStats.goalSection}
              onChange={(e) => handleToggle('goalSection', e.target.checked)}
              className="rrg-checkbox"
            />
            Show Reading Goal
          </label>

          {showStats.goalSection && (
            <div className="rrg-toggle-group" style={{ paddingLeft: '1.5rem', marginTop: '0.75rem' }}>
              {goalInput}
              <label className="rrg-checkbox-label">
                <input
                  type="checkbox"
                  checked={showStats.goalBooks}
                  onChange={(e) => handleToggle('goalBooks', e.target.checked)}
                  className="rrg-checkbox"
                />
                Goal Books
              </label>
              <label className="rrg-checkbox-label">
                <input
                  type="checkbox"
                  checked={showStats.goalBooksRead}
                  onChange={(e) => handleToggle('goalBooksRead', e.target.checked)}
                  className="rrg-checkbox"
                />
                Books Read
              </label>
              <label className="rrg-checkbox-label">
                <input
                  type="checkbox"
                  checked={showStats.goalProgress}
                  onChange={(e) => handleToggle('goalProgress', e.target.checked)}
                  className="rrg-checkbox"
                />
                Progress
              </label>
            </div>
          )}
        </>
      )}

      {showHighlightControls && (
        <>
          <hr style={{ border: 'none', borderTop: '1px dashed rgba(0,0,0,0.2)', margin: '1rem 0 0.5rem' }} />
          <label className="rrg-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="checkbox"
              checked={showStats.highlightsSection}
              onChange={(e) => handleToggle('highlightsSection', e.target.checked)}
              className="rrg-checkbox"
            />
            Show Highlights
          </label>

          {showStats.highlightsSection && (
            <div className="rrg-toggle-group" style={{ paddingLeft: '1.5rem', marginTop: '0.75rem' }}>
              <label className="rrg-checkbox-label">
                <input
                  type="checkbox"
                  checked={showStats.highlightsAvgLength}
                  onChange={(e) => handleToggle('highlightsAvgLength', e.target.checked)}
                  className="rrg-checkbox"
                />
                Avg Book Length
              </label>
              <label className="rrg-checkbox-label">
                <input
                  type="checkbox"
                  checked={showStats.highlightsAvgRating}
                  onChange={(e) => handleToggle('highlightsAvgRating', e.target.checked)}
                  className="rrg-checkbox"
                />
                Avg Rating
              </label>
              <label className="rrg-checkbox-label">
                <input
                  type="checkbox"
                  checked={showStats.highlightsFiveStar}
                  onChange={(e) => handleToggle('highlightsFiveStar', e.target.checked)}
                  className="rrg-checkbox"
                />
                5★ Reads
              </label>
              <label className="rrg-checkbox-label">
                <input
                  type="checkbox"
                  checked={showStats.highlightsMostReadMonth}
                  onChange={(e) => handleToggle('highlightsMostReadMonth', e.target.checked)}
                  className="rrg-checkbox"
                />
                Most-Read Month
              </label>
              <label className="rrg-checkbox-label">
                <input
                  type="checkbox"
                  checked={showStats.highlightsShortest}
                  onChange={(e) => handleToggle('highlightsShortest', e.target.checked)}
                  className="rrg-checkbox"
                />
                Shortest Book
              </label>
              <label className="rrg-checkbox-label">
                <input
                  type="checkbox"
                  checked={showStats.highlightsLongest}
                  onChange={(e) => handleToggle('highlightsLongest', e.target.checked)}
                  className="rrg-checkbox"
                />
                Longest Book
              </label>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SummaryStatsToggles
