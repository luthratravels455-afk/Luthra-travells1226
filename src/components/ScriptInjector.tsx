import React, { useEffect } from 'react';
import { useCMS } from '../contexts/CMSContext';

export const ScriptInjector: React.FC = () => {
  const { settings } = useCMS();

  useEffect(() => {
    const headHtml = settings.custom_head_scripts || '';
    const bodyHtml = settings.custom_body_scripts || '';
    const footerHtml = settings.custom_footer_scripts || '';

    // Function to safely inject HTML/Scripts into a target DOM node
    const injectScripts = (html: string, targetNode: HTMLElement, containerId: string) => {
      // Remove existing injected container if present
      let existingContainer = document.getElementById(containerId);
      if (existingContainer) {
        existingContainer.remove();
      }

      if (!html.trim()) return;

      const container = document.createElement('div');
      container.id = containerId;
      container.style.display = 'none';

      // Parse HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Process all child nodes (scripts, noscripts, meta, links, style, etc.)
      const nodes = Array.from(doc.head.childNodes).concat(Array.from(doc.body.childNodes));

      nodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          if (el.tagName === 'SCRIPT') {
            const script = document.createElement('script');
            // Copy attributes
            Array.from(el.attributes).forEach((attr) => {
              script.setAttribute(attr.name, attr.value);
            });
            // Copy inline content
            if (el.textContent) {
              script.textContent = el.textContent;
            }
            container.appendChild(script);
          } else {
            // Clone non-script elements (e.g. meta, link, noscript, div, style)
            container.appendChild(el.cloneNode(true));
          }
        }
      });

      targetNode.appendChild(container);
    };

    injectScripts(headHtml, document.head, 'luthra-custom-head-scripts');
    injectScripts(bodyHtml, document.body, 'luthra-custom-body-scripts');
    injectScripts(footerHtml, document.body, 'luthra-custom-footer-scripts');

    return () => {
      ['luthra-custom-head-scripts', 'luthra-custom-body-scripts', 'luthra-custom-footer-scripts'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
    };
  }, [settings.custom_head_scripts, settings.custom_body_scripts, settings.custom_footer_scripts]);

  return null;
};
