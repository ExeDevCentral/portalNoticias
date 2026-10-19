import { describe, it, expect } from 'vitest';
import { generateIronicReview, enrichCableWithIronicReview } from '../../src/services/world-kiosk/ironic-reviewer';
import type { CableItem } from '../../src/types/cables';

describe('Ironic Reviewer Service', () => {
  it('generates an ironic warning tag and review for diplomatic or summit news without touching original text', () => {
    const input = {
      title: 'Cumbre de líderes mundiales debate nuevo acuerdo preliminar para 2035',
      summary: 'Los cancilleres emitieron un comunicado conjunto tras tres días de negociaciones.',
      source: 'BBC Mundo',
      category: 'Internacional',
    };

    const review = generateIronicReview(input);

    expect(review.warningTag).toBeDefined();
    expect(review.warningTag.length).toBeGreaterThan(0);
    expect(review.ironicReview).toBeDefined();
    expect(review.ironicReview.length).toBeGreaterThan(15);
    expect(review.originalIntact).toBe(true);
  });

  it('generates finance-themed irony for banking or inflation news', () => {
    const input = {
      title: 'El Banco Central eleva las tasas ante el repunte de la inflación y la suba del dólar',
      summary: 'Wall Street y analistas financieros esperan cautela en los mercados.',
      source: 'El País',
      category: 'Economía',
    };

    const review = generateIronicReview(input);

    expect(review.warningTag).toMatch(/GRÁFICO|BOLSILLO|FINANCIERO|INFLAC/i);
    expect(review.ironicReview.toLowerCase()).toContain('dinero');
    expect(review.originalIntact).toBe(true);
  });

  it('generates tech-themed irony for AI and Silicon Valley news', () => {
    const input = {
      title: 'OpenAI y Silicon Valley anuncian nueva inteligencia artificial que revolucionará los empleos',
      summary: 'El algoritmo promete transformar la productividad global.',
      source: 'Infobae',
      category: 'Tecnología',
    };

    const review = generateIronicReview(input);

    expect(review.warningTag).toMatch(/SILICON|ALGORITMO|HUMO|FUTURO/i);
    expect(review.originalIntact).toBe(true);
  });

  it('handles fallback generic headlines gracefully with humor and integrity guarantee', () => {
    const input = {
      title: 'Inauguran nueva rotonda en el cruce de avenidas principales',
      source: 'Clarín',
    };

    const review = generateIronicReview(input);

    expect(review.warningTag).toBeDefined();
    expect(review.ironicReview).toBeDefined();
    expect(review.originalIntact).toBe(true);
  });

  it('enriches a full CableItem preserving 100% of the original metadata and link while adding ironicReview', () => {
    const originalCable: CableItem = {
      id: 'cable-test-1',
      source: 'The Guardian',
      category: 'World Affairs',
      originalTitle: 'World leaders sign climate declaration at annual summit',
      originalSummary: 'Delegates agreed on voluntary reduction goals without binding sanctions.',
      sourceUrl: 'https://www.theguardian.com/environment/summit',
      publishedAt: '2026-10-19T10:00:00Z',
      imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9',
    };

    const enriched = enrichCableWithIronicReview(originalCable);

    // Original data must NOT be touched or mutated
    expect(enriched.id).toBe(originalCable.id);
    expect(enriched.originalTitle).toBe(originalCable.originalTitle);
    expect(enriched.originalSummary).toBe(originalCable.originalSummary);
    expect(enriched.sourceUrl).toBe(originalCable.sourceUrl);
    expect(enriched.source).toBe(originalCable.source);
    expect(enriched.imageUrl).toBe(originalCable.imageUrl);

    // Ironic enhancement
    expect(enriched.ironicReview).toBeDefined();
    expect(enriched.warningTag).toBeDefined();
    expect(enriched.originalIntact).toBe(true);
  });
});
