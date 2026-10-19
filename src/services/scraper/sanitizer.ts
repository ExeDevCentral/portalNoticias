import * as cheerio from 'cheerio';

export function sanitizeHtml(html: string): string {
  if (!html) return '';

  const $ = cheerio.load(html, null, false);

  // Remove dangerous and tracking tags
  $('script, iframe, style, form, object, embed, frame, frameset, noscript').remove();

  // Strip event handler attributes (onclick, onerror, onload, etc.)
  $('*').each((_, el) => {
    if (el.type === 'tag') {
      const attribs = el.attribs || {};
      for (const attr of Object.keys(attribs)) {
        if (attr.toLowerCase().startsWith('on') || attr.toLowerCase() === 'href' && attribs[attr].trim().toLowerCase().startsWith('javascript:')) {
          delete attribs[attr];
        }
      }
    }
  });

  return $.html().trim();
}
