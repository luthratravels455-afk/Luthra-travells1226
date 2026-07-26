import React, { useEffect } from 'react';

export interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  robots?: string;
  focusKeyword?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalUrl,
  ogImage = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
  ogType = 'website',
  robots = 'index, follow',
  focusKeyword,
}) => {
  useEffect(() => {
    const fullTitle = title.includes('Luthra Travels') ? title : `${title} | Luthra Travels`;
    document.title = fullTitle;

    // Helper to update or create meta tags
    const setMeta = (nameAttr: string, attrVal: string, contentVal: string) => {
      let el = document.querySelector(`meta[${nameAttr}="${attrVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(nameAttr, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', contentVal);
    };

    // Standard Meta
    setMeta('name', 'description', description);
    setMeta('name', 'robots', robots);
    if (focusKeyword) setMeta('name', 'keywords', focusKeyword);

    // OpenGraph Meta
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:site_name', 'Luthra Travels');

    // Twitter Card Meta
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);

    // Canonical Tag
    const href = canonicalUrl || window.location.href;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', href);
  }, [title, description, canonicalUrl, ogImage, ogType, robots, focusKeyword]);

  return null;
};
