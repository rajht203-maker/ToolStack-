import fs from 'fs';
import path from 'path';
import { INDEXABLE_TOOL_SLUGS } from '../src/config/indexableTools';
import { TOP_40_TOOL_CONTENT } from '../src/data/top40ToolContent';
import { TOOLS_DATA, CATEGORIES } from '../src/data/toolsData';
import { BLOG_ARTICLES } from '../src/data/blogArticles';
import { HOMEPAGE_FAQS } from '../src/utils/seoConfig';

const siteUrl = 'https://toolstack-eosin.vercel.app';
const distDir = path.resolve('dist');

if (!fs.existsSync(distDir)) {
  console.log('Dist directory does not exist yet. Run vite build first.');
  process.exit(0);
}

const templatePath = path.join(distDir, 'index.html');
if (!fs.existsSync(templatePath)) {
  console.log('dist/index.html not found. Skipping prerender.');
  process.exit(0);
}

const baseHtml = fs.readFileSync(templatePath, 'utf-8');

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#039;';
      default: return m;
    }
  });
}

function writeStaticPage(
  subpath: string, 
  title: string, 
  description: string, 
  canonicalUrl: string, 
  bodyContent: string, 
  jsonLd?: any[]
) {
  const targetDir = path.join(distDir, subpath);
  fs.mkdirSync(targetDir, { recursive: true });

  let pageHtml = baseHtml;

  // Replace title tag
  pageHtml = pageHtml.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  // Replace existing description, og:title, og:description, twitter:title, twitter:description
  pageHtml = pageHtml.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${escapeHtml(description)}" />`);
  pageHtml = pageHtml.replace(/<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  pageHtml = pageHtml.replace(/<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  pageHtml = pageHtml.replace(/<meta\s+name=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${escapeHtml(title)}" />`);
  pageHtml = pageHtml.replace(/<meta\s+name=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);

  // Inject canonical & robots meta tags
  const canonicalTag = `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`;
  const robotsTag = `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`;

  let headInjections = `${canonicalTag}\n    ${robotsTag}`;

  if (jsonLd && jsonLd.length > 0) {
    for (const schema of jsonLd) {
      headInjections += `\n    <script type="application/ld+json">${JSON.stringify(schema)}</script>`;
    }
  }

  // Ensure clean head injection
  if (pageHtml.includes('</head>')) {
    pageHtml = pageHtml.replace('</head>', `    ${headInjections}\n  </head>`);
  }

  // Pre-render content inside <div id="root">
  pageHtml = pageHtml.replace(
    '<div id="root"></div>',
    `<div id="root">${bodyContent}</div>`
  );

  const outFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(outFile, pageHtml, 'utf-8');
}

// Global Nav Header HTML
function renderGlobalHeader(): string {
  return `
  <header style="border-bottom: 1px solid #e2e8f0; background: #ffffff; padding: 12px 24px; position: sticky; top: 0; z-index: 50;">
    <div style="max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
      <a href="/" style="display: flex; align-items: center; gap: 10px; text-decoration: none; color: #0f172a;">
        <div style="width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(135deg, #4f46e5, #7c3aed); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 900; font-size: 18px;">T</div>
        <span style="font-weight: 900; font-size: 19px; letter-spacing: -0.5px;">Tool<span style="color: #4f46e5;">Stack</span></span>
      </a>
      <nav style="display: flex; align-items: center; gap: 18px; font-size: 13px; font-weight: 600;">
        <a href="/" style="color: #475569; text-decoration: none;">Home</a>
        <a href="/category/pdf" style="color: #475569; text-decoration: none;">PDF Tools</a>
        <a href="/category/image" style="color: #475569; text-decoration: none;">Image Tools</a>
        <a href="/category/calculator" style="color: #475569; text-decoration: none;">Calculators</a>
        <a href="/blog" style="color: #475569; text-decoration: none;">Blog</a>
        <a href="/about" style="color: #475569; text-decoration: none;">About</a>
        <a href="/contact" style="color: #475569; text-decoration: none;">Contact</a>
      </nav>
    </div>
  </header>`;
}

// Global Footer HTML
function renderGlobalFooter(): string {
  return `
  <footer style="background: #0f172a; color: #94a3b8; padding: 48px 24px 32px; border-top: 1px solid #1e293b; margin-top: 64px;">
    <div style="max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 32px; margin-bottom: 40px;">
      <div>
        <div style="display: flex; align-items: center; gap: 10px; color: #ffffff; font-weight: 900; font-size: 20px; margin-bottom: 12px;">
          <div style="width: 28px; height: 28px; border-radius: 8px; background: #4f46e5; display: flex; align-items: center; justify-content: center; font-size: 15px;">T</div>
          <span>ToolStack</span>
        </div>
        <p style="font-size: 13px; line-height: 1.6; color: #94a3b8;">
          Free, fast, and 100% private online utilities for PDF merging, image compression, developer formatting, and financial calculations. All processing runs locally inside your browser.
        </p>
      </div>

      <div>
        <h4 style="color: #ffffff; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px;">Popular Utilities</h4>
        <ul style="list-style: none; padding: 0; margin: 0; font-size: 13px; line-height: 2;">
          <li><a href="/tools/pdf-merge" style="color: #94a3b8; text-decoration: none;">Merge PDF Documents</a></li>
          <li><a href="/tools/pdf-compress" style="color: #94a3b8; text-decoration: none;">Compress PDF Files</a></li>
          <li><a href="/tools/image-compressor" style="color: #94a3b8; text-decoration: none;">Lossless Image Compressor</a></li>
          <li><a href="/calculators/loan-emi" style="color: #94a3b8; text-decoration: none;">Loan EMI Calculator</a></li>
          <li><a href="/tools/json-formatter" style="color: #94a3b8; text-decoration: none;">JSON Validator &amp; Formatter</a></li>
          <li><a href="/tools/word-counter" style="color: #94a3b8; text-decoration: none;">Word &amp; Character Counter</a></li>
        </ul>
      </div>

      <div>
        <h4 style="color: #ffffff; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px;">Tool Categories</h4>
        <ul style="list-style: none; padding: 0; margin: 0; font-size: 13px; line-height: 2;">
          <li><a href="/category/pdf" style="color: #94a3b8; text-decoration: none;">PDF Documents</a></li>
          <li><a href="/category/image" style="color: #94a3b8; text-decoration: none;">Image Utilities</a></li>
          <li><a href="/category/developer" style="color: #94a3b8; text-decoration: none;">Developer Tools</a></li>
          <li><a href="/category/text" style="color: #94a3b8; text-decoration: none;">Text &amp; Writing</a></li>
          <li><a href="/category/calculator" style="color: #94a3b8; text-decoration: none;">Calculators</a></li>
          <li><a href="/category/converter" style="color: #94a3b8; text-decoration: none;">Unit Converters</a></li>
        </ul>
      </div>

      <div>
        <h4 style="color: #ffffff; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px;">Company &amp; Compliance</h4>
        <ul style="list-style: none; padding: 0; margin: 0; font-size: 13px; line-height: 2;">
          <li><a href="/about" style="color: #94a3b8; text-decoration: none;">About ToolStack</a></li>
          <li><a href="/contact" style="color: #94a3b8; text-decoration: none;">Contact Us &amp; Support</a></li>
          <li><a href="/blog" style="color: #94a3b8; text-decoration: none;">Learning Hub &amp; Blog</a></li>
          <li><a href="/privacy-policy" style="color: #94a3b8; text-decoration: none; font-weight: 600;">Privacy Policy</a></li>
          <li><a href="/terms" style="color: #94a3b8; text-decoration: none;">Terms &amp; Conditions</a></li>
          <li><a href="/disclaimer" style="color: #94a3b8; text-decoration: none;">Legal Disclaimer</a></li>
        </ul>
      </div>
    </div>

    <div style="max-width: 1280px; margin: 0 auto; border-top: 1px solid #1e293b; padding-top: 24px; font-size: 12px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px;">
      <p style="margin: 0;">&copy; ${new Date().getFullYear()} ToolStack. All rights reserved. 100% In-Browser Execution.</p>
      <div style="display: flex; gap: 16px;">
        <a href="/privacy-policy" style="color: #94a3b8; text-decoration: none;">Privacy</a>
        <a href="/terms" style="color: #94a3b8; text-decoration: none;">Terms</a>
        <a href="/disclaimer" style="color: #94a3b8; text-decoration: none;">Disclaimer</a>
        <a href="/contact" style="color: #94a3b8; text-decoration: none;">Contact</a>
      </div>
    </div>
  </footer>`;
}

console.log('Generating pre-rendered static HTML for all indexable pages...');

// ============================================================================
// 1. HOMEPAGE STATIC PRE-RENDERING
// ============================================================================
console.log('-> Pre-rendering Homepage (dist/index.html)...');
const indexableTools = INDEXABLE_TOOL_SLUGS.map(slug => TOOLS_DATA.find(t => t.slug === slug || t.id === slug)).filter(Boolean) as any[];

let homeToolCardsHtml = '';
for (const tool of indexableTools) {
  const toolUrl = tool.category === 'calculator' ? `/calculators/${tool.slug}` : `/tools/${tool.slug}`;
  homeToolCardsHtml += `
    <article style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-col; justify-content: space-between;">
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; background: #e0e7ff; color: #4338ca; padding: 3px 10px; border-radius: 9999px;">${escapeHtml(tool.category)}</span>
          <span style="font-size: 11px; color: #10b981; font-weight: 700;">Client-Side</span>
        </div>
        <h3 style="font-size: 17px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0;">
          <a href="${toolUrl}" style="color: inherit; text-decoration: none;">${escapeHtml(tool.name)}</a>
        </h3>
        <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0 0 16px 0;">
          ${escapeHtml(tool.description)}
        </p>
      </div>
      <div>
        <a href="${toolUrl}" style="display: inline-block; width: 100%; text-align: center; background: #f8fafc; border: 1px solid #cbd5e1; color: #334155; font-size: 13px; font-weight: 700; padding: 9px 16px; border-radius: 10px; text-decoration: none;">
          Open ${escapeHtml(tool.name)} &rarr;
        </a>
      </div>
    </article>`;
}

let homeCategoriesHtml = '';
for (const cat of CATEGORIES) {
  homeCategoriesHtml += `
    <a href="/category/${cat.id}" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; text-decoration: none; color: #0f172a; display: block; box-shadow: 0 1px 2px rgba(0,0,0,0.04);">
      <h3 style="font-size: 15px; font-weight: 800; margin: 0 0 4px 0;">${escapeHtml(cat.name)}</h3>
      <p style="font-size: 12px; color: #64748b; margin: 0; line-height: 1.4;">${escapeHtml(cat.description)}</p>
    </a>`;
}

let homeFaqsHtml = '';
for (const faq of HOMEPAGE_FAQS) {
  homeFaqsHtml += `
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 22px; box-shadow: 0 1px 2px rgba(0,0,0,0.04);">
      <h3 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0;">${escapeHtml(faq.question)}</h3>
      <p style="font-size: 13px; color: #475569; line-height: 1.6; margin: 0;">${escapeHtml(faq.answer)}</p>
    </div>`;
}

const homepageBody = `
  ${renderGlobalHeader()}
  <main style="max-width: 1280px; margin: 0 auto; padding: 40px 24px; font-family: system-ui, -apple-system, sans-serif;">
    <!-- Hero Section -->
    <section style="text-align: center; margin-bottom: 48px;">
      <div style="display: inline-block; background: #e0e7ff; color: #4338ca; font-size: 12px; font-weight: 800; padding: 6px 16px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">
        Free Web Utilities • 100% In-Browser Execution
      </div>
      <h1 style="font-size: clamp(32px, 5vw, 54px); font-weight: 900; letter-spacing: -1px; color: #0f172a; margin: 0 0 16px 0; line-height: 1.15;">
        ToolStack – Free Online PDF, Image, Text &amp; Calculator Tools
      </h1>
      <p style="font-size: 17px; color: #64748b; max-width: 760px; margin: 0 auto 32px auto; line-height: 1.6;">
        Fast, 100% private in-browser utilities. Merge PDFs, compress images, calculate loan EMIs, format JSON, generate QR codes, and convert files with zero server uploads.
      </p>

      <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; font-size: 13px; margin-bottom: 24px;">
        <span style="color: #94a3b8; font-weight: 600; padding: 6px 0;">Popular:</span>
        <a href="/tools/pdf-merge" style="background: #f1f5f9; color: #334155; padding: 6px 14px; border-radius: 9999px; text-decoration: none; font-weight: 600;">PDF Merge</a>
        <a href="/tools/pdf-compress" style="background: #f1f5f9; color: #334155; padding: 6px 14px; border-radius: 9999px; text-decoration: none; font-weight: 600;">PDF Compress</a>
        <a href="/tools/image-compressor" style="background: #f1f5f9; color: #334155; padding: 6px 14px; border-radius: 9999px; text-decoration: none; font-weight: 600;">Image Compressor</a>
        <a href="/calculators/loan-emi" style="background: #f1f5f9; color: #334155; padding: 6px 14px; border-radius: 9999px; text-decoration: none; font-weight: 600;">Loan EMI Calculator</a>
        <a href="/tools/json-formatter" style="background: #f1f5f9; color: #334155; padding: 6px 14px; border-radius: 9999px; text-decoration: none; font-weight: 600;">JSON Formatter</a>
        <a href="/tools/word-counter" style="background: #f1f5f9; color: #334155; padding: 6px 14px; border-radius: 9999px; text-decoration: none; font-weight: 600;">Word Counter</a>
      </div>
    </section>

    <!-- Top 40 Popular Online Tools Section -->
    <section style="margin-bottom: 56px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px;">
        <div>
          <h2 style="font-size: 26px; font-weight: 900; color: #0f172a; margin: 0 0 4px 0;">Top 40 Popular Online Tools</h2>
          <p style="font-size: 14px; color: #64748b; margin: 0;">Featured high-speed in-browser utilities with zero setup required.</p>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
        ${homeToolCardsHtml}
      </div>
    </section>

    <!-- Editorial Explainer Section (350+ words for AdSense & Google Indexation) -->
    <section style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 36px; box-shadow: 0 2px 4px rgba(0,0,0,0.04); margin-bottom: 56px;">
      <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 28px;">
        <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #4f46e5; letter-spacing: 0.5px;">Comprehensive Utility Platform</span>
        <h2 style="font-size: 28px; font-weight: 900; color: #0f172a; margin: 6px 0 12px 0;">
          About ToolStack – Free Online PDF, Image, Text &amp; Calculator Tools
        </h2>
        <p style="font-size: 15px; color: #475569; line-height: 1.7; margin: 0;">
          ToolStack is an all-in-one suite of modern, high-performance web utilities built for professionals, students, creators, and everyday internet users. Designed with a strict client-side first architecture, ToolStack empowers you to merge PDFs, compress high-resolution images, format complex JSON code, calculate loan EMIs, convert units, and generate secure passwords without installation, watermarks, or account registration.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 28px;">
        <div>
          <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0;">100% Client-Side &amp; Private</h3>
          <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin: 0;">
            Traditional online converters upload your confidential contracts, medical scans, spreadsheets, and private images to remote third-party cloud servers. ToolStack takes a radically different approach: every calculation and document conversion takes place 100% inside your web browser using HTML5 Canvas, WebAssembly, and local JavaScript memory. Your files never leave your computer or phone.
          </p>
        </div>

        <div>
          <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0;">Six Essential Tool Suites</h3>
          <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin: 0;">
            Our suite covers essential digital tasks: PDF tools (merge, split, compress, watermark, rotate), Image tools (lossless compression, format converter, resizer, crop), Developer tools (JSON validator, Base64 encoder, UUID generator, diff checker), Text tools (word counter, case converter, slug generator), and Financial calculators (Loan EMI, Compound Interest, GST, BMI).
          </p>
        </div>

        <div>
          <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0;">Instant Execution in 3 Steps</h3>
          <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin: 0;">
            Using ToolStack is effortless: (1) Pick your desired utility from the top tools list or category directory, (2) Drag and drop your file or enter your data into the workspace, and (3) Click process to receive your output instantly. There are no wait times, queue delays, file size paywalls, or forced email signups.
          </p>
        </div>
      </div>
    </section>

    <!-- Tool Categories Section -->
    <section style="margin-bottom: 56px;">
      <h2 style="font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 16px 0;">Explore All Tool Categories</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px;">
        ${homeCategoriesHtml}
      </div>
    </section>

    <!-- Homepage FAQs -->
    <section style="margin-bottom: 40px;">
      <h2 style="font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 20px 0;">Frequently Asked Questions</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
        ${homeFaqsHtml}
      </div>
    </section>
  </main>
  ${renderGlobalFooter()}
`;

const homeJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ToolStack',
    url: `${siteUrl}/`,
    description: 'Free online tools for PDF merging, image compression, text manipulation, code formatting, and financial calculations. 100% private, client-side, zero signup.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/?tool={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ToolStack',
    url: `${siteUrl}/`,
    logo: `${siteUrl}/icon.svg`
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOMEPAGE_FAQS.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
];

writeStaticPage(
  '',
  'ToolStack - Free Online PDF, Image, Text & Calculator Tools',
  'Free online tools for PDF merging, image compression, text manipulation, code formatting, and financial calculations. 100% private, client-side, zero signup.',
  `${siteUrl}/`,
  homepageBody,
  homeJsonLd
);

// ============================================================================
// 2. TOP 40 INDEXABLE TOOL PAGES (PRE-RENDERED TO /tools/ AND /calculators/)
// ============================================================================
console.log('-> Pre-rendering Top 40 Tool Pages...');
for (const slug of INDEXABLE_TOOL_SLUGS) {
  const tool = TOOLS_DATA.find(t => t.slug === slug || t.id === slug);
  const content = TOP_40_TOOL_CONTENT[slug];
  if (!tool || !content) continue;

  const canonicalSubpath = tool.category === 'calculator' ? `calculators/${tool.slug}` : `tools/${tool.slug}`;
  const canonicalUrl = `${siteUrl}/${canonicalSubpath}`;
  const toolTitle = `${tool.name} – Free Online ${tool.category === 'calculator' ? 'Calculator' : 'Tool'} | ToolStack`;
  const toolDesc = `Free online ${tool.name}. ${tool.description} 100% private in-browser processing with zero server uploads.`;

  const relatedToolsHtml = (tool.relatedToolIds || []).slice(0, 4).map(relId => {
    const rel = TOOLS_DATA.find(t => t.id === relId || t.slug === relId);
    if (!rel) return '';
    const relUrl = rel.category === 'calculator' ? `/calculators/${rel.slug}` : `/tools/${rel.slug}`;
    return `<a href="${relUrl}" style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 12px; text-decoration: none; color: #0f172a; display: block;">
      <strong style="display: block; font-size: 14px; margin-bottom: 4px;">${escapeHtml(rel.name)}</strong>
      <span style="font-size: 12px; color: #64748b;">${escapeHtml(rel.description)}</span>
    </a>`;
  }).filter(Boolean).join('');

  const toolBody = `
    ${renderGlobalHeader()}
    <main style="max-width: 960px; margin: 0 auto; padding: 36px 20px; font-family: system-ui, -apple-system, sans-serif;">
      <!-- Breadcrumbs -->
      <nav aria-label="Breadcrumb" style="font-size: 12px; color: #64748b; margin-bottom: 20px;">
        <a href="/" style="color: #64748b; text-decoration: none;">Home</a> &gt; 
        <a href="/category/${tool.category}" style="color: #64748b; text-decoration: none; text-transform: capitalize;">${escapeHtml(tool.category)}</a> &gt; 
        <span style="color: #0f172a; font-weight: 700;">${escapeHtml(tool.name)}</span>
      </nav>

      <!-- Tool Header -->
      <header style="margin-bottom: 28px;">
        <div style="display: inline-block; background: #e0e7ff; color: #4338ca; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; margin-bottom: 12px;">
          ${escapeHtml(tool.category)} Utility • 100% Client-Side Privacy
        </div>
        <h1 style="font-size: clamp(28px, 4vw, 42px); font-weight: 900; color: #0f172a; margin: 0 0 12px 0;">
          ${escapeHtml(tool.name)}
        </h1>
        <p style="font-size: 16px; color: #475569; line-height: 1.6; margin: 0;">
          ${escapeHtml(tool.description)}
        </p>
      </header>

      <!-- Interactive Tool Workspace Placeholder -->
      <section style="background: #ffffff; border: 2px dashed #cbd5e1; border-radius: 20px; padding: 40px 24px; text-align: center; margin-bottom: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.03);">
        <div style="max-width: 500px; margin: 0 auto;">
          <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0;">Start using ${escapeHtml(tool.name)}</h2>
          <p style="font-size: 13px; color: #64748b; margin-bottom: 20px;">
            Fast, secure, and private. Drag and drop your file or enter input below to begin processing instantly in your browser.
          </p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px; font-size: 14px; color: #475569;">
            Interactive tool workspace loading... If JavaScript is disabled, please enable it to use live file manipulation.
          </div>
        </div>
      </section>

      <!-- In-Depth Unique Content (400+ Words Handcrafted) -->
      <article style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 36px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); margin-bottom: 36px; line-height: 1.7;">
        <section style="margin-bottom: 32px;">
          <h2 style="font-size: 22px; font-weight: 900; color: #0f172a; margin: 0 0 12px 0;">About ${escapeHtml(tool.name)}</h2>
          <p style="font-size: 14px; color: #475569; margin-bottom: 16px;">
            ${escapeHtml(content.inDepthOverview)}
          </p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; font-size: 13px; color: #166534;">
            <strong>Who It Helps:</strong> ${escapeHtml(content.targetAudience)}
          </div>
        </section>

        <section style="margin-bottom: 32px; border-top: 1px solid #f1f5f9; padding-top: 24px;">
          <h2 style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 0 0 14px 0;">How to Use ${escapeHtml(tool.name)} (Step-by-Step)</h2>
          <ol style="margin: 0; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.8;">
            ${content.stepByStepGuide.map(step => `<li>${escapeHtml(step)}</li>`).join('')}
          </ol>
        </section>

        <section style="margin-bottom: 32px; border-top: 1px solid #f1f5f9; padding-top: 24px;">
          <h2 style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 0 0 14px 0;">Key Benefits &amp; Features</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
            ${content.keyBenefits.map(b => `
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
                <strong style="display: block; font-size: 14px; color: #0f172a; margin-bottom: 4px;">${escapeHtml(b.title)}</strong>
                <span style="font-size: 13px; color: #64748b;">${escapeHtml(b.description)}</span>
              </div>
            `).join('')}
          </div>
        </section>

        <section style="margin-bottom: 32px; border-top: 1px solid #f1f5f9; padding-top: 24px;">
          <h2 style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 0 0 14px 0;">Common Use Cases &amp; Practical Tips</h2>
          <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.8;">
            ${content.useCases.map(u => `<li><strong>${escapeHtml(u.title)}:</strong> ${escapeHtml(u.description)}</li>`).join('')}
          </ul>
        </section>

        <section style="border-top: 1px solid #f1f5f9; padding-top: 24px;">
          <h2 style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 0 0 16px 0;">Frequently Asked Questions</h2>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${content.faqs.map(f => `
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px;">
                <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0;">${escapeHtml(f.question)}</h3>
                <p style="font-size: 13px; color: #475569; margin: 0; line-height: 1.6;">${escapeHtml(f.answer)}</p>
              </div>
            `).join('')}
          </div>
        </section>
      </article>

      ${relatedToolsHtml ? `
      <!-- Related Tools Section -->
      <section style="margin-bottom: 32px;">
        <h2 style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 0 0 16px 0;">Related Utilities</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
          ${relatedToolsHtml}
        </div>
      </section>` : ''}
    </main>
    ${renderGlobalFooter()}
  `;

  const toolJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: tool.name,
      operatingSystem: 'All (Web Browser)',
      applicationCategory: 'UtilitiesApplication',
      description: toolDesc,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${siteUrl}/`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: tool.category,
          item: `${siteUrl}/category/${tool.category}`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: tool.name,
          item: canonicalUrl
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: content.faqs.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer
        }
      }))
    }
  ];

  // 1. Canonical subpath (e.g. tools/pdf-merge or calculators/loan-emi)
  writeStaticPage(canonicalSubpath, toolTitle, toolDesc, canonicalUrl, toolBody, toolJsonLd);

  // 2. Also write direct slug for backwards compatibility (e.g. /pdf-merge)
  writeStaticPage(tool.slug, toolTitle, toolDesc, canonicalUrl, toolBody, toolJsonLd);

  // 3. If category is calculator, also write tools/slug; if tools, also write calculators/slug if needed
  if (tool.category === 'calculator') {
    writeStaticPage(`tools/${tool.slug}`, toolTitle, toolDesc, canonicalUrl, toolBody, toolJsonLd);
  }

  // Support loan-emi alias for emi-calculator
  if (tool.slug === 'emi-calculator') {
    writeStaticPage('calculators/loan-emi', toolTitle, toolDesc, canonicalUrl, toolBody, toolJsonLd);
    writeStaticPage('tools/loan-emi', toolTitle, toolDesc, canonicalUrl, toolBody, toolJsonLd);
    writeStaticPage('loan-emi', toolTitle, toolDesc, canonicalUrl, toolBody, toolJsonLd);
  }
}

// ============================================================================
// 3. CATEGORY HUB PAGES
// ============================================================================
console.log('-> Pre-rendering Category Hub Pages...');
for (const cat of CATEGORIES) {
  const catTools = TOOLS_DATA.filter(t => t.category === cat.id);
  const catUrl = `${siteUrl}/category/${cat.id}`;
  const catTitle = `${cat.name} Online Tools – Free & In-Browser | ToolStack`;
  const catDesc = `Explore free online ${cat.name} utilities on ToolStack. Fast, watermark-free, and 100% private in-browser processing.`;

  let catCardsHtml = '';
  for (const t of catTools) {
    const tUrl = t.category === 'calculator' ? `/calculators/${t.slug}` : `/tools/${t.slug}`;
    catCardsHtml += `
      <article style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px; box-shadow: 0 1px 2px rgba(0,0,0,0.04);">
        <h3 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0;">
          <a href="${tUrl}" style="color: inherit; text-decoration: none;">${escapeHtml(t.name)}</a>
        </h3>
        <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0 0 12px 0;">${escapeHtml(t.description)}</p>
        <a href="${tUrl}" style="color: #4f46e5; font-size: 12px; font-weight: 700; text-decoration: none;">Open Tool &rarr;</a>
      </article>`;
  }

  const catBody = `
    ${renderGlobalHeader()}
    <main style="max-width: 1280px; margin: 0 auto; padding: 40px 24px; font-family: system-ui, -apple-system, sans-serif;">
      <nav aria-label="Breadcrumb" style="font-size: 12px; color: #64748b; margin-bottom: 20px;">
        <a href="/" style="color: #64748b; text-decoration: none;">Home</a> &gt; 
        <span style="color: #0f172a; font-weight: 700;">${escapeHtml(cat.name)}</span>
      </nav>

      <header style="margin-bottom: 36px;">
        <h1 style="font-size: 36px; font-weight: 900; color: #0f172a; margin: 0 0 12px 0;">${escapeHtml(cat.name)} Tools &amp; Utilities</h1>
        <p style="font-size: 16px; color: #64748b; max-width: 800px; margin: 0; line-height: 1.6;">
          ${escapeHtml(cat.description)} All processing occurs locally on your machine for zero data exposure.
        </p>
      </header>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px;">
        ${catCardsHtml}
      </div>
    </main>
    ${renderGlobalFooter()}
  `;

  const catJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${cat.name} Online Tools`,
      url: catUrl,
      description: catDesc
    }
  ];

  writeStaticPage(`category/${cat.id}`, catTitle, catDesc, catUrl, catBody, catJsonLd);
}

