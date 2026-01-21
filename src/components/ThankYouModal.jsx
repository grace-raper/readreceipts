import React from 'react'
import { X, Coffee, Heart } from 'lucide-react'
import './ThankYouModal.css'
import { trackEvent } from './PostHogProvider'

const ThankYouModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  const handleCTAClick = (ctaType) => {
    trackEvent('thank_you_cta_clicked', {
      cta_type: ctaType
    })
  }

  const avatarSrc = `${import.meta.env.BASE_URL}grace-avatar.png`

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-header">
          <Heart size={32} style={{ color: '#d97706' }} />
          <h2>Thanks for using Read Receipts!</h2>
          <img src={avatarSrc} alt="Grace" className="modal-avatar" />
        </div>

        <div className="modal-body">
          <p>
           Hi, I’m Grace! 👋 I’m a software engineer and avid reader based in Seattle, WA, and I build and maintain Read Receipts in my free time.
          </p>

          <div className="modal-actions">
            <p className="modal-support-copy">
              If you’ve enjoyed using the project and have the means, sponsoring me helps keep the site running (and fuels my coffee habit ☕️):
            </p>
            <a
              href="https://buymeacoffee.com/hk46zntm5pq"
              target="_blank"
              rel="noopener noreferrer"
              className="modal-button primary pill"
              onClick={() => handleCTAClick('buy_coffee')}
            >
              <Coffee size={18} />
              Sponsor / Buy me a coffee
            </a>
            <p className="modal-support-copy">
              No budget but still want to support? I’d love a follow on Goodreads or StoryGraph — growing an audience big enough to receive ARCs is a longtime dream of mine.
            </p>

            <a
              href="https://www.goodreads.com/graceraper"
              target="_blank"
              rel="noopener noreferrer"
              className="modal-button secondary"
              onClick={() => handleCTAClick('follow_goodreads')}
            >
              Follow me on Goodreads
            </a>
            <a
              href="https://app.thestorygraph.com/profile/graceraper"
              target="_blank"
              rel="noopener noreferrer"
              className="modal-button secondary"
              onClick={() => handleCTAClick('follow_storygraph')}
            >
              Follow me on StoryGraph
            </a>
          </div>

          <div className="modal-footer">
            <p>
              And if you share your receipt on social media, tag <strong>@readreceipts.xyz</strong> so I can see what you’re reading. 💛
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThankYouModal
