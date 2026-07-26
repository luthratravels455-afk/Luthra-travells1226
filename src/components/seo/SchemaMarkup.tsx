import React, { useEffect } from 'react';

export interface SchemaMarkupProps {
  type: 'LocalBusiness' | 'TaxiService' | 'Organization' | 'FAQPage' | 'Review' | 'BreadcrumbList';
  data?: any;
}

export const SchemaMarkup: React.FC<SchemaMarkupProps> = ({ type, data }) => {
  useEffect(() => {
    let schemaObj: any = {};

    const orgBase = {
      '@context': 'https://schema.org',
      name: 'Luthra Travels',
      url: 'https://luthratravels.com',
      logo: 'https://luthratravels.com/favicon.svg',
      telephone: '+919958956593',
      email: 'luthratravel455@gmail.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Suite 402, Signature Towers, South City 1',
        addressLocality: 'Gurgaon',
        addressRegion: 'Delhi NCR',
        postalCode: '122001',
        addressCountry: 'IN',
      },
    };

    if (type === 'LocalBusiness' || type === 'TaxiService') {
      schemaObj = {
        ...orgBase,
        '@type': ['LocalBusiness', 'TaxiService'],
        areaServed: ['Delhi', 'Gurgaon', 'Noida', 'Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Shimla', 'Agra', 'Jaipur'],
        openingHours: 'Mo-Su 00:00-23:59',
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '28.4595',
          longitude: '77.0266',
        },
      };
    } else if (type === 'Organization') {
      schemaObj = {
        ...orgBase,
        '@type': 'Organization',
        sameAs: [
          'https://instagram.com/luthratravels',
          'https://facebook.com/luthratravels',
          'https://linkedin.com/company/luthratravels',
        ],
      };
    } else if (type === 'FAQPage' && data?.faqs) {
      schemaObj = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data.faqs.map((f: any) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      };
    } else if (type === 'BreadcrumbList' && data?.items) {
      schemaObj = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: data.items.map((item: any, idx: number) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: item.label,
          item: item.path ? `https://luthratravels.com${item.path}` : undefined,
        })),
      };
    }

    const scriptId = `schema-${type.toLowerCase()}`;
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.text = JSON.stringify(schemaObj);

    return () => {
      if (scriptEl) scriptEl.remove();
    };
  }, [type, data]);

  return null;
};
