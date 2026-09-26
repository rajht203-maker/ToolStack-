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

export const PRIMARY_PRODUCTION_URL = 'https://toolstack-eosin.vercel.app';

/**
 * Get current site base origin
 */
export function getSiteOrigin(): string {
  // If explicitly provided via Vite env
  const envUrl = (import.meta as any).env?.VITE_SITE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.startsWith('http')) {
    return envUrl.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    const hostname = window.location.hostname;
    // If running on production vercel app domain or custom production domain, keep origin
    if (hostname.endsWith('vercel.app') || (!hostname.includes('localhost') && !hostname.includes('127.0.0.1') && !hostname.includes('run.app') && !hostname.includes('github.io'))) {
      return window.location.origin.replace(/\/+$/, '');
    }
    // Sandbox and internal dev environments canonicalize to production URL
    return PRIMARY_PRODUCTION_URL;
  }
  return PRIMARY_PRODUCTION_URL;
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

  // Search-intent optimized title for high Google ranking
  let seoTitle = tool.seoTitle;
  if (!seoTitle || seoTitle.trim().length < 20) {
    if (tool.category === 'calculator') {
      seoTitle = `${tool.name} Online – Free ${categoryName} Calculator | ToolStack`;
    } else if (tool.category === 'pdf') {
      seoTitle = `${tool.name} Online – Free PDF Tool (100% Private) | ToolStack`;
    } else if (tool.category === 'converter') {
      seoTitle = `${tool.name} Online – Free Unit Converter | ToolStack`;
    } else if (tool.category === 'image') {
      seoTitle = `${tool.name} Online – Free Fast Image Utility | ToolStack`;
    } else {
      seoTitle = `${tool.name} Online – Free ${categoryName} Utility | ToolStack`;
    }
  } else if (!seoTitle.includes('ToolStack') && !seoTitle.includes('|')) {
    seoTitle = `${seoTitle} | ToolStack`;
  }

  // Actionable, high-CTR meta description
  let seoDescription = tool.seoDescription;
  if (!seoDescription || seoDescription.trim().length < 50) {
    seoDescription = `${tool.name} – Free online tool. ${tool.description} 100% private in-browser processing with zero server uploads. Fast, secure, and no installation required.`;
  }

  // Clear, intent-focused H1
  const h1 = tool.name;

  // Search keywords targeted for Google queries
  const keywords = Array.from(new Set([
    tool.name.toLowerCase(),
    `${tool.name.toLowerCase()} online`,
    `free ${tool.name.toLowerCase()}`,
    `best ${tool.name.toLowerCase()}`,
    `${tool.name.toLowerCase()} tool`,
    `how to use ${tool.name.toLowerCase()}`,
    `free ${tool.name.toLowerCase()} online`,
    categoryName.toLowerCase(),
    `${categoryName.toLowerCase()} tools online`,
    ...(tool.tags || []).map(t => t.toLowerCase()),
    'free online tools',
    'browser tools',
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

  // 1. WebPage Schema
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': seoTitle,
    'description': seoDescription,
    'url': canonicalUrl,
    'isPartOf': {
      '@type': 'WebSite',
      'name': 'ToolStack',
      'url': `${origin}${getBasePath()}/`
    }
  };
  structuredData.push(webPageSchema);

  // 2. BreadcrumbList
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

  // 3. WebApplication / SoftwareApplication
  const webAppSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': ['WebApplication', 'SoftwareApplication'],
    'name': tool.name,
    'url': canonicalUrl,
    'applicationCategory': getApplicationCategory(tool.category),
    'operatingSystem': 'All (Web Browser, Windows, Mac, Linux, iOS, Android)',
    'browserRequirements': 'Requires modern web browser with JavaScript enabled (Chrome, Safari, Firefox, Edge)',
    'description': seoDescription,
    'isAccessibleForFree': true,
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
      'availability': 'https://schema.org/InStock',
      'category': 'Free Online Utility'
    },
    'featureList': [
      '100% Client-side processing in your browser',
      'Zero server upload for maximum privacy & data confidentiality',
      'Instant document & file generation',
      'No registration, credit card, or watermark required'
    ]
  };
  structuredData.push(webAppSchema);

  // 4. HowTo Schema (Enables rich tutorial cards on Google)
  const stepItems = tool.howToUse && tool.howToUse.length > 0 
    ? tool.howToUse 
    : [
        `Access the free ${tool.name} tool in your browser.`,
        `Upload, paste, or configure your input parameters into the tool workspace.`,
        `Click the process or generate action button for instant computation.`,
        `Save, copy, or download your processed output directly with zero server delay.`
      ];

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': `How to use ${tool.name} Online for Free`,
    'description': `Simple step-by-step instructions on how to use ${tool.name} with instant client-side execution.`,
    'step': stepItems.map((stepText, idx) => ({
      '@type': 'HowToStep',
      'position': idx + 1,
      'name': `Step ${idx + 1}`,
      'text': stepText,
      'url': `${canonicalUrl}#step-${idx + 1}`
    }))
  };
  structuredData.push(howToSchema);

  // 5. FAQPage Schema (Only added when visible FAQs are present, adhering strictly to Google Search guidelines)
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
 * Genuine, visible Frequently Asked Questions on the ToolStack Homepage
 */
export const HOMEPAGE_FAQS = [
  {
    question: 'Are all tools on ToolStack completely free?',
    answer: 'Yes, all 1,200+ utilities on ToolStack are 100% free with unlimited usage, zero subscriptions, and no hidden watermarks.'
  },
  {
    question: 'Are my files or sensitive data uploaded to remote servers?',
    answer: 'No. ToolStack is built with a strict privacy-first architecture. All PDF processing, image compression, math calculations, and cryptographic operations run locally inside your browser using client-side WebAssembly, HTML5 Canvas, and Web Crypto APIs.'
  },
  {
    question: 'Do I need to create an account or install any software?',
    answer: 'No installation or account creation is required to use public tools. Every utility runs instantly inside your web browser across Chrome, Safari, Edge, Firefox, Android, and iOS.'
  },
  {
    question: 'What tool categories are available on ToolStack?',
    answer: 'ToolStack features comprehensive utility suites including PDF Tools, Image Utilities, Developer Helpers, Financial Calculators, Unit Converters, Text Tools, Security Keys, and SEO Utilities.'
  }
];

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
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': HOMEPAGE_FAQS.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
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
    h1: 'ToolStack – 1,200+ Free Online Web Tools & Utilities',
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
