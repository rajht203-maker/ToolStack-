import { ToolItem, CategoryInfo } from '../types';
import { CATEGORIES, TOOLS_DATA } from '../data/toolsData';

export interface PageSEOConfig {
  name: string;
  slug: string;
  description: string;
  category: string;
  keywords: string[];
  canonicalUrl: string;
  indexable: boolean;
  h1: string;
  seoTitle: string;
  seoDescription: string;
  relatedTools: string[];
  structuredData: Record<string, any>[];
}

/**
 * Get current site base origin
 */
export function getSiteOrigin(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    // Avoid local development origins if production env is set
    const envUrl = (import.meta as any).env?.VITE_SITE_URL;
    if (envUrl && typeof envUrl === 'string' && envUrl.startsWith('http')) {
      return envUrl.replace(/\/+$/, '');
    }
    return window.location.origin.replace(/\/+$/, '');
  }
  return 'https://toolstack-eosin.vercel.app';
}

/**
 * Get base path if hosted on a subpath (e.g. GitHub Pages)
 */
export function getBasePath(): string {
  if (typeof window === 'undefined') return '';
  const isGitHubPages = window.location.hostname.endsWith('github.io');
  if (isGitHubPages) {
    const segments = window.location.pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
      const first = segments[0];
      if (first !== 'tools' && first !== 'calculators' && first !== 'category' && first !== 'admin') {
        return `/${first}`;
      }
    }
  }
  return '';
}

/**
 * Build canonical URL for a tool
 */
export function getToolCanonicalUrl(tool: ToolItem, origin?: string): string {
  const baseOrigin = origin || getSiteOrigin();
  const basePath = getBasePath();
  const subpath = tool.category === 'calculator' 
    ? `/calculators/${tool.slug}` 
    : `/tools/${tool.slug}`;
  return `${baseOrigin}${basePath}${subpath}`;
}

/**
 * Generate comprehensive, search-intent driven SEO configuration for a tool
 */
export function getToolSEOConfig(tool: ToolItem, customOrigin?: string): PageSEOConfig {
  const origin = customOrigin || getSiteOrigin();
  const canonicalUrl = getToolCanonicalUrl(tool, origin);
  const categoryInfo = CATEGORIES.find(c => c.id === tool.category);
  const categoryName = categoryInfo?.name || tool.category.toUpperCase();

  // Search-intent optimized title
  // E.g.: "PDF Merge Online – Combine Multiple PDFs Free | ToolStack"
  let seoTitle = tool.seoTitle;
  if (!seoTitle || seoTitle.trim().length < 20) {
    seoTitle = `${tool.name} Online – Free Fast Web Utility | ToolStack`;
  } else if (!seoTitle.includes('ToolStack') && !seoTitle.includes('|')) {
    seoTitle = `${seoTitle} | ToolStack`;
  }

  // Actionable, high-CTR meta description
  let seoDescription = tool.seoDescription;
  if (!seoDescription || seoDescription.trim().length < 50) {
    seoDescription = `${tool.description} Free, browser-based online utility. 100% private client-side processing with zero server uploads.`;
  }

  // Clear, intent-focused H1
  const h1 = tool.name;

  // Search keywords
  const keywords = Array.from(new Set([
    tool.name.toLowerCase(),
    `${tool.name.toLowerCase()} online`,
    `free ${tool.name.toLowerCase()}`,
    `${tool.name.toLowerCase()} tool`,
    categoryName.toLowerCase(),
    ...(tool.tags || []).map(t => t.toLowerCase()),
    'free online tools',
    'client-side privacy',
    'no signup required'
  ]));

  // Find related tools IDs (fallback to same category if fewer than 3)
  let relatedTools = tool.relatedToolIds && tool.relatedToolIds.length > 0 
    ? [...tool.relatedToolIds] 
    : [];
  if (relatedTools.length < 3) {
    const sameCatTools = TOOLS_DATA
      .filter(t => t.id !== tool.id && t.category === tool.category)
      .slice(0, 4 - relatedTools.length)
      .map(t => t.id);
    relatedTools = Array.from(new Set([...relatedTools, ...sameCatTools]));
  }

  // --- Rich JSON-LD Structured Data ---
  const structuredData: Record<string, any>[] = [];

  // 1. BreadcrumbList
  const breadcrumbListSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': `${origin}${getBasePath()}/`
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': categoryName,
        'item': `${origin}${getBasePath()}/category/${tool.category}`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': tool.name,
        'item': canonicalUrl
      }
    ]
  };
  structuredData.push(breadcrumbListSchema);

  // 2. WebApplication / SoftwareApplication
  const webAppSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': tool.name,
    'url': canonicalUrl,
    'applicationCategory': getApplicationCategory(tool.category),
    'operatingSystem': 'All (Web Browser)',
    'browserRequirements': 'Requires modern web browser with JavaScript enabled (Chrome, Firefox, Safari, Edge)',
    'description': seoDescription,
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
      'category': 'Free Online Utility'
    },
    'featureList': [
      '100% Client-side processing in your browser',
      'Zero server upload for maximum privacy & data confidentiality',
      'Instant document & file generation',
      'No registration or watermark required'
    ]
  };
  structuredData.push(webAppSchema);

  // 3. FAQPage (Only when the visible page actually contains FAQs)
  if (tool.faqs && tool.faqs.length > 0) {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': tool.faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    };
    structuredData.push(faqSchema);
  }

  return {
    name: tool.name,
    slug: tool.slug,
    description: tool.description,
    category: tool.category,
    keywords,
    canonicalUrl,
    indexable: true,
    h1,
    seoTitle,
    seoDescription,
    relatedTools,
    structuredData
  };
}

/**
 * Generate SEO configuration for Homepage
 */
