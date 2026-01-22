import React, { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Download } from 'lucide-react'
import html2canvas from 'html2canvas'
import { Output, Mp4OutputFormat, BufferTarget, CanvasSource } from 'mediabunny'
import { parseGIF, decompressFrames } from 'gifuct-js'
import BackgroundSelector from '../components/social-share/BackgroundSelector'
import SolidGradientBackground from '../components/social-share/SolidGradientBackground'
import UploadBackground from '../components/social-share/UploadBackground'
import GiphyBackground from '../components/social-share/GiphyBackground'
import UnsplashBackground from '../components/social-share/UnsplashBackground'
import PreviewCanvas from '../components/social-share/PreviewCanvas'
import '../ReadingReceiptGenerator.css'
import { trackEvent } from '../components/PostHogProvider'

const ShareSocialPage = ({ onNavigate, receiptConfig, books, username }) => {
  const [backgroundType, setBackgroundType] = useState('solid')
  const [background, setBackground] = useState({ type: 'solid', value: '#fbbf93' })
  const [selectedGif, setSelectedGif] = useState(null)
  const [selectedUnsplashImage, setSelectedUnsplashImage] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [aspectRatio, setAspectRatio] = useState({ label: 'Square (1:1)', value: '1:1', ratio: 1 })
  const [receiptScale, setReceiptScale] = useState(0.9)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const previewRef = useRef(null)
  const receiptRef = useRef(null)


  const aspectRatios = [
    { label: 'Square (1:1)', value: '1:1', ratio: 1 },
    { label: 'Instagram Portrait (4:5)', value: '4:5', ratio: 4/5 },
    { label: 'Instagram Story (9:16)', value: '9:16', ratio: 9/16 },
    { label: 'Landscape (16:9)', value: '16:9', ratio: 16/9 }
  ]

  const handleBackgroundTypeChange = (type) => {
    setBackgroundType(type)
    trackEvent('social_share_background_type_selected', {
      background_type: type
    })
    if (type === 'solid') {
      setBackground({ type: 'solid', value: '#fbbf93' })
    } else if (type !== 'giphy' && type !== 'unsplash') {
      setBackground({ type: 'none', value: null })
    }
  }

  const handleBackgroundChange = (bgData) => {
    setBackground(bgData)
    if (bgData.type === 'solid') {
      trackEvent('social_share_color_selected', {
        color: bgData.value
      })
    } else if (bgData.type === 'gradient') {
      trackEvent('social_share_gradient_selected', {
        gradient: bgData.value
      })
    } else if (bgData.type === 'upload') {
      trackEvent('social_share_file_uploaded', {
        file_type: bgData.fileType,
        file_size_mb: bgData.file ? (bgData.file.size / 1024 / 1024).toFixed(2) : 0
      })
    }
  }

  const handleGifSelect = (gif) => {
    setSelectedGif(gif)
    if (gif) {
      setBackground({ type: 'gif', value: gif.images.original.url, gifData: gif })
      setZoom(1)
      trackEvent('gif_selected', {
        gif_id: gif.id,
        gif_title: gif.title
      })
    } else {
      setBackground({ type: 'none', value: null })
    }
  }

  const handleUnsplashSelect = (image) => {
    setSelectedUnsplashImage(image)
    if (image) {
      setBackground({ type: 'unsplash', value: image.url, imageData: image })
      setZoom(1)
      trackEvent('unsplash_image_selected', {
        photographer: image.photographer
      })
    } else {
      setBackground({ type: 'none', value: null })
    }
  }

  useEffect(() => {
    if (receiptRef.current) {
      const receiptHeight = receiptRef.current.offsetHeight
      const canvasHeight = previewRef.current?.offsetHeight || 500
      const targetHeight = canvasHeight * 0.9
      const scale = targetHeight / receiptHeight
      setReceiptScale(Math.min(scale, 1))
    }
  }, [receiptConfig, aspectRatio])

  const handleDownload = async () => {
    if (!previewRef.current) return

    const isVideo = (background.type === 'gif' && selectedGif) || 
                    (background.type === 'upload' && background.fileType === 'video')

    trackEvent('social_share_download_initiated', {
      background_type: background.type,
      zoom_level: zoom,
      aspect_ratio: aspectRatio.value,
      export_format: isVideo ? 'mp4' : 'png'
    })

    try {
      if (background.type === 'gif' && selectedGif) {
        await exportAsMP4()
      } else if (background.type === 'upload' && background.fileType === 'video') {
        await exportAsVideoMP4()
      } else {
        await exportAsPNG()
      }
    } catch (error) {
      console.error('Error generating download:', error)
      trackEvent('social_share_download_failed', {
        error: error.message
      })
    }
  }

  const exportAsPNG = async () => {
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
        background_type: background.type,
        zoom_level: zoom,
        aspect_ratio: aspectRatio.value,
        format: 'png',
        background_value: background.type === 'solid' ? background.value : 
                         background.type === 'gradient' ? 'gradient' : 
                         background.type === 'unsplash' ? background.imageData?.photographer : 
                         'other'
      })
    })
  }

  const exportAsMP4 = async () => {
    console.log('=== MP4 Export Started ===')
    setIsExporting(true)
    setExportProgress(0)

    try {
    const width = previewRef.current.offsetWidth
    const height = previewRef.current.offsetHeight
    const previewRect = previewRef.current.getBoundingClientRect()
    const receiptRect = receiptRef.current?.getBoundingClientRect()
    const receiptWidthRatio = receiptRect && previewRect ? receiptRect.width / previewRect.width : 0.6
    const receiptHeightRatio = receiptRect && previewRect ? receiptRect.height / previewRect.height : 0.6
    const selectedAspect = aspectRatio
    const baseExport = 1200
    // Scale export so the longer side is ~1200px while respecting aspect ratio
    const exportWidth = (selectedAspect?.ratio || 1) >= 1
      ? baseExport
      : Math.round(baseExport * (selectedAspect?.ratio || 1))
    const exportHeight = (selectedAspect?.ratio || 1) >= 1
      ? Math.round(baseExport / (selectedAspect?.ratio || 1))
      : baseExport
    console.log(`Canvas dimensions: ${width}x${height} -> Export dimensions: ${exportWidth}x${exportHeight}`)

    setExportProgress(5)

    // Fetch GIF and parse frames
    console.log('Fetching GIF from:', selectedGif.images.original.url)
    const gifResponse = await fetch(selectedGif.images.original.url)
    const gifArrayBuffer = await gifResponse.arrayBuffer()
    console.log(`GIF downloaded: ${gifArrayBuffer.byteLength} bytes`)
    
    const gifData = parseGIF(gifArrayBuffer)
    const frames = decompressFrames(gifData, true)

    console.log(`GIF has ${frames.length} frames`)
    console.log('First frame dimensions:', frames[0]?.dims)

    // GIF delays from gifuct-js are in milliseconds. Some GIFs have 0 delay; default to 10ms.
    const rawDelaysMs = frames.map(f => f.delay)
    const normalizedDelaysMs = frames.map(f => Math.max(f.delay, 10)) // minimum 10ms
    const minDelayMs = Math.min(...normalizedDelaysMs)
    const maxDelayMs = Math.max(...normalizedDelaysMs)
    const zeroDelayCount = rawDelaysMs.filter(d => d === 0).length
    const totalDurationMs = normalizedDelaysMs.reduce((sum, d) => sum + d, 0) // milliseconds
    const durationSeconds = totalDurationMs / 1000 // convert ms to seconds
    const avgDelayMs = totalDurationMs / frames.length
    const averageFrameDuration = durationSeconds / frames.length // seconds
    const avgFps = +(1 / averageFrameDuration).toFixed(2)
    console.log(`GIF duration (normalized): ${durationSeconds.toFixed(3)}s, target FPS: ${avgFps}, frames: ${frames.length}`)
    console.log(`Delay stats (ms): min=${minDelayMs}, max=${maxDelayMs}, zeroDelays=${zeroDelayCount}, avgMs=${avgDelayMs.toFixed(2)}`)

    setExportProgress(15)

    // Capture receipt as canvas
    console.log('Capturing receipt with html2canvas...')
    // Capture receipt at higher scale for sharper export
    // const receiptScaleForExport = Math.min(3, Math.max(2, exportWidth / (receiptRef.current?.offsetWidth || width)))
    const receiptCanvas = await html2canvas(receiptRef.current, {
      backgroundColor: null,
    //   scale: receiptScaleForExport,
      useCORS: true,
      allowTaint: true
    })
    console.log(`Receipt canvas: ${receiptCanvas.width}x${receiptCanvas.height}`)

    setExportProgress(25)

    // Prepare main canvas
    console.log('Creating main canvas for compositing...')
    const canvas = document.createElement('canvas')
    canvas.width = exportWidth
    canvas.height = exportHeight
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    console.log(`Main canvas created: ${canvas.width}x${canvas.height}`)

    // Temporary canvas for GIF frames with proper disposal handling
    const gifCanvas = document.createElement('canvas')
    const gifCtx = gifCanvas.getContext('2d')
    gifCanvas.width = frames[0].dims.width
    gifCanvas.height = frames[0].dims.height
    console.log(`GIF canvas: ${gifCanvas.width}x${gifCanvas.height}`)

    // Higher-res render canvas for GIF (upsample to reduce pixelation)
    const gifUpscale = 2
    const renderGifCanvas = document.createElement('canvas')
    const renderGifCtx = renderGifCanvas.getContext('2d')
    renderGifCanvas.width = gifCanvas.width * gifUpscale
    renderGifCanvas.height = gifCanvas.height * gifUpscale
    renderGifCtx.imageSmoothingEnabled = true
    renderGifCtx.imageSmoothingQuality = 'high'

    // Previous frame canvas for disposal method 3 (restore to previous)
    const prevCanvas = document.createElement('canvas')
    const prevCtx = prevCanvas.getContext('2d')
    prevCanvas.width = gifCanvas.width
    prevCanvas.height = gifCanvas.height

    setExportProgress(35)

    // Record directly to MP4 using CanvasSource
    console.log('Initializing MP4 output with CanvasSource...')
    const mp4Output = new Output({
      format: new Mp4OutputFormat({ fastStart: 'in-memory' }),
      target: new BufferTarget()
    })

    // Create CanvasSource for encoding frames
    const videoSource = new CanvasSource(canvas, {
      codec: 'avc',
      bitrate: 2_000_000
    })
    console.log('CanvasSource created with H.264 (avc) codec, 2Mbps bitrate')
    mp4Output.addVideoTrack(videoSource)

    console.log('Starting MP4 output...')
    await mp4Output.start()
    setExportProgress(40)
    
    console.log(`Processing and encoding ${frames.length} frames...`)
    // Clear GIF canvas once to avoid leftover pixels from uninitialized areas
    gifCtx.clearRect(0, 0, gifCanvas.width, gifCanvas.height)
    gifCtx.fillStyle = '#ffffff'
    gifCtx.fillRect(0, 0, gifCanvas.width, gifCanvas.height)
    gifCtx.imageSmoothingEnabled = true
    gifCtx.imageSmoothingQuality = 'high'
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    let previousImageData = gifCtx.getImageData(0, 0, gifCanvas.width, gifCanvas.height)
    let currentTimestamp = 0
    
    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i]
      const dims = frame.dims
      
      if (i % 10 === 0) {
        console.log(`Processing frame ${i + 1}/${frames.length}, timestamp: ${currentTimestamp.toFixed(2)}s, delay: ${frame.delay}ms, disposal: ${frame.disposalType}`)
      }

      // Handle disposal method from previous frame
      if (i > 0) {
        const prevFrame = frames[i - 1]
        const prevDims = prevFrame.dims
        // 2 = restore to background (clear the previous frame area)
        // 3 = restore to previous (revert to saved buffer)
        if (prevFrame.disposalType === 2) {
          gifCtx.fillStyle = '#ffffff'
          gifCtx.fillRect(prevDims.left, prevDims.top, prevDims.width, prevDims.height)
        } else if (prevFrame.disposalType === 3) {
          gifCtx.putImageData(previousImageData, 0, 0)
        }
        // 0 or 1 = no disposal (leave as is)
      }

      // Draw the new frame patch
      const imageData = new ImageData(
        new Uint8ClampedArray(frame.patch),
        dims.width,
        dims.height
      )
      gifCtx.putImageData(imageData, dims.left, dims.top)

      // Save current state if next frame needs disposal type 3
      previousImageData = gifCtx.getImageData(0, 0, gifCanvas.width, gifCanvas.height)

      // Composite to main canvas: GIF background + receipt
      // Upscale GIF frame into render canvas for better quality
      renderGifCtx.clearRect(0, 0, renderGifCanvas.width, renderGifCanvas.height)
      renderGifCtx.drawImage(gifCanvas, 0, 0, renderGifCanvas.width, renderGifCanvas.height)

      const scale = Math.max(exportWidth / renderGifCanvas.width, exportHeight / renderGifCanvas.height)
      const scaledWidth = renderGifCanvas.width * scale
      const scaledHeight = renderGifCanvas.height * scale
      const x = (exportWidth - scaledWidth) / 2
      const y = (exportHeight - scaledHeight) / 2

      // Ensure a solid background to avoid stray transparent/black pixels
      ctx.clearRect(0, 0, exportWidth, exportHeight)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, exportWidth, exportHeight)
      ctx.drawImage(renderGifCanvas, x, y, scaledWidth, scaledHeight)

      // Draw receipt on top with the same relative size as preview
      const targetReceiptWidth = exportWidth * receiptWidthRatio
      const targetReceiptHeight = exportHeight * receiptHeightRatio
      const receiptScale = Math.min(
        targetReceiptWidth / receiptCanvas.width,
        targetReceiptHeight / receiptCanvas.height
      )
      const receiptDrawWidth = receiptCanvas.width * receiptScale
      const receiptDrawHeight = receiptCanvas.height * receiptScale
      const receiptX = (exportWidth - receiptDrawWidth) / 2
      const receiptY = (exportHeight - receiptDrawHeight) / 2
      ctx.drawImage(receiptCanvas, receiptX, receiptY, receiptDrawWidth, receiptDrawHeight)

      if (i === 0) {
        console.log('First frame composite complete:', {
          gifScale: scale,
          gifPosition: { x, y },
          receiptPosition: { x: receiptX, y: receiptY }
        })
      }

      // Use the actual (normalized) GIF delay for this frame (convert ms to seconds)
      const frameDuration = Math.max(normalizedDelaysMs[i] / 1000, 0.02) // seconds

      // Allow paint to flush before encoding this frame
      await new Promise(res => requestAnimationFrame(res))
      await new Promise(res => requestAnimationFrame(res))

      // Encode and add this frame to the video
      await videoSource.add(currentTimestamp, frameDuration)
      
      // Update timestamp for next frame
      currentTimestamp += frameDuration

      setExportProgress(40 + ((i + 1) / frames.length) * 45)
    }

    console.log(`All ${frames.length} frames encoded, total video time: ${currentTimestamp.toFixed(3)}s. Finalizing MP4...`)
    await mp4Output.finalize()
    console.log('MP4 encoding complete')
    setExportProgress(90)

    // Download MP4
    const buffer = mp4Output.target.buffer
    const blob = new Blob([buffer], { type: 'video/mp4' })
    console.log(`MP4 blob created: ${blob.size} bytes`)
    
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `read-receipt-social-${Date.now()}.mp4`
    link.click()
    console.log('MP4 file downloaded to user downloads')
    URL.revokeObjectURL(url)

    setExportProgress(100)
    console.log('=== MP4 Export Complete ===')

    trackEvent('social_share_download_completed', {
      background_type: 'gif',
      zoom_level: zoom,
      aspect_ratio: aspectRatio.value,
      format: 'mp4',
      encoder: 'mediabunny',
      gif_frames: frames.length,
      gif_duration: durationSeconds,
      gif_fps: avgFps,
      gif_id: selectedGif?.id,
      gif_title: selectedGif?.title
    })
  } catch (error) {
    console.error('=== MP4 Export Failed ===')
    console.error('Error details:', error)
    console.error('Error stack:', error.stack)
    alert('MP4 export failed. Falling back to PNG.')
    await exportAsPNG()
  } finally {
    setIsExporting(false)
    setExportProgress(0)
  }
}

