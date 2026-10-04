import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INDEXABLE_TOOL_SLUGS } from '../src/config/indexableTools';
import { TOP_40_TOOL_CONTENT } from '../src/data/top40ToolContent';
import { TOOLS_DATA } from '../src/data/toolsData';
import { BLOG_ARTICLES } from '../src/data/blogArticles';

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

function writeStaticPage(subpath: string, title: string, description: string, canonicalUrl: string, bodyContent: string, jsonLd?: any[]) {
  const targetDir = path.join(distDir, subpath);
  fs.mkdirSync(targetDir, { recursive: true });

  let pageHtml = baseHtml;

  // Replace title
  pageHtml = pageHtml.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  // Replace or inject meta description & canonical
  const metaDescTag = `<meta name="description" content="${escapeHtml(description)}" />`;
  const canonicalTag = `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`;
  const robotsTag = `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`;

  let headInjections = `${metaDescTag}\n    ${canonicalTag}\n    ${robotsTag}`;

  if (jsonLd && jsonLd.length > 0) {
    for (const schema of jsonLd) {
      headInjections += `\n    <script type="application/ld+json">${JSON.stringify(schema)}</script>`;
    }
  }

  pageHtml = pageHtml.replace('</head>', `    ${headInjections}\n  </head>`);

  // Pre-render content inside <div id="root">
  pageHtml = pageHtml.replace(
    '<div id="root"></div>',
    `<div id="root">${bodyContent}</div>`
  );

  const outFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(outFile, pageHtml, 'utf-8');
}

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

console.log('Starting static pre-rendering for Google AdSense indexable pages...');

// 1. Compliance Pages
// About Us
writeStaticPage(
  'about',
  'About Us – Privacy-First Online Tools | ToolStack',
  'Discover ToolStack: our mission, 100% client-side privacy architecture, team philosophy, and commitment to fast, watermark-free web utilities.',
  `${siteUrl}/about`,
  `<main class="p-8 max-w-4xl mx-auto space-y-6">
    <h1 class="text-3xl font-black">About ToolStack</h1>
    <p class="text-base text-gray-700 leading-relaxed">
      ToolStack was engineered with a radical premise: you should never have to surrender your personal documents, business spreadsheets, or private photos to anonymous cloud servers just to perform basic everyday file tasks.
    </p>
    <h2 class="text-xl font-bold">100% Client-Side Privacy Architecture</h2>
    <p class="text-sm text-gray-600 leading-relaxed">
      Every PDF merger, image compressor, code validator, and financial calculator executes directly in your browser memory via WebAssembly and HTML5 Canvas. Your files are never uploaded or stored remotely.
    </p>
    <h2 class="text-xl font-bold">Our Philosophy</h2>
    <p class="text-sm text-gray-600 leading-relaxed">
      Free, fast, watermark-free utilities without forced account signups or intrusive tracking.
    </p>
  </main>`
);

// Contact Us
writeStaticPage(
  'contact',
  'Contact Us – Support & Feedback | ToolStack',
  'Have questions, tool requests, or partnership inquiries? Contact the ToolStack engineering team. Real response within 24-48 business hours.',
  `${siteUrl}/contact`,
  `<main class="p-8 max-w-4xl mx-auto space-y-6">
    <h1 class="text-3xl font-black">Contact ToolStack Support</h1>
    <p class="text-base text-gray-700 leading-relaxed">
      Have a feature suggestion, bug report, or business inquiry? Email us directly at <strong>contact@toolstack.app</strong>.
    </p>
    <p class="text-sm text-gray-600">Our engineering team responds within 24 to 48 business hours.</p>
  </main>`
);

// Privacy Policy
writeStaticPage(
  'privacy-policy',
  'ToolStack Privacy Policy – Client-Side & Cookies Policy',
  'Read how ToolStack safeguards your documents, code, images, and online privacy with strict client-side isolation, zero server storage, and transparent advertising disclosures.',
  `${siteUrl}/privacy-policy`,
  `<main class="p-8 max-w-4xl mx-auto space-y-6">
    <h1 class="text-3xl font-black">ToolStack Privacy Policy</h1>
    <p class="text-base text-gray-700 leading-relaxed">
      ToolStack processes all files client-side in your browser. We never upload, inspect, or retain your files.
    </p>
    <h2 class="text-xl font-bold">Google AdSense & Cookies</h2>
    <p class="text-sm text-gray-600 leading-relaxed">
      Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to your sites and/or other sites on the Internet.
    </p>
    <p class="text-sm text-gray-600 leading-relaxed">
      Users may opt out of personalized advertising by visiting <a href="https://www.aboutads.info">aboutads.info</a> or Google Ad Settings.
    </p>
  </main>`
);

