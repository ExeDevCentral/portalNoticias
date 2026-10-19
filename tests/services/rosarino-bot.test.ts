import { describe, it, expect } from 'vitest';
import {
  matchPhotoForContext,
  generateRosarinoEdition,
  EDITORIAL_PROMPT_DNA,
  GeneratedArticle,
} from '../../src/services/ai-editor/rosarino-bot';

describe('Rosarino Editorial Bot Service', () => {
  describe('Contextual Photo Matcher', () => {
    it('matches Monumento Nacional a la Bandera for Belgrano and civic identity news', () => {
      const photo = matchPhotoForContext({
        title: 'Homenaje a Belgrano en las barrancas del Paraná con vigilia ciudadana',
        category: 'ciudad',
      });

      expect(photo.url).toBeDefined();
      expect(photo.url).toMatch(/^https:\/\//);
      expect(photo.caption.toLowerCase()).toContain('monumento');
    });

    it('matches Puerto de Rosario / Hidrovía for Urquiza and grain export news', () => {
      const photo = matchPhotoForContext({
        title: 'El legado portuario de Urquiza: récord de buques en los muelles de la Hidrovía',
        category: 'economia',
      });

      expect(photo.url).toBeDefined();
      expect(photo.caption.toLowerCase()).toMatch(/puerto|hidrovía|paraná/);
    });

    it('matches Rosario Central / Gigante de Arroyito for Canalla football news', () => {
      const photo = matchPhotoForContext({
        title: 'Rosario Central prepara el Gigante de Arroyito para recibir a su gente en noche decisiva',
        category: 'deportes',
      });

      expect(photo.url).toBeDefined();
      expect(photo.caption.toLowerCase()).toMatch(/central|arroyito|canalla/);
    });

    it('matches Newell’s Old Boys / Coloso Marcelo Bielsa for Leproso football news', () => {
      const photo = matchPhotoForContext({
        title: "Banderazo en el Coloso del Parque: los hinchas de Newell's colman las tribunas",
        category: 'deportes',
      });

      expect(photo.url).toBeDefined();
      expect(photo.caption.toLowerCase()).toMatch(/newell|coloso|parque/);
    });
  });

  describe('Editorial Edition Generator (12-hour cycle)', () => {
    it('contains the core Rosarino DNA prompt mentioning Belgrano, Urquiza, and the classic Central/NOB', () => {
      expect(EDITORIAL_PROMPT_DNA).toContain('Belgrano');
      expect(EDITORIAL_PROMPT_DNA).toContain('Urquiza');
      expect(EDITORIAL_PROMPT_DNA).toContain('Central');
      expect(EDITORIAL_PROMPT_DNA).toContain("Newell's");
    });

    it('generates a full 12-hour edition with at least 4 contextualized articles', () => {
      const edition = generateRosarinoEdition();

      expect(edition.length).toBeGreaterThanOrEqual(4);

      // Verify at least one article has sports (Central or Newell's)
      const hasSports = edition.some((item: GeneratedArticle) => item.category === 'deportes');
      expect(hasSports).toBe(true);

      // Verify at least one article covers economy or port (Urquiza legacy)
      const hasPortEconomy = edition.some(
        (item: GeneratedArticle) => item.category === 'economia' || item.title.toLowerCase().includes('puerto')
      );
      expect(hasPortEconomy).toBe(true);

      // Check structure of each article
      for (const item of edition) {
        expect(item.title).toBeDefined();
        expect(item.title.length).toBeGreaterThan(15);
        expect(item.summary).toBeDefined();
        expect(item.summary.length).toBeGreaterThan(20);
        expect(item.content).toContain('<p>');
        expect(item.imageUrl).toMatch(/^https:\/\//);
        expect(item.source).toContain('Redacción');
      }
    });
  });
});