// ============================================================================
// 4. BLOG HUB & 10 MASTERCLASS ARTICLES (800+ WORDS EACH)
// ============================================================================
console.log('-> Pre-rendering Blog Index & 10 Masterclass Articles...');
let blogListHtml = '';
for (const a of BLOG_ARTICLES) {
  blogListHtml += `
    <article style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); margin-bottom: 24px;">
      <div style="display: flex; gap: 12px; align-items: center; font-size: 12px; color: #4f46e5; font-weight: 700; margin-bottom: 8px;">
        <span style="text-transform: uppercase;">${escapeHtml(a.category)}</span>
        <span>•</span>
        <span style="color: #64748b;">${escapeHtml(a.readTime)}</span>
        <span>•</span>
        <span style="color: #64748b;">${escapeHtml(a.publishedDate)}</span>
      </div>
      <h2 style="font-size: 22px; font-weight: 900; color: #0f172a; margin: 0 0 10px 0;">
        <a href="/blog/${a.slug}" style="color: inherit; text-decoration: none;">${escapeHtml(a.title)}</a>
      </h2>
      <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 0 0 14px 0;">${escapeHtml(a.excerpt)}</p>
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
        <span style="color: #475569;">By <strong>${escapeHtml(a.author.name)}</strong></span>
        <a href="/blog/${a.slug}" style="color: #4f46e5; font-weight: 700; text-decoration: none;">Read Masterclass &rarr;</a>
      </div>
    </article>`;
}

