import { NewsRepository } from '../../db/news-repository';
import { LiveBroadcaster } from '../live/live-broadcaster';
import { PRESS_PHOTO_CATALOG, PressPhoto } from './photo-catalog';
import { slugify } from '../../utils/slugify';

export const EDITORIAL_PROMPT_DNA = `
ERES EL BOT DE REDACCIÓN AUTÓNOMA DE "ROSARIO EN TIEMPO REAL".
Tu entrenamiento y criterio editorial se fundamentan en los pilares innegociables de la identidad rosarina y su manual de iniciación:

1. EL DESACATO ÉTICO DE LAS BARRANCAS (1812):
   - La primera vez que flameó la enseña patria fue en las barrancas del río Paraná en Rosario el 27 de febrero de 1812.
   - Cuando el poder central de Buenos Aires ordenó guardarla y disimularla por temor diplomático, el pueblo y las tropas desobedecieron con dignidad insumisa.
   - De allí heredamos el coraje cívico, el orgullo del Pago de los Arroyos y la negativa histórica a arrodillarse ante el centralismo porteño.
   - Rosario sancionó por ley ser Capital Federal tres veces (1868, 1869, 1873) y fue vetada por recelo del puerto de Buenos Aires.

2. EL PRAGMATISMO FEDERAL Y PORTUARIO DEL PARANÁ (1852):
   - En agosto de 1852, la comarca fue declarada Ciudad y su puerto fue abierto formalmente al comercio mundial con derechos diferenciales.
   - Se quebró el monopolio asfixiante de la aduana de Buenos Aires y se consolidó la Hidrovía Paraná-Paraguay como arteria exportadora por donde sale el 80% de la harina y aceite de soja.
   - El Paraná es marrón, espeso y majestuoso: lleva en su corriente más dólares que toda la City porteña, mientras Rosario paga la nafta más cara y en Balcarce 50 festejan retenciones con aire acondicionado.
   - Calado oficial en 34 pies; Panamax operando 28 horas continuas al son de cumbia santafesina.

3. LA RELIGIÓN BÍBLICA DEL CLÁSICO: ROSARIO CENTRAL VS. NEWELL'S OLD BOYS:
   - En Rosario el fútbol es religión binaria, vitalicia e irreversible hasta la cremación; Boca y River producen lástima antropológica.
   - Rosario Central (fundado en 1889 en los talleres del Central Argentine Railway por Thomas Molineux y obreros entre calderas, vapor y carbón; adoptó el mote de "Canallas" como orgullo obrero tras negarse al partido benéfico del Hospital Carrasco).
   - Newell's Old Boys (fundado en 1903 en el Parque de la Independencia por egresados del Colegio Anglo-Argentino de Isaac Newell y Anna Jockinsen; adoptó el mote de "Leprosos" como estandarte invencible tras aceptar jugar por los enfermos de lepra).
   - Primer mandamiento: prohibida la tibieza. No existe ser simpatizante de River o Boca; semejante afirmación es causal de compasión médica inmediata.

4. CRITERIO EDITORIAL Y NOTAS AL PASO:
   - Gran prosa informativa: método de las 5 Ws, datos contrastados y solemnidad de imprenta tradicional.
   - Rigor analítico y contexto geopolítico: se desglosa el lenguaje de los despachos oficiales y corporativos, aportando claves interpretativas, advertencias económicas y notas al pie sin alterar el despacho original.
   - Cobertura equilibrada: ciclo de 12 horas que abarca Rosario, la Región Centro, la Argentina federal y los cables del Mundo leídos desde la orilla del Paraná.
`;

export interface ContextPhotoQuery {
  title: string;
  category?: string;
  tags?: string[];
}

