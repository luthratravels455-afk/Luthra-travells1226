import React, { useEffect } from 'react';
import { useCMS } from '../contexts/CMSContext';

export const AnalyticsInjector: React.FC = () => {
  const { settings } = useCMS();

  useEffect(() => {
    if (!settings) return;

    // Helper to add meta tag
    const setMetaTag = (name: string, content: string | undefined, enabled: boolean) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (enabled && content && content.trim()) {
        const cleanContent = content.includes('content=')
          ? content.replace(/.*content=["']([^"']+)["'].*/, '$1')
          : content.trim();

        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', name);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', cleanContent);
      } else if (meta) {
        meta.remove();
      }
    };

    // 1. Google Search Console Verification Meta
    setMetaTag(
      'google-site-verification',
      settings.gsc_meta_tag,
      settings.gsc_enabled !== 'false'
    );

    // 2. Bing Webmaster Verification Tag
    setMetaTag(
      'msvalidate.01',
      settings.bing_verification_tag,
      settings.bing_enabled !== 'false'
    );

    // 3. Yandex Webmaster Verification Tag
    setMetaTag(
      'yandex-verification',
      settings.yandex_verification_tag,
      settings.yandex_enabled !== 'false'
    );

    // Helper to inject external script by ID
    const injectScript = (id: string, code: () => void, enabled: boolean) => {
      const existing = document.getElementById(id);
      if (enabled) {
        if (!existing) {
          code();
        }
      } else if (existing) {
        existing.remove();
      }
    };

    // 4. Google Analytics 4 (GA4)
    const ga4Id = settings.ga4_measurement_id?.trim();
    const ga4Enabled = settings.ga4_enabled !== 'false' && Boolean(ga4Id);
    injectScript('ga4-script', () => {
      const script1 = document.createElement('script');
      script1.id = 'ga4-script';
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.id = 'ga4-inline-script';
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${ga4Id}');
      `;
      document.head.appendChild(script2);
    }, ga4Enabled);

    // 5. Google Tag Manager (GTM)
    const gtmId = settings.gtm_container_id?.trim();
    const gtmEnabled = settings.gtm_enabled !== 'false' && Boolean(gtmId);
    injectScript('gtm-script', () => {
      const script = document.createElement('script');
      script.id = 'gtm-script';
      script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `;
      document.head.appendChild(script);
    }, gtmEnabled);

    // 6. Microsoft Clarity
    const clarityId = settings.clarity_project_id?.trim();
    const clarityEnabled = settings.clarity_enabled !== 'false' && Boolean(clarityId);
    injectScript('clarity-script', () => {
      const script = document.createElement('script');
      script.id = 'clarity-script';
      script.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${clarityId}");
      `;
      document.head.appendChild(script);
    }, clarityEnabled);

    // 7. Meta / Facebook Pixel
    const pixelId = settings.meta_pixel_id?.trim();
    const pixelEnabled = settings.meta_pixel_enabled !== 'false' && Boolean(pixelId);
    injectScript('meta-pixel-script', () => {
      const script = document.createElement('script');
      script.id = 'meta-pixel-script';
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);
    }, pixelEnabled);

  }, [settings]);

  return null;
};
