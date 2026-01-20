import { useEffect, useState } from 'react';
import posthog from 'posthog-js';

const CONSENT_COOKIE_NAME = 'readreceipts_cookie_consent';

// Check if user has Do Not Track enabled
const hasDoNotTrack = () => {
  return navigator.doNotTrack === '1' || 
         window.doNotTrack === '1' || 
         navigator.msDoNotTrack === '1';
};

// Get cookie consent status
const getCookieConsent = () => {
  const consent = localStorage.getItem(CONSENT_COOKIE_NAME);
  if (consent === 'accepted') return true;
  if (consent === 'declined') return false;
  return null;
};

export function PostHogProvider({ children, hasConsent }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_POSTHOG_API_KEY;
    const host = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';
    
    // Respect Do Not Track
    if (hasDoNotTrack()) {
      console.log('PostHog: Do Not Track is enabled. Analytics disabled.');
      return;
    }

    // Only initialize if we have consent
    if (hasConsent && apiKey && !isInitialized) {
      posthog.init(apiKey, {
        api_host: host,
        capture_pageview: false,
        capture_pageleave: true,
        autocapture: false,
        session_recording: {
          enabled: true,
          maskAllInputs: false,
        },
      });
      setIsInitialized(true);
      console.log('PostHog: Analytics initialized with user consent');
    } else if (hasConsent === false && isInitialized) {
      // User declined consent, opt out
      posthog.opt_out_capturing();
      console.log('PostHog: User declined consent. Analytics disabled.');
    } else if (!apiKey) {
      console.warn('PostHog API key not found. Analytics will not be initialized.');
    }
    
    return () => {
      // Clean up if needed
    };
  }, [hasConsent, isInitialized]);

  return children;
}

export const trackEvent = (eventName, properties = {}) => {
  if (posthog && posthog.capture) {
    posthog.capture(eventName, properties);
  }
};

export const trackPageView = (pageName, properties = {}) => {
  if (posthog && posthog.capture) {
    posthog.capture('$pageview', {
      page_name: pageName,
      ...properties
    });
  }
};

export const trackTemplateSelection = (template, properties = {}) => {
  trackEvent('template_selected', {
    template_type: template,
    ...properties
  });
};

export const trackSettingChange = (settingName, value, context = {}) => {
  trackEvent('setting_changed', {
    setting_name: settingName,
    setting_value: value,
    template_type: context.template,
    previous_value: context.previous_value,
    ...context
  });
};

export const trackReceiptDownload = (template, settings = {}) => {
  trackEvent('receipt_downloaded', {
    template_type: template,
    ...settings
  });
};

export const trackImport = (source, bookCount, shelfCounts = {}) => {
  trackEvent('books_imported', {
    import_source: source,
    total_books: bookCount,
    read_books: shelfCounts.read || 0,
    currently_reading: shelfCounts.currentlyReading || 0,
    to_read: shelfCounts.toRead || 0
  });
};

export const trackBookAction = (action, bookData = {}) => {
  trackEvent('book_action', {
    action_type: action,
    ...bookData
  });
};

export const trackNavigation = (from, to) => {
  trackEvent('navigation', {
    from_page: from,
    to_page: to
  });
};

export const identifyUser = (userId, properties = {}) => {
  if (posthog && posthog.identify) {
    posthog.identify(userId, properties);
  }
};
