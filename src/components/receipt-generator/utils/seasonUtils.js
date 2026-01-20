export const getSeasonRange = (selectedYear, selectedSeason, customSeasonStart, customSeasonEnd) => {
  const year = selectedYear
  if (selectedSeason === 'winter') {
    return {
      start: new Date(year - 1, 11, 1), // Dec previous year
      end: new Date(year, 1, 29, 23, 59, 59, 999), // end of Feb
    }
  }
  if (selectedSeason === 'spring') {
    return { start: new Date(year, 2, 1), end: new Date(year, 4, 31, 23, 59, 59, 999) }
  }
  if (selectedSeason === 'summer') {
    return { start: new Date(year, 5, 1), end: new Date(year, 7, 31, 23, 59, 59, 999) }
  }
  if (selectedSeason === 'fall') {
    return { start: new Date(year, 8, 1), end: new Date(year, 10, 30, 23, 59, 59, 999) }
  }
  if (selectedSeason === 'custom' && customSeasonStart && customSeasonEnd) {
    return { start: new Date(customSeasonStart), end: new Date(customSeasonEnd) }
  }
  return null
}

export const getSeasonYearLabel = (year, season) => {
  if (season === 'winter') {
    return `${year} - Dec '${String(year - 1).slice(-2)}, Jan '${String(year).slice(-2)}, Feb '${String(year).slice(-2)}`
  }
  if (season === 'spring') return `${year} - Mar, Apr, May`
  if (season === 'summer') return `${year} - Jun, Jul, Aug`
  if (season === 'fall') return `${year} - Sep, Oct, Nov`
  return `${year}`
}
