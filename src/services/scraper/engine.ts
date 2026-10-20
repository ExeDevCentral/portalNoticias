import { NewsRepository } from '../../db/news-repository';
import { parseRssFeed, ParsedArticle } from './rss-parser';

export interface FeedSource {
  name: string;
  url: string;
}

export const DEFAULT_FEEDS: FeedSource[] = [
  // Locales Rosario
  { name: 'La Capital', url: 'https://www.lacapital.com.ar/rss/home.xml' },
  { name: 'El Ciudadano', url: 'https://www.elciudadanoweb.com/feed/' },
  // Nacionales
  { name: 'Clarín', url: 'https://www.clarin.com/rss/lo-ultimo/' },
  { name: 'La Nación', url: 'https://www.lanacion.com.ar/arc/outboundfeeds/rss/?outputType=xml' },
  { name: 'Infobae', url: 'https://www.infobae.com/arc/outboundfeeds/rss/?outputType=xml' },
  { name: 'Ámbito Financiero', url: 'https://www.ambito.com/rss/home.xml' },
  // Internacionales / Mundo
  { name: 'BBC Mundo', url: 'https://feeds.bbci.co.uk/mundo/rss.xml' },
  { name: 'El País', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/internacional/portada' },
  { name: 'DW Español', url: 'https://rss.dw.com/rdf/rss-sp-all' },
  { name: 'The Guardian', url: 'https://www.theguardian.com/world/rss' },
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
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 RosarioEnTiempoReal/1.0',
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
