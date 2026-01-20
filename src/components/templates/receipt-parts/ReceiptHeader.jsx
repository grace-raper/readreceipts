import React from 'react'

const ReceiptHeader = ({ title = 'READ RECEIPTS', username = 'READER' }) => {
  return (
    <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
      <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, letterSpacing: '0.12em' }}>
        {title.toUpperCase()}
      </h2>
      <p style={{ margin: '0.3rem 0 0', fontSize: '11px', opacity: 0.7 }}>
        {username ? username.toUpperCase() : 'READER'}
      </p>
    </div>
  )
}

export default ReceiptHeader
