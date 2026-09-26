# Atelier AI

AI Interior Studio is a commercial-ready product foundation for exploring interior directions from a room photograph. The project is being implemented in small, verifiable stages from `AI_Interior_Studio_Codex_TZ/AI_Interior_Studio_Codex_TZ.md`.

## Current stage

Stages 1–4 currently cover the product shell, mock studio flow, generation boundary and Supabase foundation:

- Next.js App Router, React and strict TypeScript
- Tailwind CSS and reusable shadcn-style UI primitives
- Lucide icons
- Responsive bilingual landing page at `/en` and `/ru`
- Shared header, footer, design tokens and route structure
- Studio at `/en/studio` and `/ru/studio` with photo validation, settings and responsive preview
- Explicitly labelled Demo mode with a prepared Before / Demo after comparison
- Server-side `AIImageService` with mock and OpenAI adapters
- Real-provider guard requiring Supabase configuration and an authenticated session before any OpenAI call
- Multipart image validation by MIME, size and file signature
- No-store `/api/health` endpoint exposing only non-secret runtime readiness information
- Real provider disabled by default with `ENABLE_REAL_GENERATION=false`
- Supabase browser/server clients with cookie session refresh middleware
- Email login/signup pages and PKCE callback route
- Projects page and API with ownership delegated to Supabase RLS
- Protected project detail API for reading, renaming and deleting owner-owned projects
- Project save flow that uploads the original image only to the private `project-images` bucket
- Generation history API that records saved settings and can privately store a real generated result image
- Initial PostgreSQL/RLS/storage migration in `supabase/migrations`

The visual room preview is a clearly illustrative CSS composition. It does not claim to be an AI-generated transformation.

## Local setup

Requirements: Node.js 20.9+ and npm 10+.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). The root route redirects to `/en`; switch to `/ru` for Russian copy.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Next stages

To connect Supabase, copy `.env.example` to `.env.local`, add the project URL and publishable key, then apply the migration in `supabase/migrations` through the Supabase SQL Editor. Real generation remains disabled until authentication, private storage and server-side limits are connected end to end.
