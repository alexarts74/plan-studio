# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Build & Development Commands

- `npm run dev` — start dev server (port 3000)
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — run ESLint (`eslint` with `next/core-web-vitals` + `typescript` configs)

## Tech Stack

- **Next.js 16.2.1** (App Router) — has breaking changes vs training data, always consult `node_modules/next/dist/docs/` before writing code
- **React 19.2.4** / **React DOM 19.2.4**
- **Tailwind CSS v4** — uses new `@tailwindcss/postcss` plugin and `@theme inline` directive (not v3 `tailwind.config.js`)
- **TypeScript 5** (strict mode)
- **ESLint 9** with flat config (`eslint.config.mjs`)

## Architecture

- App Router at `/app` — no Pages Router, `lang="fr"`
- Path alias: `@/*` maps to project root
- Fonts: **Cormorant Garamond** (serif, titles) + **Inter** (sans, body) configured in `lib/fonts.ts`
- Global styles in `/app/globals.css` with CSS custom properties, Tailwind v4 `@theme inline`, no dark mode
- Static assets in `/public/` — optimized images in `public/images/`, video in `public/videos/`
- Components in `/components/` — Navigation (hamburger overlay), Footer, Logo, ImageGallery (lightbox), ProjectCard, AnimatedSection, ContactForm
- Portfolio data centralized in `lib/portfolio-data.ts` — 2 categories, 23 projects
- Dynamic routes: `/portfolio/[category]` and `/portfolio/[category]/[project]` with `generateStaticParams`
- Contact form opens the user's mail client via `mailto:` (client-side, no backend)
- Image processing script: `node scripts/process-images.mjs` — resizes source photos from `SITE WEB/` → `public/images/`

## Key Differences From Older Next.js

Next.js 16 and Tailwind v4 have significant API changes. Do not rely on prior knowledge — read the docs at `node_modules/next/dist/docs/` and check deprecation notices before implementing features.
