import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCMS } from '../contexts/CMSContext';

export const TrackingInjector: React.FC = () => {
  const { settings } = useCMS();
  const location = useLocation();

  useEffect(() => {
    if (!settings) return;

    // 1. GOOGLE SEARCH CONSOLE META VERIFICATION
    if (settings.gsc_verification_code) {
      let gscMeta = document.querySelector('meta[name="google-site-verification"]');
      if (!gscMeta) {
        gscMeta = document.createElement('meta');
        gscMeta.setAttribute('name', 'google-site-verification');
        document.head.appendChild(gscMeta);
      }
      gscMeta.setAttribute('content', settings.gsc_verification_code);
    }

    // 2. GOOGLE ANALYTICS 4 (GA4)
    if (settings.ga4_enabled === 'true' && settings.ga4_measurement_id) {
      const ga4Id = settings.ga4_measurement_id.trim();
      const scriptId = 'ga4-script-loader';

      if (!document.getElementById(scriptId)) {
        const ga4Script = document.createElement('script');
        ga4Script.id = scriptId;
        ga4Script.async = true;
        ga4Script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
        document.head.appendChild(ga4Script);

        const ga4InitScript = document.createElement('script');
        ga4InitScript.id = 'ga4-init-script';
        ga4InitScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${ga4Id}', { send_page_view: false });
        `;
        document.head.appendChild(ga4InitScript);
      }
    }

    // 3. GOOGLE TAG MANAGER (GTM)
    if (settings.gtm_enabled === 'true' && settings.gtm_container_id) {
      const gtmId = settings.gtm_container_id.trim();
      const gtmScriptId = 'gtm-script-loader';

      if (!document.getElementById(gtmScriptId)) {
        const gtmScript = document.createElement('script');
        gtmScript.id = gtmScriptId;
        gtmScript.innerHTML = `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `;
        document.head.appendChild(gtmScript);
      }
    }

    // 4. META PIXEL (FACEBOOK PIXEL)
    if (settings.meta_pixel_enabled === 'true' && settings.meta_pixel_id) {
      const pixelId = settings.meta_pixel_id.trim();
      const pixelScriptId = 'meta-pixel-script';

      if (!document.getElementById(pixelScriptId)) {
        const pixelScript = document.createElement('script');
        pixelScript.id = pixelScriptId;
        pixelScript.innerHTML = `
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
        document.head.appendChild(pixelScript);
      }
    }

    // 5. MICROSOFT CLARITY
    if (settings.clarity_enabled === 'true' && settings.clarity_project_id) {
      const clarityId = settings.clarity_project_id.trim();
      const clarityScriptId = 'clarity-script';

      if (!document.getElementById(clarityScriptId)) {
        const clarityScript = document.createElement('script');
        clarityScript.id = clarityScriptId;
        clarityScript.innerHTML = `
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityId}");
        `;
        document.head.appendChild(clarityScript);
      }
    }

    // 6. CUSTOM HEAD SCRIPTS / JSON-LD SCHEMA
    if (settings.custom_head_scripts) {
      const customHeadId = 'custom-head-scripts-container';
      let headContainer = document.getElementById(customHeadId);
      if (!headContainer) {
        headContainer = document.createElement('div');
        headContainer.id = customHeadId;
        document.head.appendChild(headContainer);
      }
      headContainer.innerHTML = settings.custom_head_scripts;
    }

    // 7. CUSTOM FOOTER SCRIPTS / CHAT WIDGETS
    if (settings.custom_footer_scripts) {
      const customFooterId = 'custom-footer-scripts-container';
      let footerContainer = document.getElementById(customFooterId);
      if (!footerContainer) {
        footerContainer = document.createElement('div');
        footerContainer.id = customFooterId;
        document.body.appendChild(footerContainer);
      }
      footerContainer.innerHTML = settings.custom_footer_scripts;
    }

  }, [settings]);

  // Page View Tracking on Route Changes
  useEffect(() => {
    if (typeof window.gtag === 'function' && settings.ga4_measurement_id) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }

    if (typeof window.fbq === 'function' && settings.meta_pixel_enabled === 'true') {
      window.fbq('track', 'PageView');
    }
  }, [location, settings]);

  return null;
};
