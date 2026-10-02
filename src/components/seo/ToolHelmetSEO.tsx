import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ToolItem } from '../../types';
import { getCompleteToolSEO } from '../../utils/toolSEOData';
import { getSiteOrigin } from '../../utils/seoConfig';

interface ToolHelmetSEOProps {
  tool: ToolItem;
  allTools: ToolItem[];
}

export const ToolHelmetSEO: React.FC<ToolHelmetSEOProps> = ({ tool, allTools }) => {
  const origin = getSiteOrigin();
  const seo = getCompleteToolSEO(tool, allTools, origin);
  const ogImage = `${origin}/og-image.png`;

  return (
    <Helmet>
      {/* 1. Unique Title (max 60 chars, format: "{Tool Name} - Free Online | ToolStack") */}
      <title>{seo.title}</title>

      {/* 2. Unique Meta Description (max 155 chars) */}
      <meta name="description" content={seo.description} />

      {/* 3. Canonical URL */}
      <link rel="canonical" href={seo.canonicalUrl} />

      {/* 4. OpenGraph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="ToolStack" />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={seo.canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* 5. Twitter / X Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={ogImage} />

      {/* 6. JSON-LD Structured Data: SoftwareApplication & FAQPage */}
      {seo.structuredData.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};