export function getHomeSEOConfig(customOrigin?: string): PageSEOConfig {
  const origin = customOrigin || getSiteOrigin();
  const basePath = getBasePath();
  const canonicalUrl = `${origin}${basePath}/`;

  const structuredData: Record<string, any>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'ToolStack',
      'alternateName': 'ToolStack Online Utilities',
      'url': canonicalUrl,
      'description': 'All-in-one free online tools platform with 1,200+ utilities including PDF & image suites, developer tools, calculators, converters, security keys, and SEO tools.',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': `${canonicalUrl}?tool={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'ToolStack',
      'url': canonicalUrl,
      'logo': `${origin}${basePath}/icon.svg`,
      'sameAs': []
    }
  ];

  return {
    name: 'ToolStack',
    slug: '',
    description: 'All-in-one free online tools platform with 1,200+ browser-based utilities.',
    category: 'all',
    keywords: [
      'free online tools',
      'pdf tools online',
      'image compressor',
      'developer tools',
      'calculators',
      'unit converters',
      'privacy focused tools',
      'client side tools'
    ],
    canonicalUrl,
    indexable: true,
    h1: '1,200+ Free Online Web Tools & Utilities',
    seoTitle: 'ToolStack - 1,200+ All-in-One Free Online Tools & Utilities',
    seoDescription: 'Access 1,200+ free online tools for PDF merging, image compression, calculators, unit conversions, and developer utilities. 100% private, client-side, zero signup.',
    relatedTools: ['pdf-merge', 'pdf-compress', 'image-compressor', 'percentage-calculator'],
    structuredData
  };
}

/**
 * Generate SEO configuration for Category pages
 */
export function getCategorySEOConfig(category: CategoryInfo, customOrigin?: string): PageSEOConfig {
  const origin = customOrigin || getSiteOrigin();
  const basePath = getBasePath();
  const canonicalUrl = `${origin}${basePath}/category/${category.id}`;

  const categoryTools = TOOLS_DATA.filter(t => t.category === category.id);
  const toolNames = categoryTools.slice(0, 8).map(t => t.name).join(', ');

  const structuredData: Record<string, any>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': `${category.name} – Free Online Tools`,
      'url': canonicalUrl,
      'description': `${category.description} Free, browser-based utilities including ${toolNames}.`,
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': `${origin}${basePath}/`
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': category.name,
            'item': canonicalUrl
          }
        ]
      }
    }
  ];

  return {
    name: category.name,
    slug: category.id,
    description: category.description,
    category: category.id,
    keywords: [
      category.name.toLowerCase(),
      `${category.name.toLowerCase()} online`,
      `free ${category.name.toLowerCase()}`,
      'browser utilities',
      'client-side processing'
    ],
    canonicalUrl,
    indexable: true,
    h1: `${category.name} – Free Online Utilities`,
    seoTitle: `${category.name} – Free Online Utilities & Web Tools | ToolStack`,
    seoDescription: `${category.description} Explore ${categoryTools.length} free, private, client-side ${category.name.toLowerCase()} with instant results.`,
    relatedTools: categoryTools.slice(0, 6).map(t => t.id),
    structuredData
  };
}

/**
 * Generate SEO configuration for Admin / Private pages (Strictly Noindex)
 */
export function getAdminSEOConfig(customOrigin?: string): PageSEOConfig {
  const origin = customOrigin || getSiteOrigin();
  const basePath = getBasePath();
  const canonicalUrl = `${origin}${basePath}/admin`;

  return {
    name: 'Admin Control Center',
    slug: 'admin',
    description: 'Restricted administrative system settings and tool registry management.',
    category: 'admin',
    keywords: [],
    canonicalUrl,
    indexable: false, // NOINDEX
    h1: 'Admin Management Console',
    seoTitle: 'Admin Control Center | ToolStack',
    seoDescription: 'System administration and management dashboard.',
    relatedTools: [],
    structuredData: []
  };
}

/**
 * Generate SEO configuration for Privacy Policy Page (Indexable)
 */
export function getPrivacyPolicySEOConfig(customOrigin?: string): PageSEOConfig {
  const origin = customOrigin || getSiteOrigin();
  const basePath = getBasePath();
  const canonicalUrl = `${origin}${basePath}/privacy-policy`;

  return {
    name: 'Privacy Policy',
    slug: 'privacy-policy',
    description: 'Official Privacy Policy for ToolStack. Explains client-side privacy architecture, cookies, Google AdSense disclosures, and data rights.',
    category: 'legal',
    keywords: [
      'toolstack privacy policy',
      'privacy policy online tools',
      'client-side data protection',
      'google adsense policy disclosure',
      'cookies policy'
    ],
    canonicalUrl,
    indexable: true,
    h1: 'Privacy Policy',
    seoTitle: 'Privacy Policy – Data Protection & AdSense Compliance | ToolStack',
    seoDescription: 'Review the official ToolStack Privacy Policy. Learn about our 100% client-side privacy architecture, cookie policies, Google AdSense advertising disclosures, and user rights.',
    relatedTools: [],
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'ToolStack Privacy Policy',
        url: canonicalUrl,
        description: 'Privacy Policy explaining data protection, client-side processing, cookies, and advertising disclosures for ToolStack.'
      }
    ]
  };
}

/**
 * Helper to map tool category to Schema.org application category
 */
function getApplicationCategory(category: string): string {
  switch (category) {
    case 'pdf':
    case 'text':
      return 'BusinessApplication';
    case 'developer':
    case 'security':
      return 'DeveloperApplication';
    case 'calculator':
    case 'converter':
      return 'UtilitiesApplication';
    case 'image':
      return 'DesignApplication';
    default:
      return 'UtilitiesApplication';
  }
}
