import fs from 'fs';
import { generateSitemapXML, generateRobotsTxt } from '../src/utils/sitemapGenerator';

const siteUrl = 'https://toolstack-eosin.vercel.app';

try {
  // 1. Generate Sitemap XML
  const sitemap = generateSitemapXML(siteUrl);
  fs.writeFileSync('sitemap.xml', sitemap, 'utf-8');
  fs.writeFileSync('public/sitemap.xml', sitemap, 'utf-8');
  console.log('✓ sitemap.xml generated in root and public/ (' + sitemap.length + ' bytes)');

  // 2. Generate Robots TXT
  const robots = generateRobotsTxt(siteUrl);
  fs.writeFileSync('robots.txt', robots, 'utf-8');
  fs.writeFileSync('public/robots.txt', robots, 'utf-8');
  console.log('✓ robots.txt generated in root and public/ (' + robots.length + ' bytes)');
} catch (error) {
  console.error('Failed to generate sitemap or robots:', error);
  process.exit(1);
}
