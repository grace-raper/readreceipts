import React from 'react'
import CustomizeDefaultReceipt from '../receipt-settings/CustomizeDefaultReceipt'
import CustomizeYearReceipt from '../receipt-settings/CustomizeYearReceipt'
import CustomizeTbrReceipt from '../receipt-settings/CustomizeTbrReceipt'
import CustomizeCurrentlyReadingReceipt from '../receipt-settings/CustomizeCurrentlyReadingReceipt'
import CustomizeSeasonalReceipt from '../receipt-settings/CustomizeSeasonalReceipt'
import CustomizeMonthReceipt from '../receipt-settings/CustomizeMonthReceipt'

const TemplateSettingsPanel = ({
  template,
  numBooksToShow,
  setNumBooksToShow,
  showStats,
  setShowStats,
  pagesPerHour,
  setPagesPerHour,
  selectedYear,
  setSelectedYear,
  readingGoal,
  setReadingGoal,
  selectedMonth,
  setSelectedMonth,
  selectedSeason,
  setSelectedSeason,
  customSeasonName,
  setCustomSeasonName,
  customSeasonStart,
  setCustomSeasonStart,
  customSeasonEnd,
  setCustomSeasonEnd,
  receiptDate,
  setReceiptDate,
  getSeasonYearLabel,
  onInteraction
}) => {
  return (
    <>
      {template === 'tbr' && (
        <CustomizeTbrReceipt
          numBooksToShow={numBooksToShow}
          setNumBooksToShow={setNumBooksToShow}
          showStats={showStats}
          setShowStats={setShowStats}
          receiptDate={receiptDate}
          setReceiptDate={setReceiptDate}
          onInteraction={onInteraction}
        />
      )}
      
      {template === 'current' && (
        <CustomizeCurrentlyReadingReceipt
          receiptDate={receiptDate}
          setReceiptDate={setReceiptDate}
          onInteraction={onInteraction}
        />
      )}
      
      {template === 'standard' && (
        <CustomizeDefaultReceipt
          numBooksToShow={numBooksToShow}
          setNumBooksToShow={setNumBooksToShow}
          showStats={showStats}
          setShowStats={setShowStats}
          pagesPerHour={pagesPerHour}
          setPagesPerHour={setPagesPerHour}
          onInteraction={onInteraction}
        />
      )}
      
      {template === 'yearly' && (
        <CustomizeYearReceipt
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          readingGoal={readingGoal}
          setReadingGoal={setReadingGoal}
          showStats={showStats}
          setShowStats={setShowStats}
          pagesPerHour={pagesPerHour}
          setPagesPerHour={setPagesPerHour}
          onInteraction={onInteraction}
        />
      )}
      
      {template === 'monthly' && (
        <CustomizeMonthReceipt
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          showStats={showStats}
          setShowStats={setShowStats}
          pagesPerHour={pagesPerHour}
          setPagesPerHour={setPagesPerHour}
          onInteraction={onInteraction}
        />
      )}
      
      {template === 'seasonal' && (
        <CustomizeSeasonalReceipt
          selectedSeason={selectedSeason}
          setSelectedSeason={setSelectedSeason}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          customSeasonName={customSeasonName}
          setCustomSeasonName={setCustomSeasonName}
          customSeasonStart={customSeasonStart}
          setCustomSeasonStart={setCustomSeasonStart}
          customSeasonEnd={customSeasonEnd}
          setCustomSeasonEnd={setCustomSeasonEnd}
          getSeasonYearLabel={getSeasonYearLabel}
          showStats={showStats}
          setShowStats={setShowStats}
          pagesPerHour={pagesPerHour}
          setPagesPerHour={setPagesPerHour}
          onInteraction={onInteraction}
        />
      )}
    </>
  )
}

export default TemplateSettingsPanel
