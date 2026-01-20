import React from 'react'
import '../ReadingReceiptGenerator.css'

const AboutPage = () => {
  return (
    <div className="rrg-page">
      <div className="rrg-container" style={{ maxWidth: '700px', paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img 
            src="/grace-avatar.png" 
            alt="Grace Raper" 
            style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              objectFit: 'cover',
              margin: '0 auto 1rem',
              boxShadow: '0 8px 18px rgba(0, 0, 0, 0.25)',
              border: '3px solid #1f1307'
            }} 
          />
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1f1307' }}>
            About Read Receipts
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#4a3c33', lineHeight: 1.6 }}>
            Created by Grace Raper
          </p>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>The Story</h2>
          <p style={{ lineHeight: 1.7, color: '#4a3c33', marginBottom: '1rem' }}>
            Read Receipts transforms your reading history into beautiful, vintage-styled receipts. 
            Whether you're tracking your yearly reading goals, celebrating seasonal favorites, or 
            just want a unique way to share your literary journey, Read Receipts makes it easy and fun.
          </p>
          <p style={{ lineHeight: 1.7, color: '#4a3c33' }}>
            Import your data from Goodreads, customize your receipt style, and share your reading 
            accomplishments with friends. Every book you've read deserves to be celebrated!
          </p>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Support This Project</h2>
          <p style={{ lineHeight: 1.7, color: '#4a3c33', marginBottom: '1.5rem' }}>
            Read Receipts is free to use and always will be. If you'd like to support the project 
            and help keep it running, consider buying me a coffee or following along on social media!
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a 
              href="https://www.buymeacoffee.com/graceraper" 
              target="_blank" 
              rel="noreferrer"
              className="rrg-button"
              style={{ textDecoration: 'none' }}
            >
              ☕ Buy Me a Coffee
            </a>
            <a 
              href="https://www.goodreads.com/graceraper" 
              target="_blank" 
              rel="noreferrer"
              className="rrg-button secondary"
              style={{ textDecoration: 'none' }}
            >
              Follow on Goodreads
            </a>
          </div>
        </div>

        <div className="rrg-card">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Connect</h2>
          <p style={{ lineHeight: 1.7, color: '#4a3c33', marginBottom: '1rem' }}>
            Follow along for updates, reading recommendations, and more:
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="https://www.instagram.com/graceraper" target="_blank" rel="noreferrer" aria-label="Instagram">
              <img src="https://s.magecdn.com/social/mb-instagram.svg" alt="Instagram" width="32" height="32" />
            </a>
            <a href="https://www.tiktok.com/@graceraper" target="_blank" rel="noreferrer" aria-label="TikTok">
              <img src="https://s.magecdn.com/social/mb-tiktok.svg" alt="TikTok" width="32" height="32" />
            </a>
            <a href="https://github.com/graceraper" target="_blank" rel="noreferrer" aria-label="GitHub">
              <img src="https://s.magecdn.com/social/mb-github.svg" alt="GitHub" width="32" height="32" />
            </a>
            <a href="https://www.linkedin.com/in/graceraper" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <img src="https://s.magecdn.com/social/mb-linkedin.svg" alt="LinkedIn" width="32" height="32" />
            </a>
            <a href="https://graceraper.substack.com" target="_blank" rel="noreferrer" aria-label="Substack">
              <img src="https://s.magecdn.com/social/mb-substack.svg" alt="Substack" width="32" height="32" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
