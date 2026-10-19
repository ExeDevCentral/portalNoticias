import * as cheerio from 'cheerio';
import { detectCategory } from './category-detector';
import { sanitizeHtml } from './sanitizer';
import { NewsCategory } from '../../db/schema';

export interface ParsedArticle {
  title: string;
  link: string;
  summary: string;
  content: string;
  publishedAt: Date;
  imageUrl: string;
  source: string;
  category: NewsCategory;
}

export function parseRssFeed(xmlContent: string, sourceName: string): ParsedArticle[] {
  const $ = cheerio.load(xmlContent, { xmlMode: true });
  const articles: ParsedArticle[] = [];

  $('item').each((_, item) => {
    const $item = $(item);
    const title = $item.find('title').first().text().trim();
    const link = $item.find('link').first().text().trim() || $item.find('guid').first().text().trim();
    const rawDescription = $item.find('description').first().text().trim();
    const rawContent = $item.find('content\\:encoded').first().text().trim() || rawDescription;

    const pubDateStr = $item.find('pubDate').first().text().trim();
    const publishedAt = pubDateStr ? new Date(pubDateStr) : new Date();

    // Image extraction from enclosure, media:content, or img tag
    let imageUrl = '';
    const enclosure = $item.find('enclosure[type^="image"]');
    if (enclosure.length && enclosure.attr('url')) {
      imageUrl = enclosure.attr('url') || '';
    } else {
      const mediaContent = $item.find('media\\:content[url]');
      if (mediaContent.length && mediaContent.attr('url')) {
        imageUrl = mediaContent.attr('url') || '';
      } else {
        const desc$ = cheerio.load(rawDescription);
        const imgTag = desc$('img').first().attr('src');
        if (imgTag) {
          imageUrl = imgTag;
        }
      }
    }

    if (!imageUrl) {
      imageUrl = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80';
    }

    const cleanSummary = sanitizeHtml(rawDescription).replace(/<[^>]*>?/gm, '').trim();
    const cleanContent = sanitizeHtml(rawContent);
    const category = detectCategory(title, cleanSummary);

    if (title && link) {
      articles.push({
        title,
        link,
        summary: cleanSummary.slice(0, 300),
        content: cleanContent || `<p>${cleanSummary}</p>`,
        publishedAt: isNaN(publishedAt.getTime()) ? new Date() : publishedAt,
        imageUrl,
        source: sourceName,
        category,
      });
    }
  });

  return articles;
}