// Terms
writeStaticPage(
  'terms',
  'Terms & Conditions | ToolStack',
  'Read the official Terms and Conditions of service for using ToolStack online tools, calculators, and client-side utilities.',
  `${siteUrl}/terms`,
  `<main class="p-8 max-w-4xl mx-auto space-y-6">
    <h1 class="text-3xl font-black">ToolStack Terms & Conditions</h1>
    <p class="text-base text-gray-700 leading-relaxed">
      By accessing ToolStack, you agree to these Terms and Conditions. All utilities are provided as-is for personal and commercial use without warranty.
    </p>
  </main>`
);

// Disclaimer
writeStaticPage(
  'disclaimer',
  'Disclaimer & Disclosures | ToolStack',
  'Read the ToolStack general utility, financial calculator, and advertising disclosures. Transparent terms for free in-browser tools.',
  `${siteUrl}/disclaimer`,
  `<main class="p-8 max-w-4xl mx-auto space-y-6">
    <h1 class="text-3xl font-black">ToolStack Legal Disclaimers</h1>
    <p class="text-base text-gray-700 leading-relaxed">
      Calculators and utilities are provided for educational and estimation purposes only. Always consult a certified professional before making financial, tax, or legal commitments.
    </p>
  </main>`
);

// 2. Blog Hub & Articles
const articles = BLOG_ARTICLES;
let blogIndexBody = `<main class="p-8 max-w-5xl mx-auto space-y-8">
  <h1 class="text-4xl font-black">ToolStack Learning Hub & Blog</h1>
  <p class="text-base text-gray-600">Expert guides, tutorials, and technical masterclasses on file processing, image compression, and financial math.</p>
  <div class="space-y-6">`;

for (const a of articles) {
  blogIndexBody += `
    <article class="p-6 border rounded-2xl space-y-2">
      <h2 class="text-2xl font-bold"><a href="/blog/${a.slug}">${escapeHtml(a.title)}</a></h2>
      <p class="text-sm text-gray-600">${escapeHtml(a.excerpt)}</p>
      <div class="text-xs text-gray-400">Published: ${a.publishedDate} • ${a.readTime} • By ${a.author.name}</div>
    </article>`;
}
blogIndexBody += `</div></main>`;

writeStaticPage(
  'blog',
  'ToolStack Blog – Guides on PDF, Image, Math & Privacy Tools',
  'Explore expert guides, tutorials, and deep-dives on PDF workflows, lossy vs lossless image compression, loan formulas, and client-side privacy.',
  `${siteUrl}/blog`,
  blogIndexBody
);

