import React from 'react'

const ReceiptSection = ({ 
  children, 
  dashed = false, 
  paddingTop = '0.9rem', 
  paddingBottom = '0.9rem',
  className = ''
}) => {
  const classes = dashed ? `rrg-dashed ${className}` : className
  
  return (
    <div className={classes} style={{ paddingTop, paddingBottom }}>
      {children}
    </div>
  )
}

export default ReceiptSection
