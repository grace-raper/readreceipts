import React, { useState, useRef } from 'react'
import { Grid } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'

const GiphyBackground = ({ onGifSelect, selectedGif }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const canvasRef = useRef(null)

  const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY || ''
  const gf = new GiphyFetch(GIPHY_API_KEY)

  const fetchGifs = (offset) => {
    if (!searchQuery.trim()) {
      return gf.trending({ offset, limit: 20 })
    }
    return gf.search(searchQuery, { offset, limit: 20 })
  }

  const handleGifClick = (gif, e) => {
    e.preventDefault()
    onGifSelect(gif)
  }

  return (
    <div>
      {selectedGif && (
        <div style={{ 
          marginBottom: '1rem',
          padding: '1rem',
          background: '#f8f4ec',
          borderRadius: '8px',
          border: '2px solid #d97706'
        }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <img 
              src={selectedGif.images.fixed_height_small.url}
              alt={selectedGif.title}
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'cover',
                borderRadius: '6px',
                border: '2px solid #1f1307'
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                Selected GIF
              </div>
              <div style={{ 
                fontSize: '0.8rem', 
                color: '#666',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {selectedGif.title || 'Untitled'}
              </div>
            </div>
            <button
              onClick={() => onGifSelect(null)}
              style={{
                padding: '0.5rem 1rem',
                border: '2px solid #1f1307',
                borderRadius: '6px',
                background: 'white',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
          Search GIFs
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Giphy (or leave empty for trending)..."
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            border: '2px solid #1f1307',
            borderRadius: '6px',
            fontSize: '1rem',
            fontFamily: 'inherit'
          }}
        />
      </div>

      <div 
        ref={canvasRef}
        id="giphy-grid-container"
        style={{
          maxHeight: '500px',
          overflowY: 'auto',
          border: '2px solid #e2d9c8',
          borderRadius: '8px',
          marginBottom: '1rem',
          width: '100%'
        }}
      >
        {GIPHY_API_KEY ? (
          <Grid
            key={searchQuery}
            width={canvasRef.current?.offsetWidth - 16 || 400}
            columns={3}
            gutter={6}
            fetchGifs={fetchGifs}
            onGifClick={handleGifClick}
          />
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
            Please add GIPHY API key to .env file
          </div>
        )}
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        fontSize: '0.75rem',
        color: '#666',
        marginTop: '0.5rem'
      }}>
        <span>Powered by</span>
        <img 
          src="/giphy-300.png" 
          alt="GIPHY" 
          style={{ height: '20px' }}
        />
      </div>
    </div>
  )
}

export default GiphyBackground
