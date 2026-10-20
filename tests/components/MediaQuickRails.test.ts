import { describe, it, expect } from 'vitest';
import { ROSARIO_OUTLETS, NATIONAL_OUTLETS } from '../../src/services/media-outlets';

describe('MediaQuickRails Data & Outlets', () => {
  it('contains essential Rosario outlets', () => {
    const names = ROSARIO_OUTLETS.map((o) => o.name);
    expect(names).toContain('La Capital');
    expect(names).toContain('Rosario3');
    expect(names).toContain('El Ciudadano');
    expect(names).toContain('Bolsa de Comercio');
  });

  it('contains essential National outlets without prohibited trademarks', () => {
    const names = NATIONAL_OUTLETS.map((o) => o.name);
    expect(names).toContain('Infobae');
    expect(names).toContain('Clarín');
    expect(names).toContain('Ámbito Financiero');
    expect(names).toContain('Prensa Federal');

    // Never use trademarked 'La Nación' in national outlets
    expect(names).not.toContain('La Nación');
  });

  it('ensures each outlet has a valid URL and brand color', () => {
    [...ROSARIO_OUTLETS, ...NATIONAL_OUTLETS].forEach((outlet) => {
      expect(outlet.websiteUrl).toMatch(/^https?:\/\//);
      expect(outlet.brandColor).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(outlet.shortName.length).toBeGreaterThan(0);
      expect(outlet.filterKey.length).toBeGreaterThan(0);
    });
  });
});
