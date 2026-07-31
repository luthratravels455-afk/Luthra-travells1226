import React, { useEffect, useState } from 'react';
import { seoService, PageSEORecord } from '../../services/seoService';
import { useCMS } from '../../contexts/CMSContext';

export interface PageSEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  pagePath?: string;
  ogImage?: string;
  schemaType?: 'LocalBusiness' | 'FAQPage' | 'BlogPosting' | 'BreadcrumbList' | 'Organization';
  faqItems?: Array<{ question: string; answer: string }>;
  blogData?: { title: string; excerpt: string; date: string; author: string; image: string };
}

export const PageSEO: React.FC<PageSEOProps> = ({
  title,
  description,
  canonicalUrl,
  pagePath,
  ogImage,
  schemaType = 'LocalBusiness',
  faqItems,
  blogData,
}) => {
  const { settings } = useCMS();
  const [seoRecord, setSeoRecord] = useState<PageSEORecord | null>(null);

  const currentPath = pagePath || window.location.pathname;

  useEffect(() => {
    let isMounted = true;
    const loadSEO = async () => {
      const dbSeo = await seoService.getPageSEO(currentPath);
      if (isMounted && dbSeo) {
        setSeoRecord(dbSeo);
      }
    };
    loadSEO();
    return () => { isMounted = false; };
  }, [currentPath]);

  useEffect(() => {
    // Resolve Title
    const baseTitle = seoRecord?.meta_title || title || 'Premium Taxi Services Across India';
    const fullTitle = baseTitle.includes('Luthra Travels') ? baseTitle : `${baseTitle} | Luthra Travels`;
    document.title = fullTitle;

    // Helper for Meta Tags
    const updateMetaTag = (attribute: string, key: string, content: string) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attribute}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attribute, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper for Link Tags
    const updateLinkTag = (rel: string, href: string) => {
      if (!href) return;
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // Resolve Values
    const resolvedDesc = seoRecord?.meta_description || description || settings.company_tagline || 'Experience safe, comfortable and reliable taxi services with professional drivers and transparent pricing.';
    const resolvedCanonical = seoRecord?.canonical_url || canonicalUrl || `https://luthratravels.com${currentPath}`;
    const resolvedRobots = seoRecord?.robots_meta || 'index, follow';
    const resolvedOgTitle = seoRecord?.og_title || fullTitle;
    const resolvedOgDesc = seoRecord?.og_description || resolvedDesc;
    const resolvedOgImage = seoRecord?.og_image || ogImage || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop';
    const resolvedOgType = seoRecord?.og_type || 'website';
    const resolvedTwitterCard = seoRecord?.twitter_card || 'summary_large_image';

    // Standard Meta
    updateMetaTag('name', 'description', resolvedDesc);
    updateMetaTag('name', 'robots', resolvedRobots);
    updateLinkTag('canonical', resolvedCanonical);

    // Open Graph
    updateMetaTag('property', 'og:title', resolvedOgTitle);
    updateMetaTag('property', 'og:description', resolvedOgDesc);
    updateMetaTag('property', 'og:image', resolvedOgImage);
    updateMetaTag('property', 'og:type', resolvedOgType);
    updateMetaTag('property', 'og:site_name', 'Luthra Travels');
    updateMetaTag('property', 'og:url', resolvedCanonical);

    // Twitter Card
    updateMetaTag('name', 'twitter:card', resolvedTwitterCard);
    updateMetaTag('name', 'twitter:title', resolvedOgTitle);
    updateMetaTag('name', 'twitter:description', resolvedOgDesc);
    updateMetaTag('name', 'twitter:image', resolvedOgImage);

    // JSON-LD Structured Data Schema Generation
    const activeSchemaType = seoRecord?.schema_type || schemaType;
    let schemaObj: any = null;

    if (seoRecord?.custom_json_ld) {
      try {
        schemaObj = JSON.parse(seoRecord.custom_json_ld);
      } catch {
        // Fallback if custom JSON-LD fails to parse
      }
    }

    if (!schemaObj) {
      if (activeSchemaType === 'LocalBusiness' || activeSchemaType === 'Organization') {
        schemaObj = {
          '@context': 'https://schema.org',
          '@type': 'TaxiService',
          'name': 'Luthra Travels',
          'url': 'https://luthratravels.com',
          'logo': 'https://luthratravels.com/favicon.svg',
          'image': resolvedOgImage,
          'telephone': settings.phone_primary || '+91 99589 56593',
          'email': settings.email_primary || 'luthratravel455@gmail.com',
          'address': {
            '@type': 'PostalAddress',
            'streetAddress': 'Suite 402, Signature Towers, South City 1',
            'addressLocality': 'Gurgaon',
            'addressRegion': 'Haryana / Delhi NCR',
            'postalCode': '122001',
            'addressCountry': 'IN'
          },
          'geo': {
            '@type': 'GeoCoordinates',
            'latitude': '28.4595',
            'longitude': '77.0266'
          },
          'priceRange': '₹₹',
          'openingHoursSpecification': {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            'opens': '00:00',
            'closes': '23:59'
          },
          'areaServed': ['Delhi', 'Gurgaon', 'Noida', 'Agra', 'Jaipur', 'Chandigarh']
        };
      } else if (activeSchemaType === 'FAQPage' && faqItems && faqItems.length > 0) {
        schemaObj = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': faqItems.map(item => ({
            '@type': 'Question',
            'name': item.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': item.answer
            }
          }))
        };
      } else if (activeSchemaType === 'BlogPosting' && blogData) {
        schemaObj = {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          'headline': blogData.title,
          'description': blogData.excerpt,
          'image': blogData.image,
          'author': {
            '@type': 'Person',
            'name': blogData.author
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'Luthra Travels',
            'logo': {
              '@type': 'ImageObject',
              'url': 'https://luthratravels.com/favicon.svg'
            }
          },
          'datePublished': blogData.date
        };
      } else {
        // BreadcrumbList Schema default
        schemaObj = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://luthratravels.com/'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': fullTitle,
              'item': resolvedCanonical
            }
          ]
        };
      }
    }

    // Inject JSON-LD script
    let scriptEl = document.querySelector('script[type="application/ld+json"]#seo-schema');
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.setAttribute('type', 'application/ld+json');
      scriptEl.setAttribute('id', 'seo-schema');
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schemaObj, null, 2);

  }, [seoRecord, title, description, canonicalUrl, currentPath, ogImage, schemaType, faqItems, blogData, settings]);

  return null;
};
