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
      {selectedImage && (
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
              src={selectedImage.thumb}
              alt="Selected"
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
                Selected Photo
              </div>
              <div style={{ fontSize: '0.75rem', color: '#666' }}>
                by{' '}
                <a 
                  href={selectedImage.photographerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#d97706', textDecoration: 'none' }}
                >
                  {selectedImage.photographer}
                </a>
                {' '}on{' '}
                <a
                  href={selectedImage.unsplashUrl || addUtm('https://unsplash.com/')}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#d97706', textDecoration: 'none' }}
                >
                  Unsplash
                </a>
              </div>
            </div>
            <button
              onClick={() => onImageSelect(null)}
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
              padding: '0.75rem 1.5rem',
              border: '2px solid #1f1307',
              borderRadius: '6px',
              background: '#fef3c7',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Search size={18} />
            Search
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
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '0.5rem'
            }}>
              {images.map((image) => (
                <button
                  key={image.id}
                  onClick={() => handleImageClick(image)}
                  style={{
                    padding: 0,
                    border: '2px solid #1f1307',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: 'none',
                    aspectRatio: '4/3',
                    position: 'relative'
                  }}
                >
                  <img 
                    src={image.urls.small}
                    alt={image.alt_description || 'Unsplash photo'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '0.25rem 0.5rem',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    fontSize: '0.65rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {image.user.name}
                  </div>
                </button>
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
                  background: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  fontWeight: 600,
                  opacity: loading ? 0.6 : 1
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
