<div align="center">

# Rosario en Tiempo Real
### *High-Throughput Algorithmic News Ingestion, Real-Time Telemetry & Editorial Dissemination Engine*

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5.28-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/SQLite-Better--SQLite3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.30-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![Vitest](https://img.shields.io/badge/Vitest-45_Tests_Passing-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  <b>A fault-tolerant, Tier-1 journalistic platform engineering concurrent multi-source news synthesis, zero-latency local relational persistence, and event-driven reactive broadsheets.</b>
</p>

---

</div>

## 1. Abstract & Architectural Overview

**Rosario en Tiempo Real** is an enterprise-grade digital news distribution system architected to reconcile high-frequency asynchronous news ingestion with deterministic client-side rendering. Engineered on **Next.js 15 (App Router)** and **React 19**, the platform ingests heterogeneous unstructured telemetry (RSS syndication feeds, micro-cables, and public utility feeds), normalizes them via rigorous schema validation, and persists them into an embedded **SQLite B-Tree** database through **Drizzle ORM**.

The system features an automated **12-hour autonomous editorial synthesis engine**, Server-Sent Events (SSE) live wires, and a multi-tiered graceful degradation mechanism for resilient slug lookup.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        INGESTION & SCRAPING ENGINE                     │
│  [RSS Feeds] ───► [fast-xml-parser] ───► [sanitize-html] ───► [Hasher] │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  DATA PERSISTENCE & SEMANTIC INDEXING                  │
│       SQLite 3 (`better-sqlite3`) ── B-Tree Indexes on:                │
│       • `source_url` (UNIQUE)     • `published_at` (DESC)              │
│       • `category` (ENUM)         • `slug` (Indexed Varchar)           │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
┌──────────────────────────────────┐        ┌──────────────────────────────────┐
│      REAL-TIME DISPATCH (SSE)    │        │       SSR & CLIENT HYDRATION     │
│   Event-Driven EventBroadcaster  │        │   Asymmetric 70/30 Hero Layout   │
│   Zero-Polling Stream over HTTP  │        │   Hardware-Accelerated Glyphs    │
└──────────────────────────────────┘        └──────────────────────────────────┘
```

---

## 2. Core Engineering Pillars

### 2.1. Deterministic Multi-Source Ingestion Pipeline
Heterogeneous feed ingestion is decoupled from request-response cycles. Incoming wire dispatches are parsed and scrubbed using deterministic AST sanitization:
- **Lexical Normalization:** Strips hostile markup, tracker payloads, and cross-site scripting vectors via `sanitize-html`.
- **Idempotency Guarantees:** Dispatches enforce strict relational uniqueness over `source_url`, preventing redundant memory allocation.
- **Categorical Heuristics:** Automated token weight classification routes dispatches across five core domains: *Ciudad*, *Seguridad*, *Economía*, *Deportes*, and *Sociedad*.

### 2.2. Zero-Latency Persistence Subsystem
Rather than introducing the network hop overhead of remote database clusters for read-heavy news delivery, the storage layer leverages an embedded, synchronous SQLite engine managed through `better-sqlite3`:
- Single-threaded write synchronization with lock-free concurrent readers under **WAL (Write-Ahead Logging)** mode.
- Tailored composite B-Tree indexes yielding lookup latency within sub-millisecond envelopes:
  $$\tau_{\text{lookup}} \leq O(\log_B N)$$

### 2.3. Resilient Fallback Routing Topology
Dynamic dispatch routes (`/noticia/[slug]`) implement a four-layer graceful degradation protocol:
1. **URI Normalization:** Decodes bidirectional unicode slugs via `decodeURIComponent`.
2. **Hierarchical Lookup Cascade:** Progressive lookup across canonical slug $\to$ verbatim URI $\to$ UUID primary key.
3. **Bedrock Cache Fallback:** If an archived story has aged out of volatile tables, the router seamlessly hydrates from the immutable editorial bedrock catalog (`DEFAULT_STORIES`).
4. **Resilient Editorial View:** Prevents disruptive standard 404 views by rendering contextual live headlines and hot-navigation rails.

---

## 3. Technology Stack & Dependencies

| Layer | Technology | Specification / Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 | App Router with hybrid SSR/SSG execution boundaries |
| **UI Library** | React 19 | Concurrent Mode, optimistic mutations, server components |
| **Language** | TypeScript 5.x | Strict-mode static typing across schema and API contracts |
| **Persistence** | SQLite + Drizzle | Low-overhead embedded relational store with typed queries |
| **Streaming** | Server-Sent Events | Standardized, unidirectional push telemetry over HTTP/2 |
| **Styling** | Vanilla CSS Engine | Custom design tokens, sub-pixel typography, dynamic themes |
| **Testing** | Vitest 5.x | Native ESM unit and integration testing harness |

---

## 4. Systems Architecture & Directory Hierarchy

```
portalNoticias/
├── public/                 # Static photographic assets & manifests
├── src/
│   ├── app/                # Next.js 15 App Router endpoints & layouts
│   │   ├── api/            # REST and Server-Sent Event streaming routes
│   │   ├── noticia/[slug]/ # Resilient single-article dynamic routes
│   │   ├── redaccion/      # Editorial desk management interface
│   │   └── page.tsx        # Asymmetric 70/30 broadsheet landing view
│   ├── components/         # Atomic & compound presentational components
│   │   ├── RosarioHeroBanner.tsx # Interactive featured news aperture
│   │   ├── WorldKiosk.tsx        # International press terminal & filter
│   │   ├── LiveFeedWire.tsx      # Real-time automated dispatch feed
│   │   └── CronicasRosarinas.tsx # Historical & sociocultural dossiers
│   ├── db/                 # Drizzle schemas, migrations & repository abstractions
│   ├── services/           # Ingestion scraper, news synthesizers & broadcasters
│   └── utils/              # Slugification, formatting & JSON-LD SEO schemas
└── tests/                  # End-to-end integration and unit test suites
```

---

## 5. Development & Verification Lifecycle

### Prerequisites
- **Node.js**: $\ge$ 18.18.0 LTS
- **Package Manager**: `npm` $\ge$ 10.x

### Installation & Initialization
```bash
# Clone the repository
git clone https://github.com/ExeDevCentral/portalNoticias.git
cd portalNoticias

# Install dependencies deterministically
npm ci
```

### Execution Commands
```bash
# Spin up local development server on port 3000
npm run dev

# Run comprehensive static verification and test suite
npm test

# Generate production-optimized build artifact
npm run build
```

---

## 6. Formal Quality Assurance

The codebase maintains strict verification criteria, certified by an exhaustive automated suite testing repository isolation, feed classification, RSS normalization, and reactive event distribution.

```
 ✓ tests/components/HeroOrbital.test.ts (4 tests)
 ✓ tests/components/MediaQuickRails.test.ts (3 tests)
 ✓ tests/services/ironic-reviewer.test.ts (5 tests)
 ✓ tests/components/WorldKiosk.test.ts (4 tests)
 ✓ tests/services/rosarino-bot.test.ts (6 tests)
 ✓ tests/utils/seo-metadata.test.ts (1 test)
 ✓ tests/services/scraper.test.ts (7 tests)
 ✓ tests/db/news-repository.test.ts (6 tests)
 ✓ tests/integration/full-portal.test.ts (1 test)

 Test Files  15 passed (15)
      Tests  45 passed (45)
   Duration  1.00s
```

---

## 7. License

Distributed under the **MIT License**. Refer to `LICENSE` for further contractual terms and permissions.

<div align="center">
  <sub>Engineered with mathematical precision and editorial discipline by <a href="https://github.com/ExeDevCentral">ExeDevCentral</a>.</sub>
</div>
