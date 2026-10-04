import React, { useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Calculator, 
  ExternalLink, 
  ArrowLeft, 
  ChevronRight,
  Info,
  DollarSign
} from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';
import { getSiteOrigin } from '../../utils/seoConfig';

interface DisclaimerPageProps {
  onGoHome: () => void;
}

export const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ onGoHome }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const origin = getSiteOrigin();
  const lastUpdated = 'September 28, 2026';

  const seoConfig = {
    seoTitle: 'Disclaimer & Disclosures | ToolStack',
    seoDescription: 'Read the ToolStack general utility, financial calculator, and advertising disclosures. Transparent terms for free in-browser tools.',
    canonicalUrl: `${origin}/disclaimer`,
    indexable: true,
    keywords: ['toolstack disclaimer', 'financial calculator disclaimer', 'advertising disclosure'],
    category: 'all',
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'ToolStack Legal Disclaimer',
        url: `${origin}/disclaimer`
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
            Disclaimer
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800 mb-4">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Important Legal Notices
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-3">
            ToolStack Disclaimer
          </h1>
          
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
            Please review the following disclaimers regarding tool results, mathematical calculators, privacy boundaries, and third-party advertising on ToolStack.
          </p>

          <div className="pt-4 text-xs text-slate-500 dark:text-slate-400">
            <strong>Last Updated:</strong> {lastUpdated}
          </div>
        </header>

        {/* Disclaimers Cards */}
        <div className="space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Calculator className="w-5 h-5" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                1. Financial &amp; Math Calculators Disclaimer
              </h2>
            </div>
            <p>
              The calculators provided on ToolStack (including Loan EMI, Compound Interest, Percentage, Sales Tax, and Salary calculators) are intended exclusively for general informational, educational, and preliminary planning purposes. While our calculation algorithms implement standard banking formulas, results should not be construed as official financial, investment, tax, or legal advice.
            </p>
            <p>
              Financial institutions apply proprietary underwriting criteria, varying loan compounding methods, insurance fees, and local tax surcharges. Always consult a certified financial planner, CPA, or lending officer before finalizing formal borrowing or investment commitments.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <ShieldAlert className="w-5 h-5" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                2. Client-Side Data &amp; Lossless Guarantee Disclaimer
              </h2>
            </div>
            <p>
              All file processing on ToolStack executes locally within your browser. ToolStack does not back up, store, or recover user files. You are solely responsible for retaining original copies of documents and image assets prior to processing. ToolStack is not liable for data loss, accidental file replacement, or browser crashes during processing of unusually large files.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <DollarSign className="w-5 h-5" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                3. Advertising &amp; Affiliate Disclosure
              </h2>
            </div>
            <p>
              ToolStack is financed through digital advertising served by Google AdSense and reputable ad networks. These advertisements allow us to maintain free, unrestricted access to all 1,200+ utilities without charging subscription fees or injecting promotional watermarks into your documents.
            </p>
            <p>
              We do not endorse specific third-party products advertised in ad banners. If you interact with external sponsor advertisements, you will be directed to third-party websites governed by their own privacy practices and terms of service.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
              <Info className="w-5 h-5" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                4. Health &amp; Fitness Disclaimers (BMI Calculator)
              </h2>
            </div>
            <p>
              The Body Mass Index (BMI) calculator calculates statistical body mass indicators based on World Health Organization guidelines. BMI is a screening metric and does not diagnose health conditions, body fat percentage, or cardiovascular wellness. Consult a qualified medical practitioner for personalized health evaluations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