const blogIndexBody = `
  ${renderGlobalHeader()}
  <main style="max-width: 960px; margin: 0 auto; padding: 40px 20px; font-family: system-ui, -apple-system, sans-serif;">
    <nav aria-label="Breadcrumb" style="font-size: 12px; color: #64748b; margin-bottom: 20px;">
      <a href="/" style="color: #64748b; text-decoration: none;">Home</a> &gt; 
      <span style="color: #0f172a; font-weight: 700;">Blog</span>
    </nav>
    <header style="margin-bottom: 36px;">
      <h1 style="font-size: 38px; font-weight: 900; color: #0f172a; margin: 0 0 12px 0;">ToolStack Blog &amp; Knowledge Base</h1>
      <p style="font-size: 16px; color: #64748b; margin: 0;">Comprehensive tutorials, performance analyses, and guides on PDF manipulation, image optimization, developer tooling, and client-side web technology.</p>
    </header>
    <div>
      ${blogListHtml}
    </div>
  </main>
  ${renderGlobalFooter()}
`;

writeStaticPage(
  'blog',
  'ToolStack Blog – In-Depth Technical Guides & Tutorials',
  'Explore comprehensive guides on PDF optimization, lossless image compression, secure client-side cryptography, and financial calculators.',
  `${siteUrl}/blog`,
  blogIndexBody
);

