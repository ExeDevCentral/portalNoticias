'use client';

import React, { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${url}`)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', margin: '16px 0' }}>
      <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', fontWeight: 600 }}>
        COMPARTIR:
      </span>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          padding: '4px 10px',
          borderRadius: '3px',
          textDecoration: 'none',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
        }}
      >
        WhatsApp
      </a>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          backgroundColor: 'var(--ink)',
          color: 'var(--paper)',
          padding: '4px 10px',
          borderRadius: '3px',
          textDecoration: 'none',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
        }}
      >
        X (Twitter)
      </a>
      <button
        type="button"
        onClick={handleCopy}
        style={{
          background: 'none',
          border: '1px solid var(--ink-faint)',
          padding: '3px 10px',
          borderRadius: '3px',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)',
          cursor: 'pointer',
          color: 'var(--ink)',
          fontWeight: 600,
        }}
      >
        {copied ? '¡Copiado!' : 'Copiar Enlace'}
      </button>
    </div>
  );
}
