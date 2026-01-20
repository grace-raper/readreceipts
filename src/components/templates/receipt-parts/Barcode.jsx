import React from 'react'

const Barcode = ({ barcode, url = 'https://readreceipts.xyz', marginTop = '0.35rem' }) => {
  const renderBarcode = () => {
    if (!barcode) return null
    // If already JSX, render as-is
    if (React.isValidElement(barcode)) return barcode
    // If provided as text, render text
    if (typeof barcode === 'string') return <div>{barcode}</div>
    // If provided as object with bars/width, render SVG
    if (barcode.bars && barcode.width) {
      const height = 110
      return (
        <svg
          viewBox={`0 0 ${barcode.width} ${height}`}
          style={{ width: '100%', height: 'auto' }}
          preserveAspectRatio="xMidYMid meet"
        >
          {barcode.bars.map((bar, idx) => (
            <rect key={idx} x={bar.x} y={8} width={bar.width} height={height - 16} fill="black" />
          ))}
        </svg>
      )
    }
    return null
  }

  return (
    <div style={{ textAlign: 'center', marginTop }}>
      {renderBarcode()}
      <div style={{ fontSize: '11px', color: '#4b5563', marginTop: '-2rem' }}>{url}</div>
    </div>
  )
}

export default Barcode
