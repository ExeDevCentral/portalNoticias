import { NewsCategory } from '../../db/schema';

const KEYWORDS: Record<NewsCategory, string[]> = {
  deportes: [
    'newell', 'central', 'fútbol', 'futbol', 'canalla', 'leproso', 'arroyito',
    'coloso', 'liga profesional', 'afa', 'clásico', 'clasico', 'messi', 'di maría', 'di maria',
    'rojinegro', 'auriazul', 'dt', 'partido', 'gol', 'cancha', 'champions', 'copa', 'selección',
    'seleccion', 'scaloni', 'boca', 'river', 'tenis'
  ],
  seguridad: [
    'policial', 'policía', 'policia', 'balacera', 'allanamiento', 'tiroteo', 'detuvieron',
    'detenido', 'homicidio', 'asesinato', 'comisaría', 'comisaria', 'gendarmería', 'gendarmeria',
    'fiscalía', 'fiscalia', 'robo', 'narco', 'crimen', 'disparos', 'zona sur', 'zona norte', 'zona oeste',
    'justicia', 'juez', 'corte suprema', 'investigación', 'ataque'
  ],
  economia: [
    'dólar', 'dolar', 'puerto', 'hidrovía', 'hidrovia', 'granos', 'cereal', 'soja',
    'exportación', 'exportacion', 'inflación', 'inflacion', 'bcr', 'bolsa de comercio',
    'paritarias', 'afip', 'banco', 'salario', 'campo', 'fmi', 'wall street', 'tasas',
    'aranceles', 'mercado', 'deuda', 'pbi', 'inversión', 'inversion', 'finanzas'
  ],
  politica: [
    'gobernador', 'intendente', 'javkin', 'pullaro', 'concejo', 'legislatura',
    'senado', 'elecciones', 'ministro', 'gobierno', 'municipio', 'provincia',
    'diputados', 'partido político', 'campaña', 'presidente', 'congreso', 'casa rosada',
    'canciller', 'geopolítica', 'geopolitica', 'cumbre', 'diplomacia', 'guerra', 'onu'
  ],
  ciudad: [
    'tránsito', 'transito', 'circunvalación', 'circunvalacion', 'monumento', 'colectivos',
    'sube', 'obras', 'bacheo', 'río paraná', 'rio parana', 'puente rosario-victoria',
    'corte de calle', 'parque independencia', 'costanera'
  ],
  sociedad: [
    'salud', 'educación', 'educacion', 'escuela', 'hospital', 'universidad', 'unr',
    'clima', 'alerta meteorológico', 'temporal', 'cultura', 'teatro', 'cine', 'vecinos',
    'internacional', 'mundo', 'medio ambiente', 'ciencia', 'tecnología', 'tecnologia'
  ],
};

export function detectCategory(title: string, summary: string): NewsCategory {
  const text = `${title} ${summary}`.toLowerCase();

  for (const [category, words] of Object.entries(KEYWORDS) as [NewsCategory, string[]][]) {
    for (const word of words) {
      if (text.includes(word)) {
        return category;
      }
    }
  }

  return 'sociedad';
}
