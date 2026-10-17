'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface CableItem {
  id: string;
  source: string;
  category: string;
  originalTitle: string;
  originalSummary: string;
  sourceUrl: string;
  publishedAt: string;
  imageUrl: string;
}

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
  const [cables, setCables] = useState<CableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCable, setSelectedCable] = useState<CableItem | null>(null);
  
  // Estado del streaming
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamProgress, setStreamProgress] = useState('');
  const [rewrittenArticle, setRewrittenArticle] = useState<RewrittenArticle | null>(null);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  // Cargar cables al montar
  useEffect(() => {
    fetchCables();
  }, []);

  const fetchCables = async (query = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cables${query ? `?q=${encodeURIComponent(query)}` : ''}`);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCables(searchQuery);
  };

  // Motor de reescritura periodística con streaming
  const startStreamingRewrite = (cable: CableItem) => {
    setSelectedCable(cable);
    setIsStreaming(true);
    setStreamProgress('Conectando con la Sala de Redacción... [OK]');
    setRewrittenArticle(null);
    setPublishedSuccess(false);

    // Generador satírico periodístico (método de pirámide invertida y deadpan)
    const officialTitle = cable.originalTitle;
    let satiricalTitle = '';
    let badge = '[SEGÚN FUENTES QUE PREFIEREN NO EXISTIR]';

    if (cable.originalTitle.toLowerCase().includes('banco') || cable.originalTitle.toLowerCase().includes('inflac')) {
      satiricalTitle = 'Banqueros centrales confirman que el dinero seguirá perdiendo valor pero de manera muy prolija';
      badge = '[ECONOMÍA (FICCIÓN)]';
    } else if (cable.originalTitle.toLowerCase().includes('clima') || cable.originalTitle.toLowerCase().includes('cumbre')) {
      satiricalTitle = 'Líderes mundiales firman histórico compromiso de continuar reuniéndose en hoteles de cinco estrellas';
      badge = '[GEOPOLÍTICA (POR DECIR ALGO)]';
    } else if (cable.originalTitle.toLowerCase().includes('tecnolog') || cable.originalTitle.toLowerCase().includes('ia') || cable.originalTitle.toLowerCase().includes('empleo')) {
      satiricalTitle = 'Comité de expertos concluye que el futuro del trabajo consistirá en mirar pantallas con preocupación creciente';
      badge = '[SOCIEDAD & DESIDIA]';
    } else {
      satiricalTitle = `Autoridades informan que la situación respecto a "${cable.originalTitle.slice(0, 40)}..." está bajo control de nadie`;
      badge = '[ÚLTIMO MOMENTO (HACE 3 DÍAS)]';
    }

    const dek = `Luego de intensas deliberaciones que concluyeron justo a la hora del almuerzo, portavoces oficiales aseguraron que los próximos pasos se anunciarán formalmente en cuanto alguien descubra cuáles son.`;

    const bodyParagraphs = [
      `GINEBRA / REDACCIÓN CENTRAL. En una comparecencia solemne transmitida a través de circuitos cerrados institucionales, los delegados presentaron el informe definitivo sobre los recientes acontecimientos, destacando especialmente el impecable diseño tipográfico de la portada del documento.`,
      `"Hemos alcanzado un nivel de consenso inédito: todos coincidimos plenamente en que la culpa es del contexto internacional y de los meses que tienen más de treinta días", afirmó un vocero consultado por este periódico tras prometerle no transcribir sus suspiros.`,
      `El evento concluyó con un cerrado aplauso protocolar entre asistentes que inmediatamente procedieron a consultar sus teléfonos para verificar si el mundo seguía existiendo tal como lo habían dejado antes de la sesión.`,
    ];

    const quote = `"El plan es absolutamente impecable; su único defecto residual es que requiere ser implementado en la realidad."`;
    const imageCaption = `FOTO DE ARCHIVO: Panel de especialistas manteniendo rostros de profunda concentración cívica durante la lectura del acta. (Foto: Archivo de Prensa)`;

    // Simulación de streaming palabra por palabra con feedback en vivo
    const steps = [
      '1. Analizando cable original de ' + cable.source + '...',
      '2. Identificando los 5 Ws periodísticos (Quién, Qué, Cuándo, Dónde, Por qué)...',
      '3. Formulando el titular oficial tachado...',
      '4. Redactando titular satírico con rigor deadpan...',
      '5. Maquetando crónica periodística en 3 párrafos...',
      '6. Asociando fotografía de prensa y epígrafe solemne...',
      '7. ¡Crónica completada con éxito!',
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
    }, 450);
  };

  const publishArticle = () => {
    setPublishedSuccess(true);
    setTimeout(() => {
      setPublishedSuccess(false);
    }, 4000);
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Barra superior */}
      <div style={{ borderBottom: '1px solid var(--ink-faint)', padding: '6px 0', fontSize: '0.8rem' }}>
        <div className="editorial-container font-mono" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--ink-soft)' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link href="/" style={{ color: 'var(--ink)', textDecoration: 'none', fontWeight: 'bold' }}>
              ← VOLVER A LA PORTADA
            </Link>
            <span>•</span>
            <span>TERMINAL EDITORIAL DE CABLES INTERNACIONALES</span>
          </div>
          <span style={{ color: 'var(--red-urgent)', fontWeight: 'bold' }}>
            ESTADO: CONECTADO AL FEED MUNDIAL
          </span>
        </div>
      </div>

      <div className="editorial-container" style={{ paddingTop: '24px' }}>
        <header style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span className="badge-urgent badge-deadpan">SALA DE REDACCIÓN & TELEX</span>
              <h1 className="font-display" style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', margin: '4px 0' }}>
                Buscador & Transformador de Cables
              </h1>
              <p style={{ color: 'var(--ink-soft)', fontStyle: 'italic', fontSize: '1.05rem' }}>
                Seleccioná cualquier despacho real de agencias internacionales. El motor preservará el método periodístico pero reescribirá la historia con la lucidez mordaz del diario.
              </p>
            </div>
            <span className="font-mono" style={{ fontSize: '0.8rem', border: '1px solid var(--ink)', padding: '4px 8px' }}>
              COSTO: $0 (FEEDS RSS ABIERTOS)
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
                fetchCables('');
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
                  {rewrittenArticle.body.map((p, idx) => (
                    <p key={idx}>{p}</p>
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
