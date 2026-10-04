import React, { useEffect } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Globe2, 
  Users, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles, 
  Lock, 
  Layers, 
  ChevronRight,
  Heart
} from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';
import { getSiteOrigin } from '../../utils/seoConfig';

interface AboutPageProps {
  onGoHome: () => void;
  onOpenContact?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onGoHome, onOpenContact }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const origin = getSiteOrigin();
  const seoConfig = {
    seoTitle: 'About Us – Privacy-First Online Tools | ToolStack',
    seoDescription: 'Discover ToolStack: our mission, 100% client-side privacy architecture, team philosophy, and commitment to fast, watermark-free web utilities.',
    canonicalUrl: `${origin}/about`,
    indexable: true,
    keywords: ['about ToolStack', 'client-side online tools', 'privacy-first web utilities', 'free online tools without sign up'],
    category: 'all',
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About ToolStack',
        description: 'ToolStack provides 1,200+ fast, client-side online tools and calculators that protect user data privacy.',
        url: `${origin}/about`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors py-8 sm:py-12">
      <SEOHead config={seoConfig} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <button 
            onClick={onGoHome}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-700 dark:text-slate-200 font-semibold" aria-current="page">
            About Us
          </span>
        </nav>

        {/* Back Button */}
        <div>
          <button
            onClick={onGoHome}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-xs transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Tools</span>
          </button>
        </div>

        {/* Header Hero */}
        <header className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Our Mission & Philosophy
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
            Empowering the Web with Private, Blazing-Fast Tools
          </h1>
          
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
            ToolStack was engineered with a radical premise: you should never have to surrender your personal documents, business spreadsheets, or private photos to anonymous cloud servers just to perform basic everyday file tasks.
          </p>
        </header>

        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">100% Client-Side</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every PDF merger, image compressor, code validator, and financial calculator executes directly in your browser memory via WebAssembly and HTML5 Canvas. Your files are never uploaded or stored remotely.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Zero Latency Speed</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Without server round-trips or slow network queues, your tools process files instantly at native hardware speeds, even when offline or experiencing poor connectivity.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Free & Watermark-Free</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              No sneaky trial periods, no page caps, and no forced promotional stamps across your documents. Clean, professional results every time.
            </p>
          </div>
        </div>

        {/* The Story Section */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Why We Built ToolStack</h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              Like millions of professionals, developers, and students, our team grew exhausted by the state of online file tools. The typical conversion or PDF site was plagued with intrusive pop-up ads, deceptive "Download" buttons that initiated third-party adware, artificial file size gates requiring costly monthly subscriptions, and alarming privacy policies that quietly reserved the right to analyze or retain uploaded paperwork.
            </p>
            <p>
              We asked a straightforward question: with modern browsers supporting WebAssembly, Web Workers, and hardware-accelerated Canvas, why should simple document tasks require uploading files across the internet at all?
            </p>
            <p>
              The result is <strong>ToolStack</strong>: a modern suite of over 1,200 utilities spanning document editing, image manipulation, programming formatting, math calculations, and unit conversions—all running 100% locally on your machine.
            </p>
          </div>
        </section>

        {/* Technology Architecture */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Technology Stack</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Engineered with modern, high-performance web standards:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><strong>WebAssembly &amp; PDF-Lib:</strong> In-memory PDF compiling and raster manipulation</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><strong>HTML5 Canvas API:</strong> High-DPI bicubic image resampling &amp; filtering</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><strong>Web Cryptography API (CSPRNG):</strong> Hardware-grade password &amp; hash generation</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><strong>PWA Offline Service Worker:</strong> Full functionality with zero active internet</span>
            </div>
          </div>
        </section>

        {/* Contact Callout */}
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold">Have Questions or Feature Requests?</h3>
            <p className="text-xs text-indigo-100">
              We continually expand ToolStack based on community feedback and suggestions.
            </p>
          </div>
          {onOpenContact && (
            <button
              onClick={onOpenContact}
              className="px-5 py-2.5 bg-white text-indigo-600 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
            >
              Contact Our Team
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
