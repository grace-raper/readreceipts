import React from 'react'

const BarcodeFooter = ({ barcode, url = 'https://readreceipts.xyz', marginTop = '0.35rem' }) => {
  return (
    <div style={{ textAlign: 'center', marginTop }}>
      {barcode}
       https://readreceipts.xyz
      <div style={{ fontSize: '11px', color: '#4b5563', marginTop: '0.15rem' }}>{url}</div>
    </div>
  )
}

export default BarcodeFooter
