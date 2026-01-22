import React from 'react'
import { Palette, Upload, Image } from 'lucide-react'

const BackgroundSelector = ({ selectedType, onSelectType }) => {
  const backgroundTypes = [
    {
      id: 'solid',
      label: 'Solid/Gradient',
      icon: Palette,
      description: 'Choose colors or gradients'
    },
    {
      id: 'upload',
      label: 'Upload',
      icon: Upload,
      description: 'Upload your own image/video'
    },
    {
      id: 'giphy',
      label: 'Giphy',
      icon: null,
      logo: '/giphy-300.png',
      description: 'Search animated GIFs'
    },
    {
      id: 'unsplash',
      label: 'Unsplash',
      icon: Image,
      description: 'Browse free photos'
    }
  ]

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, fontSize: '1rem' }}>
        Background Type
      </label>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '0.75rem'
      }}>
        {backgroundTypes.map((type) => {
          const Icon = type.icon
          const isSelected = selectedType === type.id
          
          return (
            <button
              key={type.id}
              onClick={() => onSelectType(type.id)}
              style={{
                padding: '1rem 0.75rem',
                border: `2px solid ${isSelected ? '#d97706' : '#1f1307'}`,
                borderRadius: '8px',
                background: isSelected ? '#fef3c7' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                textAlign: 'center',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = '#f8f4ec'
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'white'
                }
              }}
            >
              {type.logo ? (
                <img 
                  src={type.logo} 
                  alt={type.label}
                  style={{ height: '24px', objectFit: 'contain' }}
                />
              ) : Icon ? (
                <Icon size={24} strokeWidth={2} />
              ) : null}
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                  {type.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#666', lineHeight: 1.3 }}>
                  {type.description}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default BackgroundSelector
