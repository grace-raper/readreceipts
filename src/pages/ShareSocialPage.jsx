import React, { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Search, ZoomIn, ZoomOut, Download } from 'lucide-react'
import html2canvas from 'html2canvas'
import ReceiptWrapper from '../components/ReceiptWrapper'
import '../ReadingReceiptGenerator.css'
import { trackEvent } from '../components/PostHogProvider'

const ShareSocialPage = ({ onNavigate, receiptConfig, books, username }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [gifs, setGifs] = useState([])
  const [selectedGif, setSelectedGif] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 50, y: 50 })
  const canvasRef = useRef(null)
  const previewRef = useRef(null)
  const receiptRef = useRef(null)

  const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY || ''

  const searchGiphy = async (query) => {
    if (!query.trim()) return
    
    setIsSearching(true)
    trackEvent('giphy_search_initiated', {
      query: query
    })

    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=20&rating=g`
      )
      const data = await response.json()
      setGifs(data.data || [])
      
      trackEvent('giphy_search_completed', {
        query: query,
        results_count: data.data?.length || 0
      })
    } catch (error) {
      console.error('Error searching Giphy:', error)
      trackEvent('giphy_search_failed', {
        query: query,
        error: error.message
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleGifSelect = (gif) => {
    setSelectedGif(gif)
    setZoom(1)
    setBackgroundPosition({ x: 50, y: 50 })
    
    trackEvent('gif_selected', {
      gif_id: gif.id,
      gif_title: gif.title
    })
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5))
  }

  const handleDownload = async () => {
    if (!previewRef.current) return

    trackEvent('social_share_download_initiated', {
      has_gif: !!selectedGif,
      zoom_level: zoom
    })

    try {
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true
      })

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = `read-receipt-social-${Date.now()}.png`
        link.href = url
        link.click()
        URL.revokeObjectURL(url)

        trackEvent('social_share_download_completed', {
          has_gif: !!selectedGif,
          zoom_level: zoom
        })
      })
    } catch (error) {
      console.error('Error generating download:', error)
      trackEvent('social_share_download_failed', {
        error: error.message
      })
    }
  }

  return (
    <div className="rrg-page">
      <div className="rrg-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          
          {/* Left Panel - GIF Search & Selection */}
          <div style={{ flex: '1 1 400px', minWidth: '300px' }}>
            <div className="rrg-card">
              <button 
                className="rrg-button secondary" 
                onClick={() => onNavigate?.('receipt')}
                style={{ marginBottom: '1rem', width: 'auto' }}
              >
                <ArrowLeft size={16} />
                Back to Receipt
              </button>

              <h2>Add GIF Background</h2>
              <p style={{ margin: '0 0 1rem', lineHeight: 1.6, fontSize: '0.95rem' }}>
                Search for a GIF to use as your background. Your receipt will be centered on top.
              </p>

              {/* Search Bar */}
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchGiphy(searchQuery)}
                  placeholder="Search Giphy..."
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem 0.75rem 1rem',
                    border: '2px solid #1f1307',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
                <button
                  onClick={() => searchGiphy(searchQuery)}
                  disabled={isSearching}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: isSearching ? 'not-allowed' : 'pointer',
                    padding: '0.5rem'
                  }}
                >
                  <Search size={20} color="#1f1307" />
                </button>
              </div>

              {/* GIF Grid */}
              {isSearching && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  Searching...
                </div>
              )}

              {!isSearching && gifs.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: '0.5rem',
                  maxHeight: '500px',
                  overflowY: 'auto',
                  padding: '0.5rem',
                  border: '1px solid #e2d9c8',
                  borderRadius: '6px'
                }}>
                  {gifs.map((gif) => (
                    <div
                      key={gif.id}
                      onClick={() => handleGifSelect(gif)}
                      style={{
                        cursor: 'pointer',
                        border: selectedGif?.id === gif.id ? '3px solid #d97706' : '2px solid transparent',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        aspectRatio: '1',
                        position: 'relative'
                      }}
                    >
                      <img
                        src={gif.images.fixed_height_small.url}
                        alt={gif.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {!isSearching && gifs.length === 0 && searchQuery && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  No results found. Try a different search term.
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Preview & Controls */}
          <div style={{ flex: '1 1 500px', minWidth: '300px' }}>
            <div className="rrg-card">
              <h2>Preview</h2>
              
              {selectedGif && (
                <>
                  {/* Zoom Controls */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    background: '#f8f4ec',
                    borderRadius: '6px'
                  }}>
                    <button
                      onClick={handleZoomOut}
                      className="rrg-button secondary"
                      style={{ padding: '0.5rem', width: 'auto' }}
                    >
                      <ZoomOut size={18} />
                    </button>
                    <div style={{ flex: 1, textAlign: 'center', fontWeight: 600 }}>
                      Zoom: {Math.round(zoom * 100)}%
                    </div>
                    <button
                      onClick={handleZoomIn}
                      className="rrg-button secondary"
                      style={{ padding: '0.5rem', width: 'auto' }}
                    >
                      <ZoomIn size={18} />
                    </button>
                  </div>
                </>
              )}

              {/* Preview Canvas */}
              <div
                ref={previewRef}
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1',
                  border: '2px solid #1f1307',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: selectedGif ? 'transparent' : '#f8f4ec',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {selectedGif && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundImage: `url(${selectedGif.images.original.url})`,
                      backgroundSize: `${zoom * 100}%`,
                      backgroundPosition: `${backgroundPosition.x}% ${backgroundPosition.y}%`,
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                )}
                
                {/* Receipt */}
                <div
                  ref={receiptRef}
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    transform: 'scale(0.90)',
                    transformOrigin: 'center',
                    maxWidth: '80%'
                  }}
                >
                  {receiptConfig ? (
                    <ReceiptWrapper
                      books={receiptConfig.displayBooks || books}
                      username={receiptConfig.username || username}
                      period={receiptConfig.period}
                      template={receiptConfig.template}
                      readingGoal={receiptConfig.readingGoal}
                      showStats={receiptConfig.showStats}
                      pagesPerHour={receiptConfig.pagesPerHour}
                      numBooksToShow={receiptConfig.numBooksToShow}
                      selectedYear={receiptConfig.selectedYear}
                      selectedMonth={receiptConfig.selectedMonth}
                      selectedSeason={receiptConfig.selectedSeason}
                      customSeasonName={receiptConfig.customSeasonName}
                      customSeasonStart={receiptConfig.customSeasonStart}
                      customSeasonEnd={receiptConfig.customSeasonEnd}
                      receiptDate={receiptConfig.receiptDate}
                    />
                  ) : (
                    <div
                      style={{
                        background: 'white',
                        padding: '2rem 1.5rem',
                        borderRadius: '4px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ 
                        fontFamily: 'monospace', 
                        fontSize: '1.2rem', 
                        fontWeight: 'bold',
                        marginBottom: '0.5rem'
                      }}>
                        READ RECEIPTS
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        Create a receipt first
                      </div>
                      <div style={{ 
                        marginTop: '1rem', 
                        fontSize: '0.75rem', 
                        color: '#999',
                        fontFamily: 'monospace'
                      }}>
                        readreceipts.xyz
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Download Button */}
              {selectedGif && (
                <button
                  onClick={handleDownload}
                  className="rrg-button"
                  style={{ marginTop: '1rem', width: '100%' }}
                >
                  <Download size={18} />
                  Download as PNG
                </button>
              )}

              {!selectedGif && (
                <div style={{ 
                  marginTop: '1rem', 
                  textAlign: 'center', 
                  color: '#666',
                  fontSize: '0.95rem'
                }}>
                  Select a GIF from the search results to get started
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShareSocialPage
