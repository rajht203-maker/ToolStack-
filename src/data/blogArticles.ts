import { BlogArticle } from '../types/blog';
import { ARTICLES_BATCH_1 } from './blog/articlesBatch1';
import { ARTICLES_BATCH_2 } from './blog/articlesBatch2';

export const BLOG_ARTICLES: BlogArticle[] = [
  ...ARTICLES_BATCH_1,
  ...ARTICLES_BATCH_2
];

/**
 * Retrieve all published blog articles
 */
export function getAllBlogArticles(): BlogArticle[] {
  return BLOG_ARTICLES;
}

/**
 * Retrieve a single blog article by slug
 */
export function getBlogArticleBySlug(slug: string): BlogArticle | undefined {
  if (!slug) return undefined;
  const normalized = slug.toLowerCase().trim();
  return BLOG_ARTICLES.find(a => a.slug === normalized || a.id === normalized);
}

/**
 * Retrieve related articles for a given article
 */
export function getRelatedBlogArticles(currentSlug: string, count = 3): BlogArticle[] {
  const current = getBlogArticleBySlug(currentSlug);
  return BLOG_ARTICLES
    .filter(a => a.slug !== currentSlug)
    .sort((a, b) => {
      if (current && a.category === current.category) return -1;
      return 0;
    })
    .slice(0, count);
}
