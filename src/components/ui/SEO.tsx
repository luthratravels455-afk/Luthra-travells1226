import React, { useEffect } from 'react';

export interface PageSEOProps {
  title: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  schemaType?: 'LocalBusiness' | 'TaxiService' | 'FAQPage' | 'Article';
}

export const PageSEO: React.FC<PageSEOProps> = ({
  title,
  description = 'Luthra Travels - Premier Executive Chauffeur Mobility & Taxi Fleet Rentals in Delhi NCR, Airport Transfers, Outstation Trips & Local Taxis.',
  canonicalUrl,
  ogImage = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
  schemaType = 'LocalBusiness',
}) => {
  useEffect(() => {
    const fullTitle = `${title} | Luthra Travels`;
    document.title = fullTitle;

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // OpenGraph Meta
    const ogTags = [
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:image', content: ogImage },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Luthra Travels' },
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:title', content: fullTitle },
      { property: 'twitter:description', content: description },
      { property: 'twitter:image', content: ogImage },
    ];

    ogTags.forEach((tag) => {
      let el = document.querySelector(`meta[property="${tag.property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', tag.property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', tag.content);
    });

    // Canonical
    const currentUrl = canonicalUrl || window.location.href;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // Inject JSON-LD LocalBusiness & TaxiService Schema
    const schemaId = 'luthra-jsonld-schema';
    let scriptEl = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = schemaId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'TaxiService',
      name: 'Luthra Travels',
      description: 'Executive Chauffeur Taxi Rentals, Airport Transfers, Outstation Trips, Local Taxis, and Corporate Mobility across Delhi NCR and North India.',
      url: 'https://luthratravels.com',
      telephone: '+91 99589 56593',
      email: 'luthratravel455@gmail.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Suite 402, Signature Towers, South City 1',
        addressLocality: 'Gurgaon',
        addressRegion: 'Delhi NCR',
        postalCode: '122001',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '28.4595',
        longitude: '77.0266',
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '00:00',
        closes: '23:59',
      },
      areaServed: [
        'Delhi',
        'Gurgaon',
        'Noida',
        'Faridabad',
        'Ghaziabad',
        'Agra',
        'Jaipur',
        'Chandigarh',
        'Dehradun',
        'Shimla',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Taxi Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Airport Transfer IGI T1/T2/T3',
              description: '24/7 Punctual airport transfers with flight radar tracking.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Outstation Taxi',
              description: 'Intercity flat rate taxi rentals to Agra, Jaipur, Chandigarh, Shimla.',
            },
          },
        ],
      },
    };

    scriptEl.textContent = JSON.stringify(structuredData);
  }, [title, description, canonicalUrl, ogImage, schemaType]);

  return null;
};
