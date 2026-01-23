import React from 'react'
import { Palette, Upload, Image } from 'lucide-react'

const BackgroundSelector = ({ selectedType, onSelectType }) => {
  const backgroundTypes = [
    {
      id: 'solid',
      label: 'Color',
      icon: Palette,
      description: 'Choose colors or gradients'
    },
    {
      id: 'upload',
      label: 'Upload',
      icon: Upload,
      description: 'Upload your own image/video'
    },
    // {
    //   id: 'giphy',
    //   label: 'GIPHY',
    //   icon: null,
    //   logo: '/GIPHY-IconBlack-36x36.png',
    //   logoSelected: '/GIPHY-IconWhite-36x36.png',
    //   description: 'Search animated GIFs'
    // },
    {
      id: 'unsplash',
      label: 'Unsplash',
      icon: null,
      logo: '/Unsplash_Symbol.svg',
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
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '0.75rem',
        minWidth: 0
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
                border: `2px solid ${isSelected ? '#1f1307' : '#1f1307'}`,
                borderRadius: '8px',
                background: isSelected ? '#1f1307' : 'white',
                color: isSelected ? 'white' : '#1f1307',
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
                  src={isSelected && type.logoSelected ? type.logoSelected : type.logo} 
                  alt={type.label}
                  style={{ 
                    height: '22px', 
                    objectFit: 'contain',
                    filter: isSelected && !type.logoSelected ? 'invert(1)' : 'none'
                  }}
                />
              ) : Icon ? (
                <Icon size={24} strokeWidth={2} color={isSelected ? 'white' : '#1f1307'} />
              ) : null}
              <div style={{
                fontWeight: 600,
                fontSize: '0.95rem'
              }}>
                {type.label}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default BackgroundSelector
