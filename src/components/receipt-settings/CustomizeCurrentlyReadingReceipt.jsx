import React from 'react'

const CustomizeCurrentlyReadingReceipt = ({ receiptDate, setReceiptDate, onInteraction }) => {
  return (
    <div className="rrg-settings-section">
      <div style={{ marginBottom: '1rem' }}>
        <label className="rrg-label">Receipt Date</label>
        <input
          type="date"
          value={receiptDate}
          onChange={(e) => {
            setReceiptDate(e.target.value)
            onInteraction?.()
          }}
          className="rrg-input"
        />
      </div>
      
      <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>
        Currently Reading receipts show all books in progress.
      </p>
    </div>
  )
}

export default CustomizeCurrentlyReadingReceipt
