import React, { useRef, useEffect } from 'react'
import { ZoomIn, ZoomOut } from 'lucide-react'
import ReceiptWrapper from '../ReceiptWrapper'

const PreviewCanvas = ({ 
  background,
  aspectRatio,
  zoom,
  onZoomChange,
  receiptConfig,
  books,
  username,
  receiptRef,
  previewRef,
  receiptScale
}) => {
  const aspectRatios = [
    { label: 'Square (1:1)', value: '1:1', ratio: 1 },
    { label: 'Instagram Portrait (4:5)', value: '4:5', ratio: 4/5 },
    { label: 'Instagram Story (9:16)', value: '9:16', ratio: 9/16 },
    { label: 'Landscape (16:9)', value: '16:9', ratio: 16/9 }
  ]

  const getCanvasStyle = () => {
    const selectedAspect = aspectRatios.find(ar => ar.value === aspectRatio.value)
    return {
      position: 'relative',
      width: '1080px',
      maxWidth: '100%',
      aspectRatio: selectedAspect?.ratio || 1,
      border: 'none',
      borderRadius: '0',
      overflow: 'hidden',
      background: background.type === 'none' ? '#f8f4ec' : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }

  const getBackgroundStyle = () => {
    if (background.type === 'solid') {
      return { background: background.value }
    }
    if (background.type === 'gradient') {
      return { background: background.value }
    }
    if (background.type === 'upload') {
      if (background.fileType === 'video') {
        return {}
      }
      return {
        backgroundImage: `url(${background.value})`,
        backgroundSize: zoom > 1 ? `${zoom * 100}%` : 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    }
    if (background.type === 'gif') {
      return {
        backgroundImage: `url(${background.value})`,
        backgroundSize: zoom > 1 ? `${zoom * 100}%` : 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    }
    if (background.type === 'unsplash') {
      return {
        backgroundImage: `url(${background.value})`,
        backgroundSize: zoom > 1 ? `${zoom * 100}%` : 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    }
    return {}
  }

  const handleZoomIn = () => {
    onZoomChange(Math.min(zoom + 0.1, 3))
  }

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoom - 0.1, 0.5))
  }

  const showZoomControls = ['gif', 'upload', 'unsplash'].includes(background.type)

  return (
    <div>
      {showZoomControls && (
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
      )}

      <div
        ref={previewRef}
        style={getCanvasStyle()}
      >
        {background.type !== 'none' && (
          <>
            {background.type === 'upload' && background.fileType === 'video' ? (
              <video
                src={background.value}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  ...getBackgroundStyle()
                }}
              />
            )}
          </>
        )}
        
        <div
          ref={receiptRef}
          style={{
            position: 'relative',
            zIndex: 1,
            transform: `scale(${receiptScale})`,
            transformOrigin: 'center',
            maxWidth: '90%'
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
    </div>
  )
}

export default PreviewCanvas