// Individual 10 Blog Posts
for (const a of BLOG_ARTICLES) {
  let articleSectionsHtml = '';
  for (const s of a.sections) {
    articleSectionsHtml += `
      <section style="margin-bottom: 32px;">
        <h2 style="font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 10px 0;">${escapeHtml(s.heading)}</h2>
        ${s.subheading ? `<h3 style="font-size: 16px; font-weight: 700; color: #4f46e5; margin: 0 0 12px 0;">${escapeHtml(s.subheading)}</h3>` : ''}
        ${s.content.map(p => `<p style="font-size: 15px; color: #334155; line-height: 1.75; margin-bottom: 14px;">${escapeHtml(p)}</p>`).join('')}
      </section>`;
  }

  let articleFaqsHtml = '';
  if (a.faqs && a.faqs.length > 0) {
    articleFaqsHtml = `
      <section style="border-top: 1px solid #f1f5f9; padding-top: 32px; margin-top: 32px;">
        <h2 style="font-size: 22px; font-weight: 900; color: #0f172a; margin: 0 0 16px 0;">Frequently Asked Questions</h2>
        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${a.faqs.map(f => `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px;">
              <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0;">${escapeHtml(f.question)}</h3>
              <p style="font-size: 14px; color: #475569; margin: 0; line-height: 1.6;">${escapeHtml(f.answer)}</p>
            </div>
          `).join('')}
        </div>
      </section>`;
  }

  const postBody = `
    ${renderGlobalHeader()}
    <article style="max-width: 860px; margin: 0 auto; padding: 40px 20px; font-family: system-ui, -apple-system, sans-serif;">
      <nav aria-label="Breadcrumb" style="font-size: 12px; color: #64748b; margin-bottom: 24px;">
        <a href="/" style="color: #64748b; text-decoration: none;">Home</a> &gt; 
        <a href="/blog" style="color: #64748b; text-decoration: none;">Blog</a> &gt; 
        <span style="color: #0f172a; font-weight: 700;">${escapeHtml(a.title)}</span>
      </nav>

      <header style="margin-bottom: 36px; border-bottom: 1px solid #f1f5f9; padding-bottom: 28px;">
        <div style="display: flex; gap: 12px; align-items: center; font-size: 12px; color: #4f46e5; font-weight: 700; margin-bottom: 12px;">
          <span style="text-transform: uppercase;">${escapeHtml(a.category)}</span>
          <span>•</span>
          <span style="color: #64748b;">${escapeHtml(a.readTime)}</span>
          <span>•</span>
          <span style="color: #64748b;">Published: ${escapeHtml(a.publishedDate)}</span>
        </div>
        <h1 style="font-size: clamp(28px, 4vw, 42px); font-weight: 900; color: #0f172a; line-height: 1.2; margin: 0 0 16px 0;">
          ${escapeHtml(a.title)}
        </h1>
        <p style="font-size: 17px; color: #64748b; line-height: 1.6; margin: 0 0 16px 0;">
          ${escapeHtml(a.excerpt)}
        </p>
        <div style="font-size: 13px; color: #475569;">
          Written by <strong>${escapeHtml(a.author.name)}</strong> (${escapeHtml(a.author.role)})
        </div>
      </header>

      <div style="font-size: 16px; color: #334155; line-height: 1.8;">
        ${a.introduction.map(p => `<p style="margin-bottom: 16px;">${escapeHtml(p)}</p>`).join('')}
        ${articleSectionsHtml}
        ${articleFaqsHtml}
        <div style="border-top: 1px solid #f1f5f9; padding-top: 24px; margin-top: 32px;">
          <h2 style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 0 0 10px 0;">Summary &amp; Next Steps</h2>
          ${a.conclusion.map(p => `<p style="margin-bottom: 14px;">${escapeHtml(p)}</p>`).join('')}
        </div>
      </div>
    </article>
    ${renderGlobalFooter()}
  `;

  const postJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: a.title,
      description: a.excerpt,
      datePublished: a.publishedDate,
      dateModified: a.updatedDate,
      author: {
        '@type': 'Person',
        name: a.author.name
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: (a.faqs || []).map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer
        }
      }))
    }
  ];

  writeStaticPage(`blog/${a.slug}`, `${a.title} | ToolStack`, a.excerpt, `${siteUrl}/blog/${a.slug}`, postBody, postJsonLd);
}

