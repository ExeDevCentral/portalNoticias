import { NewsRepository } from '../../db/news-repository';
import { parseRssFeed, ParsedArticle } from './rss-parser';

export interface FeedSource {
  name: string;
  url: string;
}

export const DEFAULT_FEEDS: FeedSource[] = [
  { name: 'La Capital', url: 'https://www.lacapital.com.ar/rss/home.xml' },
  { name: 'El Ciudadano', url: 'https://www.elciudadanoweb.com/feed/' },
  { name: 'Clarín', url: 'https://www.clarin.com/rss/lo-ultimo/' },
  { name: 'La Nación', url: 'https://www.lanacion.com.ar/arc/outboundfeeds/rss/?outputType=xml' },
  { name: 'Ámbito Financiero', url: 'https://www.ambito.com/rss/home.xml' },
];

export interface SyncResult {
  totalProcessed: number;
  totalInserted: number;
  errors: { source: string; message: string }[];
}

export async function runCrawlerSync(
  repo: NewsRepository,
  feeds: FeedSource[] = DEFAULT_FEEDS
): Promise<SyncResult> {
  let totalProcessed = 0;
  let totalInserted = 0;
  const errors: { source: string; message: string }[] = [];

  for (const feed of feeds) {
    try {
      const response = await fetch(feed.url, {
        headers: {
          'User-Agent': 'RosarioEnTiempoReal/1.0 (+https://rosarioentiempreal.com.ar)',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        errors.push({
          source: feed.name,
          message: `HTTP error ${response.status}`,
        });
        continue;
      }

      const xml = await response.text();
      const articles: ParsedArticle[] = parseRssFeed(xml, feed.name);
      totalProcessed += articles.length;

      for (const article of articles) {
        const created = await repo.createNewsItem({
          title: article.title,
          summary: article.summary,
          content: article.content,
          imageUrl: article.imageUrl,
          source: article.source,
          sourceUrl: article.link,
          category: article.category,
          isUrgent: false,
          isPinned: false,
          publishedAt: article.publishedAt,
        });

        if (created) {
          totalInserted++;
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      errors.push({
        source: feed.name,
        message: errorMessage,
      });
    }
  }

  return {
    totalProcessed,
    totalInserted,
    errors,
  };
}
