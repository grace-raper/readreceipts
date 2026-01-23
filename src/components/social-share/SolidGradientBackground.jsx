import React, { useState } from 'react'

const SolidGradientBackground = ({ onBackgroundChange }) => {
  const [backgroundMode, setBackgroundMode] = useState('preset')
  const [customColor, setCustomColor] = useState('#f8f4ec')
  const [gradientStart, setGradientStart] = useState('#ffaf87')
  const [gradientEnd, setGradientEnd] = useState('#ff6b6b')
  const [gradientDirection, setGradientDirection] = useState('to bottom')

  const presetColors = [
    { name: 'Peach', value: '#fbbf93' },
    { name: 'Mint', value: '#a7f3d0' },
    { name: 'Blue', value: '#93c5fd' },
    { name: 'Lavender', value: '#c4b5fd' },
    { name: 'Rose', value: '#f9a8d4' },
    { name: 'Grey', value: '#e5e7eb' },
    { name: 'Brown', value: '#d6b28f' }
  ]

  const presetGradients = [
    { name: 'Sunset', value: 'linear-gradient(135deg, #ffb347 0%, #ff416c 100%)' },
    { name: 'Peach', value: 'linear-gradient(135deg, #ffe5c0 0%, #ff9ec7 100%)' },
    { name: 'Cool Breeze', value: 'linear-gradient(135deg, #8fd3f4 0%, #84fab0 100%)' }
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
              padding: '0.65rem',
              border: `2px solid #1f1307`,
              borderRadius: '6px',
              background: backgroundMode === 'preset' ? '#1f1307' : 'white',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: backgroundMode === 'preset' ? 'white' : '#1f1307',
              transition: 'all 0.2s'
            }}
          >
            Presets
          </button>
          <button
            onClick={() => setBackgroundMode('custom')}
            style={{
              flex: 1,
              padding: '0.65rem',
              border: `2px solid #1f1307`,
              borderRadius: '6px',
              background: backgroundMode === 'custom' ? '#1f1307' : 'white',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: backgroundMode === 'custom' ? 'white' : '#1f1307',
              transition: 'all 0.2s'
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
                gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                gap: '0.5rem'
              }}>
                {presetColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handlePresetColorClick(color.value)}
                    style={{
                      padding: 0,
                      border: '1px solid #ffffff',
                      borderRadius: '50%',
                      background: color.value,
                      cursor: 'pointer',
                      width: '100%',
                      aspectRatio: '1 / 1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}
                    title={color.name}
                  >
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1f1307' }}>
                      {/* {color.name} */}
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
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                {presetGradients.map((gradient) => (
                  <button
                    key={gradient.name}
                    onClick={() => handlePresetGradientClick(gradient.value)}
                    style={{
                      padding: '0',
                      border: '1px solid #ffffff',
                      borderRadius: '6px',
                      background: gradient.value,
                      cursor: 'pointer',
                      height: '50px',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                    title={gradient.name}
                  >
                    {/* <span style={{
                      fontSize: '0.7rem',
                      padding: '0.35rem 0.5rem',
                      background: '#f8f4ec',
                      width: '100%',
                      textAlign: 'center',
                      fontWeight: 700
                    }}>
                      {gradient.name}
                    </span> */}
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
