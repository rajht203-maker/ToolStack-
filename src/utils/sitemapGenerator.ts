import { TOOLS_DATA, CATEGORIES } from '../data/toolsData';
import { getSiteOrigin, getBasePath } from './seoConfig';

export interface SitemapURLItem {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

/**
 * Generate a complete array of all public, indexable URLs for the sitemap
 */
export function getAllSitemapURLs(customOrigin?: string): SitemapURLItem[] {
  const origin = customOrigin || getSiteOrigin();
  const basePath = getBasePath();
  const today = new Date().toISOString().split('T')[0];

  const urls: SitemapURLItem[] = [];

  // 1. Homepage
  urls.push({
    loc: `${origin}${basePath}/`,
    lastmod: today,
    changefreq: 'daily',
    priority: '1.0'
  });

  // 2. Legal / Compliance Pages (Privacy Policy)
  urls.push({
    loc: `${origin}${basePath}/privacy-policy`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.7'
  });

  // 3. Category Pages
  for (const cat of CATEGORIES) {
    urls.push({
      loc: `${origin}${basePath}/category/${cat.id}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8'
    });
  }

  // 3. Individual Tool Pages (All 1,200+ public tools)
  for (const tool of TOOLS_DATA) {
    const subpath = tool.category === 'calculator' 
      ? `/calculators/${tool.slug}` 
      : `/tools/${tool.slug}`;

    // Popular/Trending tools get higher priority in Google crawl budget
    const isHighPriority = tool.popular || tool.trending || tool.badge === 'Popular';
    const priority = isHighPriority ? '0.9' : '0.8';

    urls.push({
      loc: `${origin}${basePath}${subpath}`,
      lastmod: today,
      changefreq: 'weekly',
      priority
    });
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
 * Generate robots.txt content with dynamic origin support
 */
export function generateRobotsTxt(customOrigin?: string): string {
  const origin = customOrigin || getSiteOrigin();
  const basePath = getBasePath();
  const sitemapUrl = `${origin}${basePath}/sitemap.xml`;

  return `# ToolStack Robots.txt - Search Engine Crawling Policy
# Allow all standard search engine crawlers access to public tools & utilities
User-agent: *
Allow: /
Allow: /tools/
Allow: /calculators/
Allow: /category/

# Disallow administrative, authentication, and private endpoints
Disallow: /admin/
Disallow: /admin
Disallow: /dashboard/
Disallow: /login/
Disallow: /api/

# Sitemap location
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
