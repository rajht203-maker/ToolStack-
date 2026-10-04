import { ToolItem } from '../types';
import { TOOLS_DATA } from '../data/toolsData';

/**
 * ============================================================================
 * INDEXABLE TOOLS CONFIGURATION
 * ============================================================================
 * 
 * To pass Google AdSense "Low value content" review, only high-utility,
 * content-rich tools should be exposed to search engines. All other tools
 * remain 100% active and functional for visitors, but serve:
 *   <meta name="robots" content="noindex, follow" />
 * and are omitted from sitemap.xml.
 * 
 * HOW TO ADD MORE TOOLS TO SEARCH ENGINE INDEX LATER:
 * Simply add the tool's slug or id to the INDEXABLE_TOOL_SLUGS array below.
 * Once added, the tool will automatically:
 *   1. Receive an "index, follow" robots tag.
 *   2. Be included in the auto-generated sitemap.xml.
 *   3. Benefit from comprehensive SEO structured data.
 */

export const INDEXABLE_TOOL_SLUGS: string[] = [
  // --- 1. Document & PDF Power Utilities (10) ---
  'pdf-merge',
  'pdf-split',
  'pdf-compress',
  'pdf-to-jpg',
  'jpg-to-pdf',
  'pdf-protect-password',
  'pdf-page-rotator',
  'pdf-page-numberer',
  'pdf-watermark-stamper',
  'pdf-grayscale-converter',

  // --- 2. Image Optimization & Graphics (10) ---
  'image-compressor',
  'image-resizer',
  'image-format-converter',
  'favicon-generator',
  'qr-generator',
  'qr-code-logo-generator',
  'svg-optimizer',
  'image-aspect-ratio-cropper',
  'image-filter-studio',
  'image-svg-data-url-converter',

  // --- 3. Text, Writing & Content Utilities (6) ---
  'word-counter',
  'case-converter',
  'lorem-ipsum',
  'diff-checker',
  'markdown-previewer',
  'slug-generator',

  // --- 4. Developer & Data Converters (6) ---
  'json-formatter',
  'base64-encoder',
  'url-encoder',
  'uuid-generator',
  'csv-to-json',
  'timestamp-converter',

  // --- 5. Financial, Math & Health Calculators (7) ---
  'emi-calculator',
  'percentage-calculator',
  'age-calculator',
  'bmi-calculator',
  'discount-calculator',
  'compound-interest',
  'unit-converter',

  // --- 6. Security & Privacy Utility (1) ---
  'password-generator'
];

/**
 * Check whether a given tool slug or ID is approved for search engine indexing
 */
export function isToolIndexable(slugOrId: string): boolean {
  if (!slugOrId) return false;
  const normalized = slugOrId.toLowerCase().trim();
  return INDEXABLE_TOOL_SLUGS.includes(normalized);
}

/**
 * Retrieve all ToolItem objects that are currently indexable
 */
export function getIndexableTools(allTools: ToolItem[] = TOOLS_DATA): ToolItem[] {
  const indexableSet = new Set(INDEXABLE_TOOL_SLUGS);
  return allTools.filter(t => indexableSet.has(t.slug) || indexableSet.has(t.id));
}
