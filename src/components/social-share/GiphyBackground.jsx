import React, { useState, useRef, useEffect } from 'react'
import { Grid } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'

const GiphyBackground = ({ onGifSelect, selectedGif }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const canvasRef = useRef(null)
  const [gridWidth, setGridWidth] = useState(400)

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

  useEffect(() => {
    const updateWidth = () => {
      if (canvasRef.current) {
        const width = canvasRef.current.clientWidth
        if (width && width !== gridWidth) {
          setGridWidth(width)
        }
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [gridWidth])

  return (
    <div>
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
            width={gridWidth}
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