export function matchPhotoForContext(query: ContextPhotoQuery): PressPhoto {
  const text = `${query.title} ${query.category || ''} ${(query.tags || []).join(' ')}`.toLowerCase();

  // 1. Newell's Old Boys / Coloso Marcelo Bielsa / Banderazo
  if (
    text.includes('newell') ||
    text.includes('coloso') ||
    text.includes('bielsa') ||
    text.includes('leproso') ||
    text.includes('banderazo') ||
    text.includes('rojinegr') ||
    text.includes('parque de la independencia')
  ) {
    return PRESS_PHOTO_CATALOG.newells_coloso;
  }

  // 2. Rosario Central / Gigante de Arroyito / Canalla
  if (
    text.includes('central') ||
    text.includes('arroyito') ||
    text.includes('canalla') ||
    text.includes('auriazul') ||
    text.includes('gigante')
  ) {
    return PRESS_PHOTO_CATALOG.central_arroyito;
  }

  // 3. Monumento a la Bandera / Barrancas del Paraná / Memoria Cívica
  if (
    text.includes('monumento') ||
    text.includes('barranca') ||
    /\b(bandera|pabellón|pabellon)\b/i.test(text)
  ) {
    return PRESS_PHOTO_CATALOG.monumento_bandera;
  }

  // 4. Puerto de Rosario / Hidrovía / Navegación fluvial
  if (
    text.includes('puerto') ||
    text.includes('hidrov') ||
    text.includes('buque') ||
    text.includes('barco') ||
    text.includes('grano') ||
    text.includes('paraná') ||
    text.includes('parana')
  ) {
    return PRESS_PHOTO_CATALOG.puerto_rosario;
  }

  if (
    text.includes('bolsa') ||
    text.includes('dolar') ||
    text.includes('dólar') ||
    text.includes('soja') ||
    text.includes('mercado') ||
    text.includes('tasa')
  ) {
    return PRESS_PHOTO_CATALOG.bolsa_comercio;
  }

  if (
    text.includes('buenos aires') ||
    text.includes('congreso') ||
    text.includes('casa rosada') ||
    text.includes('nacion') ||
    text.includes('nación') ||
    text.includes('presidente') ||
    text.includes('federal')
  ) {
    return PRESS_PHOTO_CATALOG.casa_rosada_federal;
  }

  if (text.includes('cumbre') || text.includes('mundo') || text.includes('internacional') || text.includes('diplom')) {
    return PRESS_PHOTO_CATALOG.mundo_diplomacia;
  }

  // Fallback seguro de prensa
  return PRESS_PHOTO_CATALOG.puerto_rosario;
}

export interface GeneratedArticle {
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  imageCaption: string;
  source: string;
  sourceUrl: string;
  category: 'ciudad' | 'deportes' | 'economia' | 'politica' | 'sociedad';
  isUrgent: boolean;
  isPinned: boolean;
}

