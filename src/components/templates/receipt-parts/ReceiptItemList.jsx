import React from 'react'

const ReceiptItemList = ({ 
  displayBooks, 
  renderStars, 
  formatPrice,
  columnHeaders = { left: '★', middle: 'ITEM', right: 'PAGES' }
}) => {
  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '45px minmax(0, 1fr) 35px',
          columnGap: '0.35rem',
          fontWeight: 600,
          marginBottom: '0.6rem',
        }}
      >
        <span style={{ textAlign: 'left' }}>{columnHeaders.left}</span>
        <span style={{ textAlign: 'left' }}>{columnHeaders.middle}</span>
        <span style={{ textAlign: 'right' }}>{columnHeaders.right}</span>
      </div>

      {displayBooks
        .filter(book => !book.hidden)
        .map((book, index) => (
          <div key={index} className="rrg-item-row">
            <div className="rrg-item-rating">{renderStars(book.rating)}</div>
            <div className="rrg-item-title">
              {book.title}
              {book.author && (
                <span className="rrg-item-author"> - {book.author}</span>
              )}
            </div>
            <div className="rrg-item-price">{formatPrice(book.pages)}</div>
          </div>
        ))}
    </>
  )
}

export default ReceiptItemList
