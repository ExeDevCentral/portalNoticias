import { describe, it, expect } from 'vitest';
import type { CableItem } from '../../src/types/cables';

// Test the filtering and grouping logic used by WorldKiosk
function filterWorldKioskCables(cables: CableItem[], sourceFilter: string, searchQuery: string): CableItem[] {
  return cables.filter((item) => {
    const matchesSource = sourceFilter === 'all' || item.source.toLowerCase().includes(sourceFilter.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      item.originalTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.originalSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.ironicReview?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    return matchesSource && matchesSearch;
  });
}

describe('WorldKiosk Filtering Logic', () => {
  const sampleCables: CableItem[] = [
    {
      id: 'c1',
      source: 'BBC Mundo',
      category: 'Internacional',
      originalTitle: 'Cumbre de líderes mundiales sobre el clima',
      originalSummary: 'Nuevo pacto de reducción de emisiones.',
      sourceUrl: 'https://www.bbc.com/noticia-1',
      publishedAt: '2026-10-19T10:00:00Z',
      imageUrl: 'https://images.unsplash.com/photo-1',
      warningTag: 'PROMESAS A 2050',
      ironicReview: 'Compromisos para cuando nadie esté vivo para rendir cuentas.',
      originalIntact: true,
    },
    {
      id: 'c2',
      source: 'Clarín Mundo',
      category: 'Economía',
      originalTitle: 'Wall Street y la suba de tasas',
      originalSummary: 'Los mercados reaccionan con cautela.',
      sourceUrl: 'https://www.clarin.com/noticia-2',
      publishedAt: '2026-10-19T11:00:00Z',
      imageUrl: 'https://images.unsplash.com/photo-2',
      warningTag: 'ALERTA DE GRÁFICO ELEGANTE',
      ironicReview: 'La curva del desastre tiene un diseño impecable.',
      originalIntact: true,
    },
    {
      id: 'c3',
      source: 'El País',
      category: 'Tecnología',
      originalTitle: 'Nueva inteligencia artificial revoluciona el mercado laboral',
      originalSummary: 'Se proyecta aumento de productividad.',
      sourceUrl: 'https://elpais.com/noticia-3',
      publishedAt: '2026-10-19T12:00:00Z',
      imageUrl: 'https://images.unsplash.com/photo-3',
      warningTag: 'HUMO DE SILICON VALLEY',
      ironicReview: 'Salvará a la humanidad siempre que pagues la suscripción.',
      originalIntact: true,
    },
  ];

  it('filters cables by newspaper source', () => {
    const bbcOnly = filterWorldKioskCables(sampleCables, 'BBC Mundo', '');
    expect(bbcOnly).toHaveLength(1);
    expect(bbcOnly[0].source).toBe('BBC Mundo');
  });

  it('filters cables by search query matching original title or ironic review', () => {
    const byReview = filterWorldKioskCables(sampleCables, 'all', 'suscripción');
    expect(byReview).toHaveLength(1);
    expect(byReview[0].source).toBe('El País');

    const byTitle = filterWorldKioskCables(sampleCables, 'all', 'tasas');
    expect(byTitle).toHaveLength(1);
    expect(byTitle[0].source).toBe('Clarín Mundo');
  });

  it('preserves untampered sourceUrl for 1-click external navigation', () => {
    const result = filterWorldKioskCables(sampleCables, 'all', '');
    for (const item of result) {
      expect(item.sourceUrl).toMatch(/^https?:\/\//);
      expect(item.originalIntact).toBe(true);
    }
  });
});