export function generateRosarinoEdition(): GeneratedArticle[] {
  const baseArticles: Omit<GeneratedArticle, 'sourceUrl'>[] = [
    {
      title: 'Récord en la Hidrovía: sesenta buques graneleros operan en simultáneo en el Gran Rosario',
      summary: 'Las terminales de la Hidrovía Paraná-Paraguay registran una operatoria ininterrumpida mientras la Bolsa de Comercio monitorea cotizaciones de exportación.',
      content: `
        <p><strong>ROSARIO (De nuestra Redacción).</strong> Desde aquel hito fundacional de 1852 que reconoció a Rosario formalmente como Ciudad y abrió sus muelles al mundo, el río Paraná nunca detuvo su compás mercantil.</p>
        <p>Durante la jornada de hoy, más de sesenta barcos de ultramar aguardan y completan carga en las dársenas del cordón portuario. La marea de granos proveniente de catorce provincias ratifica que la riqueza del país se forja río abajo, pese a las reiteradas demoras burocráticas emanadas desde los escritorios capitalinos.</p>
        <p><em>"El puerto de Rosario no es una concesión administrativa: es el destino geográfico de la Argentina productiva"</em>, recordaron voceros del sector portuario consultados al cierre del despacho vespertino.</p>
      `.trim(),
      imageUrl: PRESS_PHOTO_CATALOG.puerto_rosario.url,
      imageCaption: PRESS_PHOTO_CATALOG.puerto_rosario.caption,
      source: 'Redacción Rosario (Economía & Puerto)',
      category: 'economia',
      isUrgent: false,
      isPinned: true,
    },
    {
      title: "Clásico de la pasión irreductible: Newell's y Central paralizan la ciudad sin espacio para la tibieza",
      summary: 'El Parque de la Independencia y Arroyito afinan banderas y cánticos en una semana donde no existe otro tema de conversación en esquinas y bares.',
      content: `
        <p><strong>ROSARIO (De nuestra Redacción).</strong> En ninguna otra latitud del mapa civil el fútbol ejerce semejante mandato existencial. Con Newell’s Old Boys preparando el Coloso Marcelo Bielsa y Rosario Central templando gargantas junto al río, la ciudad se sumerge en su liturgia bimestral.</p>
        <p>Ambos planteles completaron turnos tácticos a puertas cerradas, aunque en los pasillos de Pellegrini y las avenidas costeras el veredicto popular ya está dictado: el orgullo cívico del barrio no admite negociaciones diplomáticas.</p>
        <p>Como advertía la pluma de Fontanarrosa, no se trata únicamente de once voluntades corriendo tras una pelota; se trata del ordenamiento espiritual de la semana laborable.</p>
      `.trim(),
      imageUrl: PRESS_PHOTO_CATALOG.central_arroyito.url,
      imageCaption: PRESS_PHOTO_CATALOG.central_arroyito.caption,
      source: 'Redacción Deportes Rosario',
      category: 'deportes',
      isUrgent: true,
      isPinned: false,
    },
    {
      title: 'Vigilia cívica en las barrancas: la memoria del pabellón patrio y el desacato fundacional frente al río',
      summary: 'Convocan a una vigilia ciudadana junto al Monumento a la Bandera para recordar la histórica desobediencia civil que dio nacimiento al pabellón nacional.',
      content: `
        <p><strong>ROSARIO (De nuestra Redacción).</strong> Aquel 27 de febrero de 1812, cuando las tropas patriotas se formaron en la Batería Libertad y enarbolaron los colores celestes y blancos contra las órdenes expresas del Triunvirato porteño, fundaron mucho más que una insignia: instituyeron la rebeldía rosarina.</p>
        <p>Vecinos, historiadores y estudiantes se congregarán esta noche al pie de la torre de piedra para rememorar la estirpe de una ciudad que no nació por decreto de ningún adelantado español, sino por el aliento espontáneo de sus propios habitantes ribereños.</p>
        <p>La proclama fundacional sigue resonando intacta en la memoria viva de las barrancas.</p>
      `.trim(),
      imageUrl: PRESS_PHOTO_CATALOG.monumento_bandera.url,
      imageCaption: PRESS_PHOTO_CATALOG.monumento_bandera.caption,
      source: 'Redacción Ciudad & Memoria',
      category: 'ciudad',
      isUrgent: false,
      isPinned: false,
    },
    {
      title: 'Provincias unidas reclaman equidad fiscal: el interior federal exige coparticipación real de los recursos',
      summary: 'Gobernadores de la Región Centro advirtieron que los gravámenes originados en las cosechas del Litoral no pueden quedar retenidos en el puerto metropolitano.',
      content: `
        <p><strong>BUENOS AIRES / ROSARIO.</strong> En una reedición contemporánea de las viejas disputas entre el Pacto Federal y el centralismo porteño, mandatarios del Litoral y la Región Centro elevaron un pronunciamiento conjunto ante los ministerios nacionales.</p>
        <p>El reclamo subraya que los tributos generados en las plantas cerealeras santafesinas, cordobesas y entrerrianas deben transformarse en autopistas, dragado y seguridad para las comunidades que generan las divisas.</p>
        <p><em>"No admitiremos más la condición de furgón de cola de una aduana que gasta lo que el río produce"</em>, sentenciaron fuentes parlamentarias.</p>
      `.trim(),
      imageUrl: PRESS_PHOTO_CATALOG.casa_rosada_federal.url,
      imageCaption: PRESS_PHOTO_CATALOG.casa_rosada_federal.caption,
      source: 'Redacción Federal Rosario',
      category: 'politica',
      isUrgent: false,
      isPinned: false,
    },
    {
      title: 'Cumbres y diplomacia de ultramar: el comercio marítimo global gira su atención hacia la cuenca del Paraná',
      summary: 'Delegaciones comerciales de Europa y Asia iniciaron rondas técnicas para garantizar contratos de suministros agroalimentarios hacia el próximo semestre.',
      content: `
        <p><strong>GINEBRA / ROSARIO.</strong> Los despachos procedentes de los foros internacionales de comercio ratifican el peso estratégico de la cuenca del Plata en el abastecimiento alimentario mundial.</p>
        <p>Pese a las tensiones arancelarias y las cambiantes normativas de Bruselas y Pekín, las terminales rosarinas continúan siendo reconocidas por su capacidad de calado y eficiencia de embarque.</p>
        <p>La Redacción constató que las órdenes de compra para el segundo trimestre marcan una sólida demanda de derivados proteicos y harinas de soja.</p>
      `.trim(),
      imageUrl: PRESS_PHOTO_CATALOG.mundo_diplomacia.url,
      imageCaption: PRESS_PHOTO_CATALOG.mundo_diplomacia.caption,
      source: 'Corresponsalía Redacción Internacional',
      category: 'sociedad',
      isUrgent: false,
      isPinned: false,
    },
  ];

  return baseArticles.map((art) => ({
    ...art,
    sourceUrl: `https://rosarioentiempreal.com.ar/noticia/${slugify(art.title)}`,
  }));
}

export async function publishRosarinoEdition(
  repo: NewsRepository,
  broadcaster?: LiveBroadcaster
): Promise<{ count: number; titles: string[] }> {
  const articles = generateRosarinoEdition();
  const publishedTitles: string[] = [];

  for (const article of articles) {
    const created = await repo.createNewsItem({
      title: article.title,
      summary: article.summary,
      content: article.content,
      imageUrl: article.imageUrl,
      source: article.source,
      sourceUrl: article.sourceUrl,
      category: article.category,
      isUrgent: article.isUrgent,
      isPinned: article.isPinned,
      publishedAt: new Date(),
    });

    if (created) {
      publishedTitles.push(created.title);
      if (broadcaster) {
        broadcaster.publish({
          type: 'news_item',
          payload: {
            id: created.id,
            title: created.title,
            slug: created.slug,
            category: created.category,
            isUrgent: created.isUrgent,
            publishedAt: created.publishedAt,
          },
        });
      }
    }
  }

  return {
    count: publishedTitles.length,
    titles: publishedTitles,
  };
}
