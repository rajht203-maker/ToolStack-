import React, { useEffect } from 'react';
import { PageSEOConfig, getSiteOrigin } from '../../utils/seoConfig';

interface SEOHeadProps {
  config: PageSEOConfig;
}

/**
 * Helper to update or create a <meta> tag in the document head
 */
function updateMetaTag(attributeName: 'name' | 'property', attributeValue: string, content: string) {
  if (typeof document === 'undefined') return;
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Helper to update or create a <link rel="..."> tag in the document head
 */
function updateLinkTag(rel: string, href: string) {
  if (typeof document === 'undefined') return;
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

export const SEOHead: React.FC<SEOHeadProps> = ({ config }) => {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 1. Title
    document.title = config.seoTitle;

    // 2. Standard Meta Tags
    updateMetaTag('name', 'description', config.seoDescription);
    if (config.keywords.length > 0) {
      updateMetaTag('name', 'keywords', config.keywords.join(', '));
    }

    // 3. Robots meta tag (indexable vs noindex) with Google snippet directives
    const robotsContent = config.indexable 
      ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' 
      : 'noindex, nofollow';
    updateMetaTag('name', 'robots', robotsContent);
    updateMetaTag('name', 'googlebot', robotsContent);

    // 4. Canonical URL
    updateLinkTag('canonical', config.canonicalUrl);

    // 5. OpenGraph Tags
    const siteOrigin = getSiteOrigin();
    const defaultImage = `${siteOrigin}/apple-touch-icon.png`;

    updateMetaTag('property', 'og:title', config.seoTitle);
    updateMetaTag('property', 'og:description', config.seoDescription);
    updateMetaTag('property', 'og:url', config.canonicalUrl);
    updateMetaTag('property', 'og:type', config.category === 'all' ? 'website' : 'article');
    updateMetaTag('property', 'og:site_name', 'ToolStack');
    updateMetaTag('property', 'og:image', defaultImage);

    // 6. Twitter / X Cards
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', config.seoTitle);
    updateMetaTag('name', 'twitter:description', config.seoDescription);
    updateMetaTag('name', 'twitter:image', defaultImage);

    // 7. Inject JSON-LD Structured Data
    const existingScripts = document.querySelectorAll('script[data-schema="toolstack-seo"]');
    existingScripts.forEach(script => script.remove());

    if (config.structuredData && config.structuredData.length > 0) {
      config.structuredData.forEach((schemaData) => {
        const scriptElement = document.createElement('script');
        scriptElement.type = 'application/ld+json';
        scriptElement.setAttribute('data-schema', 'toolstack-seo');
        scriptElement.textContent = JSON.stringify(schemaData, null, 2);
        document.head.appendChild(scriptElement);
      });
    }

    // Cleanup on unmount
    return () => {
      const activeScripts = document.querySelectorAll('script[data-schema="toolstack-seo"]');
      activeScripts.forEach(script => script.remove());
    };
  }, [config]);

  return null;
};
