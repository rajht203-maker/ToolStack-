import { ToolItem } from '../types';
import { CATEGORIES } from '../data/toolsData';
import { getSiteOrigin } from './seoConfig';

export interface ToolSEOContent {
  title: string;
  description: string;
  canonicalUrl: string;
  h1: string;
  explanation: string;
  howToUse: string[];
  faqs: Array<{ question: string; answer: string }>;
  relatedTools: ToolItem[];
  structuredData: Record<string, any>[];
}

/**
 * Clean and format tool title strictly adhering to:
 * max 60 chars, format: "{Tool Name} - Free Online | ToolStack"
 */
export function generateToolTitle(name: string): string {
  const primaryFormat = `${name} - Free Online | ToolStack`;
  if (primaryFormat.length <= 60) {
    return primaryFormat;
  }
  const secondaryFormat = `${name} - Online | ToolStack`;
  if (secondaryFormat.length <= 60) {
    return secondaryFormat;
  }
  const tertiaryFormat = `${name} | ToolStack`;
  if (tertiaryFormat.length <= 60) {
    return tertiaryFormat;
  }
  return `${name.slice(0, 46).trim()}... | ToolStack`;
}

/**
 * Generate unique, high-relevance meta description:
 * max 155 chars, specific to what that tool does
 */
export function generateToolDescription(tool: ToolItem): string {
  const baseDesc = tool.description.trim().replace(/\.$/, '');
  // Craft a high-CTR, actionable description under 155 characters
  let desc = `Free online ${tool.name}. ${baseDesc}. 100% private, client-side in your browser with instant results.`;
  if (desc.length <= 155) {
    return desc;
  }

  desc = `${tool.name}: ${baseDesc}. Fast, free, private online utility with no installation needed.`;
  if (desc.length <= 155) {
    return desc;
  }

  desc = `${tool.name} – ${baseDesc}. Free, private in-browser utility.`;
  if (desc.length <= 155) {
    return desc;
  }

  return `${desc.slice(0, 151).trim()}...`;
}

/**
 * Generate a 2-3 sentence plain-text explanation of what the tool does
 */
export function generateToolExplanation(tool: ToolItem): string {
  const categoryInfo = CATEGORIES.find(c => c.id === tool.category);
  const catName = categoryInfo ? categoryInfo.name : 'utilities';
  const cleanDesc = tool.description.trim().replace(/\.$/, '');

  const sentence1 = `${tool.name} is a free, high-performance web utility built to ${cleanDesc.toLowerCase()}.`;
  const sentence2 = `All processing runs 100% locally in your browser using modern client-side execution, ensuring your files and data remain strictly confidential.`;
  const sentence3 = `There are no file size limits, subscription costs, or software installations required to use this tool on desktop or mobile.`;

  return `${sentence1} ${sentence2} ${sentence3}`;
}

/**
 * Generate 3-4 actionable "How to use" steps
 */
export function generateToolHowToUse(tool: ToolItem): string[] {
  if (tool.howToUse && tool.howToUse.length >= 3 && tool.howToUse.length <= 4) {
    return tool.howToUse;
  }

  const cat = tool.category;
  if (cat === 'pdf') {
    return [
      `Select or drag and drop your PDF documents into the ${tool.name} workspace.`,
      `Adjust your desired document settings, page arrangements, or compression preferences.`,
      `Click the process button to execute the task instantly using your browser's local engine.`,
      `Download your updated, high-fidelity PDF file immediately with zero server latency.`
    ];
  } else if (cat === 'image') {
    return [
      `Upload your image file (PNG, JPG, WebP, SVG, or GIF) or drag it into the drop zone.`,
      `Configure the desired dimensions, quality level, format, or visual options.`,
      `Click process to transform and render your image locally via HTML5 Canvas.`,
      `Save or download your optimized image asset with maximum visual clarity.`
    ];
  } else if (cat === 'calculator' || cat === 'converter') {
    return [
      `Enter your numerical values, parameters, or base figures into the input fields.`,
      `Select your target unit of measurement or calculation criteria from the dropdowns.`,
      `View your instant, high-precision results calculated in real time with formula breakdowns.`,
      `Copy the computed values or summary report directly to your clipboard.`
    ];
  } else if (cat === 'developer' || cat === 'security') {
    return [
      `Paste your code, payload, text, or configuration into the input editor.`,
      `Select formatting rules, target encodings, hash algorithms, or generation parameters.`,
      `Run the tool to validate, transform, format, or cryptographically process your data.`,
      `Copy the verified output or download the resulting configuration file.`
    ];
  }

  return [
    `Open the ${tool.name} tool and enter or upload your input data.`,
    `Adjust the options and preferences according to your specific task requirements.`,
    `Click the action button for instantaneous client-side calculation and processing.`,
    `Copy or download your finalized results directly to your device.`
  ];
}

