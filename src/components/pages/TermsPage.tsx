import React, { useEffect } from 'react';
import { 
  FileText, 
  Shield, 
  Scale, 
  CheckCircle2, 
  ArrowLeft, 
  ChevronRight,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';
import { getSiteOrigin } from '../../utils/seoConfig';

interface TermsPageProps {
  onGoHome: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onGoHome }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const origin = getSiteOrigin();
  const lastUpdated = 'September 28, 2026';

  const seoConfig = {
    seoTitle: 'Terms & Conditions | ToolStack',
    seoDescription: 'Read the official Terms and Conditions of service for using ToolStack online tools, calculators, and client-side utilities.',
    canonicalUrl: `${origin}/terms`,
    indexable: true,
    keywords: ['toolstack terms', 'terms and conditions', 'terms of service toolstack'],
    category: 'all',
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'ToolStack Terms and Conditions',
        url: `${origin}/terms`
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
            Terms &amp; Conditions
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 mb-4">
            <Scale className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            User Agreement &amp; Terms of Service
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-3">
            ToolStack Terms &amp; Conditions
          </h1>
          
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
            Welcome to ToolStack. By accessing or using our website, utilities, and calculators, you agree to comply with and be bound by the following terms of service.
          </p>

          <div className="pt-4 text-xs text-slate-500 dark:text-slate-400">
            <strong>Last Updated:</strong> {lastUpdated}
          </div>
        </header>

        {/* Terms Sections */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing the website at https://toolstack-eosin.vercel.app ("ToolStack"), you agree to be bound by these Terms and Conditions, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              2. Description of Service &amp; Client-Side Processing
            </h2>
            <p>
              ToolStack provides a suite of online digital utilities, document tools, image converters, calculators, and developer tools. All core processing is performed client-side within the user's web browser using technologies including WebAssembly, Web Workers, and HTML5 Canvas. ToolStack does not store, inspect, or retain user files on remote servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              3. Permitted &amp; Prohibited Use
            </h2>
            <p>
              You may use ToolStack for personal, educational, or commercial projects. However, you agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use the website for any unlawful purpose or to process illegal, abusive, or copyrighted material without authorization.</li>
              <li>Attempt to decompile, reverse engineer, or extract intellectual property from proprietary software routines where prohibited by law.</li>
              <li>Execute automated scraping, denial of service (DoS) attacks, or overload site infrastructure.</li>
              <li>Remove or obscure any copyright, trademark, or legal notices contained within the site.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              4. Disclaimer of Warranties
            </h2>
            <p>
              The tools, calculations, conversions, and information on ToolStack are provided on an "as is" and "as available" basis. ToolStack makes no warranties, expressed or implied, and hereby disclaims all other warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
            </p>
            <p>
              While our mathematical models and code parsers are rigorously tested, financial calculations (such as loan EMI, taxes, and interest) are intended for educational and estimation purposes only and do not constitute certified financial or legal counsel.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              5. Limitation of Liability
            </h2>
            <p>
              In no event shall ToolStack, its developers, or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ToolStack, even if ToolStack has been notified of the possibility of such damage.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              6. Third-Party Advertisements &amp; Links
            </h2>
            <p>
              ToolStack displays non-intrusive advertisements served through Google AdSense and third-party advertising networks to support free tool availability. These networks may use cookies (including the DoubleClick DART cookie) to deliver relevant advertisements based on visits to this and other websites. Users can manage or opt out of personalized ad tracking via Google Ad Settings or www.aboutads.info.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              7. Governing Law &amp; Modifications
            </h2>
            <p>
              ToolStack reserves the right to revise or update these terms of service at any time without prior notice. By continuing to use this website after revisions become effective, you agree to be bound by the updated terms.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Questions Regarding Terms?</h3>
            <p>
              For legal inquiries or questions concerning these Terms &amp; Conditions, please reach out via our contact page or email us at <strong>contact@toolstack.app</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
