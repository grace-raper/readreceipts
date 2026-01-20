import React from 'react'

const ReceiptSectionHeader = ({ 
  title, 
  align = 'center', 
  fontSize = '15px',
  marginBottom = '0.5rem'
}) => {
  return (
    <div style={{ 
      textAlign: align, 
      fontWeight: 600, 
      marginBottom, 
      fontSize 
    }}>
      {title}
    </div>
  )
}

export default ReceiptSectionHeader
