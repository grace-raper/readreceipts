import React from 'react'

const ReceiptTotal = ({ label = 'TOTAL', value, formatPrice }) => {
  return (
    <div style={{ paddingTop: '0.9rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 700 }}>
        <span>{label}</span>
        <span>{formatPrice ? formatPrice(value) : value}</span>
      </div>
    </div>
  )
}

export default ReceiptTotal
