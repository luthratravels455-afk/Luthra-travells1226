import React, { useEffect } from 'react';
import { useCMS } from '../contexts/CMSContext';

export const CustomScriptsInjector: React.FC = () => {
  const { settings } = useCMS();

  useEffect(() => {
    const injectSnippet = (target: HTMLElement, rawHtml: string, attributeId: string) => {
      // Remove previously injected elements for this attribute ID
      const existing = document.querySelectorAll(`[data-custom-script="${attributeId}"]`);
      existing.forEach((el) => el.remove());

      if (!rawHtml || !rawHtml.trim()) return;

      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, 'text/html');

      // Process head & body elements from parsed doc
      const nodes = Array.from(doc.head.childNodes).concat(Array.from(doc.body.childNodes));

      nodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;

          if (element.tagName.toLowerCase() === 'script') {
            // Re-create script element so browser executes inline & external scripts
            const newScript = document.createElement('script');
            newScript.setAttribute('data-custom-script', attributeId);

            Array.from(element.attributes).forEach((attr) => {
              newScript.setAttribute(attr.name, attr.value);
            });

            if (element.textContent) {
              newScript.textContent = element.textContent;
            }

            target.appendChild(newScript);
          } else {
            // Non-script tags (meta, style, noscript, div, link, etc.)
            const cloned = element.cloneNode(true) as HTMLElement;
            cloned.setAttribute('data-custom-script', attributeId);
            target.appendChild(cloned);
          }
        }
      });
    };

    const headScript = settings.custom_script_head || settings.custom_head_scripts || '';
    const bodyScript = settings.custom_script_body || settings.custom_body_scripts || '';
    const footerScript = settings.custom_script_footer || settings.custom_footer_scripts || '';

    if (headScript) {
      injectSnippet(document.head, headScript, 'head-script');
    }
    if (bodyScript) {
      injectSnippet(document.body, bodyScript, 'body-script');
    }
    if (footerScript) {
      injectSnippet(document.body, footerScript, 'footer-script');
    }
  }, [
    settings.custom_script_head,
    settings.custom_head_scripts,
    settings.custom_script_body,
    settings.custom_body_scripts,
    settings.custom_script_footer,
    settings.custom_footer_scripts,
  ]);

  return null;
};
