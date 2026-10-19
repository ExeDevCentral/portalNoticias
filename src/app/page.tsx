'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import HeroOrbital, { DEFAULT_STORIES, NewsStory } from '../components/HeroOrbital';
import CronicasRosarinas, { RosarioSection } from '../components/CronicasRosarinas';
import { IconSun, IconMoon, IconArrowRight } from '../components/Icons';
import BreakingTicker from '../components/BreakingTicker';
import LiveFeedWire from '../components/LiveFeedWire';
import CategoryBlock from '../components/CategoryBlock';
import WorldKiosk from '../components/WorldKiosk';
import Footer from '../components/Footer';
import { NewsItem } from '../db/schema';

const sectionToStoryIndex: Record<RosarioSection, number> = {
  portada: 0,
  seguridad: 1,
  futbol: 2,
  economia: 3,
  cultura: 4,
};

const storyIndexToSection: Record<number, RosarioSection> = {
  0: 'portada',
  1: 'seguridad',
  2: 'futbol',
  3: 'economia',
  4: 'cultura',
};

const NAV_ITEMS: { key: RosarioSection; label: string }[] = [
  { key: 'portada', label: 'Portada 3D' },
  { key: 'seguridad', label: 'Seguridad & Ciudad' },
  { key: 'economia', label: 'Economía & Puerto' },
  { key: 'futbol', label: "Fútbol: Newell's / Central" },
  { key: 'cultura', label: 'Cultura & Noche' },
];

