import React from 'react'

const code39 = {
  '0': 'nnnwwnwnn', '1': 'wnnwnnnnw', '2': 'nnwwnnnnw', '3': 'wnwwnnnnn',
  '4': 'nnnwwnnnw', '5': 'wnnwwnnnn', '6': 'nnwwwnnnn', '7': 'nnnwnnwnw',
  '8': 'wnnwnnwnn', '9': 'nnwwnnwnn', A: 'wnnnnwnnw', B: 'nnwnnwnnw',
  C: 'wnwnnwnnn', D: 'nnnnwwnnw', E: 'wnnnwwnnn', F: 'nnwnwwnnn',
  G: 'nnnnnwwnw', H: 'wnnnnwwnn', I: 'nnwnnwwnn', J: 'nnnnwwwnn',
  K: 'wnnnnnnww', L: 'nnwnnnnww', M: 'wnwnnnnwn', N: 'nnnnwnnww',
  O: 'wnnnwnnwn', P: 'nnwnwnnwn', Q: 'nnnnnnwww', R: 'wnnnnnwwn',
  S: 'nnwnnnwwn', T: 'nnnnwnwwn', U: 'wwnnnnnnw', V: 'nwwnnnnnw',
  W: 'wwwnnnnnn', X: 'nwnnwnnnw', Y: 'wwnnwnnnn', Z: 'nwwnwnnnn',
  '-': 'nwnnnnwnw', '.': 'wwnnnnwnn', ' ': 'nwwnnnwnn', '$': 'nwnwnwnnn',
  '/': 'nwnwnnnwn', '+': 'nwnnnwnwn', '%': 'nnnwnwnwn', '*': 'nwnnwnwnn',
}

const encodeCode39 = (text) => {
  const upper = `*${text.toUpperCase()}*`
  const unit = 2
  const wide = unit * 3
  let cursor = 0
  const bars = []

  upper.split('').forEach((ch) => {
    const pattern = code39[ch] || code39[' ']
    for (let i = 0; i < pattern.length; i++) {
      const isBar = i % 2 === 0
      const width = pattern[i] === 'w' ? wide : unit
      if (isBar) {
        bars.push({ x: cursor, width })
      }
      cursor += width
    }
    cursor += unit
  })

  const quiet = unit * 10
  bars.forEach((bar) => {
    bar.x += quiet
  })
  const totalWidth = cursor + quiet
  return { bars, width: totalWidth }
}

const Barcode = ({ barcode, encode = 'readreceipts.xyz', label = 'https://readreceipts.xyz', marginTop = '1.5rem' }) => {
  // Normalize input
  const textToEncode = encode || (typeof barcode === 'string' ? barcode : null)

  const renderBarcode = () => {
    if (!barcode && !textToEncode) return null
    // If already JSX, render as-is
    if (barcode && React.isValidElement(barcode)) return barcode
    // If provided as object with bars/width, render SVG
    if (barcode && barcode.bars && barcode.width) {
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
    // If we have text, encode then render
    if (textToEncode) {
      const { bars, width } = encodeCode39(textToEncode)
      const height = 110
      return (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto' }}
          preserveAspectRatio="xMidYMid meet"
        >
          {bars.map((bar, idx) => (
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
      <div style={{ fontSize: '11px', color: '#4b5563', marginTop: '0.2rem' }}>{label}</div>
    </div>
  )
}

export default Barcode
