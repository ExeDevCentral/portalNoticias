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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractImageUrl($item: cheerio.Cheerio<any>, rawContent: string, rawDescription: string): string {
  const enclosure = $item.find('enclosure');
  if (enclosure.length && enclosure.attr('url')) {
    return enclosure.attr('url') || '';
  }

  const mediaThumbnail = $item.find(String.raw`media\:thumbnail, thumbnail`);
  if (mediaThumbnail.length && mediaThumbnail.attr('url')) {
    return mediaThumbnail.attr('url') || '';
  }

  const mediaContent = $item.find(String.raw`media\:content, content[url]`);
  if (mediaContent.length && mediaContent.attr('url')) {
    return mediaContent.attr('url') || '';
  }

  const itemHtml = $item.html() || '';
  const content$ = cheerio.load(rawContent || rawDescription || itemHtml);
  const imgTag = content$('img').first().attr('src');
  if (imgTag) {
    return imgTag;
  }

  const urlRegex = /url=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp|avif)[^"']*)["']/i;
  const match = urlRegex.exec(itemHtml);
  if (match) {
    return match[1];
  }

  return 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80';
}

export function parseRssFeed(xmlContent: string, sourceName: string): ParsedArticle[] {
  const $ = cheerio.load(xmlContent, { xmlMode: true });
  const articles: ParsedArticle[] = [];

  $('item').each((_, item) => {
    const $item = $(item);
    const title = $item.find('title').first().text().trim();
    const link = $item.find('link').first().text().trim() || $item.find('guid').first().text().trim();
    const rawDescription = $item.find('description').first().text().trim();
    const rawContent = $item.find(String.raw`content\:encoded`).first().text().trim() || rawDescription;

    const pubDateStr = $item.find('pubDate').first().text().trim();
    const publishedAt = pubDateStr ? new Date(pubDateStr) : new Date();

    const imageUrl = extractImageUrl($item, rawContent, rawDescription);
    const cleanSummary = sanitizeHtml(rawDescription).replace(/<[^>]*>?/gm, '').trim();
    const cleanContent = sanitizeHtml(rawContent);
    const category = detectCategory(title, cleanSummary);

    if (title && link) {
      articles.push({
        title,
        link,
        summary: cleanSummary.slice(0, 300),
        content: cleanContent || `<p>${cleanSummary}</p>`,
        publishedAt: Number.isNaN(publishedAt.getTime()) ? new Date() : publishedAt,
        imageUrl,
        source: sourceName,
        category,
      });
    }
  });

  return articles;
}