export default function HomePage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [selectedSection, setSelectedSection] = useState<RosarioSection>('portada');
  const [liveNews, setLiveNews] = useState<NewsItem[]>([]);
  const [urgentNews, setUrgentNews] = useState<{ id: string; title: string; slug?: string }[]>([]);
  const [categoryNews, setCategoryNews] = useState<{
    deportes: NewsItem[];
    seguridad: NewsItem[];
    economia: NewsItem[];
  }>({ deportes: [], seguridad: [], economia: [] });

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.dataset.theme = saved;
    } else {
      document.documentElement.dataset.theme = 'dark';
    }

    fetch('/api/news')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          if (res.data.feed) setLiveNews(res.data.feed);
          if (res.data.urgent) setUrgentNews(res.data.urgent);
          if (res.data.byCategory) {
            setCategoryNews({
              deportes: res.data.byCategory.deportes || [],
              seguridad: res.data.byCategory.seguridad || [],
              economia: res.data.byCategory.economia || [],
            });
          }
        }
      })
      .catch((err) => console.error('Error fetching live news:', err));
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.dataset.theme = next;
  };

  const handleSelectSection = (section: RosarioSection) => {
    setSelectedSection(section);
  };

  // Derivar las 5 historias con gancho real a partir de liveNews o DEFAULT_STORIES
  const orbitalStories = React.useMemo<NewsStory[]>(() => {
    if (!liveNews || liveNews.length === 0) return DEFAULT_STORIES;

    const rioItem = liveNews.find((n) => n.isPinned || n.category === 'ciudad' || n.category === 'sociedad');
    const segItem = liveNews.find((n) => n.category === 'seguridad');
    const futItem = liveNews.find((n) => n.category === 'deportes');
    const ecoItem = liveNews.find((n) => n.category === 'economia');
    const cultItem = liveNews.find((n) => (n.category === 'ciudad' || n.category === 'sociedad') && n.id !== rioItem?.id);

    return [
      rioItem
        ? {
            id: 'costanera-parana',
            slug: rioItem.slug,
            category: 'INFRAESTRUCTURA & RÍO',
            tag: rioItem.isPinned ? 'PORTADA PRINCIPAL' : 'OBRA HISTÓRICA',
            title: rioItem.title,
            summary: rioItem.summary,
            hook: 'Tras 8 años de obras y promesas postergadas, Rosario recupera su mayor balcón fluvial con acceso público libre y vista panorámica al Paraná.',
            keyFacts: ['Mirador nocturno habilitado', 'Esculturas de Lola Mora restauradas', 'Paseo costero integrado'],
            time: 'Hace 4 min',
            readingTime: '3 min',
            source: rioItem.source,
            sourceUrl: rioItem.sourceUrl,
            imageUrl: rioItem.imageUrl || DEFAULT_STORIES[0].imageUrl,
            accentColor: 'var(--blue-parana)',
            isBreaking: true,
          }
        : DEFAULT_STORIES[0],
      segItem
        ? {
            id: 'seguridad-circunvalacion',
            slug: segItem.slug,
            category: 'SEGURIDAD CIUDADANA',
            tag: 'OPERATIVO METROPOLITANO',
            title: segItem.title,
            summary: segItem.summary,
            hook: 'Algoritmos de visión computarizada escanean cada vehículo al ingresar por autopistas y despachan alertas a móviles en menos de 90 segundos.',
            keyFacts: ['180 domos 4K activos', 'Lectura de patentes en 3ms', 'Monitoreo 24hs coordinado'],
            time: 'Hace 11 min',
            readingTime: '4 min',
            source: segItem.source,
            sourceUrl: segItem.sourceUrl,
            imageUrl: segItem.imageUrl || DEFAULT_STORIES[1].imageUrl,
            accentColor: 'var(--red-urgent)',
            isBreaking: true,
          }
        : DEFAULT_STORIES[1],
      futItem
        ? {
            id: 'clasico-rosarino',
            slug: futItem.slug,
            category: 'CLÁSICO ROSARINO',
            tag: 'PASIÓN DE LA CIUDAD',
            title: futItem.title,
            summary: futItem.summary,
            hook: 'La ciudad paraliza su pulso cotidiano: entradas agotadas en 40 minutos y operativo con 1.100 efectivos para una cita que no admite tibiezas.',
            keyFacts: ['Gigante de Arroyito repleto', 'Dupla goleadora de la Lepra lista', 'Seguridad con 1.100 efectivos'],
            time: 'Hace 18 min',
            readingTime: '2 min',
            source: futItem.source,
            sourceUrl: futItem.sourceUrl,
            imageUrl: futItem.imageUrl || DEFAULT_STORIES[2].imageUrl,
            accentColor: 'var(--amber-alert)',
            isBreaking: true,
          }
        : DEFAULT_STORIES[2],
      ecoItem
        ? {
            id: 'hidrovia-puerto',
            slug: ecoItem.slug,
            category: 'ECONOMÍA & PUERTO',
            tag: 'RÉCORD AGROEXPORTADOR',
            title: ecoItem.title,
            summary: ecoItem.summary,
            hook: 'Por el Paraná marrón sale el 80% de los granos del país, generando más divisas que toda la City porteña con 80 buques en rada.',
            keyFacts: ['12M de toneladas despachadas', 'Calado a 34 pies garantizado', 'Récord histórico de divisas'],
            time: 'Hace 32 min',
            readingTime: '5 min',
            source: ecoItem.source,
            sourceUrl: ecoItem.sourceUrl,
            imageUrl: ecoItem.imageUrl || DEFAULT_STORIES[3].imageUrl,
            accentColor: 'var(--blue-parana)',
          }
        : DEFAULT_STORIES[3],
      cultItem
        ? {
            id: 'cultura-pichincha',
            slug: cultItem.slug,
            category: 'CULTURA & VANGUARDIA',
            tag: 'CIRCUITO NOCTURNO',
            title: cultItem.title,
            summary: cultItem.summary,
            hook: 'De prostíbulos de 1900 a polo de diseño independiente: el barrio festeja con arte en las veredas, cerveza artesanal y carlitos al paso.',
            keyFacts: ['40 talleres de artistas abiertos', 'Intervenciones lumínicas', 'Circuito peatonal protegido'],
            time: 'Hace 45 min',
            readingTime: '3 min',
            source: cultItem.source,
            sourceUrl: cultItem.sourceUrl,
            imageUrl: cultItem.imageUrl || DEFAULT_STORIES[4].imageUrl,
            accentColor: '#8B5CF6',
          }
        : DEFAULT_STORIES[4],
    ];
  }, [liveNews]);

  const handleStoryChange = (index: number) => {
    const nextSection = storyIndexToSection[index];
    if (nextSection) {
      setSelectedSection(nextSection);
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Barra superior de servicio y metadatos */}
      <div style={{ borderBottom: '1px solid var(--ink-faint)', padding: '6px 0', fontSize: '0.8rem', backgroundColor: 'var(--paper-elevated)' }}>
        <div className="editorial-container font-mono" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--ink-soft)' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ color: 'var(--ink)' }}>ROSARIO, SANTA FE</span>
            <span>•</span>
            <span>VIERNES 17 DE OCTUBRE DE 2026</span>
            <span>•</span>
            <span style={{ color: 'var(--blue-parana)', fontWeight: 600 }}>RÍO PARANÁ: 3.42M (CRECIENDO)</span>
            <span>•</span>
            <span>DÓLAR: $1.240 / $1.260</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span>CLIMA: 22°C (VIENTO DEL RÍO)</span>
            <button
              type="button"
              onClick={toggleTheme}
              style={{
                background: 'none',
                border: '1px solid var(--ink-faint)',
                padding: '3px 10px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                cursor: 'pointer',
                color: 'var(--ink)',
                borderRadius: '3px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600,
              }}
            >
              {theme === 'dark' ? (
                <>
                  <IconSun size={12} style={{ color: 'var(--marker-yellow)' }} />
                  <span>MODO DÍA</span>
                </>
              ) : (
                <>
                  <IconMoon size={12} style={{ color: 'var(--blue-parana)' }} />
                  <span>MODO NOCTURNO</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {urgentNews.length > 0 && <BreakingTicker items={urgentNews} />}

      <div className="editorial-container">
        {/* Cabecera Principal del Periódico */}
        <header style={{ textAlign: 'center', padding: '24px 0 12px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--red-urgent)',
                border: '1px solid var(--red-urgent)',
                padding: '2px 8px',
                borderRadius: '2px',
                letterSpacing: '0.1em',
              }}
            >
              PORTAL REGIONAL 24HS
            </span>
            <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', letterSpacing: '0.1em' }}>
              PAGO DE LOS ARROYOS & HISTORIA VIVA
            </span>
            <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--red-urgent)', fontWeight: 'bold' }}>
              ● CABLES EN DIRECTO
            </span>
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(2.5rem, 6.5vw, 5.2rem)',
              fontWeight: 900,
              letterSpacing: '-0.025em',
              lineHeight: 0.95,
              textTransform: 'uppercase',
              margin: '8px 0',
              color: 'var(--ink)',
            }}
          >
            Rosario En Tiempo Real
          </h1>

          <p
            className="font-body"
            style={{
              fontSize: '1.15rem',
              fontStyle: 'italic',
              color: 'var(--ink-soft)',
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            &ldquo;La velocidad de los cables, la jerarquía de un gran diario y la memoria rebelde de las barrancas&rdquo;
          </p>

          <div className="rule-double" />

          {/* Barra de Navegación Interactiva del Diario */}
          <nav
            className="font-mono"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '6px 0',
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              fontWeight: 600,
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              {NAV_ITEMS.map((item) => {
                const isSelected = selectedSection === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleSelectSection(item.key)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '6px 0',
                      color: isSelected ? 'var(--ink)' : 'var(--ink-soft)',
                      borderBottom: isSelected ? '2px solid var(--red-urgent)' : '2px solid transparent',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.82rem',
                      fontWeight: isSelected ? 700 : 500,
                      textTransform: 'uppercase',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <a
                href="#kiosco-mundial"
                style={{
                  border: '1px solid var(--ink)',
                  color: 'var(--ink)',
                  padding: '5px 12px',
                  textDecoration: 'none',
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: '3px',
                  backgroundColor: 'var(--paper-soft)',
                }}
              >
                <span>🌍 KIOSCO MUNDIAL</span>
              </a>
              <Link
                href="/redaccion"
                style={{
                  backgroundColor: 'var(--red-urgent)',
                  color: '#FFFFFF',
                  padding: '5px 14px',
                  textDecoration: 'none',
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: '3px',
                  boxShadow: '0 2px 8px var(--red-glow)',
                }}
              >
                <span>SALA DE REDACCIÓN EN VIVO</span>
                <IconArrowRight size={13} />
              </Link>
            </div>
          </nav>

          <div className="rule-single" />
        </header>
      </div>

      {/* SECCIÓN HERO ORBITAL 3D CON MICROANIMACIONES Y PARALLAX */}
      <HeroOrbital
        stories={orbitalStories}
        selectedIndex={sectionToStoryIndex[selectedSection]}
        onStoryChange={handleStoryChange}
      />

      <div className="editorial-container" style={{ marginTop: '36px' }}>

        {/* Ticker / Fe de Erratas Rotativa de Rosario */}
        <div
          className="font-mono"
          style={{
            backgroundColor: 'var(--paper-elevated)',
            border: '1px solid var(--ink-faint)',
            padding: '8px 14px',
            fontSize: '0.82rem',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ backgroundColor: 'var(--red-urgent)', color: '#FFF', padding: '1px 6px', fontWeight: 'bold' }}>
            FE DE ERRATAS:
          </span>
          <span style={{ color: 'var(--ink)' }}>
            En la edición de ayer donde dijimos <em>&ldquo;Un vecino porteño afirmó que el río Paraná es marrón y sin encanto&rdquo;</em>, debió decir <em>&ldquo;El susodicho fue escoltado pacíficamente de vuelta a la Autopista a Buenos Aires sin derecho a despedirse del carlitos&rdquo;</em>.
          </span>
        </div>

        {/* SISTEMA DE CRÓNICAS HISTÓRICAS & MANUAL AL PASO */}
        <CronicasRosarinas
          activeSection={selectedSection}
          onSelectSection={handleSelectSection}
        />

        {/* Grilla Principal Asimétrica */}
        <main
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'start',
            marginTop: '20px',
          }}
        >
          {/* Columna Principal: Lead Story (65% del peso visual) */}
          <article style={{ gridColumn: 'span 2' }}>
            <span className="badge-deadpan">INFORME ESPECIAL • PAGO DE LOS ARROYOS</span>

            {/* Gesto firma: Titular tachado oficial + Titular satírico */}
            <h2 style={{ margin: '10px 0 16px 0' }}>
              <span className="strikethrough-official">
                Historiadores sugieren que Rosario pudo haber sido la tranquila capital federal de una república pacífica y previsible
              </span>
              <span className="satirical-correction" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
                Las barrancas del Paraná confirman desde la historia que la insubordinación cívica y el clásico del domingo fueron la única opción razonable
              </span>
            </h2>

            {/* Copete periodístico en Newsreader */}
            <p
              style={{
                fontSize: '1.25rem',
                lineHeight: 1.5,
                color: 'var(--ink-soft)',
                marginBottom: '20px',
                borderLeft: '3px solid var(--red-urgent)',
                paddingLeft: '16px',
              }}
            >
              Desde las barrancas donde se desobedeció a Buenos Aires izando dos paños de cielo hasta las terminales portuarias que cargan cincuenta millones de toneladas de cereal, la ciudad continúa su pacto secreto: alimentar a la nación mientras reniega cortésmente de su burocracia centralista.
            </p>

            {/* Foto de Prensa Tratada */}
            <div className="press-photo-container" style={{ maxHeight: '420px', marginBottom: '8px' }}>
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
                alt="Barrancas del Paraná frente a Rosario al atardecer"
                className="press-photo"
                style={{ height: '380px' }}
              />
            </div>
            <div className="press-caption">
              REGISTRO GRÁFICO: El río Paraná en su curso majestuoso frente a Rosario. A la izquierda, la memoria de las baterías ribereñas; a lo lejos, las siluetas de buques graneleros aguardando turno en la Hidrovía. (Foto: Archivo Histórico Editorial)
            </div>

            {/* Cuerpo de la crónica con método periodístico */}
            <div style={{ marginTop: '20px', fontSize: '1.1rem', lineHeight: 1.7 }}>
              <p style={{ marginBottom: '16px' }}>
                <strong>ROSARIO (De nuestra Redacción en las Barrancas).</strong> Ningún conquistador con capa y espada pisó jamás este suelo para clavar una cruz fundacional. Rosario es hija natural de la conveniencia ribereña, el trueque ganadero y la irrevocable sospecha de que cualquier orden emanada de Buenos Aires requiere al menos dos semanas de análisis escéptico antes de ser ignorada con caballerosidad.
              </p>
              <p style={{ marginBottom: '16px' }}>
                <span className="highlight-marker">
                  &ldquo;A don Bernardino Rivadavia le daba taquicardia que tuviésemos bandera propia; a don Bartolomé Mitre le daba urticaria que tuviésemos puerto ultramarino&rdquo;
                </span>, reflexiona un habitué de la esquina de Córdoba y San Martín mientras remueve un cortado con la cucharita de alpaca. &ldquo;Nos vetaron la capital tres veces por miedo a que el país se gobernara mirando al agua dulce en lugar de mirar a Europa&rdquo;.
              </p>
              <p style={{ marginBottom: '16px' }}>
                El resultado es este milagro laico: una metrópoli de un millón y medio de habitantes que no le reza a los próceres porteños, que inventó su propio sándwich con ketchup caliente y que resuelve todas sus angustias existenciales cada seis meses en una cancha de fútbol dividida en dos mitades irreconciliables.
              </p>
            </div>

            <div className="rule-faint" />

            {/* Bloque: Lo Real que es Peor */}
            <div
              style={{
                backgroundColor: 'var(--paper-elevated)',
                border: '1px solid var(--ink-faint)',
                padding: '16px 20px',
                marginTop: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--red-urgent)' }}>
                  LO REAL, QUE ES PEOR:
                </span>
                <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--ink-soft)' }}>
                  FUENTE: BOLSA DE COMERCIO DE ROSARIO & HISTORIA CONSTITUCIONAL
                </span>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--ink)', marginBottom: '8px' }}>
                Dato verídico: <em>El Congreso Nacional sancionó por ley la designación de Rosario como Capital Federal de la República en 1868, 1869 y 1873. El presidente Bartolomé Mitre la vetó la primera vez; Domingo Faustino Sarmiento la vetó en las dos ocasiones siguientes alegando razones de seguridad portuaria.</em>
              </p>
              <a
                href="https://www.bcr.com.ar"
                target="_blank"
                rel="noreferrer"
                className="font-mono"
                style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', textDecoration: 'underline' }}
              >
                ➔ Consultar archivo documental en la Bolsa de Comercio de Rosario
              </a>
            </div>
          </article>

          {/* Columna Lateral: Última Hora & Cables Breves */}
          <aside style={{ borderLeft: '1px solid var(--ink-faint)', paddingLeft: '24px' }}>
            {liveNews.length > 0 ? (
              <LiveFeedWire initialItems={liveNews} />
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Cables Rosarinos
                  </h3>
                  <span className="badge-urgent badge-deadpan" style={{ margin: 0 }}>EN VIVO</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Cable 1 */}
                  <div style={{ borderBottom: '1px solid var(--ink-faint)', paddingBottom: '16px' }}>
                    <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', marginBottom: '4px' }}>
                      16:20 GMT • PUERTO & HIDROVÍA
                    </div>
                    <h4 style={{ fontSize: '1.15rem', lineHeight: 1.25, marginBottom: '6px' }}>
                      <span className="strikethrough-official" style={{ fontSize: '0.85rem' }}>
                        Aduana central promete agilizar trámites en 72 días hábiles
                      </span>
                      <span className="satirical-correction">
                        Cincuenta buques Panamax cargan soja en San Lorenzo mientras el capitán griego pide un carlitos tostado
                      </span>
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
                      Las terminales del cordón industrial completaron la carga en tiempo récord al ritmo de cumbia santafesina.
                    </p>
                  </div>

                  {/* Cable 2 */}
                  <div style={{ borderBottom: '1px solid var(--ink-faint)', paddingBottom: '16px' }}>
                    <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', marginBottom: '4px' }}>
                      15:45 GMT • ANILLO DIGITAL & SEGURIDAD
                    </div>
                    <h4 style={{ fontSize: '1.15rem', lineHeight: 1.25, marginBottom: '6px' }}>
                      <span className="strikethrough-official" style={{ fontSize: '0.85rem' }}>
                        Centro de monitoreo implementa reconocimiento biométrico de alta fidelidad
                      </span>
                      <span className="satirical-correction">
                        Cámaras con IA confunden a hincha de Newell&apos;s con uno de Central por idéntica cara de sufrimiento previo al clásico
                      </span>
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
                      El algoritmo municipal determinó que el nivel de estrés coronario en ambos simpatizantes era estadísticamente indistinguible.
                    </p>
                  </div>

                  {/* Despacho de Cables & Teletipo */}
                  <div
                    style={{
                      border: '2px solid var(--ink)',
                      padding: '16px',
                      backgroundColor: 'var(--paper-elevated)',
                      textAlign: 'center',
                    }}
                  >
                    <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--red-urgent)' }}>
                      SERVICIO DE TELETIPO 24HS
                    </span>
                    <h4 className="font-display" style={{ margin: '8px 0', fontSize: '1.2rem' }}>
                      Despachos Fluviales & Regionales
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginBottom: '14px' }}>
                      Flujo ininterrumpido de cables de agencias, cotizaciones del puerto y novedades metropolitanas.
                    </p>
                    <Link
                      href="/redaccion"
                      style={{
                        backgroundColor: 'var(--ink)',
                        color: 'var(--paper)',
                        padding: '8px 16px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        textDecoration: 'none',
                        fontWeight: 700,
                        display: 'block',
                      }}
                    >
                      ABRIR TERMINAL DE CABLES ➔
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </main>

        <div className="rule-double" style={{ marginTop: '48px', marginBottom: '32px' }} />

        {/* KIOSCO MUNDIAL DE DIARIOS & CABLES CON RESEÑA IRÓNICA */}
        <WorldKiosk />

        <div className="rule-single" style={{ margin: '32px 0' }} />

        {/* Bloques temáticos dinámicos */}
        {categoryNews.deportes.length > 0 && (
          <CategoryBlock title="Fútbol Rosarino: Newell's y Central" categoryKey="deportes" items={categoryNews.deportes} />
        )}
        {categoryNews.seguridad.length > 0 && (
          <CategoryBlock title="Seguridad & Ciudad" categoryKey="seguridad" items={categoryNews.seguridad} />
        )}
        {categoryNews.economia.length > 0 && (
          <CategoryBlock title="Economía & Puerto" categoryKey="economia" items={categoryNews.economia} />
        )}

        <Footer />
      </div>
    </div>
  );
}