/**
 * Generate 3 relevant, tool-specific FAQs
 */
export function generateToolFAQs(tool: ToolItem): Array<{ question: string; answer: string }> {
  const cat = tool.category;
  let specificFaq: { question: string; answer: string };

  if (cat === 'pdf') {
    specificFaq = {
      question: `Does ${tool.name} alter or reduce the original quality of my PDF?`,
      answer: `No. ${tool.name} preserves all original vector paths, typography, formatting, and layout integrity while carrying out your requested operations.`
    };
  } else if (cat === 'image') {
    specificFaq = {
      question: `Which image formats are supported by ${tool.name}?`,
      answer: `${tool.name} works seamlessly with major web image formats including PNG, JPEG/JPG, WebP, SVG, GIF, and ICO.`
    };
  } else if (cat === 'calculator' || cat === 'converter') {
    specificFaq = {
      question: `How accurate are the results from ${tool.name}?`,
      answer: `${tool.name} uses verified mathematical algorithms and IEEE-754 high-precision standards to ensure exact, dependable calculations every time.`
    };
  } else {
    specificFaq = {
      question: `What makes ${tool.name} on ToolStack different from other online services?`,
      answer: `Unlike most online tools, ${tool.name} executes entirely inside your browser. No files, calculations, or sensitive inputs are ever uploaded to cloud servers.`
    };
  }

  return [
    {
      question: `Is ${tool.name} completely free to use?`,
      answer: `Yes, ${tool.name} is 100% free with unlimited usage, zero subscriptions, no hidden watermarks, and no sign-up required.`
    },
    {
      question: `Are my files and sensitive data safe when using ${tool.name}?`,
      answer: `Yes, absolutely. ${tool.name} operates with a strict privacy-first architecture where all computation occurs locally on your machine. Your data never touches remote servers.`
    },
    specificFaq
  ];
}

/**
 * Map category to Schema.org applicationCategory
 */
export function getApplicationCategory(category: string): string {
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

/**
 * Build rich JSON-LD structured data for a tool:
 * - SoftwareApplication (with applicationCategory, offers price 0)
 * - FAQPage
 * - BreadcrumbList
 */
export function generateToolStructuredData(
  tool: ToolItem,
  canonicalUrl: string,
  faqs: Array<{ question: string; answer: string }>,
  origin: string = getSiteOrigin()
): Record<string, any>[] {
  const categoryInfo = CATEGORIES.find(c => c.id === tool.category);
  const categoryName = categoryInfo ? categoryInfo.name : tool.category.toUpperCase();

  const softwareAppSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': tool.name,
    'url': canonicalUrl,
    'applicationCategory': getApplicationCategory(tool.category),
    'operatingSystem': 'All (Web Browser, Windows, Mac, Linux, iOS, Android)',
    'browserRequirements': 'Requires modern web browser with JavaScript enabled (Chrome, Safari, Firefox, Edge)',
    'description': generateToolDescription(tool),
    'isAccessibleForFree': true,
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
      'availability': 'https://schema.org/InStock',
      'category': 'Free Online Utility'
    }
  };

  const faqSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(f => ({
      '@type': 'Question',
      'name': f.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': f.answer
      }
    }))
  };

  const breadcrumbSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': `${origin}/`
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': categoryName,
        'item': `${origin}/category/${tool.category}`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': tool.name,
        'item': canonicalUrl
      }
    ]
  };

  return [softwareAppSchema, faqSchema, breadcrumbSchema];
}

/**
 * Get 4 to 6 related tools from the same category
 */
export function getRelatedCategoryTools(tool: ToolItem, allTools: ToolItem[]): ToolItem[] {
  const sameCategory = allTools.filter(t => t.id !== tool.id && t.category === tool.category);
  if (sameCategory.length >= 4) {
    return sameCategory.slice(0, 6);
  }
  // If fewer than 4 in same category, supplement with popular tools
  const others = allTools.filter(t => t.id !== tool.id && t.category !== tool.category);
  return [...sameCategory, ...others].slice(0, 6);
}

/**
 * Complete SEO package for any tool
 */
export function getCompleteToolSEO(tool: ToolItem, allTools: ToolItem[], origin: string = getSiteOrigin()): ToolSEOContent {
  const canonicalUrl = `${origin}/${tool.slug}`;
  const title = generateToolTitle(tool.name);
  const description = generateToolDescription(tool);
  const explanation = generateToolExplanation(tool);
  const howToUse = generateToolHowToUse(tool);
  const faqs = generateToolFAQs(tool);
  const relatedTools = getRelatedCategoryTools(tool, allTools);
  const structuredData = generateToolStructuredData(tool, canonicalUrl, faqs, origin);

  return {
    title,
    description,
    canonicalUrl,
    h1: tool.name,
    explanation,
    howToUse,
    faqs,
    relatedTools,
    structuredData
  };
}