// ============================================================================
// 5. COMPLIANCE & LEGAL PAGES (ABOUT, CONTACT, PRIVACY, TERMS, DISCLAIMER)
// ============================================================================
console.log('-> Pre-rendering Compliance & Legal Pages...');

// About Us
writeStaticPage(
  'about',
  'About Us – Privacy-First Online Tools | ToolStack',
  'Discover ToolStack: our mission, 100% client-side privacy architecture, team philosophy, and commitment to fast, watermark-free web utilities.',
  `${siteUrl}/about`,
  `
  ${renderGlobalHeader()}
  <main style="max-width: 860px; margin: 0 auto; padding: 40px 20px; font-family: system-ui, -apple-system, sans-serif; line-height: 1.7;">
    <h1 style="font-size: 38px; font-weight: 900; color: #0f172a; margin: 0 0 16px 0;">About ToolStack</h1>
    <p style="font-size: 16px; color: #475569; margin-bottom: 24px;">
      ToolStack was founded on a simple yet revolutionary premise: you should never have to sacrifice your personal privacy or upload sensitive documents to unverified cloud servers just to perform basic everyday file tasks.
    </p>

    <h2 style="font-size: 22px; font-weight: 900; color: #0f172a; margin: 32px 0 12px 0;">The Client-Side Privacy Revolution</h2>
    <p style="font-size: 14px; color: #475569; margin-bottom: 16px;">
      Most conventional online tool websites operate by receiving your uploaded files on their servers, running a script, and streaming the output back. This model presents severe privacy risks: your financial PDFs, medical documents, private photos, and proprietary source code are exposed to potential data breaches, unauthorized retention, and third-party sniffing.
    </p>
    <p style="font-size: 14px; color: #475569; margin-bottom: 16px;">
      ToolStack operates with a strict <strong>100% Client-Side Architecture</strong>. By leveraging modern WebAssembly (Wasm), the HTML5 Canvas API, and Web Workers, all calculations and processing happen exclusively inside your web browser. Your files never touch any external server, ensuring complete confidentiality and GDPR/HIPAA compliance.
    </p>

    <h2 style="font-size: 22px; font-weight: 900; color: #0f172a; margin: 32px 0 12px 0;">Our Core Commitments</h2>
    <ul style="font-size: 14px; color: #475569; padding-left: 20px; line-height: 1.8;">
      <li><strong>100% Free Forever:</strong> No artificial paywalls, subscription traps, or credit card requirements.</li>
      <li><strong>No Watermarks:</strong> We never degrade or watermark your converted files.</li>
      <li><strong>No Required Signups:</strong> Immediate utility without mandatory account creation.</li>
      <li><strong>High Speed:</strong> Instant processing powered directly by your local processor.</li>
    </ul>
  </main>
  ${renderGlobalFooter()}
  `
);

