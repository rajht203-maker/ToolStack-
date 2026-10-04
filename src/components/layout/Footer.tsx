import React from 'react';
import { CATEGORIES, PLATFORM_STATS } from '../../data/toolsData';
import { Wrench, Shield, Lock, Zap, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface FooterProps {
  onSelectCategory: (catId: string | null) => void;
  onOpenAdmin: () => void;
  onOpenHelp?: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenAbout?: () => void;
  onOpenContact?: () => void;
  onOpenTerms?: () => void;
  onOpenDisclaimer?: () => void;
  onOpenBlog?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onSelectCategory, 
  onOpenAdmin, 
  onOpenHelp,
  onOpenPrivacyPolicy,
  onOpenAbout,
  onOpenContact,
  onOpenTerms,
  onOpenDisclaimer,
  onOpenBlog
}) => {
  const { isAdmin } = useAuth();
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 transition-colors pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xl">
                T
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Tool<span className="text-indigo-600 dark:text-indigo-400">Stack</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              50+ professional-grade online tools for developers, designers, and admins. All processed client-side for maximum speed and privacy.
            </p>

            <div className="flex items-center gap-2 pt-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>100% Client-Side Encryption</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Document & Media
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <a
                  href="/tools/pdf-merge"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                      e.preventDefault();
                      window.history.pushState({}, '', '/tools/pdf-merge');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-block"
                >
                  PDF Merge & Split
                </a>
              </li>
              <li>
                <a
                  href="/tools/image-compressor"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                      e.preventDefault();
                      window.history.pushState({}, '', '/tools/image-compressor');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-block"
                >
                  Image Compression & Resizing
                </a>
              </li>
              <li>
                <a
                  href="/tools/qr-generator"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                      e.preventDefault();
                      window.history.pushState({}, '', '/tools/qr-generator');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-block"
                >
                  Favicon & QR Code Generator
                </a>
              </li>
              <li>
                <a
                  href="/tools/word-counter"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                      e.preventDefault();
                      window.history.pushState({}, '', '/tools/word-counter');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-block"
                >
                  Word Counter & Case Converter
                </a>
              </li>
            </ul>
          </div>

          {/* Developer & Calculators */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Developers & Finance
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <a
                  href="/tools/json-formatter"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                      e.preventDefault();
                      window.history.pushState({}, '', '/tools/json-formatter');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-block"
                >
                  JSON Formatter & Validator
                </a>
              </li>
              <li>
                <a
                  href="/tools/base64-encode"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                      e.preventDefault();
                      window.history.pushState({}, '', '/tools/base64-encode');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-block"
                >
                  Base64 & URL Encoder
                </a>
              </li>
              <li>
                <a
                  href="/calculators/emi-calculator"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                      e.preventDefault();
                      window.history.pushState({}, '', '/calculators/emi-calculator');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-block"
                >
                  Loan EMI &amp; Compound Interest
                </a>
              </li>
              <li>
                <a
                  href="/calculators/gst-calculator"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                      e.preventDefault();
                      window.history.pushState({}, '', '/calculators/gst-calculator');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-block"
                >
                  GST & Sales Tax Calculator
                </a>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Company &amp; Compliance
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenAbout) onOpenAbout();
                    else window.location.href = '/about';
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-block"
                >
                  About ToolStack
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenContact) onOpenContact();
                    else window.location.href = '/contact';
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-block"
                >
                  Contact &amp; Support
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenBlog) onOpenBlog();
                    else window.location.href = '/blog';
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-block"
                >
                  Blog &amp; Knowledge Base
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenPrivacyPolicy) onOpenPrivacyPolicy();
                    else window.location.href = '/privacy-policy';
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-block font-semibold"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenTerms) onOpenTerms();
                    else window.location.href = '/terms';
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-block"
                >
                  Terms &amp; Conditions
                </a>
              </li>
              <li>
                <a
                  href="/disclaimer"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenDisclaimer) onOpenDisclaimer();
                    else window.location.href = '/disclaimer';
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-block"
                >
                  Disclaimer &amp; Disclosures
                </a>
              </li>
              {isAdmin && (
                <li>
                  <button
                    onClick={onOpenAdmin}
                    className="text-amber-600 dark:text-amber-400 font-semibold hover:underline"
                  >
                    Admin Management Portal
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
          <div>
            © {new Date().getFullYear()} TOOLSTACK INTERACTIVE. 100% PRIVATE CLIENT-SIDE UTILITIES.
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <a
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                if (onOpenAbout) onOpenAbout();
                else window.location.href = '/about';
              }}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              About
            </a>
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                if (onOpenContact) onOpenContact();
                else window.location.href = '/contact';
              }}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Contact
            </a>
            <a
              href="/privacy-policy"
              onClick={(e) => {
                e.preventDefault();
                if (onOpenPrivacyPolicy) onOpenPrivacyPolicy();
                else window.location.href = '/privacy-policy';
              }}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold text-indigo-600 dark:text-indigo-400"
            >
              Privacy
            </a>
            <a
              href="/terms"
              onClick={(e) => {
                e.preventDefault();
                if (onOpenTerms) onOpenTerms();
                else window.location.href = '/terms';
              }}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Terms
            </a>
            <a
              href="/disclaimer"
              onClick={(e) => {
                e.preventDefault();
                if (onOpenDisclaimer) onOpenDisclaimer();
                else window.location.href = '/disclaimer';
              }}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Disclaimer
            </a>
            <a
              href="/blog"
              onClick={(e) => {
                e.preventDefault();
                if (onOpenBlog) onOpenBlog();
                else window.location.href = '/blog';
              }}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Blog
            </a>
            {onOpenHelp && (
              <button 
                onClick={onOpenHelp} 
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                title="Keyboard Shortcuts Cheat Sheet (Press ?)"
              >
                <span>Shortcuts</span>
                <kbd className="px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[9px] font-mono text-slate-400 border border-slate-200 dark:border-slate-700">?</kbd>
              </button>
            )}
            <span className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Vercel Edge Ready</span>
            {isAdmin && (
              <button onClick={onOpenAdmin} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Admin Access
              </button>
            )}
            <span className="text-emerald-500 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              System Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
