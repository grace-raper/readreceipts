import React from 'react'

const ReceiptMetadata = ({ leftText, rightText }) => {
  return (
    <div className="rrg-dashed-top" style={{ paddingTop: '0.9rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '0.5rem' }}>
        <span>{leftText}</span>
        <span>{rightText}</span>
      </div>
    </div>
  )
}

export default ReceiptMetadata
