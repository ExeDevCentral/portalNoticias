'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface LiveAlertItem {
  id: string;
  title: string;
  level: string;
  active: boolean;
  createdAt: string;
}

export default function AdminPage() {
  const [alertTitle, setAlertTitle] = useState('');
  const [alertLevel, setAlertLevel] = useState<'critical_red' | 'warning' | 'info'>('critical_red');
  const [alerts, setAlerts] = useState<LiveAlertItem[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [generating12h, setGenerating12h] = useState(false);
  const [editorial12hMessage, setEditorial12hMessage] = useState('');

  // Manual news form
  const [newsTitle, setNewsTitle] = useState('');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsCategory, setNewsCategory] = useState('ciudad');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    void loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const res = await fetch('/api/admin/alerts');
      const data = await res.json();
      if (data.success && data.alerts) {
        setAlerts(data.alerts);
      }
    } catch (err) {
      console.error('Error loading alerts:', err);
    }
  };

  const handleCreateAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle.trim()) return;

    try {
      const res = await fetch('/api/admin/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: alertTitle, level: alertLevel }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage('✅ Alerta emitida y transmitida vía SSE.');
        setAlertTitle('');
        void loadAlerts();
        setTimeout(() => setActionMessage(''), 4000);
      }
    } catch (err) {
      console.error('Error creating alert:', err);
    }
  };

  const handleCreateNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsSummary.trim()) return;

    try {
      const res = await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newsTitle,
          summary: newsSummary,
          category: newsCategory,
          isUrgent,
          isPinned,
          source: 'Redacción Central',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage('✅ Noticia publicada y transmitida a la portada.');
        setNewsTitle('');
        setNewsSummary('');
        setIsUrgent(false);
        setIsPinned(false);
        setTimeout(() => setActionMessage(''), 4000);
      }
    } catch (err) {
      console.error('Error creating news:', err);
    }
  };

  const handleManualSync = async () => {
    setSyncing(true);
    setSyncMessage('Sincronizando feeds de La Capital, Rosario3 y El Ciudadano...');
    try {
      const res = await fetch('/api/admin/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.result) {
        setSyncMessage(`✅ Sincronización exitosa: ${data.result.totalInserted} noticias nuevas incorporadas (${data.result.totalProcessed} procesadas).`);
      } else {
        setSyncMessage('⚠️ La sincronización finalizó con advertencias.');
      }
    } catch {
      setSyncMessage('❌ Error al ejecutar sincronización.');
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(''), 6000);
    }
  };

  const handleGenerate12hEdition = async () => {
    setGenerating12h(true);
    setEditorial12hMessage('Generando y publicando edición autónoma 12hs (Voz Belgrano, Urquiza y Clásicos)...');
    try {
      const res = await fetch('/api/cron/editorial-12h', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setEditorial12hMessage(`✅ ¡Tirada de 12hs publicada con éxito! ${data.count} noticias emitidas e inyectadas en portada.`);
      } else {
        setEditorial12hMessage('⚠️ Error al generar edición autónoma.');
      }
    } catch {
      setEditorial12hMessage('❌ Error de conexión al emitir edición.');
    } finally {
      setGenerating12h(false);
      setTimeout(() => setEditorial12hMessage(''), 8000);
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      <Header />

      <main className="editorial-container" style={{ marginTop: '28px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Link
            href="/"
            className="font-mono"
            style={{ fontSize: '0.8rem', color: 'var(--red-urgent)', textDecoration: 'none', fontWeight: 700 }}
          >
            ← VOLVER A LA PORTADA
          </Link>
        </div>

        <header style={{ borderBottom: '2px solid var(--ink)', paddingBottom: '12px', marginBottom: '28px' }}>
          <span className="badge-deadpan">SALA DE CONTROL EDITORIAL</span>
          <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '8px 0', color: 'var(--ink)' }}>
            Panel de Operaciones & Despachos
          </h1>
          <p className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
            Emisión de alertas rojas en vivo, sincronización de cables y administración de notas fijadas.
          </p>
        </header>

        {actionMessage && (
          <div
            className="font-mono"
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--paper-elevated)',
              border: '1px solid var(--red-urgent)',
              color: 'var(--red-urgent)',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '24px',
            }}
          >
            {actionMessage}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
          }}
        >
          {/* Bloque 1: Emitir Alerta Roja en Vivo */}
          <section
            style={{
              border: '1px solid var(--ink-faint)',
              backgroundColor: 'var(--paper-elevated)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--red-urgent)',
                  display: 'inline-block',
                }}
              />
              <h2 className="font-mono" style={{ fontSize: '1rem', margin: 0, textTransform: 'uppercase' }}>
                Emitir Alerta en Directo
              </h2>
            </div>

            <form onSubmit={handleCreateAlertSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="font-mono" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '6px' }}>
                  TITULAR DE LA ALERTA:
                </label>
                <input
                  type="text"
                  value={alertTitle}
                  onChange={(e) => setAlertTitle(e.target.value)}
                  placeholder="Ej: Corte total en Av. Circunvalación por temporal"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    border: '1px solid var(--ink-faint)',
                    backgroundColor: 'var(--paper)',
                    color: 'var(--ink)',
                  }}
                  required
                />
              </div>

              <div>
                <label className="font-mono" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '6px' }}>
                  NIVEL DE PRIORIDAD:
                </label>
                <select
                  value={alertLevel}
                  onChange={(e) => setAlertLevel(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    border: '1px solid var(--ink-faint)',
                    backgroundColor: 'var(--paper)',
                    color: 'var(--ink)',
                  }}
                >
                  <option value="critical_red">Alerta Crítica (Rojo carmesí)</option>
                  <option value="warning">Aviso Importante (Ámbar)</option>
                  <option value="info">Información de Servicio (Azul Paraná)</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: 'var(--red-urgent)',
                  color: '#FFFFFF',
                  padding: '10px 16px',
                  border: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                  marginTop: '8px',
                }}
              >
                PUBLICAR Y TRANSMITIR A CLIENTES VIA SSE ➔
              </button>
            </form>

            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--ink-faint)' }}>
              <h3 className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', marginBottom: '8px' }}>
                ALERTAS ACTIVAS ({alerts.length}):
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.82rem' }}>
                {alerts.slice(0, 5).map((a) => (
                  <li key={a.id} style={{ marginBottom: '6px', color: 'var(--ink)' }}>
                    • [{a.level}] {a.title}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Bloque 2: Sincronización Manual y Publicación */}
          <section
            style={{
              border: '1px solid var(--ink-faint)',
              backgroundColor: 'var(--paper-elevated)',
              padding: '24px',
            }}
          >
            <h2 className="font-mono" style={{ fontSize: '1rem', margin: '0 0 16px 0', textTransform: 'uppercase' }}>
              Motor de Rastreo & Sincronización
            </h2>

            <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '16px' }}>
              Dispara el rastreo simultáneo sobre los feeds de prensa rosarinos (La Capital, Rosario3, El Ciudadano), con deduplicación y categorización automática.
            </p>

            <button
              type="button"
              onClick={handleManualSync}
              disabled={syncing}
              style={{
                backgroundColor: 'var(--ink)',
                color: 'var(--paper)',
                padding: '10px 18px',
                border: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: syncing ? 'not-allowed' : 'pointer',
                opacity: syncing ? 0.7 : 1,
              }}
            >
              {syncing ? 'SINCRONIZANDO...' : 'SINCRONIZAR FUENTES AHORA ➔'}
            </button>

            {syncMessage && (
              <div
                className="font-mono"
                style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  fontSize: '0.78rem',
                  backgroundColor: 'var(--paper)',
                  border: '1px solid var(--ink-faint)',
                }}
              >
                {syncMessage}
              </div>
            )}

            {/* Control del Bot Editorial Autónomo 12hs */}
            <div
              style={{
                marginTop: '24px',
                padding: '16px',
                backgroundColor: 'var(--paper)',
                border: '1px solid var(--red-urgent)',
                borderLeft: '4px solid var(--red-urgent)',
                borderRadius: '3px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span
                  style={{
                    backgroundColor: 'var(--red-urgent)',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '2px',
                    letterSpacing: '0.06em',
                  }}
                >
                  BOT IA EDITORIAL 12HS
                </span>
                <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--ink-soft)' }}>
                  Voz Belgrano, Urquiza y Clásicos
                </span>
              </div>
              <p
                className="font-body"
                style={{ fontSize: '0.84rem', color: 'var(--ink)', margin: '0 0 12px 0', lineHeight: 1.4 }}
              >
                Emite y publica de inmediato una tirada de 5 crónicas de jerarquía: legado portuario de Urquiza, clásico Newell&apos;s y Central, vigilia belgraniana y debate federal con fotos de prensa reales contextualizadas.
              </p>
              <button
                type="button"
                onClick={handleGenerate12hEdition}
                disabled={generating12h}
                style={{
                  backgroundColor: 'var(--red-urgent)',
                  color: '#FFFFFF',
                  padding: '9px 16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: generating12h ? 0.7 : 1,
                }}
              >
                <span>{generating12h ? 'EMITIENDO EDICIÓN...' : '⚡ EMITIR EDICIÓN AUTÓNOMA 12HS'}</span>
              </button>

              {editorial12hMessage && (
                <div
                  className="font-mono"
                  style={{
                    marginTop: '10px',
                    padding: '8px',
                    fontSize: '0.75rem',
                    backgroundColor: 'var(--paper-soft)',
                    border: '1px solid var(--ink-faint)',
                    color: 'var(--red-urgent)',
                  }}
                >
                  {editorial12hMessage}
                </div>
              )}
            </div>

            <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--ink-faint)' }}>
              <h3 className="font-mono" style={{ fontSize: '0.95rem', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                Publicar Noticia Exclusiva
              </h3>

              <form onSubmit={handleCreateNewsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="text"
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  placeholder="Titular de la noticia..."
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontFamily: 'var(--font-body)',
                    border: '1px solid var(--ink-faint)',
                    backgroundColor: 'var(--paper)',
                    color: 'var(--ink)',
                  }}
                  required
                />

                <textarea
                  value={newsSummary}
                  onChange={(e) => setNewsSummary(e.target.value)}
                  placeholder="Bajada / resumen periodístico..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontFamily: 'var(--font-body)',
                    border: '1px solid var(--ink-faint)',
                    backgroundColor: 'var(--paper)',
                    color: 'var(--ink)',
                  }}
                  required
                />

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <select
                    value={newsCategory}
                    onChange={(e) => setNewsCategory(e.target.value)}
                    style={{
                      padding: '6px 10px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      border: '1px solid var(--ink-faint)',
                      backgroundColor: 'var(--paper)',
                      color: 'var(--ink)',
                    }}
                  >
                    <option value="politica">Política</option>
                    <option value="seguridad">Seguridad</option>
                    <option value="economia">Economía</option>
                    <option value="deportes">Deportes</option>
                    <option value="sociedad">Sociedad</option>
                    <option value="ciudad">Ciudad</option>
                  </select>

                  <label className="font-mono" style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <input type="checkbox" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} />
                    Urgente
                  </label>

                  <label className="font-mono" style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} />
                    Fijar en Portada
                  </label>
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: 'var(--ink)',
                    color: 'var(--paper)',
                    padding: '8px 14px',
                    border: 'none',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  PUBLICAR EN EL DIARIO ➔
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
