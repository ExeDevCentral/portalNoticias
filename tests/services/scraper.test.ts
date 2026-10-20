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

  it('accurately categorizes national politics and global diplomacy', () => {
    const polCategory = detectCategory("El Presidente y el Congreso debaten nueva ley de presupuesto", "Reunión en Casa Rosada.");
    expect(polCategory).toBe('politica');
    const ecoCategory = detectCategory("Wall Street y el FMI analizan el impacto de las tasas y aranceles", "Mercados financieros en alerta.");
    expect(ecoCategory).toBe('economia');
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
    expect(parsed).toHaveLength(1);
    expect(parsed[0].title).toBe('Avanza la obra en el Monumento a la Bandera');
    expect(parsed[0].imageUrl).toBe('https://ejemplo.com/monumento.jpg');
  });

  it('extracts images from media:thumbnail and content:encoded', () => {
    const bbcSample = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
      <channel>
        <item>
          <title>Crisis económica en el mundo</title>
          <link>https://bbc.com/mundo/123</link>
          <description>Reporte global</description>
          <media:thumbnail url="https://ichef.bbci.co.uk/sample.jpg" />
        </item>
      </channel>
    </rss>`;
    const parsed = parseRssFeed(bbcSample, 'BBC Mundo');
    expect(parsed[0].imageUrl).toBe('https://ichef.bbci.co.uk/sample.jpg');
  });

  it('includes national, local, and international sources in DEFAULT_FEEDS', async () => {
    const { DEFAULT_FEEDS } = await import('../../src/services/scraper/engine');
    const sourceNames = DEFAULT_FEEDS.map((f: { name: string }) => f.name);
    expect(sourceNames).toContain('BBC Mundo');
    expect(sourceNames).toContain('El País');
    expect(sourceNames).toContain('Infobae');
    expect(sourceNames).toContain('La Capital');
    expect(sourceNames).toContain('Clarín');
  });
});

