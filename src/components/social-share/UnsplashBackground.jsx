import React, { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'

const UnsplashBackground = ({ onImageSelect, selectedImage }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const containerRef = useRef(null)

  const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || ''
  const APP_NAME = 'readreceipts'

  const addUtm = (url) => {
    if (!url) return url
    return `${url}${url.includes('?') ? '&' : '?'}utm_source=${APP_NAME}&utm_medium=referral`
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async (query = '', pageNum = 1) => {
    if (!UNSPLASH_ACCESS_KEY) return

    setLoading(true)
    try {
      const endpoint = query 
        ? `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${pageNum}&per_page=20&orientation=landscape`
        : `https://api.unsplash.com/photos?page=${pageNum}&per_page=20&order_by=popular`

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }

      const data = await response.json()
      const newImages = query ? data.results : data

      if (pageNum === 1) {
        setImages(newImages)
      } else {
        setImages(prev => [...prev, ...newImages])
      }

      setHasMore(newImages.length === 20)
      setPage(pageNum)
    } catch (error) {
      console.error('Error fetching Unsplash images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchImages(searchQuery, 1)
  }

  const handleImageClick = (image) => {
    onImageSelect({
      url: addUtm(image.urls.regular),
      thumb: addUtm(image.urls.small),
      photographer: image.user.name,
      photographerUrl: addUtm(image.user.links.html),
      unsplashUrl: addUtm('https://unsplash.com/'),
      downloadLocation: image.links.download_location
    })

    if (UNSPLASH_ACCESS_KEY && image.links.download_location) {
      fetch(image.links.download_location, {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }).catch(err => console.error('Error tracking download:', err))
    }
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchImages(searchQuery, page + 1)
    }
  }

  if (!UNSPLASH_ACCESS_KEY) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        border: '2px dashed #e2d9c8',
        borderRadius: '8px',
        background: '#f8f4ec'
      }}>
        <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          Unsplash API Key Required
        </div>
        <div style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.5 }}>
          Please add your Unsplash Access Key to the .env file as VITE_UNSPLASH_ACCESS_KEY
        </div>
      </div>
    )
  }

  return (
    <div>
      <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
          Search Photos
        </label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for photos..."
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              border: '2px solid #1f1307',
              borderRadius: '6px',
              fontSize: '1rem',
              fontFamily: 'inherit'
            }}
          />
          <button
            type="submit"
            style={{
              width: '48px',
              height: '48px',
              border: '2px solid #1f1307',
              borderRadius: '6px',
              background: '#1f1307',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Search Unsplash"
            title="Search"
          >
            <Search size={18} color="white" />
          </button>
        </div>
      </form>

      <div 
        ref={containerRef}
        style={{
          maxHeight: '500px',
          overflowY: 'auto',
          border: '2px solid #e2d9c8',
          borderRadius: '8px',
          padding: '0.5rem'
        }}
      >
        {loading && images.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
            Loading images...
          </div>
        ) : images.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
            No images found. Try a different search term.
          </div>
        ) : (
          <>
            <div style={{ 
              columnCount: 3,
              columnGap: '0.5rem'
            }}>
              {images.map((image) => (
                <div key={image.id} style={{ breakInside: 'avoid', marginBottom: '0.5rem' }}>
                  <button
                    onClick={() => handleImageClick(image)}
                    style={{
                      padding: 0,
                      border: 'none',
                      borderRadius: 0,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: 'none',
                      width: '100%',
                      display: 'block'
                    }}
                  >
                    <img 
                      src={image.urls.small}
                      alt={image.alt_description || 'Unsplash photo'}
                      style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                  </button>
                </div>
              ))}
            </div>

            {hasMore && (
              <button
                onClick={loadMore}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  marginTop: '1rem',
                  border: '2px solid #1f1307',
                  borderRadius: '6px',
                  background: '#1f1307',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  fontWeight: 700,
                  opacity: loading ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            )}
          </>
        )}
      </div>

      <div style={{ 
        marginTop: '0.75rem',
        fontSize: '0.75rem',
        color: '#666',
        lineHeight: 1.5
      }}>
        Photos from{' '}
        <a 
          href="https://unsplash.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#d97706', textDecoration: 'none' }}
        >
          Unsplash
        </a>
      </div>
    </div>
  )
}

export default UnsplashBackground
