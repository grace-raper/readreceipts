import React, { useState } from 'react'

const Header = ({ currentPage, onNavigate }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const handleNav = (destination) => (e) => {
    e.preventDefault()
    onNavigate(destination)
    setIsMobileNavOpen(false)
  }

  return (
    <header className="rrg-topbar">
      <div className="rrg-container rrg-nav">
        <div className="rrg-nav-left">
          <a href="/" className="rrg-nav-brand" onClick={handleNav('welcome')}>
            Read Receipts
          </a>
        </div>

        <button
          className="rrg-menu-toggle"
          aria-expanded={isMobileNavOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsMobileNavOpen((open) => !open)}
        >
          ☰
        </button>

        <div className="rrg-nav-links rrg-nav-links--desktop">
          {currentPage !== 'welcome' && (
            <a href="/" className="rrg-nav-link" onClick={handleNav('welcome')}>
              Home
            </a>
          )}
          <a href="/about" className="rrg-nav-link" onClick={handleNav('about')}>
            About
          </a>
          <a href="/feedback" className="rrg-nav-link" onClick={handleNav('feedback')}>
            Feedback
          </a>
        </div>
      </div>

      <div className={`rrg-nav-links rrg-nav-links--mobile ${isMobileNavOpen ? 'open' : ''}`}>
        {currentPage !== 'welcome' && (
          <a href="/" className="rrg-nav-link" onClick={handleNav('welcome')}>
            Home
          </a>
        )}
        <a href="/about" className="rrg-nav-link" onClick={handleNav('about')}>
          About
        </a>
        <a href="/feedback" className="rrg-nav-link" onClick={handleNav('feedback')}>
          Submit Feedback
        </a>
      </div>
    </header>
  )
}

export default Header
