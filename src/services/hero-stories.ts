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
    tag: 'OBRA HISTÓRICA',
    title: 'Finalizan las obras históricas en el Monumento y la ribera: reabren la cripta y el paseo frente al Paraná',
    summary: 'Tras una intervención integral de ingeniería patrimonial, se habilitan la cripta, el propileo y el circuito costero con nueva iluminación nocturna.',
    hook: 'Tras 8 años de andamios y promesas postergadas, Rosario recupera su mayor balcón fluvial con acceso público libre y vista panorámica a la Hidrovía.',
    keyFacts: ['Mirador nocturno habilitado', 'Esculturas de Lola Mora restauradas', 'Paseo costero integrado'],
    time: 'Hace 4 min',
    readingTime: '3 min',
    source: 'La Capital',
    sourceUrl: 'https://www.lacapital.com.ar/la-ciudad/finalizaron-obras-monumento-bandera.html',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'var(--blue-parana)',
    isBreaking: true,
  },
  {
    id: 'seguridad-circunvalacion',
    slug: 'operativo-seguridad-circunvalacion-autopista-santa-fe-niebla',
    category: 'SEGURIDAD CIUDADANA',
    tag: 'OPERATIVO METROPOLITANO',
    title: 'Anillo digital inteligente y 180 domos con IA blindan todos los accesos a Circunvalación',
    summary: 'El nuevo centro de monitoreo metropolitano incorpora reconocimiento automático de patentes y patrullajes preventivos coordinados en tiempo real.',
    hook: 'Algoritmos de visión computarizada escanean cada vehículo al ingresar por autopistas y despachan alertas a móviles en menos de 90 segundos.',
    keyFacts: ['180 domos 4K activos', 'Lectura de patentes en 3ms', 'Monitoreo 24hs coordinado'],
    time: 'Hace 11 min',
    readingTime: '4 min',
    source: 'Rosario3 / Seguridad',
    sourceUrl: 'https://www.rosario3.com/policiales/operativo-circunvalacion-niebla.html',
    imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'var(--red-urgent)',
    isBreaking: true,
  },
  {
    id: 'clasico-rosarino',
    slug: 'rosario-central-gigante-arroyito-socios-agotaron-plateas',
    category: 'CLÁSICO ROSARINO',
    tag: 'PASIÓN DE LA CIUDAD',
    title: "Semana de Clásico: Central colma el Gigante y Newell's afina la táctica en Bella Vista",
    summary: '45.000 socios auriazules agotaron las ubicaciones en tiempo récord mientras el rojinegro define su alineación titular a puertas cerradas.',
    hook: 'La ciudad paraliza su pulso cotidiano: entradas agotadas en 40 minutos y operativo con 1.100 efectivos para una cita que no admite tibiezas.',
    keyFacts: ['Gigante de Arroyito repleto', 'Dupla goleadora de la Lepra lista', 'Seguridad con 1.100 efectivos'],
    time: 'Hace 18 min',
    readingTime: '2 min',
    source: 'Rosario3 Deportes',
    sourceUrl: 'https://www.lacapital.com.ar/ovacion/central-entradas-arroyito.html',
    imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'var(--amber-alert)',
    isBreaking: true,
  },
  {
    id: 'hidrovia-puerto',
    slug: 'puerto-san-lorenzo-timbues-embarque-record-granos',
    category: 'ECONOMÍA & PUERTO',
    tag: 'RÉCORD AGROINDUSTRIAL',
    title: 'Terminales portuarias del Gran Rosario alcanzan el mayor movimiento de buques de la década',
    summary: 'La profundización de la Hidrovía Paraná-Paraguay y la cosecha récord disparan las exportaciones con más de doce millones de toneladas despachadas.',
    hook: 'Por el Paraná marrón sale el 80% de los granos del país, generando más divisas que toda la City porteña con 80 buques en rada.',
    keyFacts: ['12M de toneladas despachadas', 'Calado a 34 pies garantizado', 'Récord histórico de divisas'],
    time: 'Hace 32 min',
    readingTime: '5 min',
    source: 'Bolsa de Comercio',
    sourceUrl: 'https://www.bcr.com.ar/noticias/puertos-record-granos.html',
    imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'var(--blue-parana)',
  },
  {
    id: 'cultura-pichincha',
    slug: 'noche-galerias-pichincha-circuito-nocturno',
    category: 'CULTURA & VANGUARDIA',
    tag: 'CIRCUITO NOCTURNO',
    title: 'La Noche de las Galerías en Pichincha y el Bajo convoca a miles de jóvenes frente al río',
    summary: 'Más de 40 talleres de artistas, centros culturales y polos gastronómicos abren simultáneamente con intervenciones lumínicas y música en vivo.',
    hook: 'De prostíbulos de 1900 a polo de diseño independiente: el barrio festeja con arte en las veredas, cerveza artesanal y carlitos al paso.',
    keyFacts: ['40 talleres de artistas abiertos', 'Intervenciones lumínicas', 'Circuito peatonal protegido'],
    time: 'Hace 45 min',
    readingTime: '3 min',
    source: 'Cultura Rosario',
    sourceUrl: 'https://www.rosario.gob.ar/cultura/noche-galerias-pichincha.html',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#8B5CF6',
  },
];
