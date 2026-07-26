import React, { useEffect } from 'react';

// Google Ads, GA4, GTM & Event Conversion Tracker Architecture
export const trackConversionEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    // GA4 / Google Ads dataLayer push
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: eventName,
      timestamp: new Date().toISOString(),
      ...eventParams,
    });

    console.log(`[Google Ads Conversion Tracked]: ${eventName}`, eventParams);
  }
};

export const AnalyticsTracker: React.FC = () => {
  useEffect(() => {
    // Track pageview
    trackConversionEvent('page_view', { page_path: window.location.pathname });

    // Track click events on phone numbers, WhatsApp, and booking form submissions
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const link = target.closest('a');
      if (link) {
        const href = link.getAttribute('href') || '';
        if (href.startsWith('tel:')) {
          trackConversionEvent('call_button_click', { phone: href.replace('tel:', '') });
        } else if (href.includes('wa.me') || href.includes('whatsapp.com')) {
          trackConversionEvent('whatsapp_click', { url: href });
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  return null;
};
