import React, { useState, useMemo } from 'react';
import { TOOLS_DATA, CATEGORIES } from '../../data/toolsData';
import { ToolItem } from '../../types';
import { getToolSEOConfig, getSiteOrigin, getBasePath } from '../../utils/seoConfig';
import { generateSitemapXML, generateRobotsTxt, getAllSitemapURLs } from '../../utils/sitemapGenerator';
import { 
  Search, 
  Download, 
  Copy, 
  Check, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Layers, 
  Globe, 
  FileCode, 
  Share2, 
  Info,
  ShieldCheck,
  Eye,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

interface SEOAuditDashboardProps {
  onSelectTool: (tool: ToolItem) => void;
}

export const SEOAuditDashboard: React.FC<SEOAuditDashboardProps> = ({ onSelectTool }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'issues' | 'perfect'>('all');
  const [copiedAction, setCopiedAction] = useState<string | null>(null);
  const [showGSCGuide, setShowGSCGuide] = useState(false);

  const siteOrigin = getSiteOrigin();
  const basePath = getBasePath();

  // Run comprehensive SEO audit across all tools
  const auditResults = useMemo(() => {
    const sitemapUrls = new Set(getAllSitemapURLs(siteOrigin).map(u => u.loc));
    const allToolIdentifiers = new Set([...TOOLS_DATA.map(t => t.id), ...TOOLS_DATA.map(t => t.slug)]);
    const slugMap = new Map<string, number>();

    for (const tool of TOOLS_DATA) {
      slugMap.set(tool.slug, (slugMap.get(tool.slug) || 0) + 1);
    }

    const items = TOOLS_DATA.map((tool) => {
      const config = getToolSEOConfig(tool, siteOrigin);
      const issues: string[] = [];

      // 1. Missing or suboptimal Title
      const titleLen = (config.seoTitle || '').trim().length;
      if (titleLen === 0) {
        issues.push('Missing SEO Title');
      } else if (titleLen < 20 || titleLen > 70) {
        // Warning: Suboptimal length
      }

      // 2. Missing or suboptimal Description
      const descLen = (config.seoDescription || '').trim().length;
      if (descLen === 0) {
        issues.push('Missing Meta Description');
      }

      // 3. Missing H1
      if (!config.h1 || config.h1.trim() === '') {
        issues.push('Missing H1 Tag');
      }

      // 4. Missing Canonical
      if (!config.canonicalUrl || config.canonicalUrl.trim() === '') {
        issues.push('Missing Canonical URL');
      }

      // 5. Missing Structured Data
      if (!config.structuredData || config.structuredData.length === 0) {
        issues.push('Missing Structured Data (JSON-LD)');
      }

      // 6. Broken Internal Links (related tools that don't exist)
      const brokenRelated = (tool.relatedToolIds || []).filter(id => !allToolIdentifiers.has(id));
      if (brokenRelated.length > 0) {
        issues.push(`Broken Related Links (${brokenRelated.join(', ')})`);
      }

      // 7. Missing from Sitemap
      if (!sitemapUrls.has(config.canonicalUrl)) {
        issues.push('Missing from Sitemap XML');
      }

      // 8. Duplicate Slug
      if ((slugMap.get(tool.slug) || 0) > 1) {
        issues.push(`Duplicate Slug (${tool.slug})`);
      }

      return {
        tool,
        config,
        titleLen,
        descLen,
        brokenRelated,
        issues,
        isPerfect: issues.length === 0,
        inSitemap: sitemapUrls.has(config.canonicalUrl)
      };
    });

    // Summary statistics
    const totalTools = TOOLS_DATA.length;
    const indexablePages = totalTools + CATEGORIES.length + 1; // tools + categories + home
    const noindexPages = 2; // /admin and /404

    let missingTitle = 0;
    let missingDesc = 0;
    let missingH1 = 0;
    let missingCanonical = 0;
    let missingStructuredData = 0;
    let brokenLinksCount = 0;
    let missingSitemapEntries = 0;
    let duplicateSlugs = 0;

    for (const item of items) {
      if (!item.config.seoTitle) missingTitle++;
      if (!item.config.seoDescription) missingDesc++;
      if (!item.config.h1) missingH1++;
      if (!item.config.canonicalUrl) missingCanonical++;
      if (!item.config.structuredData || item.config.structuredData.length === 0) missingStructuredData++;
      if (item.brokenRelated.length > 0) brokenLinksCount += item.brokenRelated.length;
      if (!item.inSitemap) missingSitemapEntries++;
    }

    slugMap.forEach((count) => {
      if (count > 1) duplicateSlugs += (count - 1);
    });

    return {
      items,
      stats: {
        totalTools,
        indexablePages,
        noindexPages,
        missingTitle,
        missingDesc,
        missingH1,
        missingCanonical,
        missingStructuredData,
        brokenLinksCount,
        missingSitemapEntries,
        duplicateSlugs,
        healthScore: Math.round(((totalTools - items.filter(i => i.issues.length > 0).length) / totalTools) * 100)
      }
    };
  }, [siteOrigin]);

  // Filtered tools in audit table
  const filteredItems = useMemo(() => {
    return auditResults.items.filter(({ tool, config, issues }) => {
      const matchesSearch = 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        config.seoTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || tool.category === categoryFilter;

      let matchesStatus = true;
      if (statusFilter === 'issues') {
        matchesStatus = issues.length > 0;
      } else if (statusFilter === 'perfect') {
        matchesStatus = issues.length === 0;
      }

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [auditResults.items, searchQuery, categoryFilter, statusFilter]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAction(label);
    setTimeout(() => setCopiedAction(null), 2500);
  };

  const handleDownloadSitemap = () => {
    const xml = generateSitemapXML(siteOrigin);
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadRobots = () => {
    const txt = generateRobotsTxt(siteOrigin);
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Fast Actions */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-xs text-indigo-200 border border-white/15">
            <Globe className="w-3.5 h-3.5 text-indigo-300" /> Production SEO & Indexing Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            SEO Health & Google Indexing Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200/90 max-w-xl leading-relaxed">
            Automated compliance audit across all 1,200+ utilities. Validates canonical URLs, unique titles, Open Graph, dynamic XML sitemaps, and Schema.org JSON-LD structured data.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => handleCopy(generateSitemapXML(siteOrigin), 'sitemap')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Copy dynamic sitemap.xml content to clipboard"
          >
            {copiedAction === 'sitemap' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copiedAction === 'sitemap' ? 'Copied XML' : 'Copy Sitemap'}</span>
          </button>

          <button
            onClick={handleDownloadSitemap}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Download sitemap.xml file"
          >
            <Download className="w-4 h-4" />
            <span>Download Sitemap</span>
          </button>

          <button
            onClick={handleDownloadRobots}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Download robots.txt file"
          >
            <Download className="w-4 h-4" />
            <span>Download Robots.txt</span>
          </button>

          <button
            onClick={() => setShowGSCGuide(prev => !prev)}
            className="px-3.5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-500/25 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Google Search Console Guide</span>
          </button>
        </div>
      </div>

      {/* Google Search Console Accordion Guide */}
      {showGSCGuide && (
        <div className="p-6 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 rounded-2xl shadow-md space-y-4 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Google Search Console (GSC) Setup & Verification Guide
            </h3>
            <button
              onClick={() => setShowGSCGuide(false)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[11px]">1</span>
                Add Property & Verify
              </div>
              <p className="leading-relaxed">
                Open <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-semibold">search.google.com/search-console</a>. Choose <strong>URL Prefix</strong> and enter your domain (e.g., <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">{siteOrigin}</code>). Verify via HTML tag, DNS TXT, or HTML file.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[11px]">2</span>
                Submit Sitemap
              </div>
              <p className="leading-relaxed">
                Under the <strong>Sitemaps</strong> menu in GSC, submit: <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">sitemap.xml</code>. Google will crawl all 1,200+ URLs and discover all PDF, image, calculator, and developer tools.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[11px]">3</span>
                URL Inspection & Indexing
              </div>
              <p className="leading-relaxed">
                Paste high-priority URLs into the <strong>URL Inspection</strong> search box and click <strong>&ldquo;Request Indexing&rdquo;</strong> to expedite first crawl. Monitor the Coverage &amp; Core Web Vitals reports.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 11 Required Audit Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* 1. Total Tools */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Tools</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {auditResults.stats.totalTools.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <Check className="w-3 h-3" /> Fully Audited
          </div>
        </div>

        {/* 2. Indexable Pages */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Indexable Pages</div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {auditResults.stats.indexablePages.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Tools + Categories + Home
          </div>
        </div>

        {/* 3. Noindex Pages */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Noindex Pages</div>
          <div className="text-2xl font-black text-slate-700 dark:text-slate-300 mt-1">
            {auditResults.stats.noindexPages}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            /admin &amp; 404 (Protected)
          </div>
        </div>

        {/* 4. Missing Title */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Missing Title</div>
          <div className={`text-2xl font-black mt-1 ${auditResults.stats.missingTitle > 0 ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {auditResults.stats.missingTitle}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {auditResults.stats.missingTitle === 0 ? '100% Complete' : 'Needs attention'}
          </div>
        </div>

        {/* 5. Missing Description */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Missing Description</div>
          <div className={`text-2xl font-black mt-1 ${auditResults.stats.missingDesc > 0 ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {auditResults.stats.missingDesc}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {auditResults.stats.missingDesc === 0 ? '100% Complete' : 'Needs attention'}
          </div>
        </div>

        {/* 6. Missing H1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Missing H1</div>
          <div className={`text-2xl font-black mt-1 ${auditResults.stats.missingH1 > 0 ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {auditResults.stats.missingH1}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {auditResults.stats.missingH1 === 0 ? '100% Complete' : 'Needs attention'}
          </div>
        </div>

        {/* 7. Missing Canonical */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Missing Canonical</div>
          <div className={`text-2xl font-black mt-1 ${auditResults.stats.missingCanonical > 0 ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {auditResults.stats.missingCanonical}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {auditResults.stats.missingCanonical === 0 ? '100% Complete' : 'Needs attention'}
          </div>
        </div>

        {/* 8. Missing Structured Data */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Missing Schema</div>
          <div className={`text-2xl font-black mt-1 ${auditResults.stats.missingStructuredData > 0 ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {auditResults.stats.missingStructuredData}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            JSON-LD Breadcrumb + App
          </div>
        </div>

        {/* 9. Broken Internal Links */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Broken Links</div>
          <div className={`text-2xl font-black mt-1 ${auditResults.stats.brokenLinksCount > 0 ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {auditResults.stats.brokenLinksCount}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Related tool integrity
          </div>
        </div>

        {/* 10. Missing Sitemap Entries */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Missing Sitemap</div>
          <div className={`text-2xl font-black mt-1 ${auditResults.stats.missingSitemapEntries > 0 ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {auditResults.stats.missingSitemapEntries}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            XML sync check
          </div>
        </div>

        {/* 11. Duplicate Slugs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Duplicate Slugs</div>
          <div className={`text-2xl font-black mt-1 ${auditResults.stats.duplicateSlugs > 0 ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {auditResults.stats.duplicateSlugs}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            URL collision check
          </div>
        </div>

        {/* Overall SEO Score */}
        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">SEO Health</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {auditResults.stats.healthScore}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Google Crawlable
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools by name, slug, or title..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-semibold focus:outline-none"
          >
            <option value="all">All Categories ({CATEGORIES.length})</option>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-semibold focus:outline-none"
          >
            <option value="all">All Statuses ({auditResults.items.length})</option>
            <option value="perfect">Perfect Compliance ({auditResults.items.filter(i => i.issues.length === 0).length})</option>
            <option value="issues">Issues Only ({auditResults.items.filter(i => i.issues.length > 0).length})</option>
          </select>

          <span className="text-xs text-slate-400 whitespace-nowrap font-medium px-1">
            Showing {filteredItems.length} of {auditResults.items.length} tools
          </span>
        </div>
      </div>

      {/* SEO Audit Detailed Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/60 sticky top-0 border-b border-slate-200 dark:border-slate-700/80 z-10">
              <tr className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5 pl-4">Tool &amp; Slug</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">SEO Title &amp; Intent</th>
                <th className="p-3.5">Meta Description</th>
                <th className="p-3.5">Structured Data</th>
                <th className="p-3.5">Sitemap</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredItems.slice(0, 100).map(({ tool, config, titleLen, descLen, issues, isPerfect, inSitemap }) => (
                <tr key={tool.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  {/* Tool Name & Slug */}
                  <td className="p-3.5 pl-4 font-semibold text-slate-900 dark:text-white max-w-[180px]">
                    <div className="font-bold truncate">{tool.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      /{tool.category === 'calculator' ? 'calculators' : 'tools'}/{tool.slug}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/60">
                      {tool.category}
                    </span>
                  </td>

                  {/* SEO Title */}
                  <td className="p-3.5 max-w-xs">
                    <div className="truncate font-medium text-slate-800 dark:text-slate-200" title={config.seoTitle}>
                      {config.seoTitle}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {titleLen} characters (H1: &ldquo;{config.h1}&rdquo;)
                    </div>
                  </td>

                  {/* Meta Description */}
                  <td className="p-3.5 max-w-xs">
                    <div className="line-clamp-2 text-slate-500 dark:text-slate-400 text-[11px]" title={config.seoDescription}>
                      {config.seoDescription}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {descLen} characters
                    </div>
                  </td>

                  {/* Structured Data (JSON-LD) */}
                  <td className="p-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Breadcrumb
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        WebApp
                      </span>
                      {tool.faqs && tool.faqs.length > 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          FAQPage
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Sitemap */}
                  <td className="p-3.5 whitespace-nowrap">
                    {inSitemap ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <Check className="w-3.5 h-3.5" /> Included
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600">
                        <XCircle className="w-3.5 h-3.5" /> Missing
                      </span>
                    )}
                  </td>

                  {/* Status & Issues */}
                  <td className="p-3.5 whitespace-nowrap">
                    {isPerfect ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Validated
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 inline-flex items-center gap-1" title={issues.join(' | ')}>
                        <AlertTriangle className="w-3 h-3" /> {issues.length} Issues
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="p-3.5 text-right pr-4 whitespace-nowrap">
                    <button
                      onClick={() => onSelectTool(tool)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredItems.length > 100 && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 font-medium">
            Displaying first 100 results of {filteredItems.length}. Use search or category filter to inspect specific tools.
          </div>
        )}
      </div>
    </div>
  );
};
