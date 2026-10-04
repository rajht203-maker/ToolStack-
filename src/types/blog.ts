export interface BlogSection {
  heading: string;
  subheading?: string;
  content: string[];
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: 'PDF Tools' | 'Image Optimization' | 'Privacy & Security' | 'Calculators' | 'Developer Utilities';
  readTime: string;
  publishedDate: string;
  updatedDate: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  tableOfContents: Array<{ id: string; title: string }>;
  introduction: string[];
  sections: BlogSection[];
  relatedToolSlugs: string[];
  faqs: Array<{ question: string; answer: string }>;
  conclusion: string[];
}
