# Rosario en Tiempo Real • Core Architecture

Plataforma editorial de alta concurrencia orientada a la ingestión, curaduría algorítmica y distribución en tiempo real de noticias hiperlocales, nacionales e internacionales.

---

## 1. Stack Tecnológico

| Capa | Especificación | Rol |
| :--- | :--- | :--- |
| **Runtime & Framework** | Next.js 15 (App Router) + React 19 | SSR dinámico, streaming y client-side hydration |
| **Persistencia** | SQLite (via `better-sqlite3`) + Drizzle ORM | Embedded zero-latency storage, transacciones atómicas |
| **Ingesta Asíncrona** | Engine de scraping & RSS Parser (`fast-xml-parser`) | Ingesta concurrente, idempotencia por `source_url` |
| **Frontend Styling** | Vanilla CSS Tokens + CSS Variables | Glassmorphism, aceleración 3D por hardware (`translateZ`) |
| **Quality Assurance** | Vitest (42 test suites) + TypeScript Strict | Verificación estática y de integración continua |

---

## 2. Pipeline de Ingestión y Normalización

```
[RSS Feeds / Agencias API]
       │
       ▼
[fast-xml-parser + sanitize-html]
       │
       ▼
[Category Classifier] ─── (Heurística semántica: ciudad, seguridad, deportes, economía)
       │
       ▼
[Idempotent Ingestion] ── (UNIQUE constraint sobre source_url en SQLite)
       │
       ▼
[portal.db] ───────────── (Índices B-Tree en published_at, category, slug)
```

---

## 3. Resiliencia y Fallback Routing (`/noticia/[slug]`)

La resolución de rutas dinámicas implementa un esquema multicapa de degradación elegante:
1. **Sanitización de entrada:** Decodificación segura vía `decodeURIComponent(slug)`.
2. **Lookup jerárquico:** Búsqueda en SQLite por `slug` unificado -> `slug` literal -> `UUID`.
3. **Bedrock Cache:** Si el despacho fue archivado de la tabla viva, se resuelve contra la memoria de crónicas de cabecera (`DEFAULT_STORIES`).
4. **Editorial Graceful View:** En caso de desfasaje extremo, se evita el 404 tradicional, renderizando un fallback estructurado con navegación reactiva a la portada viva.

---

## 4. Comandos de Operación

```bash
# Instalación de dependencias
npm install

# Servidor de desarrollo
npm run dev

# Ejecución de suite de tests unitarios e integración
npm test

# Validación estática de tipos
npx tsc --noEmit
```
