import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from '../../src/services/scraper/sanitizer';
import { detectCategory } from '../../src/services/scraper/category-detector';
import { parseRssFeed } from '../../src/services/scraper/rss-parser';

describe('Scraper & Sanitizer', () => {
  it('strips dangerous scripts and malicious tags from html content', () => {
    const dirty = '<p>Texto informativo <script>alert("xss")</script><iframe src="evil.com"></iframe></p>';
    const clean = sanitizeHtml(dirty);
    expect(clean).not.toContain('<script>');
    expect(clean).not.toContain('<iframe>');
    expect(clean).toContain('Texto informativo');
  });

  it('accurately categorizes sports news with Rosario teams', () => {
    const category = detectCategory("Newell's prepara cambios para visitar a Boca", "El DT rojinegro analiza variantes.");
    expect(category).toBe('deportes');
  });

  it('accurately categorizes security / police news', () => {
    const category = detectCategory("Operativo policial en zona sur por balacera", "Detuvieron a tres sospechosos.");
    expect(category).toBe('seguridad');
  });

  it('parses an RSS XML sample correctly into structured articles', () => {
    const sampleRss = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>Rosario Noticias</title>
        <item>
          <title>Avanza la obra en el Monumento a la Bandera</title>
          <link>https://ejemplo.com/monumento</link>
          <description>Detalles de las remodelaciones</description>
          <pubDate>Thu, 15 Oct 2026 10:00:00 GMT</pubDate>
          <enclosure url="https://ejemplo.com/monumento.jpg" type="image/jpeg"/>
        </item>
      </channel>
    </rss>`;

    const parsed = parseRssFeed(sampleRss, 'Rosario Media');
    expect(parsed.length).toBe(1);
    expect(parsed[0].title).toBe('Avanza la obra en el Monumento a la Bandera');
    expect(parsed[0].imageUrl).toBe('https://ejemplo.com/monumento.jpg');
  });
});
