import { describe, it, expect } from 'vitest';
import { slugify } from '../../src/utils/slugify';

describe('slugify', () => {
  it('converts titles with accents and special characters into clean slugs', () => {
    const input = "¡Último Momento! Rosario Central empató 1-1 en Arroyito: los detalles";
    const expected = "ultimo-momento-rosario-central-empato-1-1-en-arroyito-los-detalles";
    expect(slugify(input)).toBe(expected);
  });

  it('handles multiple consecutive dashes and trims whitespace', () => {
    const input = "  Noticia   con   muchos    espacios  ";
    const expected = "noticia-con-muchos-espacios";
    expect(slugify(input)).toBe(expected);
  });
});
