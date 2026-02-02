# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kuro is a Next.js 14 marketing landing page and legal documentation site for a personal digital butler app. It features a custom internationalization system with server-side HTML processing.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run start    # Run production server
npm run lint     # Next.js linting
```

## Architecture

### Content Flow

HTML templates (`index.html`, `contact.html`, `privacy.html`, `delete-account.html`) → Server-side processing (`app/lib/html.js`) → Rendered pages

The `html.js` module:
1. Extracts body content from HTML files
2. Strips script tags for security
3. Rewrites links with language prefixes (e.g., `contact.html` → `/fr/contact`)
4. Applies translations using `data-i18n*` attributes
5. Caches processed HTML

### Language Routing

- **URL pattern:** `/[lang]/[page]` (e.g., `/fr/contact`, `/en/privacy`)
- **Supported languages:** `en`, `fr`, `es`, `de` (defined in `app/lib/html.js`)
- **Default:** `en`
- **Middleware** (`middleware.js`) redirects unsupported paths to `/en`
- All language variants are statically generated at build time (`dynamicParams: false`)

### Translation System

- **Server-side:** `app/lib/html.js` processes translations during build
- **Client-side:** `public/i18n/i18n.js` handles dynamic language switching via i18next (CDN-loaded)
- **Translation keys:** Dot notation in `public/i18n/translations.js` (e.g., `nav.features`, `meta.home.title`)
- **HTML attributes:** `data-i18n`, `data-i18n-placeholder`, `data-i18n-title`, `data-i18n-aria`

### Key Files

| File | Purpose |
|------|---------|
| `app/lib/html.js` | HTML processing, translation, link rewriting, caching |
| `middleware.js` | Language routing redirects |
| `public/i18n/translations.js` | Translation bundles (FR most complete, ES/DE partial) |
| `public/i18n/i18n.js` | Client-side language switching |
| `public/script.js` | Mobile menu, contact form (Formspree), smooth scroll |

## Working with Content

- Edit HTML templates in root directory, not the rendered output
- When adding links, use relative HTML paths (e.g., `contact.html`) - they get rewritten to language-aware paths
- When adding translatable content, use `data-i18n="key.path"` and add the key to `translations.js`
- French translations are most complete; check coverage when adding new keys
