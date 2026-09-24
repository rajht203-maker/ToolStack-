import React, { useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Eye, 
  Cookie, 
  ExternalLink, 
  Mail, 
  CheckCircle2, 
  ArrowLeft, 
  FileText, 
  Server, 
  UserCheck, 
  Globe,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface PrivacyPolicyPageProps {
  onGoHome: () => void;
  onSelectCategory?: (catId: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onGoHome }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const lastUpdated = 'September 24, 2026';
  const siteUrl = 'https://toolstack-eosin.vercel.app';
  const contactEmail = 'rajht203@gmail.com';
  const publisherId = 'ca-pub-9951412841260181';

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <button 
            onClick={onGoHome}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-700 dark:text-slate-200 font-semibold" aria-current="page">
            Privacy Policy
          </span>
        </nav>

        {/* Back to Tools Button */}
        <div className="mb-6">
          <button
            onClick={onGoHome}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500 shadow-sm transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Tools</span>
          </button>
        </div>

        {/* Header Hero Banner */}
        <header className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
          
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800">
              <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Official Legal Document
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% Client-Side Privacy
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-3">
            ToolStack Privacy Policy
          </h1>
          
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-4">
            We believe your data belongs exclusively to you. Learn how ToolStack safeguards your documents, code, images, and online privacy with strict client-side isolation, zero server storage, and transparent advertising disclosures.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-medium text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
            <div>
              <strong className="text-slate-700 dark:text-slate-200">Last Updated:</strong> {lastUpdated}
            </div>
            <div>•</div>
            <div>
              <strong className="text-slate-700 dark:text-slate-200">Website:</strong>{' '}
              <a href={siteUrl} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                {siteUrl}
              </a>
            </div>
            <div>•</div>
            <div>
              <strong className="text-slate-700 dark:text-slate-200">AdSense Publisher ID:</strong>{' '}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                {publisherId}
              </code>
            </div>
          </div>
        </header>

        {/* Quick Highlights Grid */}
        <section aria-label="Key Privacy Takeaways" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Zero Document & File Uploads
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                PDFs, images, code, and documents are processed locally inside your browser via WebAssembly and Canvas. They never leave your device.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                We Never Sell Your Data
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                We do not sell, rent, monetize, or broker personal information to data brokers or third parties under CCPA/CPRA and GDPR standards.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Transparent Advertising
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                We partner with Google AdSense to serve non-intrusive ads that keep all 50+ tools 100% free. You can opt out of personalized ads at any time.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Full User Control & Privacy Rights
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                You have full rights to request access, rectification, or total deletion of any account profile or feedback stored in our system.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Table of Contents */}
        <section aria-label="Table of Contents" className="mb-10 p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
            Table of Contents
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <a href="#section-1" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5">
              <span>1. Introduction &amp; Service Scope</span>
            </a>
            <a href="#section-2" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5">
              <span>2. 100% Client-Side Privacy Architecture</span>
            </a>
            <a href="#section-3" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5">
              <span>3. Information We Collect &amp; Store</span>
            </a>
            <a href="#section-4" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5">
              <span>4. Google AdSense &amp; Advertising Disclosure</span>
            </a>
            <a href="#section-5" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5">
              <span>5. Cookies &amp; Local Storage Technology</span>
            </a>
            <a href="#section-6" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5">
              <span>6. Third-Party Service Providers</span>
            </a>
            <a href="#section-7" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5">
              <span>7. User Rights (GDPR &amp; CCPA/CPRA)</span>
            </a>
            <a href="#section-8" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5">
              <span>8. Children's Privacy (COPPA Compliance)</span>
            </a>
            <a href="#section-9" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5">
              <span>9. Data Security &amp; Encryption</span>
            </a>
            <a href="#section-10" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5">
              <span>10. Contact Us &amp; Inquiries</span>
            </a>
          </div>
        </section>

        {/* Detailed Sections */}
        <div className="space-y-8 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          
          {/* Section 1 */}
          <section id="section-1" className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-black flex items-center justify-center">1</span>
              Introduction &amp; Service Scope
            </h2>
            <p>
              Welcome to <strong>ToolStack</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;, or the &quot;Platform&quot;), publicly accessible at{' '}
              <a href={siteUrl} className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                {siteUrl}
              </a>. ToolStack provides over 50 free, high-performance web utilities spanning PDF conversion, image manipulation, developer formatting, cryptographic hashing, financial calculators, and unit converters.
            </p>
            <p>
              This Privacy Policy describes how we handle, process, and protect your information when you visit or interact with our website and progressive web app (PWA). By using ToolStack, you consent to the practices outlined in this policy. If you do not agree with any aspect, please discontinue using our services.
            </p>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-black flex items-center justify-center">2</span>
              100% Client-Side Privacy Architecture
            </h2>
            <p>
              Unlike conventional web utilities that transmit your sensitive documents, passwords, or images to remote servers for processing, <strong>ToolStack is engineered with a strict client-side first architecture</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li>
                <strong>PDF Manipulation (Merge, Split, Extract, Rotate, Compress):</strong> Processed directly inside your web browser using HTML5 Web Workers and JavaScript/WebAssembly memory. Your documents are never uploaded to any cloud server.
              </li>
              <li>
                <strong>Image Tools (Resizing, Compression, Format Conversion, Cropping):</strong> Executed in-memory via the HTML5 Canvas API and browser graphics pipelines.
              </li>
              <li>
                <strong>Developer &amp; Security Tools (JSON Validator, Base64, Password Generator, Hash Digests):</strong> All cryptographic computations (such as SHA-256, HMAC, AES, and UUID generation) use the browser&apos;s native <code>window.crypto.subtle</code> CSPRNG engine.
              </li>
              <li>
                <strong>Financial &amp; Conversion Calculators:</strong> Computed instantly in real-time on your processor with IEEE 754 precision math.
              </li>
            </ul>
            <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
              ✓ Summary: Your files and raw data never leave your computer or smartphone, guaranteeing zero server leakage, zero eavesdropping, and absolute privacy.
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-black flex items-center justify-center">3</span>
              Information We Collect &amp; Store
            </h2>
            <p>
              We prioritize data minimization. We only collect the minimal information necessary to deliver and maintain our services:
            </p>
            
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide mb-1">
                  A. Anonymous Log &amp; Technical Diagnostics
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  When you access ToolStack, our web hosting provider (Vercel) automatically registers standard server logs, which include your anonymized IP address, operating system, browser user-agent, language preference, request timestamps, and referring URLs. This information is utilized solely for denial-of-service mitigation, uptime monitoring, and routing performance.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide mb-1">
                  B. Optional User Account Credentials (Firebase Auth)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  All 50+ basic tools are completely free without requiring registration. However, if you choose to create a ToolStack account to access Member Tools or sync your tool favorites across devices, we securely store your email address, display name, and unique Firebase UID via Google Firebase Authentication. Passwords are encrypted with salt and hash by Google Firebase and are never visible to us.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide mb-1">
                  C. Voluntary Tool Feedback &amp; Bug Reports
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  When you submit a star rating, user feedback, or bug report through the interactive feedback widget on any tool page, your comments, selected ratings, and timestamp are saved in Google Cloud Firestore to help our engineering team resolve issues and improve utility features.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 - Crucial for Google AdSense */}
          <section id="section-4" className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-black flex items-center justify-center">4</span>
              Google AdSense &amp; Advertising Disclosure
            </h2>
            <p>
              To maintain all 50+ tools as 100% free public utilities without paywalls or mandatory subscriptions, ToolStack displays advertisements served by <strong>Google AdSense</strong> (Publisher ID: <code>{publisherId}</code>).
            </p>

            <div className="space-y-2 text-xs sm:text-sm">
              <p>
                <strong>Third-Party Vendors &amp; Cookies:</strong> Google, as a third-party vendor, uses cookies and tracking technologies (such as the DoubleClick DART cookie) to serve advertisements on our site based on your prior visits to ToolStack and other sites across the Internet.
              </p>
              <p>
                <strong>Personalized Advertising:</strong> Google&apos;s use of advertising cookies enables it and its certified advertising partners to serve personalized ads to you based on your visit to ToolStack and/or other websites on the internet.
              </p>
              <p>
                <strong>Non-Personalized Advertising:</strong> In regions where explicit user consent is required (such as the European Economic Area / UK under GDPR), or if you opt out of personalized advertising, ads will be non-personalized. Non-personalized ads do not use cookies for ad personalization, though they may still use cookies for frequency capping, aggregated ad reporting, and combating fraud and abuse.
              </p>
              <p>
                <strong>Google Partner Policy:</strong> For detailed information on how Google collects and processes data when you use sites that partner with Google, please visit:{' '}
                <a 
                  href="https://policies.google.com/technologies/partner-sites" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold inline-flex items-center gap-1"
                >
                  How Google uses information from sites or apps that use our services
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>

            {/* Opt-out instructions */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                How You Can Control &amp; Opt Out of Personalized Ads:
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <li>
                  Opt out of personalized advertising across Google by visiting the{' '}
                  <a 
                    href="https://adssettings.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline inline-flex items-center gap-0.5"
                  >
                    Google Ads Settings Portal <ExternalLink className="w-2.5 h-2.5" />
                  </a>.
                </li>
                <li>
                  Opt out of third-party vendors&apos; use of cookies for personalized advertising by visiting the Digital Advertising Alliance&apos;s{' '}
                  <a 
                    href="https://www.aboutads.info/choices/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline inline-flex items-center gap-0.5"
                  >
                    DAA WebChoices Consumer Choice Tool <ExternalLink className="w-2.5 h-2.5" />
                  </a>.
                </li>
                <li>
                  Users located in the European Union / United Kingdom can manage their cookie consent preferences via the{' '}
                  <a 
                    href="https://www.youronlinechoices.eu/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline inline-flex items-center gap-0.5"
                  >
                    European Interactive Digital Advertising Alliance (EDAA) <ExternalLink className="w-2.5 h-2.5" />
                  </a>.
                </li>
                <li>
                  Opt out of Network Advertising Initiative (NAI) participating companies at{' '}
                  <a 
                    href="https://optout.networkadvertising.org/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline inline-flex items-center gap-0.5"
                  >
                    optout.networkadvertising.org <ExternalLink className="w-2.5 h-2.5" />
                  </a>.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-black flex items-center justify-center">5</span>
              Cookies &amp; Local Storage Technology
            </h2>
            <p>
              Cookies and browser local storage are small data strings saved on your device to ensure smooth site navigation, preserve your preferences, and support platform operations.
            </p>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    <th className="py-2.5 pr-4 font-bold">Category</th>
                    <th className="py-2.5 pr-4 font-bold">Key / Purpose</th>
                    <th className="py-2.5 pr-4 font-bold">Duration</th>
                    <th className="py-2.5 font-bold">Provider</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-600 dark:text-slate-400">
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold text-slate-800 dark:text-slate-200">Essential / Functional</td>
                    <td className="py-2.5 pr-4">Stores dark/light mode preference (<code>toolstack_theme</code>) and favorite tool shortcuts.</td>
                    <td className="py-2.5 pr-4">Persistent (LocalStorage)</td>
                    <td className="py-2.5">First-party (ToolStack)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold text-slate-800 dark:text-slate-200">Authentication</td>
                    <td className="py-2.5 pr-4">Maintains active session tokens for logged-in users via Firebase Auth.</td>
                    <td className="py-2.5 pr-4">Session / Persistent</td>
                    <td className="py-2.5">Google Firebase</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold text-slate-800 dark:text-slate-200">Advertising</td>
                    <td className="py-2.5 pr-4">Google AdSense (<code>_gads</code>, <code>IDE</code>) for ad delivery, reporting, and spam prevention.</td>
                    <td className="py-2.5 pr-4">13 months max</td>
                    <td className="py-2.5">Google AdSense</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs pt-2">
              <strong>Disabling Cookies in Your Browser:</strong> You have the option to accept or decline cookies. Most web browsers automatically accept cookies, but you can modify your browser settings to decline cookies if you prefer. Note that disabling cookies may affect certain customized features such as saving your dark mode settings or keeping you signed in.
            </p>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-black flex items-center justify-center">6</span>
              Third-Party Service Providers
            </h2>
            <p>
              We engage reputable third-party infrastructure providers to host, secure, and operate ToolStack. Each provider processes minimal data in accordance with their strict privacy standards:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li>
                <strong>Google LLC (Firebase &amp; Google Cloud):</strong> Provides cloud authentication services and Firestore database for optional accounts, ratings, and tool bug feedback under enterprise-grade encryption.
              </li>
              <li>
                <strong>Google AdSense:</strong> Serves programmatic advertisements (multiplex, in-feed, and banner units) to sustain our free platform.
              </li>
              <li>
                <strong>Vercel Inc.:</strong> Provides global Edge CDN, web server hosting, and DNS resolution to deliver fast load times worldwide.
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-black flex items-center justify-center">7</span>
              User Rights (GDPR &amp; CCPA/CPRA Compliance)
            </h2>
            <p>
              Regardless of your physical location, ToolStack respects and honors international privacy rights:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs">
                  Your Rights Under GDPR (EEA &amp; UK)
                </h3>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                  <li><strong>Right to Access:</strong> Request a copy of your personal data stored with us.</li>
                  <li><strong>Right to Rectification:</strong> Request correction of inaccurate information.</li>
                  <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Request full deletion of your user account and feedback records.</li>
                  <li><strong>Right to Restrict or Object:</strong> Restrict processing or object to automated profiling.</li>
                  <li><strong>Right to Data Portability:</strong> Receive your account data in a structured, machine-readable format.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs">
                  Your Rights Under CCPA / CPRA (California)
                </h3>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                  <li><strong>Right to Know:</strong> Disclose categories and specific pieces of personal information collected.</li>
                  <li><strong>Right to Delete:</strong> Request deletion of personal information subject to legal exceptions.</li>
                  <li><strong>Do Not Sell or Share:</strong> We do NOT sell or share personal information for financial compensation.</li>
                  <li><strong>Non-Discrimination:</strong> We will never deny services, charge different prices, or degrade quality for exercising your privacy rights.</li>
                </ul>
              </div>
            </div>

            <p className="text-xs pt-1">
              To exercise any of these statutory rights, please email us directly at{' '}
              <a href={`mailto:${contactEmail}`} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                {contactEmail}
              </a>. We verify and respond to all verifiable consumer inquiries within 30 days without charge.
            </p>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-black flex items-center justify-center">8</span>
              Children&apos;s Privacy (COPPA Compliance)
            </h2>
            <p>
              Protecting children&apos;s privacy is of paramount importance to us. ToolStack is intended for general audiences and developers and does not knowingly solicit or collect personal information from children under the age of 13 (or under 16 in the EEA/UK), in accordance with the United States Children&apos;s Online Privacy Protection Act (COPPA).
            </p>
            <p>
              If you are a parent or guardian and become aware that your child has provided us with personal information without parental consent, please contact us immediately at{' '}
              <a href={`mailto:${contactEmail}`} className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                {contactEmail}
              </a>, and we will promptly purge the information from our records.
            </p>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-black flex items-center justify-center">9</span>
              Data Security &amp; Encryption
            </h2>
            <p>
              We implement robust technical and organizational security measures to protect your information:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li><strong>Enforced HTTPS / TLS 1.3:</strong> All communications between your web browser and our servers are encrypted in transit with contemporary TLS cryptographic suites.</li>
              <li><strong>Content Security Policies (CSP):</strong> Protection against cross-site scripting (XSS), clickjacking, and code injection attacks.</li>
              <li><strong>Local Sandboxing:</strong> File manipulation modules run inside sandboxed browser contexts with no permanent disk writes.</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section id="section-10" className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-black flex items-center justify-center">10</span>
              Contact Us &amp; Inquiries
            </h2>
            <p>
              If you have any questions, suggestions, or concerns regarding this Privacy Policy, our data protection practices, or Google AdSense disclosures, please do not hesitate to contact our team:
            </p>

            <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  ToolStack Privacy &amp; Legal Support
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Primary Email:{' '}
                  <a href={`mailto:${contactEmail}`} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    {contactEmail}
                  </a>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Official Website:{' '}
                  <a href={siteUrl} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    {siteUrl}
                  </a>
                </div>
              </div>

              <a
                href={`mailto:${contactEmail}?subject=ToolStack%20Privacy%20Policy%20Inquiry`}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 dark:shadow-none transition-all flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Email</span>
              </a>
            </div>
          </section>

        </div>

        {/* Footer Actions */}
        <div className="mt-12 text-center pt-8 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onGoHome}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to ToolStack Home</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
