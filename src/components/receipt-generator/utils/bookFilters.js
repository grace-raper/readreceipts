import { getSeasonRange } from './seasonUtils'

export const filterBooksForTemplate = (books, template, options = {}) => {
  const { selectedYear, selectedMonth, selectedSeason, customSeasonStart, customSeasonEnd } = options
  let filtered = books

  if (template === 'tbr') {
    return filtered.filter((b) => b.shelf === 'toRead')
  }

  if (template === 'current') {
    return filtered.filter((b) => b.shelf === 'currentlyReading')
  }

  if (template === 'yearly') {
    return filtered.filter((b) => {
      if (!b.dateFinished) return false
      const d = new Date(b.dateFinished)
      return d.getFullYear() === selectedYear
    })
  }

  if (template === 'monthly') {
    return filtered.filter((b) => {
      if (!b.dateFinished) return false
      const d = new Date(b.dateFinished)
      return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth
    })
  }

  if (template === 'seasonal') {
    const range = getSeasonRange(selectedYear, selectedSeason, customSeasonStart, customSeasonEnd)
    if (!range) return filtered
    return filtered.filter((b) => {
      if (!b.dateFinished) return false
      const d = new Date(b.dateFinished)
      return d >= range.start && d <= range.end
    })
  }

  // standard template — show all read books
  return filtered.filter((b) => b.shelf === 'read')
}
