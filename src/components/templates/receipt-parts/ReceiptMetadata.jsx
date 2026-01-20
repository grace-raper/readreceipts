import React from 'react'

const ReceiptMetadata = ({ leftText, rightText }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '0.5rem' }}>
      <span>{leftText}</span>
      <span>{rightText}</span>
    </div>
  )
}

export default ReceiptMetadata
