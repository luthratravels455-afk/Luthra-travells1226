// Global Window Tracking Interfaces
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    dataLayer?: any[];
    clarity?: (...args: any[]) => void;
  }
}

/**
 * Reusable Tracking Events Engine
 * Dispatches events to GA4, GTM dataLayer, Meta Pixel, and Clarity simultaneously.
 */

export const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  try {
    // 1. GA4 & Google Ads Event
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }

    // 2. GTM DataLayer Push
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: eventName,
        ...params,
        timestamp: new Date().toISOString(),
      });
    }

    // 3. Meta Pixel Track Custom Event
    if (typeof window.fbq === 'function') {
      window.fbq('trackCustom', eventName, params);
    }

    // 4. Microsoft Clarity Tag
    if (typeof window.clarity === 'function') {
      window.clarity('set', eventName, JSON.stringify(params));
    }

    console.log(`[Tracking Event] ${eventName}:`, params);
  } catch (err) {
    console.error('[Tracking Event Error]:', err);
  }
};

// Required Individual Event Methods

export const trackBookingSubmitted = (bookingDetails: {
  ref?: string;
  vehicle?: string;
  tripType?: string;
  amount?: number;
}) => {
  trackEvent('booking_submitted', {
    booking_ref: bookingDetails.ref || 'N/A',
    vehicle_name: bookingDetails.vehicle || 'Unknown',
    trip_type: bookingDetails.tripType || 'General',
    value: bookingDetails.amount || 0,
    currency: 'INR',
  });

  // Specific Meta Pixel Purchase / Lead event
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', {
      content_name: bookingDetails.vehicle,
      value: bookingDetails.amount || 0,
      currency: 'INR',
    });
  }
};

export const trackBookNowClick = (vehicleName?: string, source?: string) => {
  trackEvent('book_now_click', {
    vehicle_name: vehicleName || 'General',
    click_source: source || 'Homepage_CTA',
  });
};

export const trackWhatsAppClick = (source: string = 'Navbar') => {
  trackEvent('whatsapp_click', {
    click_source: source,
  });
};

export const trackPhoneClick = (source: string = 'Navbar', phone?: string) => {
  trackEvent('phone_click', {
    click_source: source,
    phone_number: phone || '+919958956593',
  });
};

export const trackContactFormSubmitted = (subject?: string) => {
  trackEvent('contact_form_submitted', {
    inquiry_subject: subject || 'General',
  });
};

export const trackVehicleSelected = (vehicleName: string, category?: string) => {
  trackEvent('vehicle_selected', {
    vehicle_name: vehicleName,
    vehicle_category: category || 'Taxi',
  });
};

export const trackRouteSelected = (origin: string, destination: string, fare?: number) => {
  trackEvent('route_selected', {
    route_name: `${origin} to ${destination}`,
    route_fare: fare || 0,
  });
};

export const trackBlogOpened = (blogTitle: string, category?: string) => {
  trackEvent('blog_opened', {
    blog_title: blogTitle,
    blog_category: category || 'Travel',
  });
};

export const trackGalleryOpened = (itemTitle: string, category?: string) => {
  trackEvent('gallery_item_viewed', {
    item_title: itemTitle,
    item_category: category || 'Fleet',
  });
};