// Contact Us
writeStaticPage(
  'contact',
  'Contact Us – Support & Feedback | ToolStack',
  'Have questions, tool requests, or partnership inquiries? Contact the ToolStack engineering team. Real response within 24-48 business hours.',
  `${siteUrl}/contact`,
  `
  ${renderGlobalHeader()}
  <main style="max-width: 860px; margin: 0 auto; padding: 40px 20px; font-family: system-ui, -apple-system, sans-serif; line-height: 1.7;">
    <h1 style="font-size: 38px; font-weight: 900; color: #0f172a; margin: 0 0 16px 0;">Contact ToolStack Support</h1>
    <p style="font-size: 16px; color: #475569; margin-bottom: 24px;">
      We value user feedback and are dedicated to providing support for all our browser-based utilities. Reach out to our engineering and support team using the details below.
    </p>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; margin-bottom: 32px;">
      <h2 style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 0 0 12px 0;">Direct Communication Channels</h2>
      <p style="font-size: 14px; color: #475569; margin-bottom: 8px;">
        <strong>Email Support:</strong> <a href="mailto:contact@toolstack.app" style="color: #4f46e5; text-decoration: none; font-weight: 700;">contact@toolstack.app</a>
      </p>
      <p style="font-size: 14px; color: #475569; margin-bottom: 8px;">
        <strong>Response Time:</strong> 24 to 48 business hours
      </p>
      <p style="font-size: 14px; color: #475569; margin: 0;">
        <strong>Bug Reports &amp; Feature Requests:</strong> Please include your browser name, operating system, and any error message encountered.
      </p>
    </div>

    <h2 style="font-size: 22px; font-weight: 900; color: #0f172a; margin: 32px 0 12px 0;">Frequently Asked Questions</h2>
    <div style="display: flex; flex-direction: column; gap: 14px;">
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
        <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">Are all tools completely free?</h3>
        <p style="font-size: 13px; color: #64748b; margin: 0;">Yes, every tool on ToolStack is 100% free with no hidden charges, trial limitations, or mandatory memberships.</p>
      </div>
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
        <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">Do you store my uploaded documents?</h3>
        <p style="font-size: 13px; color: #64748b; margin: 0;">No. Your files are processed in-memory directly in your browser and are never uploaded to our servers.</p>
      </div>
    </div>
  </main>
  ${renderGlobalFooter()}
  `
);

