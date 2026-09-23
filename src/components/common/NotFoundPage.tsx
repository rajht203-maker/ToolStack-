import React, { useState } from 'react';
import { SEOHead } from '../seo/SEOHead';
import { getSiteOrigin, getBasePath } from '../../utils/seoConfig';
import { ToolItem } from '../../types';
import { TOOLS_DATA } from '../../data/toolsData';
import { Search, Home, ArrowRight, AlertCircle, Compass } from 'lucide-react';

interface NotFoundPageProps {
  onGoHome: () => void;
  onSelectTool: (tool: ToolItem) => void;
  requestedSlug?: string;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onGoHome,
  onSelectTool,
  requestedSlug
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const siteOrigin = getSiteOrigin();
  const basePath = getBasePath();

  const seoConfig = {
    name: '404 - Tool Not Found',
    slug: '404',
    description: 'The requested tool or page could not be found. Explore 1,200+ free online web utilities on ToolStack.',
    category: 'system',
    keywords: [],
    canonicalUrl: `${siteOrigin}${basePath}/404`,
    indexable: false, // Strict NOINDEX for 404 pages
    h1: '404 - Tool Not Found',
    seoTitle: 'Page Not Found (404) | ToolStack',
    seoDescription: 'The page you requested could not be located. Browse 1,200+ free online tools on ToolStack.',
    relatedTools: [],
    structuredData: []
  };

  const popularTools = TOOLS_DATA.filter(t => 
    ['pdf-merge', 'pdf-compress', 'image-compressor', 'percentage-calculator', 'qr-code-generator', 'word-counter'].includes(t.slug)
  );

  const searchResults = searchQuery.trim()
    ? TOOLS_DATA.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 6)
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 text-center space-y-8 animate-in fade-in duration-200">
      <SEOHead config={seoConfig} />

      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto shadow-inner">
        <Compass className="w-10 h-10 animate-pulse" />
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
          <AlertCircle className="w-3.5 h-3.5" /> 404 Error - Page Not Found
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          We couldn&apos;t find that tool
        </h1>
        {requestedSlug && (
          <p className="text-xs font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/60 px-3 py-1 rounded-md inline-block">
            /{requestedSlug}
          </p>
        )}
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          The link might be outdated or the tool may have been renamed. Use the search bar below or explore our most popular free tools.
        </p>
      </div>

      {/* Quick Search */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all 1,200+ utilities..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Live Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-3 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg space-y-1 text-left">
            {searchResults.map((tool) => (
              <button
                key={tool.id}
                onClick={() => onSelectTool(tool)}
                className="w-full p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-left flex items-center justify-between group cursor-pointer transition-colors"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {tool.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-xs">
                    {tool.description}
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Popular Tools Recommendations */}
      <div className="pt-6 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Popular Tools You Might Need
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-xl mx-auto">
          {popularTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool)}
              className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-left hover:border-indigo-500/50 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                {tool.name}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 capitalize mt-0.5">
                {tool.category} Tool
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Return Home Button */}
      <div className="pt-4">
        <button
          onClick={onGoHome}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </button>
      </div>
    </div>
  );
};
