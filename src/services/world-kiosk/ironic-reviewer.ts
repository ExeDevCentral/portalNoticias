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

  // 0. Identidad Ribereña, Puertos, Hidrovía, Granos y Retenciones
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
      'Ochenta buques ultramarinos cargan la riqueza de la pampa húmeda frente a las barrancas mientras en Buenos Aires festejan retenciones con aire acondicionado.',
      'El río Paraná lleva más dólares que toda la City porteña, pero los rosarinos todavía pagan el combustible más caro del país.',
      'Treinta y cuatro pies de calado oficial garantizados al son de cumbia santafesina mientras la burocracia centralista pide sellados por duplicado.',
    ];
    return {
      warningTag: 'BARRANCAS & HIDROVÍA',
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
      'En esta ciudad la elección es binaria, vitalicia e irreversible hasta la cremación: o vapor, riel y grasa obrera, o academia, tiza y cuero inglés.',
      'En Rosario no existe ser simpatizante de River o de Boca: semejante tibieza en una pizzería de Pellegrini o en un quiosco de Arroyito es causal de compasión médica.',
      'Once jugadores en la cancha definirán si la ciudad sonríe con prepotencia o si los vecinos se miran de reojo en la cola del almacén hasta el próximo clásico.',
    ];
    return {
      warningTag: 'RELIGIÓN BÍBLICA ROSARINA',
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
      'Analistas financieros confirman que el dinero seguirá rindiendo menos, pero celebran que la curva del desastre tiene un diseño impecable.',
      'Especialistas explican que la pérdida del poder adquisitivo era inevitable según un complejo gráfico que solo entienden ellos.',
      'Banqueros centrales aconsejan moderación y calma mientras revisan sus bonos anuales con café de especialidad.',
    ];
    return {
      warningTag: 'ALERTA DE GRÁFICO ELEGANTE',
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
      'Multimillonarios de Silicon Valley aseguran que esta nueva actualización salvará a la humanidad, siempre y cuando no canceles la suscripción mensual.',
      'Un algoritmo predice que todos los empleos serán reemplazados por pantallas que muestran errores en tipografía Helvetica.',
      'Empresas tecnológicas anuncian con bombos y platillos una función que ya existía en 2004 pero ahora tiene luces de neón.',
    ];
    return {
      warningTag: 'HUMO DE SILICON VALLEY',
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
      'Veinte delegaciones volaron en primera clase para comprometerse formalmente a redactar un próximo borrador no vinculante.',
      'Diplomáticos de alta alcurnia declaran "profunda preocupación" ante la cámara mientras evalúan el menú de la cena oficial.',
      'Las partes alcanzaron un consenso histórico: volver a reunirse en una ciudad europea con mejor clima.',
    ];
    return {
      warningTag: 'CHAMUYO PROTOCOLAR',
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
      'Se anuncian severos compromisos de reducción de emisiones para cuando ninguno de los funcionarios presentes esté con vida para rendir cuentas.',
      'Científicos confirman que el calor en verano y el frío en invierno son alarmantes según el último powerpoint.',
      'Prometen plantar árboles en algún continente lejano tras gastar toneladas de combustible de aviación.',
    ];
    return {
      warningTag: 'PROMESAS A 2050',
      ironicReview: reviews[Math.abs(hashString(input.title)) % reviews.length],
      originalIntact: true,
    };
  }

  // 5. Deportes, Fútbol
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
      'Once millonarios corriendo en pantalones cortos definirán el estado anímico y la estabilidad cívica de millones hasta el domingo.',
      'El director técnico declara que "el grupo está fuerte" minutos antes de que la comisión directiva prepare su telegrama.',
      'Tragedia nacional evitada gracias a que una pelota de cuero pegó en el poste izquierdo.',
    ];
    return {
      warningTag: 'GRAVEDAD EXISTENCIAL DOMINGUERA',
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
      'El oficialismo asegura que todo marcha según lo planeado, mientras la oposición promete arreglarlo todo destruyendo lo anterior.',
      'Se aprueba una comisión investigadora para determinar por qué las comisiones anteriores no investigaron nada.',
      'Líderes políticos prometen austeridad implacable desde despachos recién alfombrados.',
    ];
    return {
      warningTag: 'OPTIMISMO NO CHEQUEADO',
      ironicReview: reviews[Math.abs(hashString(input.title)) % reviews.length],
      originalIntact: true,
    };
  }

  // Fallback general / Noticias de sociedad y misceláneas
  const fallbackReviews = [
    'El artículo promete revelaciones impactantes sobre cuestiones que ya sospechábamos desde el martes pasado.',
    'Portavoces oficiales confirmaron que la situación está bajo minuciosa observación mientras esperan que el problema se resuelva solo.',
    'Testigos presenciales afirman que todo ocurrió exactamente como no debería haber ocurrido.',
    'Expertos coinciden en que la solución existe, pero implementarla requeriría trabajar un fin de semana.',
  ];

  return {
    warningTag: 'ADVERTENCIA AL LECTOR',
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
