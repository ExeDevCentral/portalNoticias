export interface PressPhoto {
  url: string;
  caption: string;
  credit: string;
  tags: string[];
}

export const PRESS_PHOTO_CATALOG: Record<string, PressPhoto> = {
  monumento_belgrano: {
    url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    caption: 'Monumento Nacional a la Bandera sobre las barrancas del río Paraná en Rosario, sitio histórico del 27 de febrero de 1812.',
    credit: 'Archivo Fotográfico de Prensa Rosario',
    tags: ['belgrano', 'monumento', 'bandera', 'barrancas', 'historia', 'civica', 'ciudad'],
  },
  puerto_urquiza: {
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    caption: 'Terminal portuaria y dársenas del Gran Rosario sobre la Hidrovía Paraná-Paraguay, polo exportador consagrado desde 1852.',
    credit: 'Cámara de Puertos Fluviales',
    tags: ['urquiza', 'puerto', 'hidrovia', 'hidrovía', 'parana', 'paraná', 'granos', 'barcos', 'buques', 'economia'],
  },
  central_arroyito: {
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    caption: 'El Gigante de Arroyito en el norte rosarino, mítico bastión de Rosario Central junto al río Paraná.',
    credit: 'Departamento de Prensa Rosario Central',
    tags: ['central', 'arroyito', 'canalla', 'rosario central', 'futbol', 'deportes'],
  },
  newells_coloso: {
    url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Estadio Coloso Marcelo Bielsa en el Parque de la Independencia, corazón de la pasión rojinegra de Newell’s Old Boys.',
    credit: 'Prensa Club Atlético Newell’s Old Boys',
    tags: ['newell', 'newells', 'coloso', 'bielsa', 'leproso', 'parque', 'futbol', 'deportes'],
  },
  bolsa_comercio: {
    url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Recinto de operaciones de la Bolsa de Comercio de Rosario, centro de cotizaciones agrícolas de la Región Centro.',
    credit: 'Bolsa de Comercio de Rosario',
    tags: ['bolsa', 'dolar', 'dólar', 'soja', 'finanzas', 'mercados', 'comercio'],
  },
  casa_rosada_federal: {
    url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    caption: 'Sede del Gobierno nacional en Buenos Aires durante debates con gobernadores de las provincias federales.',
    credit: 'Agencia de Noticias Nacionales',
    tags: ['politica', 'congreso', 'nacion', 'nación', 'gobierno', 'federal', 'buenos aires'],
  },
  mundo_diplomacia: {
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    caption: 'Sede diplomática internacional durante deliberaciones de cúpulas multilaterales.',
    credit: 'Archivo de Agencias Internacionales',
    tags: ['internacional', 'mundo', 'cumbre', 'diplomacia', 'geopolitica'],
  },
};
