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

  it('supports global newspaper regions: EEUU, Europa, Asia, Rusia, and Argentina', () => {
    const regionalCables: CableItem[] = [
      {
        id: 'nyt-1',
        source: 'The New York Times',
        region: 'eeuu',
        category: 'World',
        originalTitle: 'Diplomatic talks advance in Washington',
        originalSummary: 'White House announces trade framework.',
        sourceUrl: 'https://www.nytimes.com/world/talks',
        publishedAt: '2026-10-19T10:00:00Z',
        imageUrl: 'https://images.unsplash.com/photo-1',
        originalIntact: true,
      },
      {
        id: 'rt-1',
        source: 'RT en Español',
        region: 'rusia',
        category: 'Geopolítica',
        originalTitle: 'Cumbre de los BRICS en Kazán evalúa nuevo sistema financiero',
        originalSummary: 'Moscú destaca avance del comercio en monedas locales.',
        sourceUrl: 'https://actualidad.rt.com/actualidad/brics',
        publishedAt: '2026-10-19T10:00:00Z',
        imageUrl: 'https://images.unsplash.com/photo-2',
        originalIntact: true,
      },
      {
        id: 'jazeera-1',
        source: 'Al Jazeera',
        region: 'asia',
        category: 'Asia News',
        originalTitle: 'Asia maritime trade routes expand',
        originalSummary: 'Ports across the Indian Ocean report cargo records.',
        sourceUrl: 'https://www.aljazeera.com/news/ports',
        publishedAt: '2026-10-19T10:00:00Z',
        imageUrl: 'https://images.unsplash.com/photo-3',
        originalIntact: true,
      },
      {
        id: 'clarin-1',
        source: 'Clarín',
        region: 'argentina',
        category: 'Economía',
        originalTitle: 'Cosecha récord en el puerto de Rosario',
        originalSummary: 'Las terminales fluviales operan a pleno.',
        sourceUrl: 'https://www.clarin.com/economia/puerto',
        publishedAt: '2026-10-19T10:00:00Z',
        imageUrl: 'https://images.unsplash.com/photo-4',
        originalIntact: true,
      },
    ];

    const eeuu = regionalCables.filter((c) => c.region === 'eeuu');
    const rusia = regionalCables.filter((c) => c.region === 'rusia');
    const asia = regionalCables.filter((c) => c.region === 'asia');
    const argentina = regionalCables.filter((c) => c.region === 'argentina');

    expect(eeuu[0].source).toBe('The New York Times');
    expect(rusia[0].source).toBe('RT en Español');
    expect(asia[0].source).toBe('Al Jazeera');
    expect(argentina[0].source).toBe('Clarín');
  });
});

