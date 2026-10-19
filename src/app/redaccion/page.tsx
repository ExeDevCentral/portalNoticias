'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IconSun, IconMoon } from '../../components/Icons';
import type { CableItem } from '@/types/cables';

interface RewrittenArticle {
  officialTitle: string;
  satiricalTitle: string;
  dek: string;
  body: string[];
  quote: string;
  badge: string;
  imageUrl: string;
  imageCaption: string;
  source: string;
  sourceUrl: string;
}

export default function RedaccionPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [cables, setCables] = useState<CableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCable, setSelectedCable] = useState<CableItem | null>(null);
  
  // Estado del streaming
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamProgress, setStreamProgress] = useState('');
  const [rewrittenArticle, setRewrittenArticle] = useState<RewrittenArticle | null>(null);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.dataset.theme = saved;
    } else {
      document.documentElement.dataset.theme = 'dark';
    }
    void fetchCables();
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.dataset.theme = next;
  };

  const fetchCables = async (query = '') => {
    setLoading(true);
    try {
      const url = query ? `/api/cables?q=${encodeURIComponent(query)}` : '/api/cables';
      const res = await fetch(url);
      const data = await res.json();
      if (data.cables) {
        setCables(data.cables);
      }
    } catch (err) {
      console.error('Error al cargar cables:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    void fetchCables(searchQuery);
  };

  // Motor de reescritura periodística con streaming
  const startStreamingRewrite = (cable: CableItem) => {
    setSelectedCable(cable);
    setIsStreaming(true);
    setStreamProgress('Conectando con el teletipo de la redacción... [OK]');
    setRewrittenArticle(null);
    setPublishedSuccess(false);

    const officialTitle = cable.originalTitle;
    let satiricalTitle = '';
    let badge = 'INFORME DE REDACCIÓN';

    if (cable.originalTitle.toLowerCase().includes('banco') || cable.originalTitle.toLowerCase().includes('inflac') || cable.originalTitle.toLowerCase().includes('dólar')) {
      satiricalTitle = 'Banqueros y operadores confirman que el dinero seguirá perdiendo valor pero con gráficos elegantes';
      badge = 'ECONOMÍA & FINANZAS';
    } else if (cable.originalTitle.toLowerCase().includes('clima') || cable.originalTitle.toLowerCase().includes('río') || cable.originalTitle.toLowerCase().includes('paraná')) {
      satiricalTitle = 'El río Paraná sigue bajando y subiendo según su propia voluntad sin consultar a los funcionarios de turno';
      badge = 'RÍO PARANÁ & AMBIENTE';
    } else if (cable.originalTitle.toLowerCase().includes('puerto') || cable.originalTitle.toLowerCase().includes('soja') || cable.originalTitle.toLowerCase().includes('buque')) {
      satiricalTitle = 'Ochenta barcos graneleros aguardan en rada mientras en los muelles debaten el menú de empanadas';
      badge = 'PUERTO & HIDROVÍA';
    } else if (cable.originalTitle.toLowerCase().includes('fútbol') || cable.originalTitle.toLowerCase().includes('clásico') || cable.originalTitle.toLowerCase().includes('central') || cable.originalTitle.toLowerCase().includes('newell')) {
      satiricalTitle = 'Ambos bandos coinciden en que el clásico del domingo es cuestión de vida o muerte cívica';
      badge = 'FÚTBOL ROSARINO';
    } else {
      satiricalTitle = `Autoridades informan que la situación respecto a "${cable.originalTitle.slice(0, 42)}..." está bajo minuciosa observación`;
      badge = 'DESPACHO DE URGENCIA';
    }

    const dek = `Despacho verificado desde las terminales del Paraná: portavoces oficiales aseguraron que las medidas técnicas ya fueron redactadas y esperan firma ministerial.`;

    const bodyParagraphs = [
      `ROSARIO (De nuestra Redacción). Con la solemnidad que caracteriza a las grandes jornadas del Litoral, las autoridades competentes presentaron el informe de situación con copia a las catorce provincias.`,
      `"Hemos alcanzado un entendimiento razonable con todos los sectores involucrados; el único detalle pendiente es cómo compaginarlo con el calendario civil", señaló un vocero consultado en la Bolsa de Comercio.`,
      `El despacho concluyó con la ratificación de las guardias permanentes y el monitoreo ininterrumpido sobre la Hidrovía y los accesos metropolitanos.`,
    ];

    const quote = `"La realidad regional avanza siempre un paso antes que los discursos protocolares."`;
    const imageCaption = `FOTO DE ARCHIVO: Terminal portuaria y dársenas del Gran Rosario durante la operatoria matutina. (Foto: Archivo de Prensa)`;

    const steps = [
      '1. Recepción del despacho de ' + cable.source + '...',
      '2. Cotejando datos y fuentes del Litoral...',
      '3. Formulando titular oficial contrastado...',
      '4. Redactando crónica periodística en 3 párrafos...',
      '5. Asociando fotografía de prensa y epígrafe...',
      '6. Despacho listo para publicación.',
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setStreamProgress(steps[currentStep]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
        setRewrittenArticle({
          officialTitle,
          satiricalTitle,
          dek,
          body: bodyParagraphs,
          quote,
          badge,
          imageUrl: cable.imageUrl,
          imageCaption,
          source: cable.source,
          sourceUrl: cable.sourceUrl,
        });
      }
    }, 400);
  };

  const publishArticle = async () => {
    if (!rewrittenArticle) return;
    try {
      await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: rewrittenArticle.satiricalTitle || rewrittenArticle.officialTitle,
          summary: rewrittenArticle.dek,
          content: rewrittenArticle.body.map((p) => `<p>${p}</p>`).join(''),
          imageUrl: rewrittenArticle.imageUrl,
          source: rewrittenArticle.source || 'Redacción',
          sourceUrl: rewrittenArticle.sourceUrl,
          category: 'ciudad',
          isUrgent: false,
          isPinned: true,
        }),
      });
      setPublishedSuccess(true);
      setTimeout(() => {
        setPublishedSuccess(false);
      }, 4000);
    } catch (err) {
      console.error('Error publishing rewritten article:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Barra superior de servicio y modo de color */}
      <div style={{ borderBottom: '1px solid var(--ink-faint)', padding: '6px 0', fontSize: '0.8rem', backgroundColor: 'var(--paper-elevated)' }}>
        <div className="editorial-container font-mono" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--ink-soft)' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link href="/" style={{ color: 'var(--ink)', textDecoration: 'none', fontWeight: 700 }}>
              ← VOLVER A LA PORTADA
            </Link>
            <span>•</span>
            <span style={{ color: 'var(--blue-parana)', fontWeight: 600 }}>TERMINAL DE CABLES & TELETIPO EN VIVO</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ color: 'var(--red-urgent)', fontWeight: 'bold' }}>
              ● RECEPCIÓN ACTIVA
            </span>
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

      <div className="editorial-container" style={{ paddingTop: '24px' }}>
        <header style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span className="badge-urgent badge-deadpan">TELETIPO 24 HORAS • FRECUENCIA CONTINUA</span>
              <h1 className="font-display" style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', margin: '4px 0' }}>
                Recepción & Despacho de Cables
              </h1>
              <p style={{ color: 'var(--ink-soft)', fontStyle: 'italic', fontSize: '1.05rem' }}>
                Monitoreo continuo de agencias del Litoral, cotizaciones agroindustriales y novedades metropolitanas de Rosario.
              </p>
            </div>
            <span className="font-mono" style={{ fontSize: '0.75rem', border: '1px solid var(--ink)', padding: '4px 8px' }}>
              AGENCIAS & CABLES EN TIEMPO REAL
            </span>
          </div>
          <div className="rule-double" />
        </header>

        {/* Buscador de cables */}
        <div style={{ marginBottom: '32px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="Buscar cables internacionales por tema (ej: bancos, diplomacia, clima, tecnología, empleo)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="font-mono"
              style={{
                flex: 1,
                padding: '10px 14px',
                fontSize: '0.9rem',
                backgroundColor: 'var(--paper-elevated)',
                color: 'var(--ink)',
                border: '1px solid var(--ink)',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              className="font-mono"
              style={{
                padding: '10px 20px',
                backgroundColor: 'var(--ink)',
                color: 'var(--paper)',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              BUSCAR CABLES
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                void fetchCables('');
              }}
              className="font-mono"
              style={{
                padding: '10px 16px',
                backgroundColor: 'transparent',
                color: 'var(--ink)',
                border: '1px solid var(--ink)',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              REFRESCAR
            </button>
          </form>
        </div>

        {/* Layout en dos columnas: Cables entrantes y Visor de Reescritura */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px', alignItems: 'start' }}>
          {/* Columna Izquierda: Cables Entrantes */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Bandeja de Cables Disponibles ({cables.length})
              </h3>
              {loading && <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--red-urgent)' }}>Consultando agencias...</span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '720px', overflowY: 'auto', paddingRight: '8px' }}>
              {cables.map((cable) => (
                <div
                  key={cable.id}
                  style={{
                    backgroundColor: 'var(--paper-elevated)',
                    border: selectedCable?.id === cable.id ? '2px solid var(--red-urgent)' : '1px solid var(--ink-faint)',
                    padding: '14px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div className="font-mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--ink-soft)', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{cable.source}</span>
                    <span>{cable.category}</span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', lineHeight: 1.3, marginBottom: '8px', fontFamily: 'var(--font-serif-display)' }}>
                    {cable.originalTitle}
                  </h4>

                  <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', marginBottom: '12px', lineHeight: 1.4 }}>
                    {cable.originalSummary}
                  </p>

                  {cable.ironicReview && (
                    <div
                      style={{
                        padding: '8px 10px',
                        backgroundColor: 'var(--paper)',
                        borderLeft: '3px solid var(--red-urgent)',
                        borderTop: '1px solid var(--ink-faint)',
                        borderRight: '1px solid var(--ink-faint)',
                        borderBottom: '1px solid var(--ink-faint)',
                        marginBottom: '12px',
                        borderRadius: '2px',
                      }}
                    >
                      <span
                        className="font-mono"
                        style={{
                          display: 'block',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          color: 'var(--red-urgent)',
                          letterSpacing: '0.05em',
                          marginBottom: '3px',
                        }}
                      >
                        ⚡ {cable.warningTag || 'RESEÑA IRÓNICA'}
                      </span>
                      <p
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontStyle: 'italic',
                          fontSize: '0.82rem',
                          lineHeight: 1.35,
                          color: 'var(--ink)',
                          margin: 0,
                        }}
                      >
                        &ldquo;{cable.ironicReview}&rdquo;
                      </p>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <a
                      href={cable.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono"
                      style={{ fontSize: '0.7rem', color: 'var(--ink-soft)', textDecoration: 'underline' }}
                    >
                      Ver despacho original ↗
                    </a>
                    <button
                      onClick={() => startStreamingRewrite(cable)}
                      disabled={isStreaming}
                      className="font-mono"
                      style={{
                        backgroundColor: 'var(--red-urgent)',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: isStreaming ? 'not-allowed' : 'pointer',
                        opacity: isStreaming ? 0.6 : 1,
                      }}
                    >
                      ➔ REESCRIBIR AL ESTILO DEL DIARIO
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Columna Derecha: Consola de Streaming y Nota Maquetada */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Mesa de Edición en Streaming (WebSocket)
              </h3>
              {isStreaming && (
                <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--red-urgent)', fontWeight: 'bold' }}>
                  ● TRANSMITIENDO PÁRRAFOS...
                </span>
              )}
            </div>

            {/* Consola de estado en vivo */}
            <div
              className="font-mono"
              style={{
                backgroundColor: 'var(--ink)',
                color: 'var(--paper)',
                padding: '12px 16px',
                fontSize: '0.8rem',
                border: '1px solid var(--ink)',
                marginBottom: '20px',
                minHeight: '48px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ color: 'var(--red-urgent)', fontWeight: 'bold' }}>&gt;&gt;</span>
              <span>{streamProgress || 'Seleccione un cable para iniciar el streaming periodístico...'}</span>
            </div>

            {/* Resultado maquetado con estética editorial */}
            {rewrittenArticle ? (
              <div
                style={{
                  backgroundColor: 'var(--paper)',
                  border: '2px solid var(--ink)',
                  padding: '24px',
                  boxShadow: '4px 4px 0px var(--ink)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="badge-deadpan">{rewrittenArticle.badge}</span>
                  <span className="satire-stamp">REESCRIBIENDO LA REALIDAD</span>
                </div>

                {/* Gesto firma: Titular tachado en rojo oficial + Titular satírico */}
                <div style={{ marginBottom: '16px' }}>
                  <span className="strikethrough-official" style={{ fontSize: '1rem' }}>
                    {rewrittenArticle.officialTitle}
                  </span>
                  <h2 className="satirical-correction" style={{ fontSize: '1.75rem', marginTop: '4px' }}>
                    {rewrittenArticle.satiricalTitle}
                  </h2>
                </div>

                {/* Copete */}
                <p style={{ fontSize: '1.1rem', color: 'var(--ink-soft)', marginBottom: '18px', borderLeft: '3px solid var(--red-urgent)', paddingLeft: '14px', lineHeight: 1.5 }}>
                  {rewrittenArticle.dek}
                </p>

                {/* Foto tratada con epígrafe */}
                <div className="press-photo-container" style={{ height: '240px', marginBottom: '6px' }}>
                  <img
                    src={rewrittenArticle.imageUrl}
                    alt="Foto de prensa oficial"
                    className="press-photo"
                  />
                </div>
                <div className="press-caption" style={{ marginBottom: '16px' }}>
                  {rewrittenArticle.imageCaption}
                </div>

                {/* Cita resaltada con marcador */}
                <div style={{ margin: '14px 0' }}>
                  <span className="highlight-marker">{rewrittenArticle.quote}</span>
                </div>

                {/* Párrafos */}
                <div style={{ fontSize: '1.05rem', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
                  {rewrittenArticle.body.map((p) => (
                    <p key={p.slice(0, 32)}>{p}</p>
                  ))}
                </div>

                <div className="rule-double" style={{ margin: '20px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
                    Basado en despacho verídico de: <strong>{rewrittenArticle.source}</strong>
                  </div>

                  <button
                    onClick={publishArticle}
                    className="font-mono"
                    style={{
                      backgroundColor: publishedSuccess ? '#2E7D32' : 'var(--ink)',
                      color: 'var(--paper)',
                      border: 'none',
                      padding: '10px 20px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {publishedSuccess ? '✓ ¡PUBLICADO EN LA PORTADA!' : '🖨 IMPRIMIR EN PORTADA'}
                  </button>
                </div>

                {publishedSuccess && (
                  <div
                    className="font-mono"
                    style={{
                      marginTop: '12px',
                      padding: '8px 12px',
                      backgroundColor: 'var(--paper-elevated)',
                      border: '1px solid #2E7D32',
                      color: '#2E7D32',
                      fontSize: '0.8rem',
                      textAlign: 'center',
                    }}
                  >
                    La nota fue fijada y enviada a la rotativa del diario. Podés revisarla en la portada.
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  border: '1px dashed var(--ink-faint)',
                  padding: '48px 24px',
                  textAlign: 'center',
                  color: 'var(--ink-soft)',
                }}
              >
                <p className="font-mono" style={{ fontSize: '0.85rem' }}>
                  [EL VISOR EDITORIAL ESTÁ EN ESPERA]
                </p>
                <p style={{ marginTop: '8px', fontSize: '0.95rem' }}>
                  Elegí una noticia de la columna izquierda y hacé clic en <strong>"Reescribir al estilo del diario"</strong> para ver el streaming en vivo.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
