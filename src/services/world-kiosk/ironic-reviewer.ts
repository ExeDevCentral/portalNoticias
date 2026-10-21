import type { CableItem } from '@/types/cables';

export interface IronicReviewResult {
  warningTag: string;
  ironicReview: string;
  originalIntact: boolean;
}

interface ReviewInput {
  title: string;
  summary?: string;
  source?: string;
  category?: string;
}

export function enrichCableWithIronicReview(cable: CableItem): CableItem {
  const review = generateIronicReview({
    title: cable.originalTitle,
    summary: cable.originalSummary,
    source: cable.source,
    category: cable.category,
  });

  return {
    ...cable,
    ironicReview: review.ironicReview,
    warningTag: review.warningTag,
    originalIntact: true,
  };
}

export function generateIronicReview(input: ReviewInput): IronicReviewResult {
  const text = `${input.title} ${input.summary || ''} ${input.category || ''}`.toLowerCase();

  // 0. Identidad Ribereña, Puertos, Hidrovía, Granos y Logística
  if (
    text.includes('hidrov') ||
    text.includes('puerto') ||
    text.includes('buque') ||
    text.includes('grano') ||
    text.includes('soja') ||
    text.includes('cosecha') ||
    text.includes('retenci') ||
    text.includes('panamax')
  ) {
    const reviews = [
      'El complejo agroexportador del Gran Rosario y el dragado de la Hidrovía Paraná-Paraguay son determinantes para la competitividad y el ingreso de divisas de la economía nacional.',
      'La logística fluvial sobre el río Paraná moviliza el mayor volumen de granos de la región, demandando previsibilidad en los accesos y obras de infraestructura sostenidas.',
      'El calado garantizado a 34 pies permite el tránsito continuo de buques ultramarinos que conectan la producción agroindustrial de Santa Fe con los mercados globales.',
    ];
    return {
      warningTag: 'HIDROVÍA & LOGÍSTICA FLUVIAL',
      ironicReview: reviews[Math.abs(hashString(input.title)) % reviews.length],
      originalIntact: true,
    };
  }

  // 0.1 Clásico Rosarino, Fútbol Argentino, Central vs Newell's, Boca y River
  if (
    !text.includes('banco central') &&
    !text.includes('banco') &&
    (
      text.includes('rosario central') ||
      (text.includes('central') && (text.includes('fútbol') || text.includes('futbol') || text.includes('gol') || text.includes('clásico') || text.includes('arroyito') || text.includes('canalla'))) ||
      text.includes('newell') ||
      text.includes('leproso') ||
      text.includes('canalla') ||
      text.includes('arroyito') ||
      text.includes('coloso') ||
      (text.includes('boca') && (text.includes('fútbol') || text.includes('river') || text.includes('clásico'))) ||
      (text.includes('river') && (text.includes('fútbol') || text.includes('boca') || text.includes('clásico')))
    )
  ) {
    const reviews = [
      'El clásico del fútbol rosarino moviliza a la comunidad entera, exigiendo dispositivos integrales de seguridad y ensayos tácticos rigurosos en ambos clubes.',
      'La pasión de las hinchadas en el Gigante de Arroyito y el Coloso del Parque constituye un patrimonio deportivo y cultural único en el mapa futbolístico argentino.',
      'Ambos cuerpos técnicos ajustan detalles tácticos y alineaciones titulares ante un cotejo de alta gravitación en la tabla de posiciones.',
    ];
    return {
      warningTag: 'CLÁSICO & ACTUALIDAD DEPORTIVA',
      ironicReview: reviews[Math.abs(hashString(input.title)) % reviews.length],
      originalIntact: true,
    };
  }

  // 1. Economía, Bancos, Inflación, Mercados
  if (
    text.includes('inflac') ||
    text.includes('banco') ||
    text.includes('dólar') ||
    text.includes('dolar') ||
    text.includes('tasa') ||
    text.includes('wall street') ||
    text.includes('fmi') ||
    text.includes('mercado') ||
    text.includes('deuda')
  ) {
    const reviews = [
      'El poder adquisitivo del dinero y la trayectoria de la inflación imponen cautela en las decisiones de inversión y en la planificación del presupuesto familiar.',
      'Analistas del mercado financiero evalúan el impacto de las tasas de interés sobre el crédito productivo y la estabilidad cambiaria.',
      'Las autoridades monetarias monitorean la liquidez y el valor del dinero frente a las presiones de precios en los principales centros urbanos.',
    ];
    return {
      warningTag: 'CONTEXTO FINANCIERO',
      ironicReview: reviews[Math.abs(hashString(input.title)) % reviews.length],
      originalIntact: true,
    };
  }

  // 2. Tecnología, IA, Redes Sociales, Silicon Valley
  if (
    /\b(ia|ai|chatgpt|openai|algoritmo|algoritmos|robot|robots|silicon valley|software|metaverso)\b/i.test(text) ||
    text.includes('inteligencia artificial') ||
    text.includes('red social') ||
    text.includes('mark zuckerberg') ||
    text.includes('elon musk')
  ) {
    const reviews = [
      'El avance de la inteligencia artificial y los nuevos algoritmos redefinen la productividad laboral, impulsando marcos regulatorios para garantizar transparencia.',
      'Grandes empresas tecnológicas aceleran la integración de automatización inteligente en los procesos corporativos y los servicios digitales.',
      'Expertos señalan la necesidad de capacitación continua frente a la adopción de algoritmos avanzados en la economía del conocimiento.',
    ];
    return {
      warningTag: 'FUTURO TECNOLÓGICO & ALGORITMOS',
      ironicReview: reviews[Math.abs(hashString(input.title)) % reviews.length],
      originalIntact: true,
    };
  }

  // 3. Diplomacia, Cumbres, Acuerdos Internacionales
  if (
    text.includes('cumbre') ||
    text.includes('acuerdo') ||
    text.includes('pacto') ||
    text.includes('canciller') ||
    text.includes('tratado') ||
    text.includes('onu') ||
    text.includes('g20') ||
    text.includes('negociaci') ||
    text.includes('embajad')
  ) {
    const reviews = [
      'Las delegaciones diplomáticas buscan consolidar acuerdos multilaterales con metas verificables para garantizar estabilidad en las cadenas de suministro.',
      'Los pronunciamientos conjuntos reflejan negociaciones complejas para conciliar intereses soberanos en foros de cooperación internacional.',
      'Los organismos internacionales priorizan el diálogo diplomático y la articulación comercial como pilares de resolución pacífica de controversias.',
    ];
    return {
      warningTag: 'DIPLOMACIA & POLÍTICA EXTERIOR',
      ironicReview: reviews[Math.abs(hashString(input.title)) % reviews.length],
      originalIntact: true,
    };
  }

  // 4. Clima, Calentamiento global, Ecología
  if (
    text.includes('clima') ||
    text.includes('calentamiento') ||
    text.includes('emisi') ||
    text.includes('sequía') ||
    text.includes('ola de calor') ||
    text.includes('glaciar') ||
    text.includes('cop')
  ) {
    const reviews = [
      'Los informes meteorológicos y ambientales destacan la urgencia de inversiones en infraestructura hídrica resiliente ante eventos climáticos severos.',
      'Las metas de transición energética exigen financiamiento sustentable y compromisos de reducción de emisiones por parte de los principales emisores globales.',
      'Científicos del clima advierten sobre la variabilidad de precipitaciones y su impacto directo en los rindes agropecuarios de la cuenca del Plata.',
    ];
    return {
      warningTag: 'TRANSICIÓN ECOLÓGICA & CLIMA',
      ironicReview: reviews[Math.abs(hashString(input.title)) % reviews.length],
      originalIntact: true,
    };
  }

  // 5. Deportes, Fútbol general
  if (
    text.includes('fútbol') ||
    text.includes('futbol') ||
    text.includes('gol') ||
    text.includes('clásico') ||
    text.includes('champions') ||
    text.includes('messi') ||
    text.includes('dt') ||
    text.includes('fichaje')
  ) {
    const reviews = [
      'El rendimiento de los planteles y las decisiones de los cuerpos técnicos marcan el desarrollo de una fecha clave en el calendario deportivo.',
      'El mercado de pases y la gestión de recursos de los clubes profesionales concentran la atención de analistas y simpatizantes.',
      'La preparación física y el trabajo táctico semanal definen las chances de competencia en los certámenes de primera división.',
    ];
    return {
      warningTag: 'ANÁLISIS DEPORTIVO',
      ironicReview: reviews[Math.abs(hashString(input.title)) % reviews.length],
      originalIntact: true,
    };
  }

  // 6. Política general, Elecciones, Congresos
  if (
    text.includes('elecci') ||
    text.includes('presidente') ||
    text.includes('congreso') ||
    text.includes('diputad') ||
    text.includes('senad') ||
    text.includes('ley') ||
    text.includes('campaña')
  ) {
    const reviews = [
      'El debate parlamentario y los acuerdos interbloques definen el avance de iniciativas legislativas con impacto presupuestario e institucional.',
      'Los líderes de las distintas fuerzas políticas fijan posicionamientos públicos de cara a las próximas instancias del calendario cívico.',
      'Analistas institucionales señalan la importancia del consenso federal para garantizar la gobernabilidad y la solidez de las políticas de Estado.',
    ];
    return {
      warningTag: 'BALANCE POLÍTICO & INSTITUCIONAL',
      ironicReview: reviews[Math.abs(hashString(input.title)) % reviews.length],
      originalIntact: true,
    };
  }

  // Fallback general / Noticias de sociedad y misceláneas
  const fallbackReviews = [
    'Despacho verificado con seguimiento editorial continuo y cotejo de fuentes de primera línea.',
    'Información de actualidad contrastada por la Redacción para brindar contexto claro y objetivo.',
    'Seguimiento periodístico integral sobre los acontecimientos destacados del ámbito metropolitano e internacional.',
    'Cobertura en tiempo real con datos chequeados y atribución directa a las agencias oficiales de noticias.',
  ];

  return {
    warningTag: 'SÍNTESIS EDITORIAL',
    ironicReview: fallbackReviews[Math.abs(hashString(input.title)) % fallbackReviews.length],
    originalIntact: true,
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + (str.codePointAt(i) ?? 0);
    hash = Math.trunc(hash);
  }
  return hash;
}
