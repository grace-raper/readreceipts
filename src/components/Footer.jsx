import React from 'react'

const Footer = () => {
  return (
    <footer className="rrg-footer">
      <div className="rrg-container rrg-footer-content">
        <div className="rrg-footer-left">
          © {new Date().getFullYear()} Read Receipts
          <span className="rrg-footer-sub">created by Grace Raper</span>
        </div>
        <div className="rrg-footer-social">
          <a href="https://www.instagram.com/graceraper" target="_blank" rel="noreferrer" aria-label="Instagram">
            <img src="https://s.magecdn.com/social/mb-instagram.svg" alt="Instagram" width="18" height="18" />
          </a>
          <a href="https://www.tiktok.com/@graceraper" target="_blank" rel="noreferrer" aria-label="TikTok">
            <img src="https://s.magecdn.com/social/mb-tiktok.svg" alt="TikTok" width="18" height="18" />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
            <img src="https://s.magecdn.com/social/mb-facebook.svg" alt="Facebook" width="18" height="18" />
          </a>
          <a href="https://www.pinterest.com" target="_blank" rel="noreferrer" aria-label="Pinterest">
            <img src="https://s.magecdn.com/social/mb-pinterest.svg" alt="Pinterest" width="18" height="18" />
          </a>
        </div>
        <div className="rrg-footer-legal">
          <a href="/cookies">Cookies</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="mailto:readreceipts@graceraper.com">Contact</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
