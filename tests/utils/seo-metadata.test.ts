import { describe, it, expect } from 'vitest';
import { generateArticleJsonLd } from '../../src/utils/seo';

describe('generateArticleJsonLd', () => {
  it('generates valid Schema.org NewsArticle JSON-LD structured data', () => {
    const article = {
      title: 'Monumento a la Bandera luce renovado',
      summary: 'Finalizaron las obras clave.',
      imageUrl: 'https://example.com/monumento.jpg',
      publishedAt: new Date('2026-10-15T12:00:00Z'),
      source: 'La Capital',
      sourceUrl: 'https://lacapital.com.ar/nota',
    } as any;

    const jsonLd = generateArticleJsonLd(article, 'https://rosarioentiempreal.com.ar/noticia/monumento');
    expect(jsonLd['@type']).toBe('NewsArticle');
    expect(jsonLd.headline).toBe(article.title);
    expect(jsonLd.image).toEqual([article.imageUrl]);
    expect(jsonLd.publisher.name).toBe('Rosario en Tiempo Real');
  });
});
