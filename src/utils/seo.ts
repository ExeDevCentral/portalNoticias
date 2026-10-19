import { NewsItem } from '../db/schema';

export function generateArticleJsonLd(article: NewsItem, canonicalUrl: string) {
  const publishedIso = article.publishedAt instanceof Date
    ? article.publishedAt.toISOString()
    : new Date(article.publishedAt).toISOString();

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    headline: article.title,
    description: article.summary,
    image: article.imageUrl ? [article.imageUrl] : [],
    datePublished: publishedIso,
    dateModified: publishedIso,
    author: {
      '@type': 'Organization',
      name: article.source || 'Rosario en Tiempo Real',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Rosario en Tiempo Real',
      logo: {
        '@type': 'ImageObject',
        url: 'https://rosarioentiempreal.com.ar/icon.svg',
      },
    },
  };
}
