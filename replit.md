# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Farzeena Analytics Engineer portfolio website with full-stack CMS.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Wouter routing + TailwindCSS + shadcn/ui + Framer Motion
- **API framework**: Express 5
- **Database**: MongoDB + Mongoose (DB name: `farzeena-portfolio`)
- **Auth**: better-auth with magic link plugin + Resend for email (admin-only, no public signup)
- **Validation**: Zod (`zod/v4`)
- **API codegen**: Orval (from OpenAPI spec → React Query hooks + Zod schemas)
- **Build**: esbuild (CJS bundle for API), Vite (frontend)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/              # Express API server (MongoDB + Mongoose)
│   └── farzeena-portfolio/      # React frontend (public portfolio + admin CMS)
├── lib/
│   ├── api-spec/                # OpenAPI spec + Orval codegen config
│   ├── api-client-react/        # Generated React Query hooks
│   └── api-zod/                 # Generated Zod schemas from OpenAPI
├── scripts/
│   └── src/seed.ts              # Database seed script (admin user + sample content)
├── pnpm-workspace.yaml
└── replit.md
```

## Features

### Public Portfolio (/)
- **8-section homepage**: Navbar, Hero (with pipeline animation), Featured Case Studies, Analytics Insights (blogs), CTA Banner, About, Contact Form, Footer
- **Case Studies**: `/case-studies` (list), `/case-studies/:slug` (detail with markdown rendering)
- **Blogs**: `/blogs` (list), `/blogs/:slug` (detail with markdown rendering)
- All content served from MongoDB via React Query hooks

### Admin CMS (/admin/*)
- **Magic Link Auth**: Enter email → receive magic link via Resend → auto-login. Only pre-seeded admin users can log in (`disableSignUp: true`)
- **Dashboard**: Overview with counts and quick links
- **Case Study Manager**: List, create, edit, delete case studies
- **Blog Manager**: List, create, edit, delete blogs
- **Hero Editor**: Edit hero heading, subtitle, CTAs, pipeline steps, tool icons
- **About Editor**: Edit bio, profile image, focus areas, industry tags
- **Site Settings**: Edit CTA banner text, footer, social links, contact email, SEO defaults
- **Contact Submissions**: View, mark read/unread, delete incoming contact form messages

## Key Files

### Backend (artifacts/api-server/src/)
- `app.ts` — Express app, CORS, cookie-parser, better-auth handler, route mounts
- `lib/auth.ts` — better-auth config with magic link + Resend
- `lib/mongoose.ts` — MongoDB connection
- `models/` — Mongoose models: CaseStudy, Blog, HeroSection, AboutSection, SiteSettings, ContactSubmission
- `routes/` — REST API routes for all entities + custom auth routes

### Frontend (artifacts/farzeena-portfolio/src/)
- `App.tsx` — Routing with AuthGuard, QueryClient, Toaster setup
- `pages/public/Home.tsx` — Full homepage with all 8 sections
- `pages/public/CaseStudies.tsx` — Case study listing page
- `pages/public/CaseStudyDetail.tsx` — Case study detail with markdown
- `pages/public/Blogs.tsx` — Blog listing page
- `pages/public/BlogDetail.tsx` — Blog detail with markdown
- `pages/admin/Login.tsx` — Magic link login page
- `pages/admin/Dashboard.tsx` — Admin dashboard
- `pages/admin/ContentManagers.tsx` — CaseStudiesManager + BlogsManager components
- `pages/admin/ContentEditor.tsx` — CaseStudyEditor + BlogEditor forms
- `pages/admin/SectionEditors.tsx` — HeroEditor, AboutEditor, SiteSettingsEditor, ContactSubmissions
- `components/layout/AdminLayout.tsx` — Admin sidebar layout
- `components/layout/PublicLayout.tsx` — Public nav + footer layout

## API Endpoints

All endpoints prefixed with `/api`:
- `GET/PUT /api/hero` — Hero section
- `GET/PUT /api/about` — About section
- `GET/PUT /api/site-settings` — Site settings
- `GET /api/case-studies` — List case studies
- `GET /api/case-studies/:id` — Get by ID
- `GET /api/case-studies/slug/:slug` — Get by slug
- `POST /api/case-studies` — Create
- `PUT /api/case-studies/:id` — Update
- `DELETE /api/case-studies/:id` — Delete
- `GET /api/blogs` — List blogs
- `GET /api/blogs/:id` — Get by ID
- `GET /api/blogs/slug/:slug` — Get by slug
- `POST /api/blogs` — Create
- `PUT /api/blogs/:id` — Update
- `DELETE /api/blogs/:id` — Delete
- `GET /api/contact-submissions` — List submissions
- `POST /api/contact-submissions` — Submit contact form
- `PUT /api/contact-submissions/:id` — Update (mark read/unread)
- `DELETE /api/contact-submissions/:id` — Delete
- `POST /api/contact-submissions/bulk-delete` — Bulk delete
- `POST /api/auth/request-magic-link` — Send magic link email
- `GET /api/auth/verify-session` — Check session
- `POST /api/auth/sign-out` — Sign out
- `/api/auth/*` — better-auth handler (magic link verification callbacks)

## Secrets Required
- `MONGODB_URI` — MongoDB connection string
- `RESEND_API_KEY` — Resend API key for sending magic link emails
- `ADMIN_EMAIL` — Admin email address (used during seeding)
- `BETTER_AUTH_SECRET` — better-auth secret for session signing

## Running Seed Script
```bash
pnpm --filter @workspace/scripts run seed
```
Creates admin user, 3 case studies, 3 blogs, hero section, about section, and site settings.

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from root** — `pnpm run typecheck`
- **`emitDeclarationOnly`** — only `.d.ts` files during typecheck; JS bundling by Vite/esbuild

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly`
- `pnpm --filter @workspace/api-spec run codegen` — regenerate React Query hooks + Zod schemas from OpenAPI spec
