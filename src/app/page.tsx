'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import RosarioHeroBanner from '../components/RosarioHeroBanner';
import HeroOrbital, { DEFAULT_STORIES, NewsStory } from '../components/HeroOrbital';
import { IconSun, IconMoon, IconArrowRight } from '../components/Icons';
import BreakingTicker from '../components/BreakingTicker';
import LiveFeedWire from '../components/LiveFeedWire';
import CategoryBlock from '../components/CategoryBlock';
import WorldKiosk from '../components/WorldKiosk';
import Footer from '../components/Footer';
import { MediaSideRail, MediaHorizontalBar } from '../components/MediaQuickRails';
import ModernNewsCard from '../components/ModernNewsCard';
import { NewsItem } from '../db/schema';

type MainSectionTab = 'rosario' | 'pais' | 'internacional';
type RosarioCategoryFilter = 'todas' | 'deportes' | 'seguridad' | 'economia';

export default function HomePage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeTab, setActiveTab] = useState<MainSectionTab>('rosario');
  const [heroMode, setHeroMode] = useState<'banner' | 'orbital'>('banner');
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  // Filtros de acceso rápido a diarios y sub-categorías
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string | null>(null);
  const [rosarioCategoryFilter, setRosarioCategoryFilter] = useState<RosarioCategoryFilter>('todas');

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

  // Conteo de notas disponibles por diario para los flancos laterales
  const sourceCounts = useMemo<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    liveNews.forEach((item) => {
      const s = item.source === 'La Nación' ? 'Prensa Federal' : item.source;
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [liveNews]);

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
        n.source.includes('Rosario3') ||
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
        n.source === 'Ámbito Financiero' ||
        n.source === 'Perfil' ||
        n.source === 'Página 12'
    );
  }, [liveNews]);

  // Filtrado reactivo al seleccionar un diario en los flancos laterales
  const filteredLiveNews = useMemo(() => {
    if (!selectedSourceFilter) return liveNews;
    const filter = selectedSourceFilter.toLowerCase();
    return liveNews.filter((n) => {
      const s = (n.source === 'La Nación' ? 'Prensa Federal' : n.source).toLowerCase();
      return s.includes(filter) || filter.includes(s);
    });
  }, [liveNews, selectedSourceFilter]);

  const filteredRosarioNews = useMemo(() => {
    if (!selectedSourceFilter) return rosarioWireNews;
    const filter = selectedSourceFilter.toLowerCase();
    return rosarioWireNews.filter((n) => {
      const s = (n.source === 'La Nación' ? 'Prensa Federal' : n.source).toLowerCase();
      return s.includes(filter) || filter.includes(s);
    });
  }, [rosarioWireNews, selectedSourceFilter]);

  const filteredNationalNews = useMemo(() => {
    if (!selectedSourceFilter) return nationalWireNews;
    const filter = selectedSourceFilter.toLowerCase();
    return nationalWireNews.filter((n) => {
      const s = (n.source === 'La Nación' ? 'Prensa Federal' : n.source).toLowerCase();
      return s.includes(filter) || filter.includes(s);
    });
  }, [nationalWireNews, selectedSourceFilter]);

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
        <header style={{ textAlign: 'center', padding: '16px 0 8px 0' }}>
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
              fontSize: 'clamp(2.2rem, 5.5vw, 4.4rem)',
              fontWeight: 900,
              letterSpacing: '-0.025em',
              lineHeight: 0.95,
              textTransform: 'uppercase',
              margin: '4px 0',
              color: 'var(--ink)',
            }}
          >
            Rosario En Tiempo Real
          </h1>

          <p
            className="font-body"
            style={{
              fontSize: '1rem',
              fontStyle: 'italic',
              color: 'var(--ink-soft)',
              maxWidth: '680px',
              margin: '0 auto 10px auto',
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

      {/* 4. DISPOSICIÓN PRINCIPAL CON FLANCOS LATERALES DE ACCESO RÁPIDO */}
      <div className="portal-desktop-layout" style={{ marginTop: '18px' }}>
        {/* FLANCO IZQUIERDO: ACCESO RÁPIDO A DIARIOS DE ROSARIO */}
        <aside className="portal-rail-container portal-rail-left">
          <MediaSideRail
            side="left"
            activeSource={selectedSourceFilter}
            onSelectSource={setSelectedSourceFilter}
            sourceCounts={sourceCounts}
          />
        </aside>

        {/* COLUMNA CENTRAL: NOTICIAS Y CONTENIDO EDITORIAL */}
        <div className="portal-main-column">
          {/* Barra de Acceso Rápido Horizontal (visible en tablets y móviles) */}
          <div className="portal-horizontal-bar-wrapper">
            <MediaHorizontalBar
              activeSource={selectedSourceFilter}
              onSelectSource={setSelectedSourceFilter}
            />
          </div>

          {/* Banner de Filtrado Activo (cuando el usuario hace clic en un diario) */}
          {selectedSourceFilter && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--paper-card)',
                border: '1px solid var(--blue-parana)',
                borderLeft: '4px solid var(--blue-parana)',
                borderRadius: '8px',
                padding: '10px 16px',
                marginBottom: '16px',
                boxShadow: '0 4px 16px rgba(0, 119, 182, 0.15)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem' }}>⚡</span>
                <span
                  className="font-mono"
                  style={{ fontSize: '0.8rem', color: 'var(--ink)' }}
                >
                  Mostrando crónicas de: <strong>{selectedSourceFilter}</strong> •{' '}
                  <span style={{ color: 'var(--blue-parana)', fontWeight: 700 }}>
                    {filteredLiveNews.length} artículos disponibles
                  </span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSourceFilter(null)}
                style={{
                  backgroundColor: 'var(--blue-parana)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                ✕ Ver Todos
              </button>
            </div>
          )}

          {/* VISTA ESPECÍFICA CUANDO UN DIARIO ESTÁ FILTRADO */}
          {selectedSourceFilter ? (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  borderBottom: '1px solid var(--ink-faint)',
                  paddingBottom: '8px',
                }}
              >
                <h2
                  className="font-display"
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    margin: 0,
                    color: 'var(--ink)',
                  }}
                >
                  Crónicas y Despachos de {selectedSourceFilter}
                </h2>
                <span
                  className="font-mono"
                  style={{ fontSize: '0.74rem', color: 'var(--ink-soft)' }}
                >
                  {filteredLiveNews.length} despachos
                </span>
              </div>

              {filteredLiveNews.length === 0 ? (
                <div
                  style={{
                    padding: '30px',
                    textAlign: 'center',
                    backgroundColor: 'var(--paper-card)',
                    borderRadius: '8px',
                    border: '1px solid var(--ink-faint)',
                  }}
                >
                  <p style={{ color: 'var(--ink-soft)', margin: 0 }}>
                    No se encontraron artículos recientes archivados de {selectedSourceFilter}.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedSourceFilter(null)}
                    style={{
                      marginTop: '12px',
                      padding: '6px 14px',
                      backgroundColor: 'var(--blue-parana)',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Volver a ver todos los diarios
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {filteredLiveNews.map((item) => (
                    <ModernNewsCard
                      key={item.id}
                      item={item}
                      variant="compact"
                      showCategory={true}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
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

                  <div className="rule-single" style={{ margin: '20px 0' }} />

                  {/* SUB-FILTRO DE SECCIONES ROSARINAS PARA ACHICAR LA PÁGINA */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap',
                      marginBottom: '16px',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      className="font-mono"
                      style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', fontWeight: 700 }}
                    >
                      SECCIONES:
                    </span>
                    <button
                      type="button"
                      onClick={() => setRosarioCategoryFilter('todas')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        border:
                          rosarioCategoryFilter === 'todas'
                            ? '1px solid var(--blue-parana)'
                            : '1px solid var(--ink-faint)',
                        backgroundColor:
                          rosarioCategoryFilter === 'todas'
                            ? 'var(--blue-parana)'
                            : 'var(--paper-elevated)',
                        color: rosarioCategoryFilter === 'todas' ? '#FFFFFF' : 'var(--ink)',
                        cursor: 'pointer',
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                      }}
                    >
                      🗞️ TODAS
                    </button>
                    <button
                      type="button"
                      onClick={() => setRosarioCategoryFilter('deportes')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        border:
                          rosarioCategoryFilter === 'deportes'
                            ? '1px solid var(--blue-parana)'
                            : '1px solid var(--ink-faint)',
                        backgroundColor:
                          rosarioCategoryFilter === 'deportes'
                            ? 'var(--blue-parana)'
                            : 'var(--paper-elevated)',
                        color: rosarioCategoryFilter === 'deportes' ? '#FFFFFF' : 'var(--ink)',
                        cursor: 'pointer',
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                      }}
                    >
                      ⚽ NEWELL&apos;S Y CENTRAL
                    </button>
                    <button
                      type="button"
                      onClick={() => setRosarioCategoryFilter('seguridad')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        border:
                          rosarioCategoryFilter === 'seguridad'
                            ? '1px solid var(--blue-parana)'
                            : '1px solid var(--ink-faint)',
                        backgroundColor:
                          rosarioCategoryFilter === 'seguridad'
                            ? 'var(--blue-parana)'
                            : 'var(--paper-elevated)',
                        color: rosarioCategoryFilter === 'seguridad' ? '#FFFFFF' : 'var(--ink)',
                        cursor: 'pointer',
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                      }}
                    >
                      🛡️ SEGURIDAD CIUDADANA
                    </button>
                    <button
                      type="button"
                      onClick={() => setRosarioCategoryFilter('economia')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        border:
                          rosarioCategoryFilter === 'economia'
                            ? '1px solid var(--blue-parana)'
                            : '1px solid var(--ink-faint)',
                        backgroundColor:
                          rosarioCategoryFilter === 'economia'
                            ? 'var(--blue-parana)'
                            : 'var(--paper-elevated)',
                        color: rosarioCategoryFilter === 'economia' ? '#FFFFFF' : 'var(--ink)',
                        cursor: 'pointer',
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                      }}
                    >
                      🚢 PUERTO & ECONOMÍA
                    </button>
                  </div>

                  {/* Distribución Limpia en 2 Columnas para Rosario */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                      gap: '24px',
                      alignItems: 'start',
                    }}
                  >
                    {/* Columna Izquierda: Bloques de Rosario */}
                    <main style={{ gridColumn: 'span 2' }}>
                      {(rosarioCategoryFilter === 'todas' || rosarioCategoryFilter === 'deportes') &&
                        categoryNews.deportes.length > 0 && (
                          <div id="seccion-futbol">
                            <CategoryBlock
                              title="Fútbol Rosarino: Newell's y Central"
                              categoryKey="deportes"
                              icon="⚽"
                              items={categoryNews.deportes}
                            />
                          </div>
                        )}

                      {(rosarioCategoryFilter === 'todas' || rosarioCategoryFilter === 'seguridad') &&
                        categoryNews.seguridad.length > 0 && (
                          <div id="seccion-seguridad">
                            <CategoryBlock
                              title="Seguridad Ciudadana & Monitoreo"
                              categoryKey="seguridad"
                              icon="🛡️"
                              items={categoryNews.seguridad}
                            />
                          </div>
                        )}

                      {(rosarioCategoryFilter === 'todas' || rosarioCategoryFilter === 'economia') &&
                        categoryNews.economia.length > 0 && (
                          <div id="seccion-economia">
                            <CategoryBlock
                              title="Economía, Puerto e Hidrovía del Paraná"
                              categoryKey="economia"
                              icon="🚢"
                              items={categoryNews.economia}
                            />
                          </div>
                        )}
                    </main>

                    {/* Columna Derecha: Teletipo Local de Rosario */}
                    <aside style={{ borderLeft: '1px solid var(--ink-faint)', paddingLeft: '16px' }}>
                      <div
                        style={{
                          backgroundColor: 'var(--paper-elevated)',
                          border: '1px solid var(--ink-faint)',
                          padding: '7px 10px',
                          borderRadius: '4px',
                          marginBottom: '10px',
                          fontSize: '0.72rem',
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
                      <LiveFeedWire initialItems={filteredRosarioNews.length > 0 ? filteredRosarioNews : liveNews} />
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
                      padding: '20px 24px',
                      backgroundColor: 'var(--paper-elevated)',
                      border: '1px solid var(--ink-faint)',
                      borderLeft: '5px solid var(--red-urgent)',
                      borderRadius: '6px',
                      marginBottom: '20px',
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
                        fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)',
                        fontWeight: 900,
                        color: 'var(--ink)',
                        margin: '6px 0 8px 0',
                      }}
                    >
                      El País: Despachos, Economía Federal y Política Nacional
                    </h2>
                    <p
                      className="font-body"
                      style={{
                        fontSize: '0.96rem',
                        color: 'var(--ink-soft)',
                        margin: 0,
                        maxWidth: '780px',
                        lineHeight: 1.45,
                      }}
                    >
                      Información contrastada y en tiempo real de los principales diarios y agencias del país: Clarín,
                      Infobae, Ámbito Financiero y Prensa Federal.
                    </p>
                  </div>

                  {/* Cuadrícula Limpia de Noticias Nacionales (2 Columnas Modernas) */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                      gap: '24px',
                      alignItems: 'start',
                    }}
                  >
                    {/* Columna Izquierda: Crónicas Nacionales en Cuadrícula Compacta */}
                    <main style={{ gridColumn: 'span 2' }}>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                          gap: '12px',
                        }}
                      >
                        {filteredNationalNews.slice(0, 10).map((item) => (
                          <ModernNewsCard
                            key={item.id}
                            item={item}
                            variant="compact"
                            showCategory={true}
                          />
                        ))}
                      </div>
                    </main>

                    {/* Columna Derecha: Teletipo Federal */}
                    <aside style={{ borderLeft: '1px solid var(--ink-faint)', paddingLeft: '16px' }}>
                      <div
                        style={{
                          backgroundColor: 'var(--paper-elevated)',
                          border: '1px solid var(--ink-faint)',
                          padding: '7px 10px',
                          borderRadius: '4px',
                          marginBottom: '10px',
                          fontSize: '0.72rem',
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
                      <LiveFeedWire initialItems={filteredNationalNews} />
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
                      padding: '20px 24px',
                      backgroundColor: 'var(--paper-elevated)',
                      border: '1px solid var(--ink-faint)',
                      borderLeft: '5px solid var(--ink)',
                      borderRadius: '6px',
                      marginBottom: '20px',
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
                        fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)',
                        fontWeight: 900,
                        color: 'var(--ink)',
                        margin: '6px 0 8px 0',
                      }}
                    >
                      El Gran Kiosco: Los Diarios del Mundo en 1 Click
                    </h2>
                    <p
                      className="font-body"
                      style={{
                        fontSize: '0.96rem',
                        color: 'var(--ink-soft)',
                        margin: 0,
                        maxWidth: '780px',
                        lineHeight: 1.45,
                      }}
                    >
                      Filtrá por región (EEUU, Europa, Asia, Rusia y América) y leé directamente los artículos originales de
                      BBC Mundo, El País, Deutsche Welle, The Guardian, CNN y Al Jazeera.
                    </p>
                  </div>

                  <WorldKiosk />
                </div>
              )}
            </>
          )}

          <Footer />
        </div>

        {/* FLANCO DERECHO: ACCESO RÁPIDO A DIARIOS NACIONALES */}
        <aside className="portal-rail-container portal-rail-right">
          <MediaSideRail
            side="right"
            activeSource={selectedSourceFilter}
            onSelectSource={setSelectedSourceFilter}
            sourceCounts={sourceCounts}
          />
        </aside>
      </div>
    </div>
  );
}
