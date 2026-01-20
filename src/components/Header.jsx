import React from 'react'

const Header = ({ currentPage, onNavigate }) => {
  return (
    <header className="rrg-topbar">
      <div className="rrg-container rrg-nav">
        <div className="rrg-nav-left">
          <a
            href="/"
            className="rrg-nav-brand"
            onClick={(e) => {
              e.preventDefault()
              onNavigate('welcome')
            }}
          >
            Read Receipts
          </a>
        </div>
        <div className="rrg-nav-links">
          {currentPage !== 'welcome' && (
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault()
                onNavigate('welcome')
              }}
            >
              Home
            </a>
          )}
          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault()
              onNavigate('about')
            }}
          >
            About
          </a>
          <a
            href="/feedback"
            onClick={(e) => {
              e.preventDefault()
              onNavigate('feedback')
            }}
          >
            Submit Feedback
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header
