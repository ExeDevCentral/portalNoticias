import { describe, it, expect } from 'vitest';
import { DEFAULT_STORIES } from '../../src/services/hero-stories';

describe('HeroOrbital Real News Cards & Editorial Hooks', () => {
  it('contains 5 real cards with authentic slugs, hooks, and categories', () => {
    expect(DEFAULT_STORIES).toHaveLength(5);

    DEFAULT_STORIES.forEach((story) => {
      // Must have a real slug pointing to an article
      expect(story.slug).toBeDefined();
      expect(story.slug.length).toBeGreaterThan(5);

      // Must have an engaging hook ("El gancho")
      expect(story.hook).toBeDefined();
      expect(story.hook.length).toBeGreaterThan(25);

      // Must have key takeaway facts
      expect(story.keyFacts).toBeDefined();
      expect(story.keyFacts?.length).toBeGreaterThanOrEqual(2);

      // Must have title, summary, source, and image
      expect(story.title.length).toBeGreaterThan(15);
      expect(story.summary.length).toBeGreaterThan(20);
      expect(story.source).toBeDefined();
      expect(story.imageUrl).toMatch(/^https:\/\//);
    });
  });

  it('contains zero mentions of Belgrano or Urquiza across all cards and hooks', () => {
    DEFAULT_STORIES.forEach((story) => {
      const fullContent = `${story.title} ${story.summary} ${story.hook} ${story.slug} ${story.tag}`;
      expect(fullContent).not.toContain('Belgrano');
      expect(fullContent).not.toContain('Urquiza');
    });
  });

  it('maps the 5 core identity pillars: Río, Seguridad, Clásico, Puerto, and Cultura', () => {
    const categories = DEFAULT_STORIES.map((s) => s.category);
    expect(categories).toContain('INFRAESTRUCTURA & RÍO');
    expect(categories).toContain('SEGURIDAD CIUDADANA');
    expect(categories).toContain('CLÁSICO ROSARINO');
    expect(categories).toContain('ECONOMÍA & PUERTO');
    expect(categories).toContain('CULTURA & VANGUARDIA');
  });

  it('contains valid slugs corresponding to database articles', () => {
    const slugs = DEFAULT_STORIES.map((s) => s.slug);
    expect(slugs).toContain('obras-restauracion-monumento-nacional-a-la-bandera');
    expect(slugs).toContain('operativo-seguridad-circunvalacion-autopista-santa-fe-niebla');
    expect(slugs).toContain('rosario-central-gigante-arroyito-socios-agotaron-plateas');
    expect(slugs).toContain('puerto-san-lorenzo-timbues-embarque-record-granos');
    expect(slugs).toContain('noche-galerias-pichincha-circuito-nocturno');
  });
});
