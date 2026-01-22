import React, { useState } from 'react'

const SolidGradientBackground = ({ onBackgroundChange }) => {
  const [backgroundMode, setBackgroundMode] = useState('preset')
  const [customColor, setCustomColor] = useState('#f8f4ec')
  const [gradientStart, setGradientStart] = useState('#fef3c7')
  const [gradientEnd, setGradientEnd] = useState('#fed7aa')
  const [gradientDirection, setGradientDirection] = useState('to bottom')

  const presetColors = [
    { name: 'Cream', value: '#f8f4ec' },
    { name: 'Warm Beige', value: '#fef3c7' },
    { name: 'Peach', value: '#fed7aa' },
    { name: 'Mint', value: '#d1fae5' },
    { name: 'Sky Blue', value: '#dbeafe' },
    { name: 'Lavender', value: '#e9d5ff' },
    { name: 'Rose', value: '#fce7f3' },
    { name: 'Sage', value: '#dcfce7' }
  ]

  const presetGradients = [
    { name: 'Sunset', value: 'linear-gradient(to bottom, #fef3c7, #fed7aa)' },
    { name: 'Ocean', value: 'linear-gradient(to bottom, #dbeafe, #bfdbfe)' },
    { name: 'Forest', value: 'linear-gradient(to bottom, #dcfce7, #bbf7d0)' },
    { name: 'Lavender Dream', value: 'linear-gradient(to bottom, #e9d5ff, #f3e8ff)' },
    { name: 'Peachy', value: 'linear-gradient(135deg, #fed7aa, #fce7f3)' },
    { name: 'Cool Breeze', value: 'linear-gradient(135deg, #dbeafe, #d1fae5)' }
  ]

  const handlePresetColorClick = (color) => {
    setCustomColor(color)
    onBackgroundChange({ type: 'solid', value: color })
  }

  const handlePresetGradientClick = (gradient) => {
    onBackgroundChange({ type: 'gradient', value: gradient })
  }

  const handleCustomColorChange = (color) => {
    setCustomColor(color)
    onBackgroundChange({ type: 'solid', value: color })
  }

  const handleGradientChange = () => {
    const gradient = `linear-gradient(${gradientDirection}, ${gradientStart}, ${gradientEnd})`
    onBackgroundChange({ type: 'gradient', value: gradient })
  }

  const handleHexInput = (e) => {
    let value = e.target.value
    if (!value.startsWith('#')) {
      value = '#' + value
    }
    setCustomColor(value)
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      onBackgroundChange({ type: 'solid', value })
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            onClick={() => setBackgroundMode('preset')}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: `2px solid ${backgroundMode === 'preset' ? '#d97706' : '#e2d9c8'}`,
              borderRadius: '6px',
              background: backgroundMode === 'preset' ? '#fef3c7' : 'white',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 600
            }}
          >
            Presets
          </button>
          <button
            onClick={() => setBackgroundMode('custom')}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: `2px solid ${backgroundMode === 'custom' ? '#d97706' : '#e2d9c8'}`,
              borderRadius: '6px',
              background: backgroundMode === 'custom' ? '#fef3c7' : 'white',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 600
            }}
          >
            Custom
          </button>
        </div>

        {backgroundMode === 'preset' && (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 600 }}>
                Solid Colors
              </h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.5rem'
              }}>
                {presetColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handlePresetColorClick(color.value)}
                    style={{
                      padding: '0',
                      border: '2px solid #1f1307',
                      borderRadius: '6px',
                      background: color.value,
                      cursor: 'pointer',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                    title={color.name}
                  >
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '0.25rem 0.5rem',
                      background: 'rgba(255,255,255,0.9)',
                      width: '100%',
                      textAlign: 'center',
                      fontWeight: 600
                    }}>
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 600 }}>
                Gradients
              </h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.5rem'
              }}>
                {presetGradients.map((gradient) => (
                  <button
                    key={gradient.name}
                    onClick={() => handlePresetGradientClick(gradient.value)}
                    style={{
                      padding: '0',
                      border: '2px solid #1f1307',
                      borderRadius: '6px',
                      background: gradient.value,
                      cursor: 'pointer',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                    title={gradient.name}
                  >
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '0.25rem 0.5rem',
                      background: 'rgba(255,255,255,0.9)',
                      width: '100%',
                      textAlign: 'center',
                      fontWeight: 600
                    }}>
                      {gradient.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {backgroundMode === 'custom' && (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 600 }}>
                Solid Color
              </h4>
              
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  style={{
                    width: '60px',
                    height: '40px',
                    border: '2px solid #1f1307',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={handleHexInput}
                  placeholder="#f8f4ec"
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    border: '2px solid #1f1307',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
                Enter hex color (e.g., #f8f4ec) or RGB values
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 600 }}>
                Custom Gradient
              </h4>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  Start Color
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="color"
                    value={gradientStart}
                    onChange={(e) => {
                      setGradientStart(e.target.value)
                      setTimeout(handleGradientChange, 0)
                    }}
                    style={{
                      width: '50px',
                      height: '36px',
                      border: '2px solid #1f1307',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    type="text"
                    value={gradientStart}
                    onChange={(e) => {
                      setGradientStart(e.target.value)
                      if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                        setTimeout(handleGradientChange, 0)
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      border: '2px solid #1f1307',
                      borderRadius: '6px',
                      fontFamily: 'monospace',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  End Color
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="color"
                    value={gradientEnd}
                    onChange={(e) => {
                      setGradientEnd(e.target.value)
                      setTimeout(handleGradientChange, 0)
                    }}
                    style={{
                      width: '50px',
                      height: '36px',
                      border: '2px solid #1f1307',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    type="text"
                    value={gradientEnd}
                    onChange={(e) => {
                      setGradientEnd(e.target.value)
                      if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                        setTimeout(handleGradientChange, 0)
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      border: '2px solid #1f1307',
                      borderRadius: '6px',
                      fontFamily: 'monospace',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  Direction
                </label>
                <select
                  value={gradientDirection}
                  onChange={(e) => {
                    setGradientDirection(e.target.value)
                    setTimeout(handleGradientChange, 0)
                  }}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '2px solid #1f1307',
                    borderRadius: '6px',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="to bottom">Top to Bottom</option>
                  <option value="to top">Bottom to Top</option>
                  <option value="to right">Left to Right</option>
                  <option value="to left">Right to Left</option>
                  <option value="135deg">Diagonal ↘</option>
                  <option value="45deg">Diagonal ↗</option>
                </select>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SolidGradientBackground