const exportAsVideoMP4 = async () => {
  console.log('=== Video MP4 Export Started ===')
  setIsExporting(true)
  setExportProgress(0)

  try {
    const width = previewRef.current.offsetWidth
    const height = previewRef.current.offsetHeight
    const previewRect = previewRef.current.getBoundingClientRect()
    const receiptRect = receiptRef.current?.getBoundingClientRect()
    const receiptWidthRatio = receiptRect && previewRect ? receiptRect.width / previewRect.width : 0.6
    const receiptHeightRatio = receiptRect && previewRect ? receiptRect.height / previewRect.height : 0.6
    const selectedAspect = aspectRatio
    const baseExport = 1200
    const exportWidth = (selectedAspect?.ratio || 1) >= 1
      ? baseExport
      : Math.round(baseExport * (selectedAspect?.ratio || 1))
    const exportHeight = (selectedAspect?.ratio || 1) >= 1
      ? Math.round(baseExport / (selectedAspect?.ratio || 1))
      : baseExport
    console.log(`Canvas dimensions: ${width}x${height} -> Export dimensions: ${exportWidth}x${exportHeight}`)

    setExportProgress(5)

    // Load the uploaded video
    console.log('Loading uploaded video:', background.value)
    const video = document.createElement('video')
    video.src = background.value
    video.crossOrigin = 'anonymous'
    video.muted = true
    
    await new Promise((resolve, reject) => {
      video.onloadedmetadata = resolve
      video.onerror = reject
    })
    
    const videoDuration = video.duration
    const videoFps = 30 // Target 30fps for uploaded videos
    const frameDuration = 1 / videoFps
    const totalFrames = Math.floor(videoDuration * videoFps)
    
    console.log(`Video loaded: ${videoDuration.toFixed(2)}s, ${totalFrames} frames at ${videoFps}fps`)
    setExportProgress(15)

    // Capture receipt as canvas
    console.log('Capturing receipt with html2canvas...')
    const receiptCanvas = await html2canvas(receiptRef.current, {
      backgroundColor: null,
      useCORS: true,
      allowTaint: true
    })
    console.log(`Receipt canvas: ${receiptCanvas.width}x${receiptCanvas.height}`)
    setExportProgress(25)

    // Prepare main canvas
    console.log('Creating main canvas for compositing...')
    const canvas = document.createElement('canvas')
    canvas.width = exportWidth
    canvas.height = exportHeight
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    console.log(`Main canvas created: ${canvas.width}x${canvas.height}`)
    setExportProgress(35)

    // Initialize MP4 output
    console.log('Initializing MP4 output with CanvasSource...')
    const mp4Output = new Output({
      format: new Mp4OutputFormat({ fastStart: 'in-memory' }),
      target: new BufferTarget()
    })

    const videoSource = new CanvasSource(canvas, {
      codec: 'avc',
      bitrate: 2_000_000
    })
    console.log('CanvasSource created with H.264 (avc) codec, 2Mbps bitrate')
    mp4Output.addVideoTrack(videoSource)

    console.log('Starting MP4 output...')
    await mp4Output.start()
    setExportProgress(40)

    console.log(`Processing and encoding ${totalFrames} frames...`)
    let currentTimestamp = 0

    for (let i = 0; i < totalFrames; i++) {
      const videoTime = i * frameDuration
      video.currentTime = videoTime
      
      await new Promise(resolve => {
        video.onseeked = resolve
      })

      if (i % 30 === 0) {
        console.log(`Processing frame ${i + 1}/${totalFrames}, timestamp: ${currentTimestamp.toFixed(2)}s`)
      }

      // Calculate video scaling to cover canvas
      const videoAspect = video.videoWidth / video.videoHeight
      const canvasAspect = exportWidth / exportHeight
      let drawWidth, drawHeight, drawX, drawY

      if (videoAspect > canvasAspect) {
        drawHeight = exportHeight
        drawWidth = exportHeight * videoAspect
        drawX = (exportWidth - drawWidth) / 2
        drawY = 0
      } else {
        drawWidth = exportWidth
        drawHeight = exportWidth / videoAspect
        drawX = 0
        drawY = (exportHeight - drawHeight) / 2
      }

      // Clear and draw video frame
      ctx.clearRect(0, 0, exportWidth, exportHeight)
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, exportWidth, exportHeight)
      ctx.drawImage(video, drawX, drawY, drawWidth, drawHeight)

      // Draw receipt on top
      const targetReceiptWidth = exportWidth * receiptWidthRatio
      const targetReceiptHeight = exportHeight * receiptHeightRatio
      const receiptScale = Math.min(
        targetReceiptWidth / receiptCanvas.width,
        targetReceiptHeight / receiptCanvas.height
      )
      const receiptDrawWidth = receiptCanvas.width * receiptScale
      const receiptDrawHeight = receiptCanvas.height * receiptScale
      const receiptX = (exportWidth - receiptDrawWidth) / 2
      const receiptY = (exportHeight - receiptDrawHeight) / 2
      ctx.drawImage(receiptCanvas, receiptX, receiptY, receiptDrawWidth, receiptDrawHeight)

      // Allow paint to flush
      await new Promise(res => requestAnimationFrame(res))
      await new Promise(res => requestAnimationFrame(res))

      // Encode frame
      await videoSource.add(currentTimestamp, frameDuration)
      currentTimestamp += frameDuration

      setExportProgress(40 + ((i + 1) / totalFrames) * 45)
    }

    console.log(`All ${totalFrames} frames encoded, total video time: ${currentTimestamp.toFixed(3)}s. Finalizing MP4...`)
    await mp4Output.finalize()
    console.log('MP4 encoding complete')
    setExportProgress(90)

    // Download MP4
    const buffer = mp4Output.target.buffer
    const blob = new Blob([buffer], { type: 'video/mp4' })
    console.log(`MP4 blob created: ${blob.size} bytes`)
    
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `read-receipt-social-${Date.now()}.mp4`
    link.click()
    console.log('MP4 file downloaded to user downloads')
    URL.revokeObjectURL(url)

    setExportProgress(100)
    console.log('=== Video MP4 Export Complete ===')

    trackEvent('social_share_download_completed', {
      background_type: 'upload_video',
      zoom_level: zoom,
      aspect_ratio: aspectRatio.value,
      format: 'mp4',
      encoder: 'mediabunny',
      video_duration: videoDuration,
      video_frames: totalFrames,
      video_fps: videoFps
    })
  } catch (error) {
    console.error('=== Video MP4 Export Failed ===')
    console.error('Error details:', error)
    console.error('Error stack:', error.stack)
    alert('Video MP4 export failed. Please try a different video file.')
    trackEvent('social_share_download_failed', {
      error: error.message,
      background_type: 'upload_video'
    })
  } finally {
    setIsExporting(false)
    setExportProgress(0)
  }
}


  return (
    <div className="rrg-page">
      <div className="rrg-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          
          {/* Left Panel - Background Options */}
          <div style={{ flex: '1 1 400px', minWidth: '300px' }}>
            {/* <button 
                className="rrg-button secondary" 
                onClick={() => onNavigate?.('receipt')}
                style={{ marginBottom: '1rem', width: 'auto' }}
              >
                <ArrowLeft size={16} />
                Back to Receipt
              </button> */}
            <div className="rrg-card">
              <h2>Customize Background</h2>
              <p style={{ margin: '0 0 1.5rem', lineHeight: 1.6, fontSize: '0.95rem' }}>
                Choose a background for your receipt. Your receipt will be centered on top.
              </p>

              <BackgroundSelector 
                selectedType={backgroundType}
                onSelectType={handleBackgroundTypeChange}
              />

              {backgroundType === 'solid' && (
                <SolidGradientBackground onBackgroundChange={handleBackgroundChange} />
              )}

              {backgroundType === 'upload' && (
                <UploadBackground onBackgroundChange={handleBackgroundChange} />
              )}

              {backgroundType === 'giphy' && (
                <GiphyBackground 
                  onGifSelect={handleGifSelect}
                  selectedGif={selectedGif}
                />
              )}

              {backgroundType === 'unsplash' && (
                <UnsplashBackground 
                  onImageSelect={handleUnsplashSelect}
                  selectedImage={selectedUnsplashImage}
                />
              )}
            </div>
          </div>

          {/* Right Panel - Preview & Controls */}
          <div style={{ flex: '1 1 500px', minWidth: '300px' }}>
            <div className="rrg-card">
              <h2>Preview</h2>
              
              {/* Aspect Ratio Selector */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Aspect Ratio
                </label>
                <select
                  value={aspectRatio.value}
                  onChange={(e) => {
                    const selected = aspectRatios.find(ar => ar.value === e.target.value)
                    setAspectRatio(selected)
                    trackEvent('social_share_aspect_ratio_changed', {
                      aspect_ratio: selected.value
                    })
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #1f1307',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    background: 'white'
                  }}
                >
                  {aspectRatios.map((ar) => (
                    <option key={ar.value} value={ar.value}>
                      {ar.label}
                    </option>
                  ))}
                </select>
              </div>

              <PreviewCanvas
                background={background}
                aspectRatio={aspectRatio}
                zoom={zoom}
                onZoomChange={setZoom}
                receiptConfig={receiptConfig}
                books={books}
                username={username}
                receiptRef={receiptRef}
                previewRef={previewRef}
                receiptScale={receiptScale}
              />

              {background.type === 'unsplash' && background.imageData?.photographer && (
                <div style={{ 
                  marginTop: '0.75rem', 
                  fontSize: '0.9rem', 
                  color: '#333', 
                  lineHeight: 1.6
                }}>
                  Photo by{' '}
                  <a
                    href={background.imageData.photographerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}
                  >
                    {background.imageData.photographer}
                  </a>
                  {' '}on{' '}
                  <a
                    href={background.imageData.unsplashUrl || 'https://unsplash.com/?utm_source=readreceipts&utm_medium=referral'}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}
                  >
                    Unsplash
                  </a>
                </div>
              )}

              {/* Download Button */}
              {isExporting && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ marginBottom: '0.5rem', fontWeight: 600, textAlign: 'center' }}>
                    Exporting MP4... {Math.round(exportProgress)}%
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#e2d9c8', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${exportProgress}%`, 
                        height: '100%', 
                        background: '#d97706', 
                        transition: 'width 0.3s ease' 
                      }}
                    />
                  </div>
                </div>
              )}
              
              {!isExporting && background.type !== 'none' && (
                <button
                  onClick={handleDownload}
                  className="rrg-button"
                  style={{ marginTop: '1rem', width: '100%' }}
                >
                  <Download size={18} />
                  Download
                </button>
              )}

              {background.type === 'none' && (
                <div style={{ 
                  marginTop: '1rem', 
                  textAlign: 'center', 
                  color: '#666',
                  fontSize: '0.95rem'
                }}>
                  Choose a background option to get started
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
