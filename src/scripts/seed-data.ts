import { NewsRepository } from '../db/news-repository';

export async function seedDatabase(repo: NewsRepository) {
  // Pinned Lead Story
  await repo.createNewsItem({
    title: 'Finalizaron las obras de restauración histórica en el Monumento Nacional a la Bandera',
    slug: 'obras-restauracion-monumento-nacional-a-la-bandera',
    summary: 'La cripta, el propileo y las esculturas de Lola Mora recuperaron su esplendor original tras una intervención integral de ingeniería y preservación patrimonial.',
    content: `
      <p>ROSARIO. Con la presencia de autoridades nacionales y provinciales, quedaron oficialmente habilitadas las renovadas instalaciones del Monumento a la Bandera frente al río Paraná.</p>
      <p>Las tareas incluyeron la impermeabilización de la torre central, la puesta en valor de los bajorrelieves escultóricos de Alfredo Bigatti y José Fioravanti, y una moderna iluminación LED que resalta el perfil del mármol travertino durante las noches.</p>
      <p>"Es una jornada de orgullo cívico para todos los rosarinos y un acto de justicia histórica hacia el símbolo máximo de nuestra identidad", destacaron los voceros del área de planeamiento.</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    source: 'La Capital',
    sourceUrl: 'https://www.lacapital.com.ar/la-ciudad/finalizaron-obras-monumento-bandera.html',
    category: 'ciudad',
    isUrgent: false,
    isPinned: true,
    publishedAt: new Date(Date.now() - 3600000 * 2),
  });

  // Urgent News
  await repo.createNewsItem({
    title: 'Operativo conjunto de seguridad en Circunvalación y autopista a Santa Fe por niebla espesa',
    slug: 'operativo-seguridad-circunvalacion-autopista-santa-fe-niebla',
    summary: 'Gendarmería y Policía Vial implementaron tránsito asistido y desvíos preventivos ante visibilidad reducida a menos de cien metros.',
    content: `
      <p>Debido a bancos de niebla y humo en los accesos norte y sur del Gran Rosario, rige máxima precaución para circular.</p>
      <p>Se solicita a los conductores mantener distancia de frenado y luces bajas encendidas.</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80',
    source: 'Rosario3',
    sourceUrl: 'https://www.rosario3.com/policiales/operativo-circunvalacion-niebla.html',
    category: 'seguridad',
    isUrgent: true,
    isPinned: false,
    publishedAt: new Date(Date.now() - 3600000),
  });

  // Sports: Newell's & Central
  await repo.createNewsItem({
    title: 'Newell’s afina la alineación en Bella Vista con dos retornos clave para el domingo',
    slug: 'newells-afina-alineacion-bella-vista-retornos-clave',
    summary: 'El entrenador rojinegro dispuso una práctica formal de fútbol en el complejo deportivo y evalúa cambios en el mediocampo ofensivo.',
    content: `
      <p>El plantel leproso completó una intensa sesión matutina pensando en el compromiso por la Liga Profesional.</p>
      <p>Con el regreso de los suspendidos, el cuerpo técnico confía en recuperar dinámica y profundidad ofensiva.</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    source: 'El Ciudadano',
    sourceUrl: 'https://www.elciudadanoweb.com/deportes/newells-practica-bella-vista.html',
    category: 'deportes',
    isUrgent: false,
    isPinned: false,
    publishedAt: new Date(Date.now() - 3600000 * 4),
  });

  await repo.createNewsItem({
    title: 'Rosario Central colmará el Gigante de Arroyito con socios que agotaron las plateas',
    slug: 'rosario-central-gigante-arroyito-socios-agotaron-plateas',
    summary: 'La masa societaria canalla canjeó la totalidad de ubicaciones habilitadas en tiempo récord de cara al próximo duelo en casa.',
    content: `
      <p>Una marea auriazul volverá a copar las tribunas junto al Paraná.</p>
      <p>Desde la sede de calle Mitre confirmaron que las puertas se abrirán con tres horas de antelación para agilizar el ingreso.</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=800&q=80',
    source: 'La Capital',
    sourceUrl: 'https://www.lacapital.com.ar/ovacion/central-entradas-arroyito.html',
    category: 'deportes',
    isUrgent: false,
    isPinned: false,
    publishedAt: new Date(Date.now() - 3600000 * 5),
  });

  // Economy: Puerto & Hidrovía
  await repo.createNewsItem({
    title: 'El puerto de San Lorenzo y Timbúes registra un embarque récord de granos en el trimestre',
    slug: 'puerto-san-lorenzo-timbues-embarque-record-granos',
    summary: 'La Cámara de Actividades Portuarias confirmó el despacho de más de doce millones de toneladas hacia mercados asiáticos y europeos.',
    content: `
      <p>Las terminales portuarias del cordón fluvial mantuvieron un ritmo operativo ininterrumpido a lo largo del último mes.</p>
      <p>El calado sobre la Hidrovía Paraná-Paraguay permitió el ingreso regular de buques de gran porte sin demoras extraordinarias.</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    source: 'Bolsa de Comercio',
    sourceUrl: 'https://www.bcr.com.ar/noticias/puertos-record-granos.html',
    category: 'economia',
    isUrgent: false,
    isPinned: false,
    publishedAt: new Date(Date.now() - 3600000 * 6),
  });

  // Politics: Gobernación & Municipio
  await repo.createNewsItem({
    title: 'Provincia y Municipio coordinan nuevas obras de pavimentación e iluminación en los barrios de Rosario',
    slug: 'provincia-municipio-coordinan-obras-pavimentacion-barrios',
    summary: 'El plan conjunto abarcará más de doscientas cuadras en los distritos sudoeste y oeste con financiamiento compartido.',
    content: `
      <p>En el marco del plan de cercanía barrial, se licitarán trabajos de cloacas, carpeta asfáltica y renovación lumínica.</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    source: 'Gobierno de Santa Fe',
    sourceUrl: 'https://www.santafe.gov.ar/noticias/obras-rosario-barrios.html',
    category: 'politica',
    isUrgent: false,
    isPinned: false,
    publishedAt: new Date(Date.now() - 3600000 * 8),
  });

  // Live Alert
  await repo.createLiveAlert({
    title: 'Precaución en el Puente Rosario-Victoria por ráfagas de viento del sudeste',
    level: 'warning',
    active: true,
  });
}
