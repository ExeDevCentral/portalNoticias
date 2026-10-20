'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import RosarioHeroBanner from '../components/RosarioHeroBanner';
import HeroOrbital, { DEFAULT_STORIES, NewsStory } from '../components/HeroOrbital';
import { IconSun, IconMoon, IconArrowRight, IconClock } from '../components/Icons';
import BreakingTicker from '../components/BreakingTicker';
import LiveFeedWire from '../components/LiveFeedWire';
import CategoryBlock from '../components/CategoryBlock';
import WorldKiosk from '../components/WorldKiosk';
import Footer from '../components/Footer';
import { NewsItem } from '../db/schema';
import { formatTimeAgo } from '../utils/formatters';

type MainSectionTab = 'rosario' | 'pais' | 'internacional';

export default function HomePage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeTab, setActiveTab] = useState<MainSectionTab>('rosario');
  const [heroMode, setHeroMode] = useState<'banner' | 'orbital'>('banner');
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  const [liveNews, setLiveNews] = useState<NewsItem[]>([]);
  const [urgentNews, setUrgentNews] = useState<{ id: string; title: string; slug?: string }[]>([]);
  const [categoryNews, setCategoryNews] = useState<{
    deportes: NewsItem[];
    seguridad: NewsItem[];
    economia: NewsItem[];
    politica: NewsItem[];
    sociedad: NewsItem[];
  }>({ deportes: [], seguridad: [], economia: [], politica: [], sociedad: [] });

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
              politica: res.data.byCategory.politica || [],
              sociedad: res.data.byCategory.sociedad || [],
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

  // 5 historias curadas de Rosario con gancho editorial
  const orbitalStories = useMemo<NewsStory[]>(() => {
    if (!liveNews || liveNews.length === 0) return DEFAULT_STORIES;

    const rioItem = liveNews.find((n) => n.isPinned || n.category === 'ciudad' || n.category === 'sociedad');
    const segItem = liveNews.find((n) => n.category === 'seguridad');
    const futItem = liveNews.find((n) => n.category === 'deportes');
    const ecoItem = liveNews.find((n) => n.category === 'economia');
    const cultItem = liveNews.find(
      (n) => (n.category === 'ciudad' || n.category === 'sociedad') && n.id !== rioItem?.id
    );

    return [
      rioItem
        ? {
            id: 'rio-principal',
            slug: rioItem.slug,
            category: rioItem.category === 'ciudad' ? 'CIUDAD & REGIÓN' : 'SOCIEDAD & MUNDO',
            tag: rioItem.isPinned ? 'PORTADA PRINCIPAL' : 'ACTUALIDAD',
            title: rioItem.title,
            summary: rioItem.summary,
            hook: rioItem.summary || rioItem.title,
            keyFacts: [rioItem.source, rioItem.category.toUpperCase(), 'Cobertura en tiempo real'],
            time: 'En vivo',
            readingTime: '3 min',
            source: rioItem.source,
            sourceUrl: rioItem.sourceUrl,
            imageUrl: rioItem.imageUrl || DEFAULT_STORIES[0].imageUrl,
            accentColor: 'var(--blue-parana)',
            isBreaking: rioItem.isUrgent || rioItem.isPinned,
          }
        : DEFAULT_STORIES[0],
      segItem
        ? {
            id: 'seguridad-ciudadana',
            slug: segItem.slug,
            category: 'SEGURIDAD & POLICIALES',
            tag: segItem.isUrgent ? 'URGENTE' : 'SEGURIDAD',
            title: segItem.title,
            summary: segItem.summary,
            hook: segItem.summary || segItem.title,
            keyFacts: [segItem.source, 'OPERATIVOS & JUSTICIA', 'Reporte verificado'],
            time: 'En vivo',
            readingTime: '3 min',
            source: segItem.source,
            sourceUrl: segItem.sourceUrl,
            imageUrl: segItem.imageUrl || DEFAULT_STORIES[1].imageUrl,
            accentColor: 'var(--red-urgent)',
            isBreaking: true,
          }
        : DEFAULT_STORIES[1],
      futItem
        ? {
            id: 'deportes-futbol',
            slug: futItem.slug,
            category: 'DEPORTES & FÚTBOL',
            tag: 'LIGA & PASIÓN',
            title: futItem.title,
            summary: futItem.summary,
            hook: futItem.summary || futItem.title,
            keyFacts: [futItem.source, 'DEPORTES', 'Cobertura de la fecha'],
            time: 'En vivo',
            readingTime: '2 min',
            source: futItem.source,
            sourceUrl: futItem.sourceUrl,
            imageUrl: futItem.imageUrl || DEFAULT_STORIES[2].imageUrl,
            accentColor: 'var(--amber-alert)',
            isBreaking: futItem.isUrgent,
          }
        : DEFAULT_STORIES[2],
      ecoItem
        ? {
            id: 'economia-puerto',
            slug: ecoItem.slug,
            category: 'ECONOMÍA & FINANZAS',
            tag: 'MERCADOS & PUERTO',
            title: ecoItem.title,
            summary: ecoItem.summary,
            hook: ecoItem.summary || ecoItem.title,
            keyFacts: [ecoItem.source, 'FINANZAS & COMERCIO', 'Actualización de cotizaciones'],
            time: 'En vivo',
            readingTime: '4 min',
            source: ecoItem.source,
            sourceUrl: ecoItem.sourceUrl,
            imageUrl: ecoItem.imageUrl || DEFAULT_STORIES[3].imageUrl,
            accentColor: 'var(--blue-parana)',
          }
        : DEFAULT_STORIES[3],
      cultItem
        ? {
            id: 'cultura-mundo',
            slug: cultItem.slug,
            category: 'MUNDO & SOCIEDAD',
            tag: 'GLOBAL & CULTURA',
            title: cultItem.title,
            summary: cultItem.summary,
            hook: cultItem.summary || cultItem.title,
            keyFacts: [cultItem.source, 'CULTURA & SOCIEDAD', 'Despacho verificado'],
            time: 'En vivo',
            readingTime: '3 min',
            source: cultItem.source,
            sourceUrl: cultItem.sourceUrl,
            imageUrl: cultItem.imageUrl || DEFAULT_STORIES[4].imageUrl,
            accentColor: '#8B5CF6',
          }
        : DEFAULT_STORIES[4],
    ];
  }, [liveNews]);

  // Filtrar cables por ámbito
  const rosarioWireNews = useMemo(() => {
    return liveNews.filter(
      (n) =>
        n.source === 'La Capital' ||
        n.source === 'El Ciudadano' ||
        n.category === 'ciudad' ||
        n.category === 'seguridad'
    );
  }, [liveNews]);

  const nationalWireNews = useMemo(() => {
    return liveNews.filter(
      (n) =>
        n.category === 'politica' ||
        n.source === 'Prensa Federal' ||
        n.source === 'Clarín' ||
        n.source === 'Infobae' ||
        n.source === 'Ámbito Financiero'
    );
  }, [liveNews]);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      {/* 1. Barra de Servicio Superior y Metadatos en Vivo */}
      <div
        style={{
          borderBottom: '1px solid var(--ink-faint)',
          padding: '6px 0',
          fontSize: '0.8rem',
          backgroundColor: 'var(--paper-elevated)',
        }}
      >
        <div
          className="editorial-container font-mono"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'var(--ink-soft)',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ color: 'var(--ink)', fontWeight: 700 }}>ROSARIO, SANTA FE</span>
            <span>•</span>
            <span>EDICIÓN 24HS EN DIRECTO</span>
            <span>•</span>
            <span style={{ color: 'var(--blue-parana)', fontWeight: 700 }}>RÍO PARANÁ: 3.42M (CRECIENDO)</span>
            <span>•</span>
            <span>DÓLAR: $1.240 / $1.260</span>
          </div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
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

      {/* 2. Cabecera Principal del Diario */}
      <div className="editorial-container">
        <header style={{ textAlign: 'center', padding: '20px 0 10px 0' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '6px',
            }}
          >
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
              PORTAL EN TIEMPO REAL
            </span>
            <span
              className="font-mono"
              style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', letterSpacing: '0.08em' }}
            >
              PAGO DE LOS ARROYOS & HISTORIA VIVA
            </span>
            <span
              className="font-mono"
              style={{ fontSize: '0.75rem', color: 'var(--red-urgent)', fontWeight: 'bold' }}
            >
              ● CABLES EN VIVO
            </span>
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(2.4rem, 6vw, 4.8rem)',
              fontWeight: 900,
              letterSpacing: '-0.025em',
              lineHeight: 0.95,
              textTransform: 'uppercase',
              margin: '6px 0',
              color: 'var(--ink)',
            }}
          >
            Rosario En Tiempo Real
          </h1>

          <p
            className="font-body"
            style={{
              fontSize: '1.08rem',
              fontStyle: 'italic',
              color: 'var(--ink-soft)',
              maxWidth: '680px',
              margin: '0 auto 12px auto',
            }}
          >
            &ldquo;La inmediatez de los cables, la jerarquía de un gran diario y la memoria rebelde de las barrancas&rdquo;
          </p>

          <div className="rule-double" />
        </header>
      </div>

      {/* 3. SELECTOR MODERNO POR PESTAÑAS (ROSARIO | EL PAÍS | INTERNACIONAL) */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 80,
          backgroundColor: 'var(--paper)',
          borderBottom: '2px solid var(--ink)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          padding: '8px 0',
        }}
      >
        <div
          className="editorial-container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          {/* Botones de Pestaña Principal */}
          <nav
            aria-label="Secciones principales"
            style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('rosario')}
              style={{
                backgroundColor: activeTab === 'rosario' ? 'var(--blue-parana)' : 'var(--paper-elevated)',
                color: activeTab === 'rosario' ? '#FFFFFF' : 'var(--ink)',
                border: activeTab === 'rosario' ? '2px solid var(--blue-parana)' : '1px solid var(--ink-faint)',
                padding: '8px 18px',
                borderRadius: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.84rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: activeTab === 'rosario' ? '0 4px 14px rgba(29, 78, 216, 0.35)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span>📍</span>
              <span>ROSARIO & REGIÓN</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pais')}
              style={{
                backgroundColor: activeTab === 'pais' ? 'var(--red-urgent)' : 'var(--paper-elevated)',
                color: activeTab === 'pais' ? '#FFFFFF' : 'var(--ink)',
                border: activeTab === 'pais' ? '2px solid var(--red-urgent)' : '1px solid var(--ink-faint)',
                padding: '8px 18px',
                borderRadius: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.84rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: activeTab === 'pais' ? '0 4px 14px rgba(220, 38, 38, 0.35)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span>🇦🇷</span>
              <span>EL PAÍS (NACIONALES)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('internacional')}
              style={{
                backgroundColor: activeTab === 'internacional' ? 'var(--ink)' : 'var(--paper-elevated)',
                color: activeTab === 'internacional' ? 'var(--paper)' : 'var(--ink)',
                border: activeTab === 'internacional' ? '2px solid var(--ink)' : '1px solid var(--ink-faint)',
                padding: '8px 18px',
                borderRadius: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.84rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: activeTab === 'internacional' ? '0 4px 14px rgba(0, 0, 0, 0.25)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span>🌍</span>
              <span>INTERNACIONAL (MUNDO)</span>
            </button>
          </nav>

          {/* Enlace directo a Redacción */}
          <Link
            href="/redaccion"
            style={{
              backgroundColor: 'var(--paper-elevated)',
              color: 'var(--ink)',
              border: '1px solid var(--ink)',
              padding: '7px 14px',
              textDecoration: 'none',
              fontSize: '0.74rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              borderRadius: '4px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>SALA DE REDACCIÓN</span>
            <IconArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* 4. CONTENIDO SEGMENTADO SEGÚN PESTAÑA ACTIVA */}
      <div className="editorial-container" style={{ marginTop: '20px' }}>
        {/* ========================================================= */}
        {/* PESTAÑA 1: ROSARIO & REGIÓN                               */}
        {/* ========================================================= */}
        {activeTab === 'rosario' && (
          <div>
            {/* Selector de Vista de Portada (Banner Creativo vs Abanico 3D) */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
                fontSize: '0.76rem',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <span style={{ color: 'var(--ink-soft)', fontWeight: 700 }}>
                CRÓNICAS DESTACADAS DE LA CIUDAD & EL PARANÁ
              </span>

              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ color: 'var(--ink-soft)', fontSize: '0.7rem' }}>VISTA:</span>
                <button
                  type="button"
                  onClick={() => setHeroMode('banner')}
                  style={{
                    padding: '3px 9px',
                    borderRadius: '3px',
                    border: '1px solid var(--ink-faint)',
                    backgroundColor: heroMode === 'banner' ? 'var(--ink)' : 'transparent',
                    color: heroMode === 'banner' ? 'var(--paper)' : 'var(--ink)',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                  }}
                >
                  Banner Moderno
                </button>
                <button
                  type="button"
                  onClick={() => setHeroMode('orbital')}
                  style={{
                    padding: '3px 9px',
                    borderRadius: '3px',
                    border: '1px solid var(--ink-faint)',
                    backgroundColor: heroMode === 'orbital' ? 'var(--ink)' : 'transparent',
                    color: heroMode === 'orbital' ? 'var(--paper)' : 'var(--ink)',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                  }}
                >
                  Abanico 3D
                </button>
              </div>
            </div>

            {/* Protagonista de Apertura: Banner Moderno o Hero 3D */}
            {heroMode === 'banner' ? (
              <RosarioHeroBanner stories={orbitalStories} />
            ) : (
              <div id="portada-3d" style={{ marginBottom: '24px' }}>
                <HeroOrbital
                  stories={orbitalStories}
                  selectedIndex={activeStoryIndex}
                  onStoryChange={setActiveStoryIndex}
                />
              </div>
            )}

            <div className="rule-single" style={{ margin: '24px 0' }} />

            {/* Distribución Limpia en 2 Columnas para Rosario */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '32px',
                alignItems: 'start',
              }}
            >
              {/* Columna Izquierda: Los Pilares Rosarinos */}
              <main style={{ gridColumn: 'span 2' }}>
                <div id="seccion-futbol">
                  {categoryNews.deportes.length > 0 ? (
                    <CategoryBlock
                      title="Fútbol Rosarino: Newell's y Central"
                      categoryKey="deportes"
                      items={categoryNews.deportes}
                    />
                  ) : null}
                </div>

                <div id="seccion-seguridad" style={{ marginTop: '24px' }}>
                  {categoryNews.seguridad.length > 0 ? (
                    <CategoryBlock
                      title="Seguridad Ciudadana & Monitoreo"
                      categoryKey="seguridad"
                      items={categoryNews.seguridad}
                    />
                  ) : null}
                </div>

                <div id="seccion-economia" style={{ marginTop: '24px' }}>
                  {categoryNews.economia.length > 0 ? (
                    <CategoryBlock
                      title="Economía, Puerto e Hidrovía del Paraná"
                      categoryKey="economia"
                      items={categoryNews.economia}
                    />
                  ) : null}
                </div>
              </main>

              {/* Columna Derecha: Teletipo Local de Rosario */}
              <aside style={{ borderLeft: '1px solid var(--ink-faint)', paddingLeft: '22px' }}>
                <div
                  style={{
                    backgroundColor: 'var(--paper-elevated)',
                    border: '1px solid var(--ink-faint)',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    marginBottom: '14px',
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    color: 'var(--blue-parana)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>📍</span>
                  <span>DESPACHOS DE ROSARIO EN DIRECTO</span>
                </div>
                <LiveFeedWire initialItems={rosarioWireNews.length > 0 ? rosarioWireNews : liveNews} />
              </aside>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PESTAÑA 2: EL PAÍS (NOTICIAS NACIONALES & FEDERALES)      */}
        {/* ========================================================= */}
        {activeTab === 'pais' && (
          <div>
            {/* Banner Cabecera Nacional */}
            <div
              style={{
                padding: '24px 28px',
                backgroundColor: 'var(--paper-elevated)',
                border: '1px solid var(--ink-faint)',
                borderLeft: '5px solid var(--red-urgent)',
                borderRadius: '6px',
                marginBottom: '28px',
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--red-urgent)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                🇦🇷 AGENDA FEDERAL Y NACIONAL
              </span>
              <h2
                className="font-display"
                style={{
                  fontSize: 'clamp(1.6rem, 3.2vw, 2.4rem)',
                  fontWeight: 900,
                  color: 'var(--ink)',
                  margin: '8px 0 10px 0',
                }}
              >
                El País: Despachos, Economía Federal y Política Nacional
              </h2>
              <p
                className="font-body"
                style={{
                  fontSize: '1rem',
                  color: 'var(--ink-soft)',
                  margin: 0,
                  maxWidth: '780px',
                  lineHeight: 1.5,
                }}
              >
                Información contrastada y en tiempo real de los principales diarios y agencias del país: Clarín,
                Infobae, Ámbito Financiero y Prensa Federal.
              </p>
            </div>

            {/* Cuadrícula Limpia de Noticias Nacionales */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '32px',
                alignItems: 'start',
              }}
            >
              {/* Columna Izquierda: Crónicas Nacionales */}
              <main style={{ gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {nationalWireNews.slice(0, 8).map((item) => (
                    <article
                      key={item.id}
                      style={{
                        padding: '18px 20px',
                        backgroundColor: 'var(--paper-card)',
                        border: '1px solid var(--ink-faint)',
                        borderRadius: '6px',
                        display: 'grid',
                        gridTemplateColumns: item.imageUrl ? '1fr 220px' : '1fr',
                        gap: '20px',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '6px',
                            fontSize: '0.72rem',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          <span style={{ color: 'var(--red-urgent)', fontWeight: 800 }}>
                            {item.source === 'La Nación' ? 'Prensa Federal' : item.source}
                          </span>
                          <span style={{ color: 'var(--ink-soft)' }}>•</span>
                          <span style={{ color: 'var(--ink-soft)' }}>{formatTimeAgo(item.publishedAt)}</span>
                        </div>

                        <Link
                          href={`/noticia/${item.slug}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <h3
                            className="font-display"
                            style={{
                              fontSize: '1.25rem',
                              fontWeight: 800,
                              lineHeight: 1.25,
                              color: 'var(--ink)',
                              margin: '0 0 8px 0',
                            }}
                          >
                            {item.title}
                          </h3>
                        </Link>

                        <p
                          style={{
                            fontSize: '0.9rem',
                            color: 'var(--ink-soft)',
                            lineHeight: 1.45,
                            margin: '0 0 12px 0',
                          }}
                        >
                          {item.summary.slice(0, 180)}...
                        </p>

                        <Link
                          href={`/noticia/${item.slug}`}
                          style={{
                            color: 'var(--red-urgent)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.76rem',
                            fontWeight: 800,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          <span>LEER COMPLETA</span>
                          <IconArrowRight size={12} />
                        </Link>
                      </div>

                      {item.imageUrl && (
                        <div
                          style={{
                            height: '140px',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            backgroundColor: '#000',
                          }}
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </main>

              {/* Columna Derecha: Teletipo Federal */}
              <aside style={{ borderLeft: '1px solid var(--ink-faint)', paddingLeft: '22px' }}>
                <div
                  style={{
                    backgroundColor: 'var(--paper-elevated)',
                    border: '1px solid var(--ink-faint)',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    marginBottom: '14px',
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    color: 'var(--red-urgent)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>🇦🇷</span>
                  <span>CABLES DEL PAÍS AL INSTANTE</span>
                </div>
                <LiveFeedWire initialItems={nationalWireNews} />
              </aside>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PESTAÑA 3: INTERNACIONAL (EL GRAN KIOSCO GLOBAL)           */}
        {/* ========================================================= */}
        {activeTab === 'internacional' && (
          <div>
            <div
              style={{
                padding: '24px 28px',
                backgroundColor: 'var(--paper-elevated)',
                border: '1px solid var(--ink-faint)',
                borderLeft: '5px solid var(--ink)',
                borderRadius: '6px',
                marginBottom: '28px',
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--ink)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                🌍 PRENSA MUNDIAL Y CORRESPONSALÍAS
              </span>
              <h2
                className="font-display"
                style={{
                  fontSize: 'clamp(1.6rem, 3.2vw, 2.4rem)',
                  fontWeight: 900,
                  color: 'var(--ink)',
                  margin: '8px 0 10px 0',
                }}
              >
                El Gran Kiosco: Los Diarios del Mundo en 1 Click
              </h2>
              <p
                className="font-body"
                style={{
                  fontSize: '1rem',
                  color: 'var(--ink-soft)',
                  margin: 0,
                  maxWidth: '780px',
                  lineHeight: 1.5,
                }}
              >
                Filtrá por región (EEUU, Europa, Asia, Rusia y América) y leé directamente los artículos originales de
                BBC Mundo, El País, Deutsche Welle, The Guardian, CNN y Al Jazeera.
              </p>
            </div>

            <WorldKiosk />
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}
