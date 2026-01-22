import React, { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'

const UploadBackground = ({ onBackgroundChange }) => {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [fileType, setFileType] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const type = file.type.startsWith('image/') ? 'image' : 
                 file.type.startsWith('video/') ? 'video' : null

    if (!type) {
      alert('Please upload an image or video file')
      return
    }

    setUploadedFile(file)
    setFileType(type)

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    
    onBackgroundChange({ 
      type: 'upload', 
      value: url,
      fileType: type,
      file: file
    })
  }

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setUploadedFile(null)
    setPreviewUrl(null)
    setFileType(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onBackgroundChange({ type: 'none', value: null })
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {!uploadedFile ? (
        <button
          onClick={handleClick}
          style={{
            width: '100%',
            padding: '3rem 2rem',
            border: '2px dashed #1f1307',
            borderRadius: '8px',
            background: 'white',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            transition: 'all 0.2s',
            fontFamily: 'inherit'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f8f4ec'
            e.currentTarget.style.borderColor = '#d97706'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white'
            e.currentTarget.style.borderColor = '#1f1307'
          }}
        >
          <Upload size={48} strokeWidth={1.5} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.5rem' }}>
              Upload Image or Video
            </div>
            <div style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.5 }}>
              Click to browse or drag and drop<br />
              Supports: JPG, PNG, GIF, MP4, MOV, WebM
            </div>
          </div>
        </button>
      ) : (
        <div style={{ 
          border: '2px solid #1f1307',
          borderRadius: '8px',
          overflow: 'hidden',
          background: 'white'
        }}>
          <div style={{ 
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            background: '#f8f4ec',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {fileType === 'image' && (
              <img 
                src={previewUrl} 
                alt="Uploaded background"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            )}
            {fileType === 'video' && (
              <video 
                src={previewUrl}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            )}
          </div>
          
          <div style={{ 
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #e2d9c8'
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                fontWeight: 600, 
                fontSize: '0.9rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {uploadedFile.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                {fileType === 'image' ? 'Image' : 'Video'} • {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
            
            <button
              onClick={handleRemove}
              style={{
                padding: '0.5rem',
                border: '2px solid #dc2626',
                borderRadius: '6px',
                background: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#dc2626',
                fontFamily: 'inherit',
                fontWeight: 600,
                fontSize: '0.85rem',
                marginLeft: '1rem'
              }}
            >
              <X size={16} />
              Remove
            </button>
          </div>

          <div style={{ 
            padding: '0.75rem 1rem',
            background: '#f8f4ec',
            borderTop: '1px solid #e2d9c8'
          }}>
            <button
              onClick={handleClick}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '2px solid #1f1307',
                borderRadius: '6px',
                background: 'white',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              Choose Different File
            </button>
          </div>
        </div>
      )}

      <div style={{ 
        marginTop: '1rem',
        padding: '0.75rem',
        background: '#fef3c7',
        borderRadius: '6px',
        fontSize: '0.8rem',
        lineHeight: 1.5,
        color: '#92400e'
      }}>
        <strong>Note:</strong> For videos, only the first frame will be used for PNG export. MP4 export is only available with GIF backgrounds.
      </div>
    </div>
  )
}

export default UploadBackground
