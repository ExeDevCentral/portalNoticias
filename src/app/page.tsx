'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import RosarioHeroBanner from '../components/RosarioHeroBanner';
import { DEFAULT_STORIES, NewsStory } from '../services/hero-stories';
import { IconSun, IconMoon, IconArrowRight } from '../components/Icons';
import BreakingTicker from '../components/BreakingTicker';
import LiveFeedWire from '../components/LiveFeedWire';
import CategoryBlock from '../components/CategoryBlock';
import WorldKiosk from '../components/WorldKiosk';
import Footer from '../components/Footer';
import ModernNewsCard from '../components/ModernNewsCard';
import { NewsItem } from '../db/schema';

type EditorialNavSection =
  | 'portada'
  | 'seguridad'
  | 'deportes'
  | 'economia'
  | 'pais'
  | 'internacional';

export default function HomePage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeNav, setActiveNav] = useState<EditorialNavSection>('portada');

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

  // Cables específicos para ámbito nacional
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

  const navItems: { id: EditorialNavSection; label: string }[] = [
    { id: 'portada', label: 'PORTADA' },
    { id: 'seguridad', label: 'SEGURIDAD & JUSTICIA' },
    { id: 'deportes', label: "CENTRAL & NEWELL'S" },
    { id: 'economia', label: 'ECONOMÍA & PUERTO' },
    { id: 'pais', label: 'EL PAÍS' },
    { id: 'internacional', label: 'INTERNACIONAL' },
  ];

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      {/* 1. Barra de Servicio Superior y Metadatos en Vivo */}
      <div
        style={{
          borderBottom: '1px solid var(--ink-faint)',
          padding: '6px 0',
          fontSize: '0.78rem',
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

      {/* 2. Cabecera Majestuosa de Prensa */}
      <div className="editorial-container">
        <header style={{ textAlign: 'center', padding: '24px 0 14px 0' }}>
          <div
            className="font-mono"
            style={{
              fontSize: '0.74rem',
              color: 'var(--ink-soft)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            SALA DE PRENSA DIGITAL • ROSARIO, SANTA FE • COBERTURA EN DIRECTO
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(2.4rem, 6vw, 4.8rem)',
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
            className="font-mono"
            style={{
              fontSize: '0.8rem',
              color: 'var(--ink-soft)',
              letterSpacing: '0.04em',
              margin: '10px auto 14px auto',
              textTransform: 'uppercase',
            }}
          >
            Periodismo independiente, cables de agencia y seguimiento metropolitano continuo
          </p>

          <div className="rule-double" />
        </header>
      </div>

      {/* 3. BARRA DE NAVEGACIÓN EDITORIAL TIPOGRÁFICA Y PURA */}
      <nav
        aria-label="Navegación editorial"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 80,
          backgroundColor: 'var(--paper)',
          borderBottom: '1px solid var(--ink-faint)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
          padding: '0',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          className="editorial-container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            overflowX: 'auto',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
            {navItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNav(item.id)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: isActive ? '3px solid var(--blue-parana)' : '3px solid transparent',
                    color: isActive ? 'var(--ink)' : 'var(--ink-soft)',
                    fontWeight: isActive ? 800 : 600,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    letterSpacing: '0.06em',
                    padding: '12px 14px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <Link
            href="/redaccion"
            style={{
              backgroundColor: 'var(--paper-elevated)',
              color: 'var(--ink)',
              border: '1px solid var(--ink-faint)',
              padding: '6px 12px',
              textDecoration: 'none',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              borderRadius: '4px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              margin: '8px 0',
            }}
          >
            <span>SALA DE REDACCIÓN</span>
            <IconArrowRight size={12} />
          </Link>
        </div>
      </nav>

      {/* 4. CONTENIDO PRINCIPAL EN FORMATO GRAN DIARIO */}
      <main className="editorial-container" style={{ marginTop: '24px' }}>
        {/* ========================================================= */}
        {/* SECCIÓN: PORTADA GENERAL DE ROSARIO                       */}
        {/* ========================================================= */}
        {activeNav === 'portada' && (
          <div>
            {/* GRILLA ASIMÉTRICA TIER-1: APERTURA (70%) + TELETIPO (30%) */}
            <div className="editorial-hero-grid">
              <div>
                <RosarioHeroBanner stories={orbitalStories} />
              </div>

              <div>
                <LiveFeedWire initialItems={liveNews} />
              </div>
            </div>

            <div className="rule-single" style={{ margin: '32px 0 24px 0' }} />

            {/* SECCIONES TEMÁTICAS BIEN ALINEADAS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {categoryNews.deportes.length > 0 && (
                <div id="seccion-futbol">
                  <CategoryBlock
                    title="Fútbol Rosarino: Newell's y Central"
                    categoryKey="deportes"
                    icon="⚽"
                    items={categoryNews.deportes}
                  />
                </div>
              )}

              {categoryNews.seguridad.length > 0 && (
                <div id="seccion-seguridad">
                  <CategoryBlock
                    title="Seguridad Ciudadana & Monitoreo Metropolitano"
                    categoryKey="seguridad"
                    icon="🛡️"
                    items={categoryNews.seguridad}
                  />
                </div>
              )}

              {categoryNews.economia.length > 0 && (
                <div id="seccion-economia">
                  <CategoryBlock
                    title="Economía, Puerto e Hidrovía del Paraná"
                    categoryKey="economia"
                    icon="🚢"
                    items={categoryNews.economia}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECCIÓN: SEGURIDAD & JUSTICIA                            */}
        {/* ========================================================= */}
        {activeNav === 'seguridad' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <CategoryBlock
                title="Seguridad Ciudadana & Monitoreo Metropolitano"
                categoryKey="seguridad"
                icon="🛡️"
                items={categoryNews.seguridad}
              />
            </div>
            <div style={{ marginTop: '20px' }}>
              <LiveFeedWire
                initialItems={liveNews.filter((n) => n.category === 'seguridad')}
              />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECCIÓN: CENTRAL & NEWELL'S                              */}
        {/* ========================================================= */}
        {activeNav === 'deportes' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <CategoryBlock
                title="Fútbol Rosarino: Newell's y Central"
                categoryKey="deportes"
                icon="⚽"
                items={categoryNews.deportes}
              />
            </div>
            <div style={{ marginTop: '20px' }}>
              <LiveFeedWire
                initialItems={liveNews.filter((n) => n.category === 'deportes')}
              />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECCIÓN: ECONOMÍA & PUERTO                               */}
        {/* ========================================================= */}
        {activeNav === 'economia' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <CategoryBlock
                title="Economía, Puerto e Hidrovía del Paraná"
                categoryKey="economia"
                icon="🚢"
                items={categoryNews.economia}
              />
            </div>
            <div style={{ marginTop: '20px' }}>
              <LiveFeedWire
                initialItems={liveNews.filter((n) => n.category === 'economia')}
              />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECCIÓN: EL PAÍS                                         */}
        {/* ========================================================= */}
        {activeNav === 'pais' && (
          <div>
            <div
              style={{
                padding: '24px 28px',
                backgroundColor: 'var(--paper-elevated)',
                border: '1px solid var(--ink-faint)',
                borderLeft: '5px solid var(--red-urgent)',
                borderRadius: '8px',
                marginBottom: '24px',
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
                DESPACHOS NACIONALES & POLÍTICA FEDERAL
              </span>
              <h2
                className="font-display"
                style={{
                  fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                  fontWeight: 900,
                  color: 'var(--ink)',
                  margin: '6px 0 8px 0',
                }}
              >
                El Escenario Nacional en Vivo
              </h2>
              <p
                className="font-body"
                style={{
                  fontSize: '0.96rem',
                  color: 'var(--ink-soft)',
                  margin: 0,
                  maxWidth: '750px',
                  lineHeight: 1.5,
                }}
              >
                Cables federales verificados de las principales agencias y medios del país con impacto en la región.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '16px',
              }}
            >
              {nationalWireNews.map((item) => (
                <ModernNewsCard key={item.id} item={item} variant="compact" showCategory={true} />
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECCIÓN: INTERNACIONAL                                   */}
        {/* ========================================================= */}
        {activeNav === 'internacional' && (
          <div>
            <div
              style={{
                padding: '24px 28px',
                backgroundColor: 'var(--paper-elevated)',
                border: '1px solid var(--ink-faint)',
                borderLeft: '5px solid var(--ink)',
                borderRadius: '8px',
                marginBottom: '24px',
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
                PRENSA MUNDIAL Y CORRESPONSALÍAS
              </span>
              <h2
                className="font-display"
                style={{
                  fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                  fontWeight: 900,
                  color: 'var(--ink)',
                  margin: '6px 0 8px 0',
                }}
              >
                El Gran Kiosco: Los Diarios del Mundo
              </h2>
              <p
                className="font-body"
                style={{
                  fontSize: '0.96rem',
                  color: 'var(--ink-soft)',
                  margin: 0,
                  maxWidth: '750px',
                  lineHeight: 1.5,
                }}
              >
                Filtrá por región y leé despachos directos de BBC Mundo, El País, Deutsche Welle, The Guardian, CNN y Al Jazeera.
              </p>
            </div>

            <WorldKiosk />
          </div>
        )}

        <Footer />
      </main>
    </div>
  );
}
