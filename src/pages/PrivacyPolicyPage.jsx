import React from 'react'
import '../ReadingReceiptGenerator.css'

const PrivacyPolicyPage = ({ onNavigate }) => {
  return (
    <div className="rrg-page rrg-page-compact">
      <div className="rrg-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <h1 className="rrg-title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          Privacy Policy
        </h1>
        <p className="rrg-subtitle" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          Last updated: January 20, 2026
        </p>

        <div className="rrg-card" style={{ marginBottom: '1rem' }}>
          <h2>Overview</h2>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            Read Receipts is committed to protecting your privacy. This policy explains how we collect, use, and protect your information when you use our service. We prioritize transparency and user control over personal data.
          </p>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1rem' }}>
          <h2>Information We Collect</h2>
          <h3 style={{ fontSize: '1rem', marginTop: '0.75rem', marginBottom: '0.5rem' }}>Reading Data (Processed Locally)</h3>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li><strong>CSV Files:</strong> When you upload a Goodreads export, it is processed entirely in your browser. We never send your book data, ratings, or reading history to our servers.</li>
            <li><strong>Manual Entries:</strong> Any books you add manually, including titles, authors, pages, ratings, and dates, remain in your browser only.</li>
            <li><strong>Username:</strong> Optional username field for receipt personalization, stored locally only.</li>
          </ul>
          
          <h3 style={{ fontSize: '1rem', marginTop: '0.75rem', marginBottom: '0.5rem' }}>Analytics Data (With Your Consent)</h3>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li><strong>Usage Analytics:</strong> We use PostHog to understand how users interact with Read Receipts (e.g., which templates are popular, which features are used).</li>
            <li><strong>Session Recordings:</strong> With your consent, we may record anonymized sessions to improve user experience and identify bugs.</li>
            <li><strong>Technical Information:</strong> Browser type, device type, page views, button clicks, and feature usage patterns.</li>
            <li><strong>No Personal Book Data:</strong> We do not send book titles, authors, ratings, or any reading history to analytics services.</li>
          </ul>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1rem' }}>
          <h2>How We Use Your Data</h2>
          <h3 style={{ fontSize: '1rem', marginTop: '0.75rem', marginBottom: '0.5rem' }}>Local Processing</h3>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li>Generate receipt previews in your browser</li>
            <li>Create downloadable PNG images of your receipts (processed locally)</li>
            <li>Persist your data locally so you don't need to re-import</li>
          </ul>
          
          <h3 style={{ fontSize: '1rem', marginTop: '0.75rem', marginBottom: '0.5rem' }}>Analytics (With Consent)</h3>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li>Understand which features are most valuable to users</li>
            <li>Identify and fix bugs or usability issues</li>
            <li>Improve the overall user experience</li>
            <li>Make data-driven decisions about future features</li>
          </ul>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1rem' }}>
          <h2>Local Storage & Cookies</h2>
          <p style={{ margin: '0 0 0.5rem', lineHeight: 1.6 }}>
            We use browser localStorage and cookies to enhance your experience:
          </p>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li><strong>localStorage:</strong> Stores your imported books, username, shelf counts, and customization preferences locally in your browser. This data never leaves your device.</li>
            <li><strong>Analytics Cookies:</strong> PostHog uses cookies to track sessions and user interactions (only with your consent).</li>
            <li><strong>Consent Cookie:</strong> Stores your cookie consent preferences.</li>
          </ul>
          <p style={{ margin: '0.75rem 0 0', lineHeight: 1.6 }}>
            You can clear all local data and cookies at any time through your browser settings. See our <button onClick={() => onNavigate?.('cookies')} style={{ background: 'none', border: 'none', color: '#d97706', textDecoration: 'underline', cursor: 'pointer', padding: 0, font: 'inherit' }}>Cookie Policy</button> for more details.
          </p>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1rem' }}>
          <h2>Third-Party Services</h2>
          <p style={{ margin: '0 0 0.5rem', lineHeight: 1.6 }}>
            We use the following third-party services:
          </p>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li><strong>PostHog:</strong> Open-source product analytics platform. PostHog may collect usage data and session recordings (with your consent). PostHog's privacy policy is available at <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#d97706' }}>posthog.com/privacy</a>.</li>
            <li><strong>Open Library API:</strong> When you import StoryGraph data, we query the Open Library API (openlibrary.org) to look up missing page counts using book ISBNs. These queries are made from your browser and include only the ISBN number—no personal information, reading history, or account data is sent. Open Library is a project of the Internet Archive. We cannot control or predict how long these API requests take to complete.</li>
          </ul>
          <p style={{ margin: '0.75rem 0 0', lineHeight: 1.6 }}>
            <strong>Important:</strong> We do not intentionally send your book data, reading history, or personally identifiable information about your reading habits to PostHog. However, session recordings may temporarily capture screen activity that includes this information (see Session Recording section below).
          </p>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1rem' }}>
          <h2>Session Recording & Screen Capture</h2>
          <p style={{ margin: '0 0 0.5rem', lineHeight: 1.6 }}>
            <strong>With your consent</strong>, we temporarily record user sessions on our website to analyze user experience and identify technical issues.
          </p>
          
          <h3 style={{ fontSize: '1rem', marginTop: '0.75rem', marginBottom: '0.5rem' }}>What We Record</h3>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li>Screen activity, including page navigation and visual interactions</li>
            <li>Mouse movements, clicks, and scrolling behavior</li>
            <li>Typed inputs in forms and fields</li>
            <li>Browser and device information</li>
          </ul>

          <h3 style={{ fontSize: '1rem', marginTop: '0.75rem', marginBottom: '0.5rem' }}>Data Minimization & Masking</h3>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li><strong>Automatic Masking:</strong> Our recording tools are configured to automatically mask sensitive data fields including passwords, credit card numbers, social security numbers, and health information before recording begins</li>
            <li><strong>Book Data Visibility:</strong> Session recordings may temporarily capture book titles, authors, and reading data visible on your screen as you use the app. This data is visible in recordings but is not extracted, stored in a database, or linked to your identity</li>
            <li><strong>No PII Storage:</strong> We do not store personally identifiable information (email addresses, full names, phone numbers) within session recordings or in any linked database</li>
            <li><strong>Anonymized Sessions:</strong> Recordings are not linked to your real identity and use anonymous session IDs</li>
          </ul>

          <h3 style={{ fontSize: '1rem', marginTop: '0.75rem', marginBottom: '0.5rem' }}>Purpose & Use</h3>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li>Improving user experience and identifying usability issues</li>
            <li>Debugging technical problems and errors</li>
            <li>Understanding user flows and feature usage patterns</li>
            <li>Optimizing the interface and functionality</li>
          </ul>
          <p style={{ margin: '0.75rem 0 0', lineHeight: 1.6 }}>
            <strong>Access is strictly limited</strong> to authorized personnel for specific, approved purposes related to product improvement and support.
          </p>

          <h3 style={{ fontSize: '1rem', marginTop: '0.75rem', marginBottom: '0.5rem' }}>Data Retention & Security</h3>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li><strong>Automatic Deletion:</strong> Session recordings are automatically deleted after 90 days to minimize risk and comply with data minimization principles</li>
            <li><strong>Encryption:</strong> All recordings are encrypted in transit and at rest using industry-standard protocols</li>
            <li><strong>Secure Access:</strong> Access to recordings is protected by authentication and authorization controls</li>
            <li><strong>No Long-Term Storage:</strong> Recordings are temporary and not archived for long-term retention</li>
          </ul>

          <h3 style={{ fontSize: '1rem', marginTop: '0.75rem', marginBottom: '0.5rem' }}>Your Rights & Consent</h3>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li><strong>Explicit Consent Required:</strong> Session recording only occurs if you accept cookies and analytics tracking</li>
            <li><strong>Opt-Out Anytime:</strong> You can decline or revoke consent at any time through the cookie banner</li>
            <li><strong>Data Requests:</strong> You have the right to request access to, correction of, or deletion of your data under applicable laws (GDPR, CCPA, etc.)</li>
            <li><strong>No Recording Without Consent:</strong> If you decline cookies, no session recording occurs</li>
          </ul>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1rem' }}>
          <h2>Data Sharing & Sale</h2>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            <strong>We do not sell, rent, or share your data with third parties for marketing purposes.</strong> Your reading data stays in your browser. Analytics data (including session recordings) is used solely to improve Read Receipts and is not shared with advertisers, data brokers, or other third parties beyond PostHog (our analytics provider).
          </p>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1rem' }}>
          <h2>Data Security</h2>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li>Your reading data is processed entirely client-side in your browser</li>
            <li>We use HTTPS to secure connections to our website</li>
            <li>Analytics data is transmitted securely to PostHog's servers</li>
            <li>We implement industry-standard security practices</li>
          </ul>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1rem' }}>
          <h2>Your Rights & Choices</h2>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li><strong>Opt-Out of Analytics:</strong> Decline cookie consent or revoke it at any time through the cookie banner</li>
            <li><strong>Clear Local Data:</strong> Delete your reading data via your browser settings (localStorage)</li>
            <li><strong>Data Portability:</strong> Export your receipts as PNG images at any time</li>
            <li><strong>Do Not Track:</strong> We respect browser Do Not Track signals</li>
            <li><strong>Contact Us:</strong> Email readreceipts@graceraper.com with privacy questions or requests</li>
          </ul>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1rem' }}>
          <h2>Future Changes & Features</h2>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            As Read Receipts evolves, we may introduce new features such as:
          </p>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: 1.6 }}>
            <li>Optional cloud backup of reading data (with explicit opt-in)</li>
            <li>Social sharing features</li>
            <li>Integration with additional reading platforms</li>
          </ul>
          <p style={{ margin: '0.75rem 0 0', lineHeight: 1.6 }}>
            Any new features that involve data collection or sharing will require your explicit consent and will be clearly disclosed in an updated privacy policy.
          </p>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1.5rem' }}>
          <h2>Children's Privacy</h2>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            Read Receipts is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us.
          </p>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1.5rem' }}>
          <h2>Changes to This Policy</h2>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            We may update this privacy policy from time to time. Significant changes will be announced on the website. The "Last updated" date at the top indicates when changes were last made. Continued use of Read Receipts after changes constitutes acceptance of the updated policy.
          </p>
        </div>

        <div className="rrg-card" style={{ marginBottom: '1.5rem' }}>
          <h2>Contact Information</h2>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            For questions, concerns, or requests regarding this privacy policy or your data, please contact:<br />
            <strong>Email:</strong> readreceipts@graceraper.com
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button className="rrg-button secondary" onClick={() => onNavigate?.('welcome')}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
