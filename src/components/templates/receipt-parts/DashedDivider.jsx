import React from 'react'

const DashedDivider = ({ 
  marginTop = '0.9rem', 
  marginBottom = '0.9rem',
  className = '' 
}) => {
  return (
    <div 
      className={`rrg-divider ${className}`}
      style={{ 
        marginTop, 
        marginBottom 
      }} 
    />
  )
}

export default DashedDivider
