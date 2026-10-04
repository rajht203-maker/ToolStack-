import React, { useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Share2, 
  Check, 
  ChevronRight, 
  Sparkles, 
  HelpCircle, 
  ExternalLink,
  BookOpen,
  User,
  Layers,
  Wrench
} from 'lucide-react';
import { BlogArticle } from '../../types/blog';
import { getBlogArticleBySlug, getRelatedBlogArticles } from '../../data/blogArticles';
import { SEOHead } from '../seo/SEOHead';
import { getSiteOrigin } from '../../utils/seoConfig';
import { TOOLS_DATA } from '../../data/toolsData';
import { ToolItem } from '../../types';

interface BlogPostPageProps {
  slug: string;
  onGoHome: () => void;
  onGoToBlogList: () => void;
  onSelectArticle: (slug: string) => void;
  onSelectTool: (tool: ToolItem) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({
  slug,
  onGoHome,
  onGoToBlogList,
  onSelectArticle,
  onSelectTool
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const origin = getSiteOrigin();
  const article = useMemo(() => getBlogArticleBySlug(slug), [slug]);
  const relatedArticles = useMemo(() => article ? getRelatedBlogArticles(article.slug) : [], [article]);

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Article Not Found</h1>
        <p className="text-sm text-slate-500">The requested article could not be located.</p>
        <button
          onClick={onGoToBlogList}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Blog Hub
        </button>
      </div>
    );
  }

  // Find tool objects for the related tool slugs
  const relatedToolObjects = useMemo(() => {
    return article.relatedToolSlugs
      .map(s => TOOLS_DATA.find(t => t.slug === s || t.id === s))
      .filter((t): t is ToolItem => Boolean(t));
  }, [article.relatedToolSlugs]);

  const seoConfig = {
    seoTitle: `${article.title} | ToolStack`,
    seoDescription: article.excerpt,
    canonicalUrl: `${origin}/blog/${article.slug}`,
    indexable: true,
    keywords: [article.category, 'toolstack guide', 'tutorial', ...article.relatedToolSlugs],
    category: 'all',
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        description: article.excerpt,
        datePublished: article.publishedDate,
        dateModified: article.updatedDate,
        author: {
          '@type': 'Person',
          name: article.author.name,
          jobTitle: article.author.role
        },
        publisher: {
          '@type': 'Organization',
          name: 'ToolStack',
          logo: {
            '@type': 'ImageObject',
            url: `${origin}/icon.svg`
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${origin}/blog/${article.slug}`
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      }
    ]
  };

  return (
    <article className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors py-8 sm:py-12">
      <SEOHead config={seoConfig} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto no-scrollbar py-0.5">
          <button 
            onClick={onGoHome}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium shrink-0"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <button 
            onClick={onGoToBlogList}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium shrink-0"
          >
            Blog
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-700 dark:text-slate-200 font-semibold truncate" aria-current="page">
            {article.title}
          </span>
        </nav>

        {/* Back Button */}
        <div>
          <button
            onClick={onGoToBlogList}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-xs transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Articles</span>
          </button>
        </div>

        {/* Header Hero */}
        <header className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800">
              {article.category}
            </span>
            <span className="text-slate-400">•</span>
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTime}</span>
            </span>
            <span className="text-slate-400">•</span>
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Updated {article.updatedDate}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {article.excerpt}
          </p>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <img 
              src={article.author.avatar} 
              alt={article.author.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
            />
            <div className="text-xs">
              <div className="font-bold text-slate-900 dark:text-white">{article.author.name}</div>
              <div className="text-slate-500 dark:text-slate-400">{article.author.role}</div>
            </div>
          </div>
        </header>

        {/* Table of Contents */}
        {article.tableOfContents.length > 0 && (
          <nav 
            aria-label="Table of Contents"
            className="p-5 sm:p-6 bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Table of Contents</span>
            </div>
            <ul className="space-y-1.5 pl-5 list-disc text-xs text-slate-600 dark:text-slate-300">
              {article.tableOfContents.map((item) => (
                <li key={item.id}>
                  <a 
                    href={`#${item.id}`} 
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Introduction */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {article.introduction.map((p, idx) => (
            <p key={idx} className="font-normal">{p}</p>
          ))}
        </div>

        {/* Interactive Related Tools Callout Banner */}
        {relatedToolObjects.length > 0 && (
          <div className="p-6 bg-gradient-to-tr from-indigo-50/80 via-white to-purple-50/80 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 rounded-3xl border border-indigo-200/80 dark:border-indigo-900/60 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Featured Interactive Tools for This Guide
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedToolObjects.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => onSelectTool(tool)}
                  className="p-3.5 bg-white dark:bg-slate-800/80 hover:bg-indigo-50/50 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-left group transition-all cursor-pointer shadow-2xs"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                      {tool.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {tool.description}
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold shrink-0">
                    Open Tool
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Article Sections */}
        <div className="space-y-6">
          {article.sections.map((section, idx) => {
            const sectionId = article.tableOfContents[idx]?.id;
            return (
              <section 
                key={idx} 
                id={sectionId}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
              >
                <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {section.heading}
                  </h2>
                  {section.subheading && (
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {section.subheading}
                    </p>
                  )}
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {section.content.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* FAQs */}
        {article.faqs.length > 0 && (
          <section id="faqs" className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-4">
              {article.faqs.map((faq, idx) => (
                <div key={idx} className="space-y-1 text-xs sm:text-sm">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {faq.question}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-xs">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Conclusion */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Final Takeaways
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {article.conclusion.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </section>

        {/* Related Articles Footer */}
        {relatedArticles.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recommended Reading
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectArticle(rel.slug)}
                  className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 cursor-pointer space-y-2 group transition-all"
                >
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                    {rel.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {rel.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