// Privacy Policy
writeStaticPage(
  'privacy-policy',
  'ToolStack Privacy Policy – Client-Side & Cookies Policy',
  'Read how ToolStack safeguards your documents, code, images, and online privacy with strict client-side isolation, zero server storage, and transparent advertising disclosures.',
  `${siteUrl}/privacy-policy`,
  `
  ${renderGlobalHeader()}
  <main style="max-width: 860px; margin: 0 auto; padding: 40px 20px; font-family: system-ui, -apple-system, sans-serif; line-height: 1.7;">
    <h1 style="font-size: 38px; font-weight: 900; color: #0f172a; margin: 0 0 16px 0;">ToolStack Privacy Policy</h1>
    <p style="font-size: 14px; color: #64748b; margin-bottom: 24px;">Last updated: October 2026</p>

    <section style="margin-bottom: 28px;">
      <h2 style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 0 0 10px 0;">1. Strict Client-Side Data Privacy</h2>
      <p style="font-size: 14px; color: #475569; margin-bottom: 12px;">
        ToolStack is engineered so that all utility processing (including PDF merging, compression, image manipulation, cryptographic hashing, and code formatting) occurs entirely within the client's web browser. At no time are your documents, images, code files, or data inputs transmitted to our web servers or any remote storage facility.
      </p>
    </section>

    <section style="margin-bottom: 28px;">
      <h2 style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 0 0 10px 0;">2. Google AdSense &amp; Third-Party Advertising</h2>
      <p style="font-size: 14px; color: #475569; margin-bottom: 12px;">
        ToolStack displays advertisements served by <strong>Google AdSense</strong>. Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites on the Internet.
      </p>
      <p style="font-size: 14px; color: #475569; margin-bottom: 12px;">
        Google's use of advertising cookies enables it and its partners to serve personalized ads to users based on their visit to our sites and/or other sites on the Internet.
      </p>
      <p style="font-size: 14px; color: #475569; margin-bottom: 12px;">
        <strong>How to Opt Out:</strong> Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style="color: #4f46e5; text-decoration: underline;">Google Ads Settings</a> or by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" style="color: #4f46e5; text-decoration: underline;">www.aboutads.info</a>.
      </p>
    </section>

    <section style="margin-bottom: 28px;">
      <h2 style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 0 0 10px 0;">3. Cookies &amp; Local Storage</h2>
      <p style="font-size: 14px; color: #475569; margin-bottom: 12px;">
        We use browser Local Storage to remember your client-side preferences (such as dark mode and your favorite tools list). This data remains strictly on your device and is never synchronized to our servers without your explicit action.
      </p>
    </section>

    <section style="margin-bottom: 28px;">
      <h2 style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 0 0 10px 0;">4. Contact Us Regarding Privacy</h2>
      <p style="font-size: 14px; color: #475569; margin: 0;">
        If you have questions about our privacy practices, contact us anytime at <a href="mailto:contact@toolstack.app" style="color: #4f46e5; text-decoration: none; font-weight: 700;">contact@toolstack.app</a>.
      </p>
    </section>
  </main>
  ${renderGlobalFooter()}
  `
);

