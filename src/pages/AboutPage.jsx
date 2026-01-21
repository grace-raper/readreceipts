import React from 'react'
import '../ReadingReceiptGenerator.css'

const AboutPage = () => {
  return (
    <div className="rrg-page rrg-page-compact">
      <div
        className="rrg-container"
        style={{
          maxWidth: '780px',
          paddingTop: '1.2rem',
          paddingBottom: '2rem',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        {/* About Grace */}
        <div
          className="rrg-card"
          style={{
            padding: '1.5rem 1.5rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.9rem'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <img
              src="/grace-avatar.png"
              alt="Grace Raper"
              style={{
                width: '112px',
                height: '112px',
                borderRadius: '50%',
                objectFit: 'cover',
                margin: '0 auto 0.65rem',
                boxShadow: '0 8px 18px rgba(0, 0, 0, 0.2)',
                border: '3px solid #1f1307'
              }}
            />
          </div>

          <section>
            <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.35rem', color: '#1f1307' }}>Meet The Author:</h2>
            <p style={{ lineHeight: 1.65, color: '#3a2f26', margin: '0 0 0.65rem' }}>
              Hi, I’m Grace! 👋 I’m a software engineer and avid reader based in Seattle, and I build and maintain Read Receipts in my free time.
              </p>
            <p style={{ lineHeight: 1.65, color: '#3a2f26', margin: '0 0 0.65rem' }}>
            If you enjoyed Read Receipts and want to support me, I’d love a follow on Goodreads or StoryGraph — growing an audience big enough to receive ARCs is a longtime dream of mine.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '2rem'}}>
              <a
                className="rrg-button secondary"
                style={{ flex: '1 1 180px', minWidth: '200px', textAlign: 'center' }}
                href="https://www.goodreads.com/graceraper"
                target="_blank"
                rel="noreferrer"
              >
                Follow me on Goodreads
              </a>
              <a
                className="rrg-button secondary"
                style={{ flex: '1 1 180px', minWidth: '200px', textAlign: 'center' }}
                href="https://app.thestorygraph.com/profile/graceraper"
                target="_blank"
                rel="noreferrer"
              >
                Follow me on StoryGraph
              </a>
            </div>
            <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.35rem', color: '#1f1307' }}>Want to connect beyond Read Receipts?</h2>
            <p style={{ lineHeight: 1.6, color: '#3b3632ff', marginBottom: '1.5rem' }}>
              I share what I’m building, reading, and learning across the internet:
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', marginTop: '0.35rem' }}>

            <a href="https://github.com/grace-raper" target="_blank" rel="noreferrer" aria-label="GitHub">
              <img src="https://s.magecdn.com/social/mb-github.svg" alt="GitHub" width="32" height="32" />
            </a>

            <a href="https://www.linkedin.com/in/graceraper" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <img src="https://s.magecdn.com/social/mb-linkedin.svg" alt="LinkedIn" width="32" height="32" />
            </a>

            <a href="https://graceraper.substack.com" target="_blank" rel="noreferrer" aria-label="Substack">
              <img src="https://s.magecdn.com/social/mb-substack.svg" alt="Substack" width="32" height="32" />
            </a> 
            
            <a href="https://www.tiktok.com/@grace.raper" target="_blank" rel="noreferrer" aria-label="TikTok">
              <img src="https://s.magecdn.com/social/mb-tiktok.svg" alt="TikTok" width="32" height="32" />
            </a>

            <a href="https://www.instagram.com/graceiraper" target="_blank" rel="noreferrer" aria-label="Instagram">
              <img src="https://s.magecdn.com/social/mb-instagram.svg" alt="Instagram" width="32" height="32" />
            </a>

              
            </div>
          </section>
        </div>

        {/* About the Project */}
        <div
          className="rrg-card"
          style={{
            padding: '1.4rem 1.5rem 1.2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem'
          }}
        >
          <section>
            <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.35rem', color: '#1f1307' }}>About the project</h2>
            <p style={{ lineHeight: 1.65, color: '#3a2f26', margin: '0 0 0.55rem' }}>
             Read Receipts is open source, and I’m always looking for sponsors and contributors to keep it growing. You can help by reaching out, jumping into the code with a PR, or even sending a few dollars — every bit helps keep the project alive:
            </p>
          </section>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            <a
              className="rrg-button"
              style={{
                flex: '1 1 200px',
                minWidth: '220px',
                textAlign: 'center',
                background: '#1f1307',
                color: '#fff',
                border: '2px solid #1f1307'
              }}
              href="https://github.com/grace-raper/readreceipts"
              target="_blank"
              rel="noreferrer"
            >
              View the GitHub repo
            </a>
            <a
              className="rrg-button"
              style={{ flex: '1 1 180px', minWidth: '200px', textAlign: 'center' }}
              href="https://buymeacoffee.com/hk46zntm5pq"
              target="_blank"
              rel="noreferrer"
            >
              Sponsor / Buy me a coffee
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
