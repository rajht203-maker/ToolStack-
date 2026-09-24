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

  // 3. Ensure AdSense ads.txt with Publisher ID is synced
  const adsTxt = 'google.com, pub-9951412841260181, DIRECT, f08c47fec0942fa0\n';
  fs.writeFileSync('ads.txt', adsTxt, 'utf-8');
  fs.writeFileSync('public/ads.txt', adsTxt, 'utf-8');
  if (fs.existsSync('dist')) {
    fs.writeFileSync('dist/ads.txt', adsTxt, 'utf-8');
  }
  console.log('✓ ads.txt verified in root, public/, and dist/');
} catch (error) {
  console.error('Failed to generate sitemap or robots:', error);
  process.exit(1);
}
