import React from 'react'

const ReceiptStatRow = ({ label, value, isLast = false }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: isLast ? 0 : '0.3rem' }}>
      <span>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  )
}

export default ReceiptStatRow
