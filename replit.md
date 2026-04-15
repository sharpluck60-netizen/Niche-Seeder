# Workspace

## Overview

Niche Seeder — a 2026 AI cinematic content distribution tool. Analyzes video URLs to identify micro-niches, maps target communities, generates human-sounding "Spark Posts," builds platform strategies, and now generates Content Blueprints, cinematic scripts, platform metadata, and multi-episode content series plans.

pnpm workspace monorepo using TypeScript.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **AI**: OpenAI via Replit AI Integrations (gpt-5.2)

## Features

- **Command Center** (dashboard): Stats, platform breakdown, Platform Signal Keys, 2026 Distribution Waterfall visualization
- **New Injection**: Paste YouTube/TikTok/Facebook/Instagram URL, AI maps micro-niche, mood keywords, audience profile, hook suggestion
- **Community Mapping**: Top 20 Discord/Telegram/Reddit communities per micro-niche with relevance scores
- **Spark Posts**: Human-sounding organic posts tailored per community and platform
- **Strategy**: Platform-specific Waterfall Trigger, 1.5s Micro-Hook, Content Pillars, Wildcard Play
- **Blueprint**: Algorithm Readiness Score (0-100 with breakdown), Character Consistency Protocol, Sound Design Plan, POV Lore/Digital Artifact concept, Identity Loyalty Factors, High-Intent Gains Tactics
- **Script Generator**: Full 60-90 second cinematic scripts with logline, 1.5-second opening hook, three acts, visual notes, dialogue/text, sound design cues, cliffhanger, character description, and world-building note
- **Metadata Optimizer**: YouTube/TikTok/Facebook titles, descriptions, posting times, search tags, hashtags, thumbnail concept, and A/B hook variants
- **Content Series Planner**: 7-episode cinematic universe plans with recurring lore, episode hooks, cliffhangers, character arcs, and Identity Loyalty hook
- **Image Lab**: Instagram concept generator that visually analyzes uploaded images, generates 6 upgraded image concepts, supports idea fusion, and now includes Location Scout for explorable buildings/rooms/sets with interior zones, interactive props, character actions, story triggers, and next image prompts
- **Photo Studio**: Sidebar-accessible prompt studio with 38 photo filter types inspired by user-provided examples, searchable categories, optional direction notes, prompt strength controls for identity/style/finish, filter-applied editable prompts, regenerate controls, recently used filters, and copyable output
- **Hairstyle Lab**: Sidebar-accessible hair prompt studio with male/female hairstyle exploration and female-only Vendor Studio prompts for hair brands/vendors uploading product references for clean model composites
- **Director Lab**: Cinematic continuity engine that accepts 1-3 uploaded images as anchor frames, visually analyzes people/settings/props/mood, detects a movie idea, builds a 6-10 shot scene with camera/SFX/VFX/dialogue/next-shot prompts, explains creative choices with Director Notes, offers Creative Rescue options for mismatched images, and seeds Episode 1/2 direction

## Creative Tools

- **Story Bible**: Full drama series manager — create series with genre/tone/visual style, add characters with full appearance/personality profiles, plan episodes with conflict/resolution/cliffhangers, deep-link to Drama Engine for scene generation
- **Drama Engine**: AI scene generator with shot-by-shot breakdown, continuous dialogue, image prompts per shot, "Copy All Prompts" and "Download PDF" export; upgraded prompt enforces shot count discipline and dialogue continuity across shots
- **Caption Lab**: 10 vibes × 8 tones × 5 content types with subject input, hashtag packs, and per-caption copy
- **Dance Studio**: 12 dance styles × 10 scenes × 10 camera angles with AI video prompt builder
- **Map Studio (Phantom Passport)**: 28 world landmarks with detailed visual/sky/ground descriptions for fake travel video prompts targeting Veo3, Kling, Runway, Pika, Hailuo

## Database Schema

- `analyses` — video analyses with `blueprintData`, `scriptData`, `metadataData`, and `seriesData` (jsonb) columns for persisting generated content tools
- `communities` — mapped communities per analysis
- `spark_posts` — generated organic posts
- `drama_series` — series metadata (title, genre, tone, setting, premise, visual style)
- `drama_characters` — character profiles linked to a series
- `drama_episodes` — episode plans with status and generated scene data

## Known Architecture Notes

- Dashboard niche IDs use stable string hash (not Math.random) to prevent flickering
- Sidebar has exactly 13 nav items; promo card duplicates were removed (April 2026)
- Intel Archive has live search filtering by title, micro-niche, and platform
- Drama Engine fetch functions guard against non-array API responses
- Instagram added as 4th platform in analyzer alongside YouTube, TikTok, Facebook

## Key Commands

- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
