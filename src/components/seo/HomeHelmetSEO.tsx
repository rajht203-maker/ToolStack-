import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getSiteOrigin } from '../../utils/seoConfig';

interface HomeHelmetSEOProps {
  toolCount: number;
}

export const HomeHelmetSEO: React.FC<HomeHelmetSEOProps> = ({ toolCount }) => {
  const origin = getSiteOrigin();
  const title = `ToolStack - ${toolCount} Free Online Tools & Utilities`;
  const description = `Access ${toolCount} free online tools for PDF merging, image compression, calculators, converters, and dev utilities. 100% private with instant results.`;
  const canonicalUrl = `${origin}/`;
  const ogImage = `${origin}/og-image.png`;

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'ToolStack',
    'url': canonicalUrl,
    'description': description,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${origin}/?search={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="ToolStack" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  );
};