// Pre-render individual 10 blog posts
for (const a of articles) {
  let articleBody = `
    <article class="p-8 max-w-4xl mx-auto space-y-6">
      <div class="text-xs text-indigo-600 font-bold">${a.category} • ${a.readTime} • ${a.publishedDate}</div>
      <h1 class="text-3xl sm:text-4xl font-black">${escapeHtml(a.title)}</h1>
      <p class="text-base text-gray-600 leading-relaxed">${escapeHtml(a.excerpt)}</p>
      <div class="text-xs text-gray-500 pb-4 border-b">By ${escapeHtml(a.author.name)}, ${escapeHtml(a.author.role)}</div>
      
      <div class="space-y-4 text-base text-gray-800 leading-relaxed">
        ${a.introduction.map(p => `<p>${escapeHtml(p)}</p>`).join('')}
      </div>`;

  for (const s of a.sections) {
    articleBody += `
      <section class="space-y-3 pt-6 border-t">
        <h2 class="text-2xl font-bold">${escapeHtml(s.heading)}</h2>
        ${s.subheading ? `<h3 class="text-sm font-semibold text-indigo-600">${escapeHtml(s.subheading)}</h3>` : ''}
        <div class="space-y-3 text-sm text-gray-700 leading-relaxed">
          ${s.content.map(p => `<p>${escapeHtml(p)}</p>`).join('')}
        </div>
      </section>`;
  }

  if (a.faqs.length > 0) {
    articleBody += `
      <section class="space-y-4 pt-6 border-t">
        <h2 class="text-2xl font-bold">Frequently Asked Questions</h2>
        <div class="space-y-3">
          ${a.faqs.map(f => `
            <div>
              <h3 class="font-bold text-base text-gray-900">${escapeHtml(f.question)}</h3>
              <p class="text-sm text-gray-600">${escapeHtml(f.answer)}</p>
            </div>
          `).join('')}
        </div>
      </section>`;
  }

  articleBody += `
      <div class="space-y-2 pt-6 border-t text-sm text-gray-700">
        ${a.conclusion.map(p => `<p>${escapeHtml(p)}</p>`).join('')}
      </div>
    </article>`;

  const jsonLd = [
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
      mainEntity: a.faqs.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer
        }
      }))
    }
  ];

  writeStaticPage(
    path.join('blog', a.slug),
    `${a.title} | ToolStack`,
    a.excerpt,
    `${siteUrl}/blog/${a.slug}`,
    articleBody,
    jsonLd
  );
}

// 3. Top 40 Indexable Tools
for (const slug of INDEXABLE_TOOL_SLUGS) {
  const tool = TOOLS_DATA.find(t => t.slug === slug || t.id === slug);
  const content = TOP_40_TOOL_CONTENT[slug];
  if (!tool || !content) continue;

  const toolTitle = `${tool.name} – Free Online | ToolStack`;
  const toolDesc = `Free online ${tool.name}. ${tool.description} 100% private, in-browser execution with instant results.`;
  const canonical = `${siteUrl}/${tool.slug}`;

  let toolBody = `
    <main class="p-8 max-w-4xl mx-auto space-y-6">
      <div class="text-xs uppercase font-bold text-indigo-600">${tool.category} Utility</div>
      <h1 class="text-3xl sm:text-4xl font-black">${escapeHtml(tool.name)}</h1>
      <p class="text-base text-gray-600">${escapeHtml(tool.description)}</p>
      
      <section class="space-y-3 pt-6 border-t">
        <h2 class="text-xl font-bold">About ${escapeHtml(tool.name)}</h2>
        <p class="text-sm text-gray-700 leading-relaxed">${escapeHtml(content.inDepthOverview)}</p>
        <div class="p-3 bg-indigo-50 text-indigo-900 rounded-xl text-xs font-semibold">
          Who It Helps: ${escapeHtml(content.targetAudience)}
        </div>
      </section>

      <section class="space-y-3 pt-6 border-t">
        <h2 class="text-xl font-bold">How to use ${escapeHtml(tool.name)}</h2>
        <ol class="space-y-2 list-decimal pl-5 text-sm text-gray-700">
          ${content.stepByStepGuide.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
        </ol>
      </section>

      <section class="space-y-3 pt-6 border-t">
        <h2 class="text-xl font-bold">Key Benefits</h2>
        <ul class="space-y-2 list-disc pl-5 text-sm text-gray-700">
          ${content.keyBenefits.map(b => `<li><strong>${escapeHtml(b.title)}:</strong> ${escapeHtml(b.description)}</li>`).join('')}
        </ul>
      </section>

      <section class="space-y-3 pt-6 border-t">
        <h2 class="text-xl font-bold">Frequently Asked Questions</h2>
        <div class="space-y-3">
          ${content.faqs.map(f => `
            <div>
              <h3 class="font-bold text-sm text-gray-900">${escapeHtml(f.question)}</h3>
              <p class="text-xs text-gray-600">${escapeHtml(f.answer)}</p>
            </div>
          `).join('')}
        </div>
      </section>
    </main>`;

  const jsonLd = [
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

  writeStaticPage(tool.slug, toolTitle, toolDesc, canonical, toolBody, jsonLd);
}

console.log('✓ Successfully pre-rendered static HTML for all indexable pages in dist/');