// Terms & Conditions
writeStaticPage(
  'terms',
  'Terms & Conditions | ToolStack',
  'Read the official Terms and Conditions of service for using ToolStack online tools, calculators, and client-side utilities.',
  `${siteUrl}/terms`,
  `
  ${renderGlobalHeader()}
  <main style="max-width: 860px; margin: 0 auto; padding: 40px 20px; font-family: system-ui, -apple-system, sans-serif; line-height: 1.7;">
    <h1 style="font-size: 38px; font-weight: 900; color: #0f172a; margin: 0 0 16px 0;">Terms &amp; Conditions</h1>
    <p style="font-size: 14px; color: #64748b; margin-bottom: 24px;">Last updated: October 2026</p>

    <section style="margin-bottom: 24px;">
      <h2 style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">1. Acceptance of Terms</h2>
      <p style="font-size: 14px; color: #475569; margin: 0;">
        By accessing or using ToolStack, you agree to be bound by these Terms and Conditions. If you do not agree with any part, please discontinue use of the platform.
      </p>
    </section>

    <section style="margin-bottom: 24px;">
      <h2 style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">2. Use License &amp; Utility Usage</h2>
      <p style="font-size: 14px; color: #475569; margin: 0;">
        All utilities are provided free of charge for personal, professional, and commercial use. You agree not to attempt to reverse engineer, disrupt, or launch denial of service attacks against the platform infrastructure.
      </p>
    </section>

    <section style="margin-bottom: 24px;">
      <h2 style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">3. Disclaimer of Warranties</h2>
      <p style="font-size: 14px; color: #475569; margin: 0;">
        ToolStack utilities are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied.
      </p>
    </section>
  </main>
  ${renderGlobalFooter()}
  `
);

// Disclaimer
writeStaticPage(
  'disclaimer',
  'Disclaimer & Disclosures | ToolStack',
  'Read the ToolStack general utility, financial calculator, and advertising disclosures. Transparent terms for free in-browser tools.',
  `${siteUrl}/disclaimer`,
  `
  ${renderGlobalHeader()}
  <main style="max-width: 860px; margin: 0 auto; padding: 40px 20px; font-family: system-ui, -apple-system, sans-serif; line-height: 1.7;">
    <h1 style="font-size: 38px; font-weight: 900; color: #0f172a; margin: 0 0 16px 0;">ToolStack Legal Disclaimer</h1>
    <p style="font-size: 14px; color: #64748b; margin-bottom: 24px;">Last updated: October 2026</p>

    <section style="margin-bottom: 24px;">
      <h2 style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">1. General Utility Disclaimer</h2>
      <p style="font-size: 14px; color: #475569; margin: 0;">
        All information and calculation outputs generated by ToolStack are provided for educational and estimation purposes only. While we strive for extreme mathematical and procedural accuracy, you should independently verify critical financial, tax, or legal calculations before making significant commitments.
      </p>
    </section>

    <section style="margin-bottom: 24px;">
      <h2 style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">2. No Professional Advice</h2>
      <p style="font-size: 14px; color: #475569; margin: 0;">
        The calculators and tools provided on this site do not constitute financial, legal, tax, or accounting advice. Always consult with a licensed professional for advice tailored to your individual circumstances.
      </p>
    </section>

    <section style="margin-bottom: 24px;">
      <h2 style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">3. External Links Disclaimer</h2>
      <p style="font-size: 14px; color: #475569; margin: 0;">
        ToolStack may contain links to external websites that are not operated by us. We have no control over the content and practices of these external sites and cannot accept responsibility or liability for their respective policies.
      </p>
    </section>
  </main>
  ${renderGlobalFooter()}
  `
);

console.log('✓ Successfully pre-rendered static HTML for all indexable pages in dist/');
