import { CATEGORIES } from '../data/toolsData';
import { getSiteOrigin, getBasePath } from './seoConfig';
import { getIndexableTools } from '../config/indexableTools';
import { getAllBlogArticles } from '../data/blogArticles';

export interface SitemapURLItem {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

/**
 * Generate a curated array of ONLY approved, high-value, indexable URLs for the sitemap.
 * Non-indexable tools are strictly excluded to satisfy Google AdSense "Low value content" criteria.
 */
export function getAllSitemapURLs(customOrigin?: string): SitemapURLItem[] {
  const origin = customOrigin || getSiteOrigin();
  const basePath = getBasePath();
  const today = new Date().toISOString().split('T')[0];

  const urls: SitemapURLItem[] = [];
  const seenLocs = new Set<string>();

  const addUrl = (loc: string, changefreq: SitemapURLItem['changefreq'], priority: string) => {
    // Ensure clean canonical URL with no trailing slash except root
    const cleanLoc = loc.replace(/\/+$/, '') || `${origin}/`;
    const finalLoc = cleanLoc === origin ? `${origin}/` : cleanLoc;
    if (!seenLocs.has(finalLoc)) {
      seenLocs.add(finalLoc);
      urls.push({
        loc: finalLoc,
        lastmod: today,
        changefreq,
        priority
      });
    }
  };

  // 1. Homepage
  addUrl(`${origin}${basePath}/`, 'daily', '1.0');

  // 2. Core Compliance & Company Pages (Required by Google AdSense)
  addUrl(`${origin}${basePath}/about`, 'monthly', '0.8');
  addUrl(`${origin}${basePath}/contact`, 'monthly', '0.8');
  addUrl(`${origin}${basePath}/privacy-policy`, 'monthly', '0.7');
  addUrl(`${origin}${basePath}/terms`, 'monthly', '0.7');
  addUrl(`${origin}${basePath}/disclaimer`, 'monthly', '0.7');

  // 3. Blog Learning Hub
  addUrl(`${origin}${basePath}/blog`, 'daily', '0.9');

  // 4. In-Depth Editorial Blog Articles (10 Masterclasses)
  const articles = getAllBlogArticles();
  for (const article of articles) {
    addUrl(`${origin}${basePath}/blog/${article.slug}`, 'weekly', '0.85');
  }

  // 5. Category Hub Pages
  for (const cat of CATEGORIES) {
    addUrl(`${origin}${basePath}/category/${cat.id}`, 'weekly', '0.8');
  }

  // 6. Top 40 High-Value Indexable Tools (ONLY these are exposed to Google index)
  const indexableTools = getIndexableTools();
  for (const tool of indexableTools) {
    const subpath = tool.category === 'calculator' ? `/calculators/${tool.slug}` : `/tools/${tool.slug}`;
    addUrl(`${origin}${basePath}${subpath}`, 'weekly', '0.9');
  }

  return urls;
}

/**
 * Generate production-standard XML sitemap string
 */
export function generateSitemapXML(customOrigin?: string): string {
  const urls = getAllSitemapURLs(customOrigin);

  const xmlEntries = urls.map(item => `  <url>
    <loc>${escapeXml(item.loc)}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;
}

/**
 * Generate robots.txt content with dynamic origin support (allows all and points to sitemap)
 */
export function generateRobotsTxt(customOrigin?: string): string {
  const origin = customOrigin || getSiteOrigin();
  const basePath = getBasePath();
  const sitemapUrl = `${origin}${basePath}/sitemap.xml`;

  return `# ToolStack Robots.txt - Search Engine Crawling Policy
User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
