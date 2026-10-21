export interface NewsStory {
  id: string;
  slug: string;
  category: string;
  tag: string;
  title: string;
  summary: string;
  hook: string;
  keyFacts?: string[];
  time: string;
  readingTime: string;
  source: string;
  sourceUrl?: string;
  imageUrl: string;
  accentColor: string;
  isBreaking?: boolean;
}

export const DEFAULT_STORIES: NewsStory[] = [
  {
    id: 'costanera-parana',
    slug: 'obras-restauracion-monumento-nacional-a-la-bandera',
    category: 'INFRAESTRUCTURA & RÍO',
    tag: 'OBRA PATRIMONIAL',
    title: 'Finalizan las obras de restauración en el Monumento y la ribera: reabren la cripta y el paseo frente al Paraná',
    summary: 'Tras una intervención integral de ingeniería patrimonial, se habilitan la cripta, el propileo y el circuito costero con nueva iluminación nocturna.',
    hook: 'Tras una exhaustiva restauración patrimonial integral, la ciudad recupera su principal balcón fluvial con acceso público y vista panorámica a la Hidrovía.',
    keyFacts: ['Mirador público habilitado', 'Puesta en valor de la cripta y el propileo', 'Circuito costero integrado'],
    time: 'Hace 4 min',
    readingTime: '3 min',
    source: 'La Capital',
    sourceUrl: 'https://www.lacapital.com.ar/la-ciudad/finalizaron-obras-monumento-bandera.html',
    imageUrl: '/images/hero/monumento-bandera.jpg',
    accentColor: 'var(--blue-parana)',
    isBreaking: true,
  },
  {
    id: 'seguridad-circunvalacion',
    slug: 'operativo-seguridad-circunvalacion-autopista-santa-fe-niebla',
    category: 'SEGURIDAD CIUDADANA',
    tag: 'MONITOREO METROPOLITANO',
    title: 'El anillo digital de monitoreo y 180 domos con IA refuerzan la vigilancia en todos los accesos metropolitanos',
    summary: 'El nuevo centro de control operativo incorpora reconocimiento automático de patentes y patrullajes preventivos coordinados en tiempo real.',
    hook: 'Sistemas de visión computarizada monitorean los corredores viales estratégicos y coordinan despachos preventivos en tiempo real con móviles policiales.',
    keyFacts: ['180 domos 4K operativos', 'Lectura de patentes en tiempo real', 'Monitoreo coordinado 24hs'],
    time: 'Hace 11 min',
    readingTime: '4 min',
    source: 'Rosario3 / Seguridad',
    sourceUrl: 'https://www.rosario3.com/policiales/operativo-circunvalacion-niebla.html',
    imageUrl: '/images/hero/circunvalacion-seguridad.jpg',
    accentColor: 'var(--red-urgent)',
    isBreaking: true,
  },
  {
    id: 'clasico-rosarino',
    slug: 'rosario-central-gigante-arroyito-socios-agotaron-plateas',
    category: 'CLÁSICO ROSARINO',
    tag: 'LIGA PROFESIONAL',
    title: "Semana de Clásico: Central colma el Gigante y Newell's afina la táctica en Bella Vista",
    summary: '45.000 socios auriazules agotaron las ubicaciones en tiempo récord mientras el plantel rojinegro define su alineación titular a puertas cerradas.',
    hook: 'La ciudad vive la antesala del encuentro deportivo más trascendente del Litoral: localidades agotadas y un dispositivo especial con 1.100 efectivos.',
    keyFacts: ['Gigante de Arroyito con localidades agotadas', 'Ensayos tácticos a puertas cerradas', 'Operativo de seguridad coordinado'],
    time: 'Hace 18 min',
    readingTime: '2 min',
    source: 'Rosario3 Deportes',
    sourceUrl: 'https://www.lacapital.com.ar/ovacion/central-entradas-arroyito.html',
    imageUrl: '/images/hero/clasico-rosarino.jpg',
    accentColor: 'var(--amber-alert)',
    isBreaking: true,
  },
  {
    id: 'hidrovia-puerto',
    slug: 'puerto-san-lorenzo-timbues-embarque-record-granos',
    category: 'ECONOMÍA & PUERTO',
    tag: 'LOGÍSTICA EXPORTADORA',
    title: 'Las terminales portuarias del Gran Rosario alcanzan el mayor movimiento de buques de la década',
    summary: 'El calado sostenido sobre la Hidrovía Paraná-Paraguay y la cosecha récord disparan las exportaciones con más de doce millones de toneladas despachadas.',
    hook: 'El nodo portuario del Gran Rosario concentra el 80% de las exportaciones agroindustriales del país con decenas de buques de ultramar operando en rada.',
    keyFacts: ['12 millones de toneladas despachadas', 'Calado efectivo garantizado a 34 pies', 'Máxima actividad agroindustrial'],
    time: 'Hace 32 min',
    readingTime: '5 min',
    source: 'Bolsa de Comercio',
    sourceUrl: 'https://www.bcr.com.ar/noticias/puertos-record-granos.html',
    imageUrl: '/images/hero/puerto-hidrovia.jpg',
    accentColor: 'var(--blue-parana)',
  },
  {
    id: 'cultura-pichincha',
    slug: 'noche-galerias-pichincha-circuito-nocturno',
    category: 'CULTURA & VANGUARDIA',
    tag: 'AGENDA URBANA',
    title: 'La Noche de las Galerías en Pichincha y el Bajo convoca a miles de ciudadanos frente al río',
    summary: 'Más de 40 talleres de artistas, centros culturales y espacios gastronómicos abren simultáneamente con intervenciones lumínicas y música en vivo.',
    hook: 'El histórico distrito de Pichincha consolida su perfil como polo de industrias creativas con circuitos peatonales, exposiciones abiertas y agenda comunitaria.',
    keyFacts: ['40 espacios culturales abiertos', 'Intervenciones lumínicas y artes visuales', 'Circuito peatonal protegido'],
    time: 'Hace 45 min',
    readingTime: '3 min',
    source: 'Cultura Rosario',
    sourceUrl: 'https://www.rosario.gob.ar/cultura/noche-galerias-pichincha.html',
    imageUrl: '/images/hero/pichincha-cultura.jpg',
    accentColor: '#8B5CF6',
  },
];
