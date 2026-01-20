import React, { useState } from 'react'
import '../ReadingReceiptGenerator.css'

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Add backend integration here
    console.log('Feedback submitted:', { feedback, email })
    setSubmitted(true)
    setTimeout(() => {
      setFeedback('')
      setEmail('')
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="rrg-page">
      <div className="rrg-container" style={{ maxWidth: '700px', paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1f1307' }}>
            Submit Feedback
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#4a3c33', lineHeight: 1.6 }}>
            I'd love to hear from you! Share your thoughts, suggestions, or report any issues.
          </p>
        </div>

        <div className="rrg-card">
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1f1307' }}>Thank You!</h2>
              <p style={{ color: '#4a3c33' }}>Your feedback has been received. I appreciate you taking the time to help me improve read receipts!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="rrg-label">Your Feedback *</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell me what you think, what features you'd like to see, or any issues you've encountered..."
                  required
                  rows="8"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: '2px solid #1f1307',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    background: '#fffdf7',
                    color: '#1f1307'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="rrg-label">Email (optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="rrg-input"
                />
                <p style={{ fontSize: '0.85rem', color: '#6b5b50', marginTop: '0.35rem' }}>
                  Leave your email if you'd like me to follow up with you.
                </p>
              </div>

              <button type="submit" className="rrg-button" style={{ width: '100%' }}>
                Submit Feedback
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default FeedbackPage
