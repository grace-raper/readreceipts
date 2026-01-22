import React, { useState, useRef, useEffect } from 'react'
import { Grid } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { trackEvent } from '../PostHogProvider'

const GiphyBackground = ({ onGifSelect, selectedGif }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchKey, setSearchKey] = useState(null)
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

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchKey(Date.now())
      trackEvent('social_share_giphy_search', {
        search_query: searchQuery
      })
    }
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

      <div style={{ marginTop: '0.5rem' }}>
        <img 
          src="/PoweredBy_640_Horizontal_Light-Backgrounds_With_Logo.gif" 
          alt="Powered by GIPHY" 
          style={{ height: '34px' }}
        />
      </div>
    </div>
  )
}

export default GiphyBackground
