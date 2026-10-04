import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ToolItem } from '../../types';
import { getCompleteToolSEO } from '../../utils/toolSEOData';
import { getSiteOrigin } from '../../utils/seoConfig';
import { isToolIndexable } from '../../config/indexableTools';
import { getTopToolContent } from '../../data/top40ToolContent';

interface ToolHelmetSEOProps {
  tool: ToolItem;
  allTools: ToolItem[];
}

export const ToolHelmetSEO: React.FC<ToolHelmetSEOProps> = ({ tool, allTools }) => {
  const origin = getSiteOrigin();
  const seo = getCompleteToolSEO(tool, allTools, origin);
  const ogImage = `${origin}/og-image.png`;
  const isIndexable = isToolIndexable(tool.slug) || isToolIndexable(tool.id);
  const customContent = getTopToolContent(tool.slug) || getTopToolContent(tool.id);

  // If indexable, robots allow indexing; otherwise explicitly "noindex, follow"
  const robotsDirective = isIndexable
    ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    : 'noindex, follow';

  // Construct high-value Schema.org JSON-LD structures
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    operatingSystem: 'All (Web Browser)',
    applicationCategory: tool.category === 'calculator' ? 'FinanceApplication' : 'UtilitiesApplication',
    description: seo.description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    url: seo.canonicalUrl
  };

  // Build FAQPage schema if FAQs exist
  const activeFaqs = customContent?.faqs || seo.faqs;
  const faqSchema = activeFaqs && activeFaqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: activeFaqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer
      }
    }))
  } : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${origin}/`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: tool.category.toUpperCase(),
        item: `${origin}/category/${tool.category}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.name,
        item: seo.canonicalUrl
      }
    ]
  };

  return (
    <Helmet>
      {/* 1. Unique Title (max 60 chars) */}
      <title>{seo.title}</title>

      {/* 2. Unique Meta Description (max 155 chars) */}
      <meta name="description" content={seo.description} />

      {/* 3. Canonical URL */}
      <link rel="canonical" href={seo.canonicalUrl} />

      {/* 4. Indexing Robots Directive (Indexable vs Noindex, Follow) */}
      <meta name="robots" content={robotsDirective} />
      <meta name="googlebot" content={robotsDirective} />

      {/* 5. OpenGraph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="ToolStack" />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={seo.canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* 6. Twitter / X Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={ogImage} />

      {/* 7. JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(softwareAppSchema)}
      </script>
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}
    </Helmet>
  );
};
